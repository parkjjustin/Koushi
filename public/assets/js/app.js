$(".username").click(function () {
    $(".dropdown-content").toggle()
});

$("#create").click(function(){
var username = $("#username").val();
var email = $("#email").val();
var password = $("#password").val();
});

window.onclick = function (e) {
    var menu = document.getElementById("dropdown-menu");

    if(!e.target.matches(".username")) {
      menu.style.display = "none"
    }
};


