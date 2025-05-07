from django.db import models

# Create your models here.

class Player(models.Model):
    name = models.CharField(max_length=100)
    score = models.IntegerField(default=0)  # Lower score is better (fewer attempts)
    date = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['score', 'date']  # Order by score (ascending) and then by date
