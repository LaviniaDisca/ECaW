let user = document.getElementById('username');
let password = document.getElementById('password');

document.getElementById('form').addEventListener('submit', (e) => {
    e.preventDefault();
    let req = new XMLHttpRequest();
    req.open("POST", "http://localhost:4747/users/register", true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.onreadystatechange = function () {
        if (req.readyState === XMLHttpRequest.DONE) {
            let result = JSON.parse(req.responseText);
            if (req.status === 200) {
                if (result.success) {
                    window.alert(result.message);
                    window.location.href="/";
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