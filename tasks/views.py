from django.shortcuts import HttpResponseRedirect, render
from django.urls import reverse
from .models import List, Task, Category
import json
from django.views.decorators.csrf import csrf_exempt
import re

@csrf_exempt
def index(request):
    if request.method == "POST":
        data = json.loads(request.body)
        if data.get("listName") is not None:
            list = List(name=data.get("listName"), idName=re.sub('[^a-zA-Z0-9]','-', data.get("listName")))
            list.save()
        if data.get("removeListName") is not None:
            List.objects.filter(idName=data.get("removeListName")).delete()
        if data.get("editListOldName") is not None:
            List.objects.filter(name=data.get("editListOldName")).update(name=data.get("editListNewName"), idName=re.sub('[^a-zA-Z0-9]','-', data.get("editListNewName")))
        if data.get("taskName") is not None:
            task = Task(list=List.objects.get(idName=data.get("parentList")), text=data.get("taskName"), idText=re.sub('[^a-zA-Z0-9]','-', data.get("taskName")))
            task.save()
            List.objects.get(idName=data.get("parentList")).tasks.add(task)
        if data.get("removeTaskText") is not None:
            Task.objects.filter(idText=data.get("removeTaskText")).delete()
        if data.get("editTaskOldText") is not None:
            Task.objects.filter(text=data.get("editTaskOldText")).update(text=data.get("editTaskNewText"), idText=re.sub('[^a-zA-Z0-9]','-', data.get("editTaskNewText")))
        if data.get("categoryName") is not None:
            category = Category(name=data.get("categoryName"), idName=re.sub('[^a-zA-Z0-9]','-', data.get("categoryName")), color=data.get("categoryColor"))
            category.save()
        if data.get("removeCategoryName") is not None:
            Category.objects.filter(idName=data.get("removeCategoryName")).delete()
        if data.get("editCategoryOldName") is not None:
            Category.objects.filter(name=data.get("editCategoryOldName"), color=data.get("editCategoryOldColor")).update(name=data.get("editCategoryNewName"), idName=re.sub('[^a-zA-Z0-9]','-', data.get("editCategoryNewName")), color=data.get("editCategoryNewColor"))
        if data.get("setCategoryName") is not None:
            task = Task.objects.get(idText=data.get("setTaskText"))
            for category in task.categories.all():
                task.categories.remove(category)
            for categoryName in data.get("setCategoryName"):
                task.categories.add(Category.objects.get(idName=categoryName))
                task.save()
        return HttpResponseRedirect(reverse("index"))
    return render(request, "tasks/index.html", {
        "lists": List.objects.all(),
        "categories": Category.objects.all()
    })