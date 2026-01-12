import csv
import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from api.models import Item

with open("./products.csv") as f:
    reader = csv.reader(f)
    next(reader, None)

    for row in reader:
        Item.objects.get_or_create(
            name=row[0],
            image=row[1],
            category="products",
            )
