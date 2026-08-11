from django.db import models


class PriceSnapshot(models.Model):
    card = models.ForeignKey('cards.Card', on_delete=models.CASCADE, related_name='price_snapshots')

    # intentionally unconstrained until a vintage set is synced and confirmed the full range of variant strings
    # e.g. "Normal", "Holofoil", "Reverse Holofoil"
    variant = models.CharField(max_length=30) 
    price = models.DecimalField(max_digits=10, decimal_places=2)
    recorded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=['card', 'recorded_at']),
        ]

    def __str__(self):
        return f"{self.card.name} - {self.variant} - ${self.price}"