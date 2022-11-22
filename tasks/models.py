from django.db import models

class List(models.Model):
    name = models.CharField(max_length=255)
    idName = models.CharField(max_length=255)

class Category(models.Model):
    name = models.CharField(max_length=255)
    idName = models.CharField(max_length=255)
    color = models.CharField(max_length=7, default='0000000')

class Task(models.Model):
    list = models.ForeignKey(List, on_delete=models.CASCADE, related_name="tasks")
    text = models.TextField(max_length=2048)
    idText = models.TextField(max_length=2048)
    categories = models.ManyToManyField(Category, related_name="tasks")