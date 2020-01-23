let token = localStorage.getItem("ecaw-jwt");

//redirect if the user isn't logged in
if (!token) {
    window.location.href = "/";
}