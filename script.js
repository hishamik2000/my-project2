let albums = JSON.parse(localStorage.getItem('albums')) || {
    Family: [],
    Architecture: [],
    Street: [],
    Landscape: [],
    Travel: [],
    Miscellaneous: []
};

const albumSelect = document.getElementById('albumSelect');
const photoInput = document.getElementById('photoInput');
const photoComment = document.getElementById('photoComment');
const photosContainer = document.getElementById('photosContainer');
const albumList = document.getElementById('albumList');

function savePhoto() {
    const file = photoInput.files[0];
    const album = albumSelect.value;
    const comment = photoComment.value;

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            albums[album].push({ url: e.target.result, comment });
            localStorage.setItem('albums', JSON.stringify(albums));
            displayPhotos(album);
            photoInput.value = '';
            photoComment.value = '';
        };
        reader.readAsDataURL(file);
    } else {
        alert('يرجى اختيار صورة.');
    }
}

function displayPhotos(album) {
    photosContainer.innerHTML = '';
    albums[album].forEach((media, index) => {
        const mediaContainer = document.createElement('div');
        mediaContainer.className = 'media-container';

        let mediaElement;
        if (media.url.startsWith('data:image')) {
            mediaElement = document.createElement('img');
            mediaElement.src = media.url;
        } else if (media.url.startsWith('data:video')) {
            mediaElement = document.createElement('video');
            mediaElement.src = media.url;
            mediaElement.controls = true;
        }

        mediaContainer.appendChild(mediaElement);

        const comment = document.createElement('p');
        comment.textContent = media.comment || '';
        mediaContainer.appendChild(comment);

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = '×';
        deleteBtn.onclick = () => deletePhoto(album, index);
        mediaContainer.appendChild(deleteBtn);

        photosContainer.appendChild(mediaContainer);
    });
}

function deletePhoto(album, index) {
    albums[album].splice(index, 1);
    localStorage.setItem('albums', JSON.stringify(albums));
    displayPhotos(album);
}

function addAlbum() {
    const albumName = prompt('أدخل اسم الألبوم الجديد:');
    if (albumName && !albums[albumName]) {
        albums[albumName] = [];
        localStorage.setItem('albums', JSON.stringify(albums));
        updateAlbumList();
    } else {
        alert('الألبوم موجود بالفعل أو الاسم غير صالح.');
    }
}

function updateAlbumList() {
    albumSelect.innerHTML = '';
    albumList.innerHTML = '';
    for (const album in albums) {
        const option = document.createElement('option');
        option.value = album;
        option.textContent = album;
        albumSelect.appendChild(option);

        const albumItem = document.createElement('div');
        albumItem.className = 'album-item';
        albumItem.textContent = album;
        albumItem.onclick = () => displayPhotos(album);

        const deleteAlbumBtn = document.createElement('button');
        deleteAlbumBtn.textContent = 'حذف';
        deleteAlbumBtn.onclick = (e) => {
            e.stopPropagation();
            deleteAlbum(album);
        };

        albumItem.appendChild(deleteAlbumBtn);
        albumList.appendChild(albumItem);
    }
    displayPhotos(albumSelect.value);
}

function deleteAlbum(album) {
    if (confirm(`هل أنت متأكد من حذف ألبوم ${album}؟`)) {
        delete albums[album];
        localStorage.setItem('albums', JSON.stringify(albums));
        updateAlbumList();
    }
}

function saveData() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(albums));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "albums_data.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

updateAlbumList();