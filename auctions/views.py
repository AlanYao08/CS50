from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from .models import User, Auction, Bid, Comment, Category
from django import forms
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseBadRequest

class ListingForm(forms.Form):
    name = forms.CharField(max_length=64)
    category = forms.CharField(max_length=64, initial='No Category Listed')
    description = forms.CharField(max_length=512)
    price = forms.DecimalField(max_digits=12, decimal_places=2)
    image = forms.URLField(max_length=200, required = False)

class BidForm(forms.Form):
    bid = forms.DecimalField(max_digits=12, decimal_places=2)

class CommentForm(forms.Form):
    comment = forms.CharField(max_length=512)

def index(request):
    return render(request, "auctions/index.html", {
        "listings": Auction.objects.filter(active=True).all()
    })


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "auctions/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "auctions/login.html")

@login_required
def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "auctions/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "auctions/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "auctions/register.html")

@login_required
def create(request):
    if request.method == "POST":
        form = ListingForm(request.POST)
        if form.is_valid():
            name = form.cleaned_data["name"]
            category = form.cleaned_data["category"]
            description = form.cleaned_data["description"]
            price = form.cleaned_data["price"]
            image = form.cleaned_data["image"]
            listing = Auction(name=name, category=category, description=description, price=price, image=image, active=True, winner="None", bidnumber=0)
            listing.save()
            creator = User.objects.get(pk=request.user.id)
            creator.auctions.add(listing)
            if Category.objects.filter(name=category).exists():
                category = Category.objects.get(name=category)
                category.auctions.add(listing)
            else:
                category = Category(name=category)
                category.save()
                category.auctions.add(listing)
            return HttpResponseRedirect(reverse("listing", args=(listing.id,)))
        else:
            return render(request, "auctions/create.html", {
                "form": form
            })
    return render(request, "auctions/create.html", {
        "form": ListingForm()
    })

def listing(request, listing_id):
    if request.method == "POST":
        if request.user.id==None:
            return HttpResponseBadRequest("You are not signed in")
        if 'submit-close' in request.POST:
            Auction.objects.filter(id=listing_id).update(active=False)
            category = Auction.objects.get(pk=listing_id).category
            if Category.objects.get(name=category).auctions.count() == 1:
                Category.objects.filter(name=category).delete()
            else:
                category = Category.objects.get(name=category)
                category.auctions.remove(Auction.objects.get(pk=listing_id))
            return HttpResponseRedirect(reverse("listing", args=(listing_id,)))
        if 'submit-watch' in request.POST:
            user = User.objects.get(pk=request.user.id)
            user.watchlist.add(Auction.objects.get(pk=listing_id))
            return HttpResponseRedirect(reverse("listing", args=(listing_id,)))
        if 'submit-stopwatch' in request.POST:
            user = User.objects.get(pk=request.user.id)
            user.watchlist.remove(Auction.objects.get(pk=listing_id))
            return HttpResponseRedirect(reverse("listing", args=(listing_id,)))
        if 'submit-comment' in request.POST:
            form = CommentForm(request.POST)
            if form.is_valid():
                commentText = form.cleaned_data["comment"]
                commenter = User.objects.get(pk=request.user.id)
                comment = Comment(auction=Auction.objects.get(id=listing_id), comment=commentText, commentee=commenter.username)
                comment.save()
                commenter.comments.add(comment)
                Auction.objects.get(pk=listing_id).comments.add(comment)
                return HttpResponseRedirect(reverse("listing", args=(listing_id,)))
            else:
                return render(request, "auctions/listing.html", {
                    "commentForm": form
                })
        form = BidForm(request.POST)
        if form.is_valid():
            amount = form.cleaned_data["bid"]
            if amount <= Auction.objects.get(id=listing_id).price:
                return HttpResponseBadRequest("Bid is not large enough")
            Auction.objects.filter(id=listing_id).update(price=amount)
            bid = Bid(auction=Auction.objects.get(id=listing_id), amount=amount)
            bid.save()
            bidder = User.objects.get(pk=request.user.id)
            bidder.bids.add(bid)
            Auction.objects.filter(id=listing_id).update(winner=bidder.username)
            Auction.objects.filter(id=listing_id).update(bidnumber=Auction.objects.get(pk=listing_id).bidnumber+1)
            return HttpResponseRedirect(reverse("listing", args=(listing_id,)))
        else:
            return render(request, "auctions/listing.html", {
                "bidForm": form
            })
    return render(request, "auctions/listing.html", {
        "watching": Auction.objects.get(pk=listing_id).watcher.filter(id=request.user.id).exists(),
        "comments": Auction.objects.get(pk=listing_id).comments.all(),
        "creator": Auction.objects.get(pk=listing_id).creator.all().first().id == request.user.id,
        "id": Auction.objects.get(pk=listing_id).creator.all().first().username,
        "listing": Auction.objects.get(pk=listing_id),
        "bidForm": BidForm(),
        "commentForm": CommentForm()
    })

@login_required
def watchlist(request):
    return render(request, "auctions/watchlist.html", {
        "listings": User.objects.get(pk=request.user.id).watchlist.all()
    })

def categories(request):
    return render(request, "auctions/categories.html", {
        "categories": Category.objects.all()
    })

def category(request, category):
    return render(request, "auctions/category.html", {
        "category": category,
        "listings": Category.objects.get(name=category).auctions.all()
    })
