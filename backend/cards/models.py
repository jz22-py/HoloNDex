from django.db import models


class Set(models.Model):
    name = models.CharField(max_length=100)
    series = models.CharField(max_length=100)
    release_date = models.DateField()
    total_cards = models.IntegerField()
    external_id = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class Card(models.Model):
    card_set = models.ForeignKey(Set, on_delete=models.CASCADE, related_name='cards')
    name = models.CharField(max_length=100)
    number = models.CharField(max_length=20) # String since some cards use values like "4a" or "TG05"
    rarity = models.CharField(max_length=50, blank=True)
    supertype = models.CharField(max_length=20) # Pokemon/Trainer/Energy
    image_url = models.URLField(blank=True)
    external_id = models.CharField(max_length=50, unique=True) # ID from data source API, used to prevent duplicate syncs

    def __str__(self):
        return f"{self.name} ({self.card_set.name})"


class PriceSnapshot(models.Model):
    card = models.ForeignKey(Card, on_delete=models.CASCADE, related_name='price_snapshots')

    # intentionally unconstrained until a vintage set is synced and confirmed the full range of variant strings
    # e.g. "Normal", "Holofoil", "Reverse Holofoil"
    variant = models.CharField(max_length=30) 
    price = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='USD')
    source = models.CharField(max_length=50) # which API/data source this price came from, e.g. "tcgtracking"
    recorded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=['card', 'recorded_at']),
        ]

    def __str__(self):
        return f"{self.card.name} - {self.variant} - ${self.price}"