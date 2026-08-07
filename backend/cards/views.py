from django.shortcuts import render
from rest_framework import generics
from .models import Card
from .serializers import CardSerializer


class CardListView(generics.ListAPIView):
    queryset = Card.objects.all()
    serializer_class = CardSerializer