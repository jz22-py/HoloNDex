# Calls core/services/tcgtracking_client.py
# Retrieves the data, extract, transform, and load into the database

from django.core.management.base import BaseCommand
from core.services.tcgtracking_client import get_set_cards
from cards.models import Set, Card


class Command(BaseCommand):
    def add_arguments(self, parser):
        parser.add_argument("set_id", type=int)

    def handle(self, *args, **options):
        set_id = options["set_id"]
        cards_data = get_set_cards(set_id)

        set_name = cards_data["set_name"]
        set_released = cards_data["set_released"]
        products = cards_data["products"]

        valid_cards = [card for card in products if card["number"] is not None]

        set_obj, _ = Set.objects.update_or_create(
            external_id = str(set_id),
            defaults = {
                "name": set_name,
                 #series: placeholder
                "release_date": set_released,
                "total_cards": len(valid_cards),
            }
        )

        for card in valid_cards:
            Card.objects.update_or_create(
                external_id = str(card["id"]),
                defaults = {
                    "card_set": set_obj,
                    "name": card["name"],
                    "number": card["number"],
                    "rarity": card["rarity"],
                    #supertype: placeholder
                    "image_url": card["image_url"], 
                }
            )
