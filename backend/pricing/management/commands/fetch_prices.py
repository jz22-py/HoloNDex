from django.core.management.base import BaseCommand
from core.services.tcgtracking_client import get_set_pricing
from pricing.models import PriceSnapshot
from cards.models import Card


class Command(BaseCommand):
    def add_arguments(self, parser):
        parser.add_argument("set_id", type=int)


    def handle(self, *args, **options):
        set_id = options["set_id"]
        set_pricings = get_set_pricing(set_id)

        cards = Card.objects.filter(card_set__external_id=str(set_id))

        # a dictionary of a set's cards' id mapped to its card object
        cards_by_external_id = {c.external_id: c for c in cards}

        price_instances = []
        for card_external_id, marketplaces in set_pricings["prices"].items():
            card = cards_by_external_id.get(card_external_id)
            if card is None:
                self.stdout.write(self.style.WARNING(f"No card found with external_id: {card_external_id}, skipping"))
                continue
            for _, variants in marketplaces.items():
                for variant, prices in variants.items():
                    price_instances.append(PriceSnapshot(card=card, variant=variant, price=prices.get("market")))

        PriceSnapshot.objects.bulk_create(price_instances)
        self.stdout.write(self.style.SUCCESS(f"Created {len(price_instances)} price snapshots for set {set_id}"))
