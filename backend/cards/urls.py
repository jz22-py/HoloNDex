from django.urls import path
from .views import CardListView, SetListView, CardDetailView, SetDetailView

urlpatterns = [
    path('sets/<int:set_id>/cards/', CardListView.as_view(), name='card-list'),
    path('sets/<int:set_id>/', SetDetailView.as_view(), name='set-detail'),
    path('sets/', SetListView.as_view(), name='set-list'),
    path("cards/<int:card_id>/", CardDetailView.as_view(), name="card-detail"),
]