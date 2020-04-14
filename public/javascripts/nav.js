function navBar() {
  var x = document.getElementById("header-right");
  var y = document.getElementById("icon");
  if (x.className === "header-right") {
    x.className += " responsive";
    y.innerHTML='<i class="fa fa-window-close"></i>';
  } else {
    x.className = "header-right";
    y.innerHTML='<i class="fa fa-bars"></i>';
  }
}