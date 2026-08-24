import requests

URL_ENDPOINT = "https://raw.githubusercontent.com/PokemonTCG/pokemon-tcg-data/master/sets/en.json"

# tcgtracking ["abbreviation"] : pokemontcg ["ptcgoCode"]
ABBREVIATION_ALIASES = {
    "BS2": "B2",        # Base Set 2
    "SHL": "SLG",       # Shining Legends
    "DEP": "DET",       # Detective Pikachu
    "CHP": "CPA",       # Champion's Path
    "CLB": "CEL",       # Celebrations
    "SWSH01": "SSH", "SWSH02": "RCL", "SWSH03": "DAA", "SWSH04": "VIV",
    "SWSH05": "BST", "SWSH06": "CRE", "SWSH07": "EVS", "SWSH08": "FST",
    "SWSH09": "BRS", "SWSH10": "ASR", "SWSH11": "LOR", "SWSH12": "SIT",
    "SM01": "SUM", "SM02": "GRI", "SM03": "BUS", "SM04": "CIN",
    "SM05": "UPR", "SM06": "FLI", "SM8": "LOT", "SM9": "TEU",
    "SM10": "UNB", "SM11": "UNM", "SM12": "CEC",
}

AMBIGUOUS_CODES = {"PR", "BST"}

NAME_OVERRIDES = {
    "EX Team Rocket Returns": "TRR",              # shares "RR" with Rising Rivals
    "Trading Card Game Classic": None,             # shares "CL" with Call of Legends
    "BW Trainer Kit: Excadrill & Zoroark": None,   # shares "BLW" with Black and White
}

def get_pokemontcg_sets():
    sets_response = requests.get(URL_ENDPOINT, timeout=5)
    sets_response.raise_for_status()
    return sets_response.json()

def get_pokemontcg_by_code():
    by_code = {}

    for s in get_pokemontcg_sets():
        code = s.get("ptcgoCode")
        if code:
            by_code.setdefault(code, s)
    return by_code

def resolve_match(abbreviation: str, pokemontcg_by_code: dict, name: str):
    """3 tiers fallback check, returns the matched set dict or None."""
    if name in NAME_OVERRIDES:
        override_code = NAME_OVERRIDES[name]
        if override_code is None:
            return None
        return pokemontcg_by_code.get(override_code)
    
    if not abbreviation:
        return None
    
    if abbreviation in AMBIGUOUS_CODES:
        return None
    
    # Tier 1: Exact match
    match = pokemontcg_by_code.get(abbreviation)
    if match:
        return match
    
    # Tier 2: Alias dictionary
    aliased = ABBREVIATION_ALIASES.get(abbreviation)
    if aliased:
        return pokemontcg_by_code.get(aliased)
    
    # Tier 3: Suffix strip
    base_code = abbreviation.split(":")[0].strip()
    return pokemontcg_by_code.get(base_code)