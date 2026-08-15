from django.urls import path
from .views import PriceSnapshotListView

urlpatterns = [
    path("cards/<int:card_id>/prices/", PriceSnapshotListView.as_view(), name="price-list")
]