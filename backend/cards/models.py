from django.db import models


class Set(models.Model):
    name = models.CharField(max_length=100)
    series = models.CharField(max_length=100)
    release_date = models.DateField()
    total_cards = models.IntegerField()
    external_id = models.CharField(max_length=50, unique=True)
    abbreviation = models.CharField(max_length=10)
    logo_url = models.URLField(blank=True)

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

