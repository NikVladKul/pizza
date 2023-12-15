const getCode = document.getElementById("get-code"); //кнопка получения кода проверки
const elemTimer = document.getElementById("timer"); //таймер для кнопки отправки данных на регистрацию
const currentPhone = document.getElementById("current-phone");//введенный номер телефона
const popupAlertName = document.querySelector(".popup-error-name"); //Заголовок окна
const popupAlertText = document.querySelector(".popup-error-message") //Сообщение в окне
const popupError = document.querySelector(".popup-error")// окно сообщения
const popupBg = document.querySelector('.popup__bg'); // Фон попап окна
const closePopupButton = document.querySelectorAll('.close-popup'); // Кнопка для закрытия попап
const closePopupBtn = document.querySelector('.close-popup-btn');
let minute = 2;
let second = 0;
let intervalID;

getCode.addEventListener('click', ajaxSendCode);
//register.addEventListener('click', ajaxSendForm)

signupForm.onsubmit = async (event) => {
  event.preventDefault();
  let response = await fetch('/signup', {
    method: 'POST',
    body: new FormData(signupForm)
  });
  if (response.headers.get('Content-Type') === 'text/html; charset=utf-8') {
    window.location.href = response.url;
  }
  let result = await response.json();
  if (!result.result) showError("Ошибка регистрации", result.message);
  //console.log(result);
}

function timer() {
  let end = false;

  if (second > 0) second--;
  else {
    second = 60;
    if (minute > 0) minute--;
    else end = true;
  }

  if (end) {
    clearInterval(intervalID);
  } else {
    let currentTime = "";
    if (minute > 9) currentTime += minute + ":";
    else currentTime += "0" + minute + ":";
    if (second > 9) currentTime += second;
    else currentTime += "0" + second;
    getCode.innerHTML = currentTime;
    //elemTimer.innerHTML = currentTime;
  }
}

function ajaxSendCode() {
  getCode.disabled = true;
  intervalID = setInterval(timer, 1000);
  setTimeout(() => { enableButton() }, 120000);
  fetch('/sendcode', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'number': currentPhone.value
    }
  }).then((response) => response.json()
  ).then(result => {
    if (!result.res) {
      // Открыть попап форму "не удалось отправить сообщение, проверьте номер телефона"
      showError("Ошибка отправки", "Проверьте номер телефона");
    }
  });
}

function enableButton() {
  getCode.disabled = false;
  getCode.innerHTML = "Получить код";
  clearInterval(intervalID);
  //elemTimer.innerHTML = "";
  minute = 2;
  second = 0;
}

function closePopup() {
  popupAlertName.innerHTML = "";
  popupAlertText.innerHTML = "";
  popupError.classList.remove("active");
  popupBg.classList.remove("active");
}

function showError(headMessage, bodyMessage) {
  popupAlertName.innerHTML = headMessage;
  popupAlertText.innerHTML = bodyMessage;
  popupError.classList.add("active");
  popupBg.classList.add("active");
}

function mask(event) {
  let keyCode = "";
  event.keyCode && (keyCode = event.keyCode);
  var pos = this.selectionStart;
  if (pos < 3) event.preventDefault();
  var matrix = "+7 (___) ___ ____",
    i = 0,
    def = matrix.replace(/\D/g, ""),
    val = this.value.replace(/\D/g, ""),
    new_value = matrix.replace(/[_\d]/g, function (a) {
      return i < val.length ? val.charAt(i++) || def.charAt(i) : a;
    });
  i = new_value.indexOf("_");
  if (i != -1) {
    i < 5 && (i = 3);
    new_value = new_value.slice(0, i);
  }
  var reg = matrix.substr(0, this.value.length).replace(/_+/g,
    function (a) {
      return "\\d{1," + a.length + "}";
    }).replace(/[+()]/g, "\\$&");
  reg = new RegExp("^" + reg + "$");
  if (event.keyCode === 46) new_value = this.value = "+7 ";
  if (!reg.test(this.value) || this.value.length < 5 || keyCode > 47 && keyCode < 58) this.value = new_value;
  if (event.keyCode === 8) {
    new_value = this.value = this.value.slice(0, this.value.length);
  }
  if (event.type == "blur" && this.value.length < 5) this.value = "";
}

[].forEach.call(document.querySelectorAll('.tel'), function (input) {
  input.addEventListener("input", mask, false);
  input.addEventListener("focus", mask, false);
  input.addEventListener("blur", mask, false);
  input.addEventListener("keydown", mask, false);
});

for (let i = 0; i < closePopupButton.length; i++) {
  closePopupButton[i].addEventListener('click', closePopup);
}
closePopupBtn.addEventListener('click', closePopup);
