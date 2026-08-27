from django.db.models import Subquery, OuterRef, F
from rest_framework import generics
from .models import Card, Set
from pricing.models import PriceSnapshot
from .serializers import CardSerializer, SetSerializer
from core.pagination import CardListPagination


class CardListView(generics.ListAPIView):
    serializer_class = CardSerializer
    pagination_class = CardListPagination

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
            .order_by(F("current_price").desc(nulls_last=True), "id")
        )

class SetListView(generics.ListAPIView):
    queryset = Set.objects.all().order_by("-release_date")
    serializer_class = SetSerializer

class CardDetailView(generics.RetrieveAPIView):
    serializer_class = CardSerializer
    lookup_field = "id"
    lookup_url_kwarg = "card_id"

    def get_queryset(self):
        latest_price = (
            PriceSnapshot.objects
            .filter(card_id=OuterRef("id"))
            .order_by("-recorded_at")
            .values("price")[:1]
        )

        return Card.objects.annotate(current_price=Subquery(latest_price))