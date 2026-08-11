from django.urls import path
from .views import CardListView, SetListView

urlpatterns = [
    path('cards/', CardListView.as_view(), name='card-list'),
    path('sets/', SetListView.as_view(), name='set-list'),
]