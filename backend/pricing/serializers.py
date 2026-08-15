from rest_framework import serializers
from .models import PriceSnapshot

class PriceSnapshotSerializer(serializers.ModelSerializer):
    class Meta:
        model = PriceSnapshot
        fields = ["variant", "price", "recorded_at"]