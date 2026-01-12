import uuid
from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator


class Item(models.Model):
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=20, choices={"products": "products", "dishes": "dishes", "drinks": "drinks"})
    image = models.URLField(
        null=True,
        blank=True,
        default="https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg"
    )

class Rating(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    score = models.SmallIntegerField(validators=[
        MinValueValidator(-1),
        MaxValueValidator(1),
    ])
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "item")

class StatsShare(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    category = models.CharField(max_length=20, choices={"products": "products", "dishes": "dishes", "drinks": "drinks"})
    snapshot = models.JSONField()
    snapshot_hash = models.CharField(max_length=64, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "category", "snapshot_hash")
