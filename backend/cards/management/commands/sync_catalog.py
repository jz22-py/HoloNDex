# Calls core/services/tcgtracking_client.py and pokemontcg_client.py
# Retrieves the data, extract, transform, and load into the database

from django.core.management.base import BaseCommand
from core.services.tcgtracking_client import get_set_cards, get_tcgtracking_sets
from core.services.pokemontcg_client import get_pokemontcg_by_code, resolve_match
from cards.models import Set, Card


class Command(BaseCommand):
    def handle(self, *args, **options):
        pokemontcg_by_code = get_pokemontcg_by_code()
        tcgtracking_sets = get_tcgtracking_sets()["sets"]

        for tcgtracking_set in tcgtracking_sets:
            if tcgtracking_set.get("is_supplemental"):
                continue

            match = resolve_match(tcgtracking_set["abbreviation"], pokemontcg_by_code, tcgtracking_set["name"])
            if match is None:
                continue

            set_id = tcgtracking_set["id"]
            cards_data = get_set_cards(set_id)

            set_name = cards_data["set_name"]
            set_released = cards_data["set_released"]
            products = cards_data["products"]

            valid_cards = [card for card in products if card["number"] is not None]

            set_obj, created = Set.objects.update_or_create(
                external_id = str(set_id),
                defaults = {
                    "name": set_name,
                    "series": match["series"],
                    "release_date": set_released,
                    "total_cards": len(valid_cards),
                    "abbreviation": tcgtracking_set["abbreviation"],
                    "logo_url": match["images"]["logo"],
                }
            )

            if created:
                self.stdout.write(self.style.SUCCESS(f"Created: {set_name} ({tcgtracking_set['abbreviation']}) - {len(valid_cards)} cards"))
            else:
                self.stdout.write(f"Updated: {set_name} ({tcgtracking_set['abbreviation']}) - {len(valid_cards)} cards")

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
