from datetime import timedelta
from decimal import Decimal
from unittest.mock import patch

from django.core.management import call_command
from django.test import TestCase
from django.test.utils import CaptureQueriesContext
from django.db import connection
from django.urls import reverse
from django.utils import timezone
from rest_framework.test import APIClient

from cards.models import Card, Set
from cards.views import CardListView
from pricing.models import PriceSnapshot


class CardListTestCase(TestCase):
    def setUp(self):
        self.card_set = Set.objects.create(
            name="Test Set",
            series="Test Series",
            release_date="2020-01-01",
            total_cards=0,
            external_id="test-set-1",
            abbreviation="TST",
        )
        self.url = reverse("card-list", kwargs={"set_id": self.card_set.id})

    def _create_cards_with_prices(self, count, snapshots_per_card=3):
        now = timezone.now()
        start = Card.objects.count()
        for i in range(start, start + count):
            card = Card.objects.create(
                card_set=self.card_set,
                name=f"Card {i}",
                number=str(i),
                external_id=f"card-{i}",
            )
            for j in range(snapshots_per_card):
                snapshot = PriceSnapshot.objects.create(
                    card=card, variant="Normal", price="1.00"
                )
                # backdate recorded_at so each card has a distinct "latest" row
                PriceSnapshot.objects.filter(pk=snapshot.pk).update(
                    recorded_at=now - timedelta(days=snapshots_per_card - j)
                )


class CardListQueryCountTests(CardListTestCase):
    """Guards against reintroducing N+1 queries on the card list endpoint."""

    def _query_count_for_card_list(self):
        with CaptureQueriesContext(connection) as ctx:
            response = APIClient().get(self.url)
        self.assertEqual(response.status_code, 200)
        return len(ctx.captured_queries)

    def test_query_count_does_not_scale_with_card_count(self):
        self._create_cards_with_prices(count=3)
        small_count = self._query_count_for_card_list()

        self._create_cards_with_prices(count=12)
        large_count = self._query_count_for_card_list()

        self.assertEqual(small_count, large_count)

    def test_query_count_is_small_fixed_number(self):
        self._create_cards_with_prices(count=5)
        with self.assertNumQueries(2):
            APIClient().get(self.url)


class CardListCorrectnessTests(CardListTestCase):
    def test_current_price_uses_latest_recorded_at_not_insertion_order(self):
        card = Card.objects.create(
            card_set=self.card_set, name="Card", number="1", external_id="card-x"
        )
        now = timezone.now()

        newer = PriceSnapshot.objects.create(card=card, variant="Normal", price="5.00")
        PriceSnapshot.objects.filter(pk=newer.pk).update(recorded_at=now)

        # created after "newer", but backdated, insertion order != time order
        older = PriceSnapshot.objects.create(card=card, variant="Normal", price="10.00")
        PriceSnapshot.objects.filter(pk=older.pk).update(recorded_at=now - timedelta(days=1))

        response = APIClient().get(self.url)
        current_price = response.json()["results"][0]["current_price"]

        self.assertEqual(Decimal(current_price), Decimal("5.00"))

    def test_queryset_has_id_as_pagination_tiebreaker(self):
        # Without a secondary sort key, cards tied on current_price
        # can appear across pages.
        view = CardListView()
        view.kwargs = {"set_id": self.card_set.id}
        self.assertIn("id", view.get_queryset().query.order_by)


class SyncCatalogIdempotencyTests(TestCase):
    def test_running_twice_does_not_duplicate_sets_or_cards(self):
        tcgtracking_sets = {
            "sets": [{"id": 999, "name": "Test Set", "abbreviation": "TS1", "is_supplemental": False}]
        }
        pokemontcg_by_code = {"TS1": [{"series": "Test Series", "images": {"logo": "logo.png"}}]}
        cards_data = {
            "set_name": "Test Set",
            "set_released": "2020-01-01",
            "products": [
                {"id": 1, "number": "1", "name": "Card A", "rarity": "Common", "image_url": "a.png"},
                {"id": 2, "number": None, "name": "Skip me", "rarity": "Common", "image_url": "b.png"},
            ],
        }

        with patch("cards.management.commands.sync_catalog.get_tcgtracking_sets", return_value=tcgtracking_sets), \
             patch("cards.management.commands.sync_catalog.get_pokemontcg_by_code", return_value=pokemontcg_by_code), \
             patch("cards.management.commands.sync_catalog.get_set_cards", return_value=cards_data):
            call_command("sync_catalog")
            call_command("sync_catalog")

        self.assertEqual(Set.objects.count(), 1)
        self.assertEqual(Card.objects.count(), 1)
