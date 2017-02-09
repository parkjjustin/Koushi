$("#submit").click(function(event) {
    var firstName = $("#first-name").val().trim();
    var lastName = $("#last-name").val().trim();
    var email = $("#email").val().trim();
    var password = $("#password").val().trim();
    var validate = $("#validate").val().trim();
    var isCharacter = /[^a-zA-Z]/;
    var input = $("input").val().trim();
    var validEmail = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{3})$/;
    if (firstName.length === 0) {
        event.preventDefault();
        $(".warning").text("First name is required");
    } else if (firstName.match(isCharacter)) {
        event.preventDefault();
        $(".warning").text("Enter a valid name");
    } else if (lastName.length === 0) {
        event.preventDefault();
        $(".warning").text("Last name is required");
    } else if (firstName.match(isCharacter)) {
        event.preventDefault();
        $(".warning").text("Enter a valid name");
    } else if (email.length === 0) {
        event.preventDefault();
        $(".warning").text("Email is required");
    } else if (email.match(validEmail) === null) {
        event.preventDefault();
        $(".warning").text("Enter a valid email");
    } else if (6 > username.length > 0 || username.length > 15) {
        event.preventDefault();
        $(".warning").text("Password must be between 6 to 15 characters");
    } else if (password !== validate) {
        event.preventDefault();
        $(".warning").text("Passwords must match");
    }
})

$(".register").click(() => {
    $("#login-content").fadeOut(0);
    $("#register-content").fadeIn(0500);
    $(".register").removeClass("register").addClass("register-active");
    $(".login").removeClass("login").addClass("login-inactive")
})

$(".register-active").click(() => {
    $("#login-content").fadeOut(0);
    $("#register-content").fadeIn(0500);
    $(".register").removeClass("register").addClass("register-active");
    $(".login").removeClass("login").addClass("login-inactive");
})

$(".login").click(() => {
    $("#register-content").fadeOut(0);
    $("#login-content").fadeIn(0500);
    $(".register-active").removeClass("register-active").addClass("register");
    $(".login-inactive").removeClass("login-inactive").addClass("login");
})