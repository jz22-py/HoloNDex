from django.contrib import admin
from .models import Set, Card, PriceSnapshot

admin.site.register(Set)
admin.site.register(Card)
admin.site.register(PriceSnapshot)
