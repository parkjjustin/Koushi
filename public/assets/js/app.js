$(".username").click(function () {
    $(".dropdown-content").toggle()
});

$("#create").click(function (e) {
    var username = $("#username").val();
    var email = $("#email").val();
    var password = $("#password").val();
    var password2 = $("#password2").val();
    $(".register-error").empty();
    if (username === "" && email.length > 1 && password.length > 1) {
        e.preventDefault();
        $(".register-error").prepend("Username is required");
    }
    else if (email === "" && username.length > 1 && password.length > 1) {
        e.preventDefault();
        $(".register-error").append("Email is required");
    }
    else if (password === "" && username.length > 1 && email.length > 1) {
        e.preventDefault();
        $(".register-error").append("Password is required");
    }

    else if (username === "" && email === "" && password.length > 1) {
        e.preventDefault();
        $(".register-error").prepend("Username is required");
        $(".register-error").append("<p>Email is required</p>");
    }

    else if (username === "" && email.length > 1 && password === "") {
        e.preventDefault();
        $(".register-error").prepend("Username is required");
        $(".register-error").append("<p>Password is required</p>");
    }

    else if (username.length > 1 && email === "" > 1 && password === "") {
        e.preventDefault();
        $(".register-error").prepend("Email is required");
        $(".register-error").append("<p>Password is required</p>");
    }

    else if (username === "" && email === "" && password === "") {
        e.preventDefault();
        $(".register-error").prepend("Username is required");
        $(".register-error").append("<p>Email is required</p>");
        $(".register-error").append("<p>Password is required</p>");
    }

    else if (6 > username.length > 0) {
        e.preventDefault();
        $(".register-error").prepend("Username must be between 6 and 15 characters");
    }

    else if (6 > password.length > 0) {
        e.preventDefault();
        $(".register-error").append("<p>Password must be between 6 and 15 characters</p>");
    }
    else if (password !== password2) {
        e.preventDefault();
        $(".register-error").append("<p>Passwords do not match</p>");
    }


});

window.onclick = function (e) {
    var menu = document.getElementById("dropdown-menu");

    if (!e.target.matches(".username")) {
        menu.style.display = "none"
    }
};


