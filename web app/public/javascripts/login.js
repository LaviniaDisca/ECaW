let user = document.getElementById('user');
let password = document.getElementById('password');

document.getElementById('form').addEventListener('submit', (e) => {
    e.preventDefault();
    let req = new XMLHttpRequest();
    req.open("POST", "http://localhost:4747/users/auth", true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.onreadystatechange = function () {
        if (req.readyState === XMLHttpRequest.DONE) {
            let result = JSON.parse(req.responseText);
            if (req.status === 200) {
                if (result.success) {
                    localStorage.setItem("ecaw-jwt", result.token);
                    localStorage.setItem("ecaw-username", user.value);
                    window.location.href = "/home"
                } else {
                    window.alert(result.message);
                    console.log("Login failed");
                }
            } else {
                window.alert(result.message);
                console.log("error");
            }
        }
    };
    req.send(JSON.stringify({username: user.value, password: password.value}))
});