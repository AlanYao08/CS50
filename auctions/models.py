from django.contrib.auth.models import AbstractUser
from django.db import models

class Auction(models.Model):
    name = models.CharField(max_length=64)
    category = models.CharField(max_length=64)
    description = models.TextField(max_length=512)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    image = models.URLField(max_length=200)
    active = models.BooleanField()
    winner = models.CharField(max_length=64)
    bidnumber = models.IntegerField()

class Bid(models.Model):
    auction = models.ForeignKey(Auction, on_delete=models.CASCADE, related_name="bids")
    amount = models.DecimalField(max_digits=12, decimal_places=2)

class Comment(models.Model):
    auction = models.ForeignKey(Auction, on_delete=models.CASCADE, related_name="comments")
    comment = models.TextField(max_length=512)
    commentee = models.CharField(max_length=64)

class User(AbstractUser):
    auctions = models.ManyToManyField(Auction, blank=True, related_name="creator")
    watchlist = models.ManyToManyField(Auction, blank=True, related_name="watcher")
    bids = models.ManyToManyField(Bid, blank=True, related_name="bidder")
    comments = models.ManyToManyField(Comment, blank=True, related_name="commenter")

class Category(models.Model):
    name = models.CharField(max_length=64)
    auctions = models.ManyToManyField(Auction, blank=True, related_name="categories")
