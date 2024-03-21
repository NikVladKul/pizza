const popupAlertName = document.querySelector(".popup-error-name"); //Заголовок окна
const popupAlertText = document.querySelector(".popup-error-message"); //Сообщение в окне
const popupError = document.querySelector(".popup-error"); // окно сообщения
const popupBg = document.querySelector(".popup__bg"); // Фон попап окна
const closePopupButton = document.querySelectorAll(".close-popup"); // Кнопка для закрытия попап
const closePopupBtn = document.querySelector(".close-popup-btn");

resetForm.onsubmit = async (event) => {
  event.preventDefault();
  let response = await fetch("/reset", {
    method: "POST",
    body: new FormData(resetForm),
  });
  let result = await response.json();
  if (!result.result) showError("Ошибка регистрации", result.message);
  else showError("Сброс пароля", result.message);
  setTimeout(() => {
    document.getElementById("login").click();
  }, 2000);
};

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

for (let i = 0; i < closePopupButton.length; i++) {
  closePopupButton[i].addEventListener("click", closePopup);
}
closePopupBtn.addEventListener("click", closePopup);
