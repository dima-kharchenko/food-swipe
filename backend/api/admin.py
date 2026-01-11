from django.contrib import admin
from .models import Item, Rating, StatsShare

admin.site.register(Item)
admin.site.register(Rating)
admin.site.register(StatsShare)

