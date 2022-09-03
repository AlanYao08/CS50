from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
import datetime
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator
from django.views.decorators.csrf import csrf_exempt
import json
from django.http import JsonResponse

from .models import User, Post, Follow, Like


def index(request):
    if request.method == "POST":
        content = request.POST["post"]
        post = Post(poster=User.objects.get(id=request.user.id), content=content, time=datetime.datetime.now(), likes=0)
        post.save()
        return HttpResponseRedirect(reverse("index"))
    posts = Post.objects.all().order_by('-time')
    for post in posts:
        post.likes = Like.objects.filter(post=post).count()
        post.save()
    paginator = Paginator(posts, 10)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    return render(request, "network/index.html", {
        "page_obj": page_obj,
        "multiple_pages": False if paginator.num_pages==1 else True
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
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


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
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")

def user(request, user):
    if request.method == "POST":
        if request.POST["button"] == "Follow":
            Follow.objects.create(follower=request.user, following=User.objects.get(username=user))
        else:
            Follow.objects.get(follower=request.user, following=User.objects.get(username=user)).delete()
    posts = User.objects.get(username=user).posts.all().order_by('-time')
    for post in posts:
        post.likes = Like.objects.filter(post=post).count()
        post.save()
    paginator = Paginator(posts, 10)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    if request.user.is_authenticated:
        return render(request, "network/user.html", {
            "userThing": User.objects.get(username=user),
            "page_obj": page_obj,
            "follow": User.objects.get(username=user).id!=request.user.id,
            "followers": Follow.objects.filter(following=User.objects.get(username=user)).count(),
            "following": Follow.objects.filter(follower=User.objects.get(username=user)).count(),
            "button": "Follow" if Follow.objects.filter(follower=request.user, following=User.objects.get(username=user)).count() == 0 else "Unfollow",
            "multiple_pages": False if paginator.num_pages==1 else True
        })
    return render(request, "network/user.html", {
        "userThing": User.objects.get(username=user),
        "page_obj": page_obj,
        "followers": Follow.objects.filter(following=User.objects.get(username=user)).count(),
        "following": Follow.objects.filter(follower=User.objects.get(username=user)).count(),
        "multiple_pages": False if paginator.num_pages==1 else True
    })

@login_required
def following(request):
    posts = Post.objects.filter(poster__in=Follow.objects.filter(follower=request.user).values('following')).order_by('-time')
    for post in posts:
        post.likes = Like.objects.filter(post=post).count()
        post.save()
    paginator = Paginator(posts, 10)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    return render(request, "network/following.html", {
        "page_obj": page_obj,
        "multiple_pages": False if paginator.num_pages==1 else True
    })

@csrf_exempt
def edit(request, post_id):
    post = Post.objects.get(id=post_id)
    if request.method == "PUT":
        data = json.loads(request.body)
        if data.get("content") is not None:
            post.content = data["content"]
        post.save()
        return HttpResponse(status=204)

@csrf_exempt
def like(request, post_id):
    post = Post.objects.get(id=post_id)
    if request.method == "PUT":
        if Like.objects.filter(user=request.user, post=post).count() == 0:
            Like.objects.create(user=request.user, post=post)
            post.likes = Like.objects.filter(post=post).count()
        else:
            Like.objects.filter(user=request.user, post=post).delete()
            post.likes = Like.objects.filter(post=post).count()
        post.save()
        return HttpResponse(json.dumps(
            {'likes': post.likes}
        ))
