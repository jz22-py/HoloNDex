import requests
import re

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

WORD_RE = re.compile(r"[a-z0-9]+")


def get_pokemontcg_sets():
    sets_response = requests.get(URL_ENDPOINT, timeout=5)
    sets_response.raise_for_status()
    return sets_response.json()


def get_pokemontcg_by_code():
    by_code = {}
    for s in get_pokemontcg_sets():
        code = s.get("ptcgoCode")
        if code:
            by_code.setdefault(code, []).append(s)
    return by_code


def words(text):
    return set(WORD_RE.findall(text.lower()))


def best_candidate(name, candidates):
    """
    Picks the candidate whose name most closely matches tcgtracking's
    name, using word set Jaccard similarity.
    Example: "Hidden Fates: Shiny Vault" prefer the "Hidden Fates Shiny
    Vault" candidate over "Hidden Fates" one, while "Hidden
    Fates" alone still prefers the plain one (extra unmatched words in
    either name count against the score).
    """
    if len(candidates) == 1:
        return candidates[0]

    name_words = words(name)
    best, best_score = candidates[0], -1.0
    for candidate in candidates:
        candidate_words = words(candidate.get("name", ""))
        union = name_words | candidate_words
        score = len(name_words & candidate_words) / len(union) if union else 0.0
        if score > best_score:
            best, best_score = candidate, score
    return best


def lookup(code, pokemontcg_by_code, name):
    candidates = pokemontcg_by_code.get(code)
    if not candidates:
        return None
    return best_candidate(name, candidates)


def resolve_match(abbreviation: str, pokemontcg_by_code: dict, name: str):
    """4 tiers fallback check, returns the matched set dict or None."""
    if name in NAME_OVERRIDES:
        override_code = NAME_OVERRIDES[name]
        if override_code is None:
            return None
        return lookup(override_code, pokemontcg_by_code, name)

    if not abbreviation:
        return None

    if abbreviation in AMBIGUOUS_CODES:
        return None

    # Tier 1: Exact match
    match = lookup(abbreviation, pokemontcg_by_code, name)
    if match:
        return match

    # Tier 2: Alias dictionary
    aliased = ABBREVIATION_ALIASES.get(abbreviation)
    if aliased:
        match = lookup(aliased, pokemontcg_by_code, name)
        if match:
            return match

    # Tier 3: Suffix strip, retrying the exact-match and alias tiers
    # against the stripped code (e.g. tcgtracking's "SWSH09:TG" strips to
    # "SWSH09", which then still needs the alias table to reach "BRS").
    base_code = abbreviation.split(":")[0].strip()
    match = lookup(base_code, pokemontcg_by_code, name)
    if match:
        return match

    aliased_base = ABBREVIATION_ALIASES.get(base_code)
    if aliased_base:
        return lookup(aliased_base, pokemontcg_by_code, name)

    # Tier 4: Fallback fail
    return None
