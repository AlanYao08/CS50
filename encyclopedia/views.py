from django.shortcuts import render
from django.shortcuts import redirect
import markdown2
from random import choice

from . import util

def index(request):
    return render(request, "encyclopedia/index.html", {
        "entries": util.list_entries()
    })

def title(request, title):
    if util.get_entry(title) != None:
        return render(request, "encyclopedia/title.html", {
            "title": title,
            "content": markdown2.markdown(util.get_entry(title))
        })
    else:
        return render(request, "encyclopedia/error.html", {
            "content": "Error! Your requested page was not found"
        })

def search(request):
    entries = []
    query = request.GET.get("q")
    for entry in util.list_entries():
        if query.lower() == entry.lower():
            return redirect("title", title=query)
        elif query.lower() in entry.lower():
            entries.append(entry)
    return render(request, "encyclopedia/search.html", {
        "entries": entries
    })

def create(request):
    if request.method == "POST":
        title = request.POST.get("title")
        content = request.POST.get("content")
        if title in util.list_entries():
            return render(request, "encyclopedia/error.html", {
                "content": "Error! Page already exists"
            })
        util.save_entry(title, content)
        return redirect("title", title=title)
    return render(request, "encyclopedia/create.html")

def edit(request, title):
    if request.method == "POST":
        content = request.POST.get("content")
        util.save_entry(title, content)
        return redirect("title", title=title)
    return render(request, "encyclopedia/edit.html", {
        "title": title,
        "content": util.get_entry(title)
    })

def random(request):
    title = choice(util.list_entries())
    return redirect("title", title=title)