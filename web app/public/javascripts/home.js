let catalog = document.getElementById('catalog');

if (!localStorage.getItem('ecaw-username') || !localStorage.getItem('ecaw-jwt')) {
    window.location.href = '/';
}

function createProject(serverData) {
    let project = document.createElement('div');
    let title = document.createElement('h1');
    let button = document.createElement('button');
    let buttonText = document.createElement('span');
    let buttonDelete = document.createElement('button');
    let deleteProj = document.createElement('span');
    let thumbnail = document.createElement('img');
    let image_url = `http://localhost:4747/projects/photo/${localStorage.getItem('ecaw-username')}/${serverData._id}/canvas`;
    if (imageExists(image_url)) {
        thumbnail.crossOrigin = "Anonymous";
        thumbnail.src = image_url;
    } else {
        thumbnail.src = 'images/empty.png';
    }
    buttonText.className = "button-text";
    buttonText.innerHTML = "Open";
    deleteProj.className = "button-delete";
    deleteProj.innerHTML = "Delete Project";
    buttonDelete.style.marginLeft = '10px';
    button.className = "button";
    buttonDelete.className = "button-del";
    button.addEventListener('click', (e) => {
        window.location.href = `/projects?projectId=${serverData._id}`;
    });
    buttonDelete.addEventListener('click', (ev) => {
        deleteProject(`${serverData._id}`);
    });
    title.innerHTML = `${serverData.title}`;
    project.className = "product";
    project.appendChild(thumbnail);
    project.appendChild(title);
    project.appendChild(button);
    project.appendChild(buttonDelete);
    button.appendChild(buttonText);
    buttonDelete.appendChild(deleteProj);
    catalog.appendChild(project);
}

function deleteProject(id) {
    let req = new XMLHttpRequest();
    req.open("DELETE", `http://localhost:4747/projects/${id}`, true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('ecaw-jwt'));
    req.onreadystatechange = function () {
        if (req.readyState === XMLHttpRequest.DONE) {
            let result = JSON.parse(req.responseText);
            if (req.status === 200) {
                if (result.success) {
                    loadProjects()
                } else {
                    window.alert(result.message);
                }
            } else {
                window.alert(result.message);
                console.log("error");
            }
        }
    };
    req.send(null);
}

function clearProjects() {
    let projects = document.getElementsByClassName('product');
    while (projects.length > 0) {
        projects[0].parentNode.removeChild(projects[0]);
    }
}

function loadProjects() {
    clearProjects();
    let req = new XMLHttpRequest();
    req.open("GET", 'http://localhost:4747/projects', true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('ecaw-jwt'));
    req.onreadystatechange = function () {
        if (req.readyState === XMLHttpRequest.DONE) {
            if (req.status === 200) {
                let projects = JSON.parse(req.responseText);
                projects.forEach((project) => {
                    let serverData = new ServerData();
                    serverData.restore(project);
                    createProject(serverData)
                });
                console.log(projects);
            } else if (req.status === 401) {
                console.log("error");
            }
        }
    };
    req.send(null);
}

function imageExists(image_url) {
    let http = new XMLHttpRequest();

    http.open('HEAD', image_url, false);
    http.send();

    return http.status !== 404;
}

document.getElementById('logOut').addEventListener('click', (e) => {
    localStorage.clear();
    window.location.href = '/';
});

document.getElementById('create-new').addEventListener('click', (e) => {
    let req = new XMLHttpRequest();
    req.open("POST", 'http://localhost:4747/projects/empty', true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('ecaw-jwt'));
    req.onreadystatechange = function () {
        if (req.readyState === XMLHttpRequest.DONE) {
            if (req.status === 200) {
                loadProjects();
            } else if (req.status === 401) {
                console.log("error");
            }
        }
    };
    req.send(null);
});

loadProjects();