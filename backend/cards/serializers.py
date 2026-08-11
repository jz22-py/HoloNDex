from rest_framework import serializers
from .models import Card, Set


class CardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = ['id', 'name', 'number', 'rarity', 'supertype', 'image_url', 'external_id']

class SetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Set
        fields = ['id', 'name', 'series', 'release_date', 'total_cards', 'external_id']