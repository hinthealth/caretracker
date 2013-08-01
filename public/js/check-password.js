var password = document.getElementById("password"),
    strength = document.getElementById("strength-bar");
password.addEventListener('keyup', function () {
  var message = "";
  if(password.value){
    var passCheck = zxcvbn(password.value);
    var display = passCheck.crack_time_display;
    if(display == 'instant'){
       message = "It would take seconds for a computer to guess your password."
    }else{
      message = "It would take " + display + " for a computer to guess your password." ;
    }
  }
  strength.innerHTML = message;

});