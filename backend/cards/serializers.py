from rest_framework import serializers
from .models import Card, Set


class CardSerializer(serializers.ModelSerializer):
    current_price = serializers.SerializerMethodField()

    def get_current_price(self, obj):
        return getattr(obj, "current_price", None)
    
    class Meta:
        model = Card
        fields = ['id', 'name', 'number', 'rarity', 'image_url', 'external_id', 'current_price', 'artist']

class SetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Set
        fields = ['id', 'name', 'series', 'release_date', 'total_cards', 'external_id', "abbreviation", "logo_url"]