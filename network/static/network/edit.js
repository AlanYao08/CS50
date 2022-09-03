function edit(id) {
    var edit_box = document.querySelector(`#edit-box-${id}`);
    var edit_btn = document.querySelector(`#edit-btn-${id}`);
    edit_box.style.display = 'block';
    edit_btn.style.display = 'block';
    edit_box.value = document.querySelector(`#post-${id}`).innerHTML;
    document.querySelector(`#post-${id}`).style.display = 'none';
    document.querySelector(`#time-${id}`).style.display = 'none';
    document.querySelector(`#edit-${id}`).style.display = 'none';
    document.querySelector(`#like-part-${id}`).style.display = 'none';
    edit_btn.addEventListener('click', () => {
        fetch(`/edit/${id}`, {
            method: 'PUT',
            body: JSON.stringify({
                content: edit_box.value
            })
        });
        edit_box.style.display = 'none';
        edit_btn.style.display = 'none';
        document.querySelector(`#post-${id}`).style.display = 'block';
        document.querySelector(`#post-${id}`).innerHTML = edit_box.value;
        document.querySelector(`#time-${id}`).style.display = 'block';
        document.querySelector(`#like-part-${id}`).style.display = 'block';
        document.querySelector(`#edit-${id}`).style.display = 'block';
    });
};

function like(id) {
    var like_btn = document.querySelector(`#like-btn-${id}`);
    like_btn.addEventListener('click', () => {
        fetch(`/like/${id}`, {method: 'PUT'})
        .then(response => response.json())
        .then(data => {
            like_btn.innerHTML = data.likes;
        })
    });
};