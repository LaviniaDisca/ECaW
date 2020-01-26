let catalog = document.getElementById('catalog');

if (!localStorage.getItem('ecaw-username') || !localStorage.getItem('ecaw-jwt')) {
    window.location.href = '/';
}

function createProject(serverData) {
    let project = document.createElement('div');
    let title = document.createElement('h1');
    let button = document.createElement('button');
    let buttonText = document.createElement('span');
    let thumbnail = document.createElement('img');
    let image_url = `http://localhost:4747/projects/photo/${localStorage.getItem('ecaw-username')}/${serverData._id}/canvas`;
    if (imageExists(image_url)) {
        thumbnail.crossOrigin = "Anonymous";
        thumbnail.src = image_url;
    }else{
        thumbnail.src='images/empty.png';
    }
    buttonText.className = "button-text";
    buttonText.innerHTML = "Open";
    button.className = "button";
    button.addEventListener('click', (e) => {
        window.location.href = `/projects?projectId=${serverData._id}`;
    });
    title.innerHTML = `${serverData.title}`;
    project.className = "product";
    project.appendChild(thumbnail);
    project.appendChild(title);
    project.appendChild(button);
    button.appendChild(buttonText);
    catalog.appendChild(project);
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