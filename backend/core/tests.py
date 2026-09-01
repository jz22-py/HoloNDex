from django.test import SimpleTestCase

from core.services.pokemontcg_client import resolve_match

# Stand-in for get_pokemontcg_by_code(). Values are lists since a single
# ptcgoCode can map to more than one real set.
POKEMONTCG_BY_CODE = {
    "SUM": [{"name": "Sun & Moon", "series": "Sun & Moon", "images": {"logo": "sum.png"}}],
    "B2": [{"name": "Base Set 2", "series": "Base", "images": {"logo": "b2.png"}}],
    "RR": [{"name": "Rising Rivals", "series": "Platinum", "images": {"logo": "rr.png"}}],
    "TRR": [{"name": "Team Rocket Returns", "series": "EX", "images": {"logo": "trr.png"}}],
    "BST": [{"name": "Some Unrelated BST Set", "series": "Other", "images": {"logo": "bst.png"}}],
    # both "Hidden Fates" and "Hidden Fates Shiny Vault" use "HIF".
    "HIF": [
        {"name": "Hidden Fates", "series": "Sun & Moon", "images": {"logo": "sm115.png"}},
        {"name": "Hidden Fates Shiny Vault", "series": "Sun & Moon", "images": {"logo": "sma.png"}},
    ],
    # both "Crown Zenith" and "Crown Zenith: Galarian Gallery" use "CRZ".
    "CRZ": [
        {"name": "Crown Zenith", "series": "Sword & Shield", "images": {"logo": "swsh12pt5.png"}},
        {"name": "Crown Zenith Galarian Gallery", "series": "Sword & Shield", "images": {"logo": "swsh12pt5gg.png"}},
    ],
    "BRS": [{"name": "Brilliant Stars", "series": "Sword & Shield", "images": {"logo": "swsh9.png"}}],
}


class ResolveMatchTests(SimpleTestCase):
    def test_exact_abbreviation_match(self):
        match = resolve_match("SUM", POKEMONTCG_BY_CODE, "Sun & Moon")
        self.assertEqual(match, POKEMONTCG_BY_CODE["SUM"][0])

    def test_alias_dictionary_match(self):
        # "BS2" only resolves via ABBREVIATION_ALIASES -> "B2".
        match = resolve_match("BS2", POKEMONTCG_BY_CODE, "Base Set 2")
        self.assertEqual(match, POKEMONTCG_BY_CODE["B2"][0])

    def test_suffix_strip_tier(self):
        match = resolve_match("SUM:P", POKEMONTCG_BY_CODE, "Sun & Moon Promo")
        self.assertEqual(match, POKEMONTCG_BY_CODE["SUM"][0])

    def test_suffix_strip_then_alias_tier(self):
        # Regression: "SWSH09:TG" strips to "SWSH09", which then needs
        # the alias table too ("SWSH09" -> "BRS") to resolve.
        match = resolve_match("SWSH09:TG", POKEMONTCG_BY_CODE, "Brilliant Stars Trainer Gallery")
        self.assertEqual(match, POKEMONTCG_BY_CODE["BRS"][0])

    def test_no_match_returns_none(self):
        match = resolve_match("ZZZ", POKEMONTCG_BY_CODE, "Nonexistent Set")
        self.assertIsNone(match)

    def test_falsy_abbreviation_returns_none(self):
        match = resolve_match("", POKEMONTCG_BY_CODE, "Some Unknown Name")
        self.assertIsNone(match)

    def test_ambiguous_code_returns_none_even_with_real_match_available(self):
        # Ambiguity check must run before the exact-match tier.
        match = resolve_match("BST", POKEMONTCG_BY_CODE, "EX Battle Stadium")
        self.assertIsNone(match)

    def test_name_override_to_none_excludes_set(self):
        match = resolve_match("CL", POKEMONTCG_BY_CODE, "Trading Card Game Classic")
        self.assertIsNone(match)

    def test_name_override_resolves_abbreviation_collision(self):
        # "RR" is shared by Rising Rivals and EX Team Rocket Returns
        # override must win over the exact match tier.
        match = resolve_match("RR", POKEMONTCG_BY_CODE, "EX Team Rocket Returns")
        self.assertEqual(match, POKEMONTCG_BY_CODE["TRR"][0])

    def test_unrelated_set_still_resolves_by_abbreviation_after_override_added(self):
        match = resolve_match("RR", POKEMONTCG_BY_CODE, "Rising Rivals")
        self.assertEqual(match, POKEMONTCG_BY_CODE["RR"][0])

    def test_shared_code_disambiguates_to_main_set(self):
        # "HIF" used to always resolve to whichever set was seen first
        match = resolve_match("HIF", POKEMONTCG_BY_CODE, "Hidden Fates")
        self.assertEqual(match["name"], "Hidden Fates")

    def test_shared_code_disambiguates_to_companion_set(self):
        match = resolve_match("HIF", POKEMONTCG_BY_CODE, "Hidden Fates: Shiny Vault")
        self.assertEqual(match["name"], "Hidden Fates Shiny Vault")

    def test_shared_code_disambiguates_crown_zenith_variants(self):
        main = resolve_match("CRZ", POKEMONTCG_BY_CODE, "SWSH: Crown Zenith")
        self.assertEqual(main["name"], "Crown Zenith")

        companion = resolve_match("CRZ", POKEMONTCG_BY_CODE, "SWSH: Crown Zenith: Galarian Gallery")
        self.assertEqual(companion["name"], "Crown Zenith Galarian Gallery")
