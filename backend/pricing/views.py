from rest_framework import generics
from .serializers import PriceSnapshotSerializer
from .models import PriceSnapshot

class PriceSnapshotListView(generics.ListAPIView):
    serializer_class = PriceSnapshotSerializer

    def get_queryset(self):
        card_id = self.kwargs["card_id"]
        return PriceSnapshot.objects.filter(card_id=card_id)   