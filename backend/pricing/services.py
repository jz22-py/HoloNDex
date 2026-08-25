from core.services.tcgtracking_client import get_set_pricing
from pricing.models import PriceSnapshot
from cards.models import Card


def fetch_prices_for_set(set_id):
    set_pricings = get_set_pricing(set_id)

    cards = Card.objects.filter(card_set__external_id=str(set_id))

    # a dictionary of a set's cards' id mapped to its card object
    cards_by_external_id = {c.external_id: c for c in cards}

    price_instances = []
    warnings = []
    for card_external_id, marketplaces in set_pricings["prices"].items():
        card = cards_by_external_id.get(card_external_id)
        if card is None:
            warnings.append(f"No card found with external_id: {card_external_id}, skipping")
            continue
        for _, variants in marketplaces.items():
            if not variants:
                continue
            for variant, prices in variants.items():
                price_instances.append(PriceSnapshot(card=card, variant=variant, price=prices.get("market")))

    PriceSnapshot.objects.bulk_create(price_instances)

    return len(price_instances), warnings