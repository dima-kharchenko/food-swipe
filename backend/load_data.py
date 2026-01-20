import csv
import os
import django
from django.conf import settings

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from api.models import Item

with open("./items.csv") as f:
    reader = csv.reader(f)
    next(reader, None)

    for row in reader:
        name = row[0]
        image = row[1]
        category = row[2]

        dct = {
            "name": name,
            "category": category,
        }
        
        full_path = os.path.join(settings.MEDIA_ROOT, image)
        if os.path.exists(full_path):
            dct["image"] = image 

        Item.objects.get_or_create(**dct)
