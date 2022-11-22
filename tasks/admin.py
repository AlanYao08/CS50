from django.contrib import admin
from .models import List, Task, Category

# Register your models here.
admin.site.register(List)
admin.site.register(Task)
admin.site.register(Category)
