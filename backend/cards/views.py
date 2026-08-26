from django.db.models import Subquery, OuterRef, F
from rest_framework import generics
from .models import Card, Set
from pricing.models import PriceSnapshot
from .serializers import CardSerializer, SetSerializer


class CardListView(generics.ListAPIView):
    serializer_class = CardSerializer

    def get_queryset(self):
        set_id = self.kwargs["set_id"]

        latest_price = (
            PriceSnapshot.objects
            .filter(card_id=OuterRef("id"))
            .order_by("-recorded_at")
            .values("price")[:1]
        )

        return (
            Card.objects
            .filter(card_set_id=set_id)
            .annotate(current_price=Subquery(latest_price))
            .order_by(F("current_price").desc(nulls_last=True))
        )

class SetListView(generics.ListAPIView):
    queryset = Set.objects.all().order_by("-release_date")
    serializer_class = SetSerializer

class CardDetailView(generics.RetrieveAPIView):
    queryset = Card.objects.all()
    serializer_class = CardSerializer
    
    lookup_field = "id"
    lookup_url_kwarg = "card_id"