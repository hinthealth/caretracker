var password = document.getElementById("password"),
    strength = document.getElementById("strength"),
    submit = document.getElementById("submit");
password.addEventListener('keyup', function () {
    var score = zxcvbn(password.value).score;
    if (score === 0) {
        strength.value = strength.className = "weakest";
        submit.disabled = false;
    }
    if (score === 1) {
        strength.value = strength.className = "weaker";
        submit.disabled = false;
    }
    if (score === 2) {
        strength.value = strength.className = "stronger";
        submit.disabled = false;
    }
    if (score > 2) {
        strength.value = strength.className = "strongest";
        submit.disabled = false;
    }
});