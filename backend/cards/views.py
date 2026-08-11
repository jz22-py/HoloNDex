from rest_framework import generics
from .models import Card, Set
from .serializers import CardSerializer, SetSerializer


class CardListView(generics.ListAPIView):
    queryset = Card.objects.all()
    serializer_class = CardSerializer

class SetListView(generics.ListAPIView):
    queryset = Set.objects.all()
    serializer_class = SetSerializer