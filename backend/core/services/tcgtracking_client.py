import requests

BASE_URL = "https://openapi.tcgtracking.com/v1/3/sets/"


def get_set_cards(set_id: str):
    cards_url = BASE_URL + str(set_id) + "/cards"
    cards_response = requests.get(cards_url, timeout=5)
    cards_response.raise_for_status()
    return cards_response.json()

def get_set_pricing(set_id: str):
    pricing_url = BASE_URL + str(set_id) + "/pricing"
    pricing_response = requests.get(pricing_url, timeout=5)
    pricing_response.raise_for_status()
    return pricing_response.json()

