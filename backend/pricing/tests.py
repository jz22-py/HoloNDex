from unittest.mock import patch

from django.test import TestCase

from cards.models import Card, Set
from pricing.models import PriceSnapshot
from pricing.services import fetch_prices_for_set
from pricing.tasks import fetch_all_prices


class FetchPricesForSetTests(TestCase):
    def setUp(self):
        self.card_set = Set.objects.create(
            name="Set", series="S", release_date="2020-01-01",
            total_cards=0, external_id="set-1", abbreviation="S1",
        )
        self.card = Card.objects.create(
            card_set=self.card_set, name="Card", number="1", external_id="card-1"
        )

    def test_missing_card_mapping_produces_warning_and_skips(self):
        payload = {"prices": {"unknown-card": {"tcgplayer": {"holofoil": {"market": 9.99}}}}}
        with patch("pricing.services.get_set_pricing", return_value=payload):
            count, warnings = fetch_prices_for_set("set-1")

        self.assertEqual(count, 0)
        self.assertIn("unknown-card", warnings[0])

    def test_empty_variants_dict_is_skipped(self):
        payload = {"prices": {"card-1": {"tcgplayer": {}}}}
        with patch("pricing.services.get_set_pricing", return_value=payload):
            count, warnings = fetch_prices_for_set("set-1")

        self.assertEqual(count, 0)
        self.assertEqual(PriceSnapshot.objects.count(), 0)

    def test_creates_one_snapshot_per_variant(self):
        payload = {
            "prices": {
                "card-1": {"tcgplayer": {"holofoil": {"market": 9.99}, "normal": {"market": 4.5}}}
            }
        }
        with patch("pricing.services.get_set_pricing", return_value=payload):
            count, warnings = fetch_prices_for_set("set-1")

        self.assertEqual(count, 2)
        self.assertEqual(warnings, [])
        self.assertEqual(PriceSnapshot.objects.filter(card=self.card).count(), 2)


class FetchAllPricesTests(TestCase):
    def test_one_failing_set_does_not_abort_the_others(self):
        Set.objects.create(
            name="Good", series="S", release_date="2020-01-01",
            total_cards=0, external_id="good", abbreviation="G",
        )
        Set.objects.create(
            name="Bad", series="S", release_date="2020-01-01",
            total_cards=0, external_id="bad", abbreviation="B",
        )

        def fake_fetch(external_id):
            if external_id == "bad":
                raise Exception("boom")
            return 5, []

        with patch("pricing.tasks.fetch_prices_for_set", side_effect=fake_fetch):
            with self.assertLogs("pricing", level="INFO") as logs:
                fetch_all_prices()  # must not raise exception

        summary = "\n".join(logs.output)
        self.assertIn("5 snapshots created", summary)
        self.assertIn("1 failures", summary)
        self.assertIn("bad", summary)
