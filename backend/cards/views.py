from rest_framework import generics
from .models import Card, Set
from .serializers import CardSerializer, SetSerializer


class CardListView(generics.ListAPIView):
    serializer_class = CardSerializer

    def get_queryset(self):
        set_id = self.kwargs["set_id"]
        return Card.objects.filter(card_set_id=set_id)

class SetListView(generics.ListAPIView):
    queryset = Set.objects.all()
    serializer_class = SetSerializer