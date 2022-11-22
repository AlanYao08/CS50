# CS50W Capstone Project - Tasks
### Video Demo: https://youtu.be/V1ms4s2rn2I

### Overview
My capstone project for CS50 Web Programming is called Tasks. It is a website that is meant for users to organize the tasks they need to do by separating them into lists and adding categories to the tasks. I wanted to make the site so that I could have a place to easily check what things I need to get finished and update it as I get new things I needed to do in a visual way.

I used many languages and technologies I learned from this course to build the website, such as Javascript, HTML, Python, CSS, Bootstrap, and Django.

### Distinctiveness and Complexity
I believe this project meets the requirements set. It implements many concepts taught in the course.

The website is only a single page but uses javascript to add HTML elements to the page and send POST requests of data as lists, tasks, or categories are created, edited, or deleted. This way, everything can be used without needing to reload the page, and when reloaded, the website looks the same with the updated data. The website uses Django with three models to store data on the lists, tasks, and categories.

This web application is unique to previous projects in that it starts out small with two inputs to create lists and categories. Categories require a name and a color input, and javascript is used to create an HTML element of a container that displays the name and color of the category along with options to edit or delete it. Lists require a name, and the container with the list has its name and options to edit or delete it. It also contains a new input that is used to create tasks that belong inside that list. Tasks require a name, and its container is inside the list and displays its name and the colors of all the categories the task belongs to. It also has options to edit or delete the task and a check list form of all the categories to change what categories the task is a part of. As new categories are created or existing ones are edited, all colors and check lists change accordingly.

Javascript is extensively used to update the screen with all the lists, tasks, and categories without reloading the page. When lists, tasks, and categories are edited, the ids of the elements have to be changed using javascript along with their names and colors in order to keep track of them.

My web application is mobile responsive.

### Installation and how to run
1. Install required Python packages
```
pip install -r requirements.txt
```
2. Make and apply migrations
```
python manage.py makemigrations tasks
python manage.py migrate
```
3. Run the server
```
python manage.py runserver
```

### File Structure
- tasks is the Django app.
- tasks/static contains all the CSS and Javascript files used for the project.
- tasks/template contains the HTML templates for the project.
- tasks/views.py contains the views and interacts with the Django models as POST requests are received.
- tasks/urls.py contains the URLs for the project.
- tasks/models.py contains the three Django models of lists, tasks, and categories.