function onInput(input){
    var measure = document.querySelector(`#${input}`).nextElementSibling;
    measure.textContent = document.querySelector(`#${input}`).value;
    document.querySelector(`#${input}`).style.width = measure.offsetWidth + 'px';
    if(`${input}`.substring(0, 9) == 'edit-list' && document.querySelector(`#${input}`).value == '') {
        document.querySelector(`#${input}`).style.width = '122px';
    }
    if(`${input}`.substring(0, 9) == 'edit-task' && document.querySelector(`#${input}`).value == '') {
        document.querySelector(`#${input}`).style.width = '112px';
    }
    if(`${input}`.substring(0, 13) == 'edit-category' && document.querySelector(`#${input}`).value == '') {
        document.querySelector(`#${input}`).style.width = '157px';
    }
};

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('#add-list-text').onclick = add_list;
    document.querySelector('#add-list-cancel').onclick = stop_add_list;
    document.querySelector('#add-list-submit').onclick = submit_add_list;
});

function add_list() {
    var measure = document.querySelector(`#list-name`).nextElementSibling;
    measure.textContent = document.querySelector(`#list-name`).value;
    document.querySelector(`#list-name`).style.width = measure.offsetWidth + 'px';
    document.querySelector('#add-list-text').style.display = 'none';
    document.querySelector('#add-list').style.display = 'block';
};

function stop_add_list() {
    document.querySelector('#add-list-text').style.display = 'block';
    document.querySelector('#add-list').style.display = 'none';
};

function submit_add_list() {
    const realName = document.querySelector('#list-name').value;
    const name = document.querySelector('#list-name').value.replace(/[^a-zA-Z0-9]/g,'-');
    const list = document.createElement('div');
    list.classList.add('container', 'col-md-auto');
    list.id = `list-${name}`;
    list.style = "padding: 5px;";

    const listName = document.createElement('span');
    listName.id = `list-${name}-name`;
    listName.style = 'float: left; color: MidnightBlue; font-weight: bold; margin-right: 3px; white-space: pre;';
    listName.innerHTML = realName;

    const listNewName = document.createElement('input');
    listNewName.setAttribute('autofocus', 'autofocus');
    listNewName.classList.add('form-control', 'editInput');
    listNewName.id = `edit-list-${name}-name`;
    listNewName.type = 'text';
    listNewName.setAttribute('name', 'name');
    listNewName.placeholder = "New List Name";
    listNewName.style = "display: none; float: left; font-weight: bold; margin-left: -3.7px;";
    listNewName.setAttribute('oninput', `onInput('edit-list-${name}-name')`);

    const listMeasure = document.createElement('span');
    listMeasure.className = 'boldMeasure';

    const listDelete = document.createElement('span');
    listDelete.id = `list-${name}-delete`;
    listDelete.style = 'float: right;';
    listDelete.className = 'hover';
    listDelete.setAttribute('onclick', `delete_list('${name}')`);
    listDelete.innerHTML = "Delete";

    const listSave = document.createElement('span');
    listSave.id = `edit-list-${name}-submit`;
    listSave.className = 'hover';
    listSave.style = "display: none; float: right; margin-left: 7px; margin-right: 7px;";
    listSave.setAttribute('onclick', `edit_list_submit('${name}')`);
    listSave.innerHTML = "Save";

    const line = document.createElement('br');

    const listEdit = document.createElement('span');
    listEdit.id = `edit-list-${name}`;
    listEdit.style = "float: right; margin-left: 7px; margin-right: 7px;";
    listEdit.className = 'hover';
    listEdit.setAttribute('onclick', `edit_list('${name}')`);
    listEdit.innerHTML = "Edit";

    const addTask = document.createElement('span');
    addTask.id = `add-task-${name}`;
    addTask.className = 'hover';
    addTask.setAttribute('onclick', `add_task('${name}')`);
    addTask.innerHTML = "Add a task";

    const addTaskText = document.createElement('input');
    addTaskText.setAttribute('autofocus', 'autofocus');
    addTaskText.className = 'form-control';
    addTaskText.id = `add-task-${name}-text`;
    addTaskText.type = 'text';
    addTaskText.setAttribute('name', 'name');
    addTaskText.placeholder = "Task Text";
    addTaskText.style = "display: none; margin-bottom: 5px; min-width: 155px; width: 155px; margin-top: 5px;";
    addTaskText.setAttribute('oninput', `onInput('add-task-${name}-text')`);

    const addTaskMeasure = document.createElement('span');
    addTaskMeasure.className = 'addMeasure';

    const addTaskButton = document.createElement('button');
    addTaskButton.id = `add-task-${name}-submit`;
    addTaskButton.className = 'btn btn-primary';
    addTaskButton.style = "display: none; margin-right: 5px;";
    addTaskButton.innerHTML = "Add Task";
    addTaskButton.setAttribute('onclick', `submit_add_task('${name}')`);

    const addTaskCancel = document.createElement('span');
    addTaskCancel.id = `add-task-${name}-cancel`;
    addTaskCancel.className = 'hover';
    addTaskCancel.setAttribute('onclick', `stop_add_task('${name}')`);
    addTaskCancel.style = "display: none;";
    addTaskCancel.innerHTML = "Cancel";

    const tasks = document.createElement('div');
    tasks.id = `tasks-${name}`;
    tasks.className = 'd-flex flex-column';

    list.append(listName);
    list.append(listNewName);
    list.append(listMeasure);
    list.append(listDelete);
    list.append(listSave);
    list.append(listEdit);
    list.append(line);
    list.append(tasks);
    list.append(addTask);
    list.append(addTaskText);
    list.append(addTaskMeasure);
    list.append(addTaskButton);
    list.append(addTaskCancel);
    document.querySelector('#lists').append(list);
    document.querySelector(`#lists`).appendChild(document.querySelector(`#add-list-text`));
    document.querySelector(`#lists`).appendChild(document.querySelector(`#add-list`));
    fetch('', {
        method: 'POST',
        body: JSON.stringify({
            listName: realName
        })
    });
    document.querySelector('#list-name').value = '';
    stop_add_list();
};

function delete_list(name) {
    var list = document.querySelector(`#list-${name}`);
    list.remove();
    fetch('', {
        method: 'POST',
        body: JSON.stringify({
            removeListName: name
        })
    });
};

function edit_list(name) {
    document.querySelector(`#list-${name}-name`).style.display = 'none';
    document.querySelector(`#edit-list-${name}`).style.display = 'none';
    document.querySelector(`#edit-list-${name}-submit`).style.display = 'block';
    document.querySelector(`#edit-list-${name}-name`).style.display = 'block';
    document.querySelector(`#edit-list-${name}-name`).value = document.querySelector(`#list-${name}-name`).innerHTML;
    var measure = document.querySelector(`#edit-list-${name}-name`).nextElementSibling;
    measure.textContent = document.querySelector(`#edit-list-${name}-name`).value;
    document.querySelector(`#edit-list-${name}-name`).style.width = measure.offsetWidth + 'px';
    if(document.querySelector(`#edit-list-${name}-name`).value == '') {
        document.querySelector(`#edit-list-${name}-name`).style.width = '122px';
    }
};

function edit_list_submit(name) {
    var edit_btn = document.querySelector(`#edit-list-${name}-submit`);
    var edit_box = document.querySelector(`#edit-list-${name}-name`);
    fetch('', {
        method: 'POST',
        body: JSON.stringify({
            editListOldName: document.querySelector(`#list-${name}-name`).innerHTML,
            editListNewName: edit_box.value
        })
    });
    var newName = edit_box.value.replace(/[^a-zA-Z0-9]/g,'-');
    edit_box.style.display = 'none';
    edit_btn.style.display = 'none';
    document.querySelector(`#edit-list-${name}`).style.display = 'block';
    document.querySelector(`#edit-list-${name}`).removeAttribute('onclick');
    document.querySelector(`#edit-list-${name}`).setAttribute('onclick', `edit_list('${newName}')`);
    document.querySelector(`#edit-list-${name}`).id = `edit-list-${newName}`;
    edit_btn.removeAttribute('onclick');
    edit_btn.setAttribute('onclick', `edit_list_submit('${newName}')`);
    edit_btn.id = `edit-list-${newName}-submit`;
    edit_box.removeAttribute('oninput');
    edit_box.setAttribute('oninput', `onInput('edit-list-${newName}-name')`);
    edit_box.id = `edit-list-${newName}-name`;
    document.querySelector(`#list-${name}-delete`).removeAttribute('onclick');
    document.querySelector(`#list-${name}-delete`).setAttribute('onclick', `delete_list('${newName}')`);
    document.querySelector(`#list-${name}-delete`).id = `list-${newName}-delete`;
    document.querySelector(`#add-task-${name}`).removeAttribute('onclick');
    document.querySelector(`#add-task-${name}`).setAttribute('onclick', `add_task('${newName}')`);
    document.querySelector(`#add-task-${name}`).id = `add-task-${newName}`;
    document.querySelector(`#add-task-${name}-text`).removeAttribute('oninput');
    document.querySelector(`#add-task-${name}-text`).setAttribute('oninput', `onInput('add-task-${newName}-text')`);
    document.querySelector(`#add-task-${name}-text`).id = `add-task-${newName}-text`;
    document.querySelector(`#add-task-${name}-submit`).removeAttribute('onclick');
    document.querySelector(`#add-task-${name}-submit`).setAttribute('onclick', `submit_add_task('${newName}')`);
    document.querySelector(`#add-task-${name}-submit`).id = `add-task-${newName}-submit`;
    document.querySelector(`#add-task-${name}-cancel`).removeAttribute('onclick');
    document.querySelector(`#add-task-${name}-cancel`).setAttribute('onclick', `stop_add_task('${newName}')`);
    document.querySelector(`#add-task-${name}-cancel`).id = `add-task-${newName}-cancel`;
    document.querySelector(`#tasks-${name}`).id = `tasks-${newName}`;
    document.querySelector(`#list-${name}-name`).style.display = 'block';
    document.querySelector(`#list-${name}-name`).innerHTML = `${edit_box.value}`;
    document.querySelector(`#list-${name}-name`).id = `list-${newName}-name`;
    document.querySelector(`#list-${name}`).id = `list-${newName}`;
}

function add_task(name) {
    var measure = document.querySelector(`#add-task-${name}-text`).nextElementSibling;
    measure.textContent = document.querySelector(`#add-task-${name}-text`).value;
    document.querySelector(`#add-task-${name}-text`).style.width = measure.offsetWidth + 'px';
    document.querySelector(`#add-task-${name}`).style.display = 'none';
    document.querySelector(`#add-task-${name}-text`).style.display = 'block';
    document.querySelector(`#add-task-${name}-submit`).style = 'margin-right: 5px;';
    document.querySelector(`#add-task-${name}-cancel`).style = '';
};

function stop_add_task(name) {
    document.querySelector(`#add-task-${name}`).style.display = 'block';
    document.querySelector(`#add-task-${name}-text`).style.display = 'none';
    document.querySelector(`#add-task-${name}-submit`).style = 'display: none;';
    document.querySelector(`#add-task-${name}-cancel`).style.display = 'none';
};

function submit_add_task(name) {
    const realText = document.querySelector(`#add-task-${name}-text`).value;
    const text = document.querySelector(`#add-task-${name}-text`).value.replace(/[^a-zA-Z0-9]/g,'-');
    const task = document.createElement('div');
    task.className = 'container';
    task.id = `task-${text}`;
    task.style = "min-width: 240px; background-color: SkyBlue; margin: 0px; margin-bottom: 5px; padding: 5px;";

    const taskName = document.createElement('span');
    taskName.id = `task-${text}-text`;
    taskName.style = 'float: left; color: MidnightBlue; margin-right: 3px; white-space: pre;';
    taskName.innerHTML = realText;

    const taskNewText = document.createElement('input');
    taskNewText.setAttribute('autofocus', 'autofocus');
    taskNewText.classList.add('form-control', 'editInput');
    taskNewText.id = `edit-task-${text}-text`;
    taskNewText.type = 'text';
    taskNewText.setAttribute('name', 'name');
    taskNewText.placeholder = "New Task Text";
    taskNewText.style = "display: none; float: left; margin-left: -3.7px;";
    taskNewText.setAttribute('oninput', `onInput('edit-task-${text}-text')`);

    const taskMeasure = document.createElement('span');
    taskMeasure.className = 'editMeasure';

    const taskDelete = document.createElement('span');
    taskDelete.id = `task-${text}-delete`;
    taskDelete.style = 'float: right;';
    taskDelete.className = 'hover';
    taskDelete.setAttribute('onclick', `delete_task('${text}')`);
    taskDelete.innerHTML = "Delete";

    const taskSave = document.createElement('span');
    taskSave.id = `edit-task-${text}-submit`;
    taskSave.className = 'hover';
    taskSave.style = "display: none; float: right; margin-left: 7px; margin-right: 7px;";
    taskSave.setAttribute('onclick', `edit_task_submit('${text}')`);
    taskSave.innerHTML = "Save";

    const taskEdit = document.createElement('span');
    taskEdit.id = `edit-task-${text}`;
    taskEdit.style = "float: right; margin-left: 7px; margin-right: 7px;";
    taskEdit.className = 'hover';
    taskEdit.setAttribute('onclick', `edit_task('${text}')`);
    taskEdit.innerHTML = "Edit";

    const line = document.createElement('br');

    const circleCategories = document.createElement('div');
    circleCategories.id = `categories-${text}`;
    circleCategories.style = "margin-bottom: 12px;";

    const setCategory = document.createElement('span');
    setCategory.id = `set-category-${text}`;
    setCategory.className = 'hover';
    setCategory.setAttribute('onclick', `set_category('${text}')`);
    setCategory.innerHTML = "Set categories";

    const formCategories = document.createElement('div');
    formCategories.id = `category-form-${text}`;
    formCategories.className = 'categoryForm';
    formCategories.style = "display: none;";
    var categories = document.querySelector(`#categories`).children;
    for(var i = 0; i < categories.length-2; i++) {
        var categoryId = categories[i].id.substring(9);
        var thing = categories[i].children;
        var categoryName = thing[1].innerHTML;

        const formCategory = document.createElement('div');
        formCategory.classList.add('form-check', 'form-check-inline');

        const formCategoryInput = document.createElement('input');
        formCategoryInput.classList.add('form-check-input', `${categoryId}Form`);
        formCategoryInput.setAttribute('name', `name${text}`);
        formCategoryInput.type = 'checkbox';
        formCategoryInput.id = `set-category-${text}-${categoryId}`;

        const formCategoryLabel = document.createElement('label');
        formCategoryLabel.classList.add('form-check-label', `${categoryId}Label`);
        formCategoryLabel.id = `label-${text}-${categoryId}`;
        formCategoryLabel.setAttribute('for', `set-category-${text}-${categoryId}`);
        formCategoryLabel.style = "white-space: pre;";
        formCategoryLabel.innerHTML = `${categoryName}`;

        formCategory.append(formCategoryInput);
        formCategory.append(formCategoryLabel);
        formCategories.append(formCategory)
    }

    const setCategoryButton = document.createElement('button');
    setCategoryButton.id = `set-category-${text}-submit`;
    setCategoryButton.className = 'btn btn-primary';
    setCategoryButton.style = "display: none;";
    setCategoryButton.setAttribute('onclick', `submit_set_category('${text}')`);
    setCategoryButton.innerHTML = "Confirm Categories";

    const setCategoryCancel = document.createElement('span');
    setCategoryCancel.id = `set-category-${text}-cancel`;
    setCategoryCancel.className = 'hover';
    setCategoryCancel.setAttribute('onclick', `stop_set_category('${text}')`);
    setCategoryCancel.style = "display: none;";
    setCategoryCancel.innerHTML = "Cancel";

    task.append(taskName);
    task.append(taskNewText);
    task.append(taskMeasure);
    task.append(taskDelete);
    task.append(taskSave);
    task.append(taskEdit);
    task.append(line);
    task.append(circleCategories);
    task.append(setCategory);
    task.append(formCategories);
    task.append(setCategoryButton);
    task.append(setCategoryCancel);
    document.querySelector(`#tasks-${name}`).append(task);
    fetch('', {
        method: 'POST',
        body: JSON.stringify({
            taskName: realText,
            parentList: name
        })
    });
    document.querySelector(`#add-task-${name}-text`).value = '';
    stop_add_task(name);
}

function delete_task(text) {
    var task = document.querySelector(`#task-${text}`);
    task.remove();
    fetch('', {
        method: 'POST',
        body: JSON.stringify({
            removeTaskText: text
        })
    });
};

function edit_task(text) {
    document.querySelector(`#task-${text}-text`).style.display = 'none';
    document.querySelector(`#edit-task-${text}`).style.display = 'none';
    document.querySelector(`#edit-task-${text}-submit`).style.display = 'block';
    document.querySelector(`#edit-task-${text}-text`).style.display = 'block';
    document.querySelector(`#edit-task-${text}-text`).value = document.querySelector(`#task-${text}-text`).innerHTML;
    var measure = document.querySelector(`#edit-task-${text}-text`).nextElementSibling;
    measure.textContent = document.querySelector(`#edit-task-${text}-text`).value;
    document.querySelector(`#edit-task-${text}-text`).style.width = measure.offsetWidth + 'px';
    if(document.querySelector(`#edit-task-${text}-text`).value == '') {
        document.querySelector(`#edit-task-${text}-text`).style.width = '112px';
    }
};

function edit_task_submit(text) {
    var edit_btn = document.querySelector(`#edit-task-${text}-submit`);
    var edit_box = document.querySelector(`#edit-task-${text}-text`);
    fetch('', {
        method: 'POST',
        body: JSON.stringify({
            editTaskOldText: document.querySelector(`#task-${text}-text`).innerHTML,
            editTaskNewText: edit_box.value
        })
    });
    var newText = edit_box.value.replace(/[^a-zA-Z0-9]/g,'-');
    edit_box.style.display = 'none';
    edit_btn.style.display = 'none';
    document.querySelector(`#edit-task-${text}`).style.display = 'block';
    document.querySelector(`#edit-task-${text}`).removeAttribute('onclick');
    document.querySelector(`#edit-task-${text}`).setAttribute('onclick', `edit_task('${newText}')`);
    document.querySelector(`#edit-task-${text}`).id = `edit-task-${newText}`;
    edit_btn.removeAttribute('onclick');
    edit_btn.setAttribute('onclick', `edit_task_submit('${newText}')`);
    edit_btn.id = `edit-task-${newText}-submit`;
    edit_box.removeAttribute('oninput');
    edit_box.setAttribute('oninput', `onInput('edit-task-${newText}-text')`);
    edit_box.id = `edit-task-${newText}-text`;
    document.querySelector(`#task-${text}-delete`).removeAttribute('onclick');
    document.querySelector(`#task-${text}-delete`).setAttribute('onclick', `delete_task('${newText}')`);
    document.querySelector(`#task-${text}-delete`).id = `task-${newText}-delete`;
    document.querySelector(`#task-${text}-text`).style.display = 'block';
    document.querySelector(`#task-${text}-text`).innerHTML = `${edit_box.value}`;
    document.querySelector(`#task-${text}-text`).id = `task-${newText}-text`;
    document.querySelector(`#task-${text}`).id = `task-${newText}`;
    var circleCategories = document.querySelector(`#categories-${text}`).children;
    for(var i = 0; i < circleCategories.length; i++) {
        var categoryId = circleCategories[i].id.substring(text.length+10);
        circleCategories[i].id = `category-${newText}-${categoryId}`;
    }
    document.querySelector(`#categories-${text}`).id = `categories-${newText}`;
    document.querySelector(`#set-category-${text}`).removeAttribute('onclick');
    document.querySelector(`#set-category-${text}`).setAttribute('onclick', `set_category('${newText}')`);
    document.querySelector(`#set-category-${text}`).id = `set-category-${newText}`;
    var formCategories = document.querySelector(`#category-form-${text}`).children;
    for(var i = 0; i < formCategories.length; i++) {
        var actualFormCategory = formCategories[i].children;
        var categoryId = actualFormCategory[0].id.substring(text.length+14);
        actualFormCategory[0].name = `name${newText}`;
        actualFormCategory[0].id = `set-category-${newText}-${categoryId}`;
        actualFormCategory[1].for = `set-category-${newText}-${categoryId}`;
        actualFormCategory[1].id = `label-${newText}-${categoryId}`;
    }
    document.querySelector(`#category-form-${text}`).id = `category-form-${newText}`;
    document.querySelector(`#set-category-${text}-submit`).removeAttribute('onclick');
    document.querySelector(`#set-category-${text}-submit`).setAttribute('onclick', `submit_set_category('${newText}')`);
    document.querySelector(`#set-category-${text}-submit`).id = `set-category-${newText}-submit`;
    document.querySelector(`#set-category-${text}-cancel`).removeAttribute('onclick');
    document.querySelector(`#set-category-${text}-cancel`).setAttribute('onclick', `stop_set_category('${newText}')`);
    document.querySelector(`#set-category-${text}-cancel`).id = `set-category-${newText}-cancel`;
}

function add_category() {
    var measure = document.querySelector(`#category-name`).nextElementSibling;
    measure.textContent = document.querySelector(`#category-name`).value;
    document.querySelector(`#category-name`).style.width = measure.offsetWidth + 'px';
    document.querySelector('#add-category-text').style.display = 'none';
    document.querySelector('#add-category').style.display = 'block';
};

function stop_add_category() {
    document.querySelector('#add-category-text').style.display = 'block';
    document.querySelector('#add-category').style.display = 'none';
};

function submit_add_category() {
    const realName = document.querySelector('#category-name').value;
    const name = document.querySelector('#category-name').value.replace(/[^a-zA-Z0-9]/g,'-');
    const color = document.querySelector('#category-color').value;

    const category = document.createElement('div');
    category.classList.add('container', 'col-md-auto');
    category.id = `category-${name}`;
    category.style = `padding-left: 8px; padding-top: 6px; padding-bottom: 5px; background-color: ${color}80; min-width: 205px;`;

    const categoryColor = document.createElement('div');
    categoryColor.id = `category-${name}-circle`;
    categoryColor.className = ('circle');
    categoryColor.style = `background-color: ${color}; margin-top: 2px; margin-left: 2px; margin-right: 10px; height: 20px; width: 20px;`;

    const categoryName = document.createElement('span');
    categoryName.id = `category-${name}-name`;
    categoryName.style = 'float: left; color: MidnightBlue; margin-right: 3px; white-space: pre;';
    categoryName.innerHTML = realName;

    const categoryNewColor = document.createElement('input');
    categoryNewColor.classList.add('form-control', 'form-control-color');
    categoryNewColor.id = `edit-category-${name}-color`;
    categoryNewColor.type = 'color';
    categoryNewColor.style = "display: none; float: left; height: 23px; width: 23px; padding: 0px; margin-right: 5.3px;";

    const categoryNewName = document.createElement('input');
    categoryNewName.setAttribute('autofocus', 'autofocus');
    categoryNewName.classList.add('form-control', 'editInput');
    categoryNewName.id = `edit-category-${name}-name`;
    categoryNewName.type = 'text';
    categoryNewName.setAttribute('name', 'name');
    categoryNewName.placeholder = "New Category Name";
    categoryNewName.style = `display: none; float: left;`;
    categoryNewName.setAttribute('oninput', `onInput('edit-category-${name}-name')`);

    const categoryMeasure = document.createElement('span');
    categoryMeasure.className = 'editMeasure';

    const categoryDelete = document.createElement('span');
    categoryDelete.id = `category-${name}-delete`;
    categoryDelete.style = 'float: right;';
    categoryDelete.className = 'hover';
    categoryDelete.setAttribute('onclick', `delete_category('${name}')`);
    categoryDelete.innerHTML = "Delete";

    const categorySave = document.createElement('span');
    categorySave.id = `edit-category-${name}-submit`;
    categorySave.className = 'hover';
    categorySave.style = "display: none; float: right; margin-left: 7px; margin-right: 7px;";
    categorySave.setAttribute('onclick', `edit_category_submit('${name}')`);
    categorySave.innerHTML = "Save";

    const categoryEdit = document.createElement('span');
    categoryEdit.id = `edit-category-${name}`;
    categoryEdit.style = "float: right; margin-left: 7px; margin-right: 7px;";
    categoryEdit.className = 'hover';
    categoryEdit.setAttribute('onclick', `edit_category('${name}')`);
    categoryEdit.innerHTML = "Edit";

    category.append(categoryColor);
    category.append(categoryName);
    category.append(categoryNewColor);
    category.append(categoryNewName);
    category.append(categoryMeasure);
    category.append(categoryDelete);
    category.append(categorySave);
    category.append(categoryEdit);

    document.querySelector('#categories').append(category);
    document.querySelector(`#categories`).appendChild(document.querySelector(`#add-category-text`));
    document.querySelector(`#categories`).appendChild(document.querySelector(`#add-category`));

    let categoryForms = document.getElementsByClassName('categoryForm');
    for(let i = 0; i < categoryForms.length; i++) {
        var taskId = categoryForms[i].id.substring(14);
        const formCategory = document.createElement('div');
        formCategory.classList.add('form-check', 'form-check-inline');

        const formCategoryInput = document.createElement('input');
        formCategoryInput.classList.add('form-check-input', `${name}Form`);
        formCategoryInput.setAttribute('name', `name${taskId}`);
        formCategoryInput.type = 'checkbox';
        formCategoryInput.id = `set-category-${taskId}-${name}`;

        const formCategoryLabel = document.createElement('label');
        formCategoryLabel.classList.add('form-check-label', `${name}Label`);
        formCategoryLabel.id = `label-${taskId}-${name}`;
        formCategoryLabel.setAttribute('for', `set-category-${taskId}-${name}`);
        formCategoryLabel.style = "white-space: pre;";
        formCategoryLabel.innerHTML = `${realName}`;

        formCategory.append(formCategoryInput);
        formCategory.append(formCategoryLabel);
        categoryForms[i].append(formCategory)
    }

    fetch('', {
        method: 'POST',
        body: JSON.stringify({
            categoryName: realName,
            categoryColor: color
        })
    });
    document.querySelector('#category-name').value = '';
    document.querySelector('#category-color').value = '#ffffff';
    stop_add_category();
};

function delete_category(name) {
    var category = document.querySelector(`#category-${name}`);
    category.remove();

    let categoryCirclesFake = document.getElementsByClassName(`${name}Circle`);
    let categoryCircles = Array.from(categoryCirclesFake);
    for(let i = 0; i < categoryCircles.length; i++) {
        categoryCircles[i].remove();
    }

    let categoryFormsFake = document.getElementsByClassName(`${name}Form`);
    let categoryForms = Array.from(categoryFormsFake);
    for(let i = 0; i < categoryForms.length; i++) {
        categoryForms[i].parentNode.remove();
    }

    fetch('', {
        method: 'POST',
        body: JSON.stringify({
            removeCategoryName: name
        })
    });
};

function edit_category(name) {
    document.querySelector(`#category-${name}-name`).style.display = 'none';
    document.querySelector(`#category-${name}-circle`).style.display = 'none';
    document.querySelector(`#edit-category-${name}`).style.display = 'none';
    document.querySelector(`#edit-category-${name}-submit`).style.display = 'block';
    document.querySelector(`#edit-category-${name}-name`).style.display = 'block';
    document.querySelector(`#edit-category-${name}-name`).value = document.querySelector(`#category-${name}-name`).innerHTML;
    var measure = document.querySelector(`#edit-category-${name}-name`).nextElementSibling;
    measure.textContent = document.querySelector(`#edit-category-${name}-name`).value;
    document.querySelector(`#edit-category-${name}-name`).style.width = measure.offsetWidth + 'px';
    if(document.querySelector(`#edit-category-${name}-name`).value == '') {
        document.querySelector(`#edit-category-${name}-name`).style.width = '157px';
    }
    document.querySelector(`#edit-category-${name}-color`).style.display = 'block';
    var rgb = document.querySelector(`#category-${name}-circle`).style.backgroundColor;
    rgb = rgb.replace(/[^\d,]/g, '').split(',');
    document.querySelector(`#edit-category-${name}-color`).value = rgbToHex(parseInt(rgb[0]),parseInt(rgb[1]),parseInt(rgb[2]));
};

function edit_category_submit(name) {
    var edit_btn = document.querySelector(`#edit-category-${name}-submit`);
    var edit_box_name = document.querySelector(`#edit-category-${name}-name`);
    var edit_box_color = document.querySelector(`#edit-category-${name}-color`);
    var rgb = document.querySelector(`#category-${name}-circle`).style.backgroundColor;
    rgb = rgb.replace(/[^\d,]/g, '').split(',');
    var oldRGB = rgbToHex(parseInt(rgb[0]),parseInt(rgb[1]),parseInt(rgb[2]));
    fetch('', {
        method: 'POST',
        body: JSON.stringify({
            editCategoryOldName: document.querySelector(`#category-${name}-name`).innerHTML,
            editCategoryNewName: edit_box_name.value,
            editCategoryOldColor: oldRGB,
            editCategoryNewColor: edit_box_color.value
        })
    });
    var newName = edit_box_name.value.replace(/[^a-zA-Z0-9]/g,'-');
    edit_box_name.style.display = 'none';
    edit_box_color.style.display = 'none';
    edit_btn.style.display = 'none';
    document.querySelector(`#edit-category-${name}`).style.display = 'block';
    document.querySelector(`#edit-category-${name}`).removeAttribute('onclick');
    document.querySelector(`#edit-category-${name}`).setAttribute('onclick', `edit_category('${newName}')`);
    document.querySelector(`#edit-category-${name}`).id = `edit-category-${newName}`;
    edit_btn.removeAttribute('onclick');
    edit_btn.setAttribute('onclick', `edit_category_submit('${newName}')`);
    edit_btn.id = `edit-category-${newName}-submit`;
    edit_box_name.removeAttribute('oninput');
    edit_box_name.setAttribute('oninput', `onInput('edit-category-${newName}-name')`);
    edit_box_name.id = `edit-category-${newName}-name`;
    edit_box_color.id = `edit-category-${newName}-color`;
    document.querySelector(`#category-${name}-delete`).removeAttribute('onclick');
    document.querySelector(`#category-${name}-delete`).setAttribute('onclick', `delete_category('${newName}')`);
    document.querySelector(`#category-${name}-delete`).id = `category-${newName}-delete`;

    let categoryCirclesFake = document.getElementsByClassName(`${name}Circle`);
    let categoryCircles = Array.from(categoryCirclesFake);
    for(let i = 0; i < categoryCircles.length; i++) {
        var firstPart = categoryCircles[i].id.substring(0, categoryCircles[i].id.length-name.length);
        categoryCircles[i].id = `${firstPart}${newName}`;
        categoryCircles[i].classList.remove(`${name}Circle`);
        categoryCircles[i].classList.add(`${newName}Circle`);
        categoryCircles[i].style.backgroundColor = `${edit_box_color.value}`;
    }

    let categoryFormsFake = document.getElementsByClassName(`${name}Form`);
    let categoryForms = Array.from(categoryFormsFake);
    for(let i = 0; i < categoryForms.length; i++) {
        var firstPart = categoryForms[i].id.substring(0, categoryForms[i].id.length-name.length);
        categoryForms[i].id = `${firstPart}${newName}`;
        categoryForms[i].classList.remove(`${name}Form`);
        categoryForms[i].classList.add(`${newName}Form`);
    }

    let categoryLabelsFake = document.getElementsByClassName(`${name}Label`);
    let categoryLabels = Array.from(categoryLabelsFake);
    for(let i = 0; i < categoryLabels.length; i++) {
        var firstPartId = categoryLabels[i].id.substring(0, categoryLabels[i].id.length-name.length);
        categoryLabels[i].id = `${firstPartId}${newName}`;
        var firstPartFor = categoryLabels[i].getAttribute('for').substring(0, categoryLabels[i].id.length-name.length);
        categoryLabels[i].for = `${firstPartFor}${newName}`;
        categoryLabels[i].innerHTML = `${edit_box_name.value}`;
        categoryLabels[i].classList.remove(`${name}Label`);
        categoryLabels[i].classList.add(`${newName}Label`);
    }

    document.querySelector(`#category-${name}-circle`).style.display = 'block';
    document.querySelector(`#category-${name}-circle`).style.backgroundColor = `${edit_box_color.value}`;
    document.querySelector(`#category-${name}-circle`).id = `category-${newName}-circle`;
    document.querySelector(`#category-${name}-name`).style.display = 'block';
    document.querySelector(`#category-${name}-name`).innerHTML = `${edit_box_name.value}`;
    document.querySelector(`#category-${name}-name`).id = `category-${newName}-name`;
    document.querySelector(`#category-${name}`).style.backgroundColor = `${edit_box_color.value}80`;
    document.querySelector(`#category-${name}`).id = `category-${newName}`;
}

function set_category(text) {
    document.querySelector(`#set-category-${text}`).style.display = 'none';
    document.querySelector(`#category-form-${text}`).style.display = 'block';
    document.querySelector(`#set-category-${text}-submit`).style = 'margin-right: 5px;';
    document.querySelector(`#set-category-${text}-cancel`).style = '';
};

function stop_set_category(text) {
    document.querySelector(`#set-category-${text}`).style.display = 'block';
    document.querySelector(`#category-form-${text}`).style.display = 'none';
    document.querySelector(`#set-category-${text}-submit`).style.display = 'none';
    document.querySelector(`#set-category-${text}-cancel`).style.display = 'none';
};

function submit_set_category(text) {
    document.querySelector(`#categories-${text}`).innerHTML = '';
    var categoryArray = [];
    var checkedBoxes = document.querySelectorAll(`input[name=name${text}]:checked`);
    checkedBoxes.forEach(category => {
        var idName = category.id.substring(text.length+14);
        categoryArray.push(idName);
        var color = document.querySelector(`#category-${idName}`).children[0].style.backgroundColor;

        const categoryCircle = document.createElement('div');
        categoryCircle.classList.add('circle', `${idName}Circle`);
        categoryCircle.id = `category-${text}-${idName}`;
        categoryCircle.style = `background-color: ${color};`;

        document.querySelector(`#categories-${text}`).append(categoryCircle);
    });
    fetch('', {
        method: 'POST',
        body: JSON.stringify({
            setCategoryName: categoryArray,
            setTaskText: text
        })
    });
    stop_set_category(text);
}