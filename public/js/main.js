let cart = {}; // Корзина
let buttonAddToCart = document.querySelector(".add-to-cart");
let logout = document.querySelector('.logout'); // Ссылка выход
let cartOrder = document.querySelector('.cart-order'); // Оформление корзины
let popupBg = document.querySelector('.popup__bg'); // Фон попап окна
let popupGood = document.querySelector('.popup-good'); // Само окно попап
//let popupLogin = document.querySelector('.popup-login'); // Само окно попап
let closePopupButton = document.querySelectorAll('.close-popup'); // Кнопка для закрытия попап
let content = document.getElementById("content"); // Содержимое категории
let tableOrder = document.getElementById("table-order"); // Содержимое категории
let user = document.getElementById("user"); // Содержимое категории
let carousel = document.getElementById("carousel-inner"); // Карусель

if (content) content.addEventListener('click', function (event) { getGoodId(event) }); // обработчик на содержимое
if (tableOrder) tableOrder.addEventListener('click', function (event) { getGoodId(event) }); // обработчик на содержимое
if (carousel) carousel.addEventListener('click', function (event) { getGoodId(event) }); // обработчик на карусель
popupGood.addEventListener('click', function (event) { getGoodId(event) }); // обработчик на попап
document.addEventListener('keydown', function (event) {
  if (user) {
    if (event.altKey && event.shiftKey && event.keyCode === 65 && user.dataset.is_admin === '1') {
      window.location.href = "/admin";
    }
    if (event.altKey && event.shiftKey && event.keyCode === 67 && user.dataset.is_cook === '1') {
      window.location.href = "/cook";
    }
  }
});

//*****************************************LOCALSTORAGE  */

function updateStorageCart() { // Обновляем корзину
  if (user) {
    localStorage.setItem('cart' + user.dataset.id, JSON.stringify(cart));
    const encodedCart = encodeURIComponent(JSON.stringify(cart));
    if (cartOrder) cartOrder.href = "/order?cart=" + encodedCart;
  }
}

if (logout) {//если выполнен вход
  logout.addEventListener('click', ajaxGetLogout);
  if (localStorage.getItem('cart' + user.dataset.id)) { //Если что-то осталось в корзине, загружаем
    cart = JSON.parse(localStorage.getItem('cart' + user.dataset.id));
    if (cartOrder) {
      const encodedCart = encodeURIComponent(JSON.stringify(cart));
      cartOrder.href = "/order?cart=" + encodedCart;
      getGoodId();
    }
    //ajaxGetProductsInfo();
  }
}

function ajaxGetLogout() {
  fetch('/logout', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  })
    .then(function (response) {
      if (response) console.log(response);
      cart = {};
      cartOrder.classList.remove('active');
      cartOrder.href = "/order"
    });
}

function getGoodId(event) {
  if (event) {
    event.preventDefault();
    if ((event.target.tagName === "IMG") && ((event.currentTarget === content) || (event.currentTarget === carousel)) || (event.target.tagName === "TD")) { // Если клик по картинке открываем попап
      let url = "/mysql?good_id=" + event.target.dataset.id;
      fetch(url).then((result) => result.json()).then((body) => fillPopupGood(body[0]));

      popupBg.classList.add('active'); // Добавляем класс 'active' для фона
      popupGood.classList.add('active');
      if (event.target.tagName != "TD") buttonAddToCart.classList.add('act');
    } else if (event.target.tagName === "BUTTON") { // Если клик по кнопке добавляем в корзину
      if (event.target.dataset.id in cart) {
        cart[event.target.dataset.id] += 1;
      } else {
        cart[event.target.dataset.id] = 1;
      }
    }
  }
  if (Object.keys(cart).length !== 0) {
    if (cartOrder) cartOrder.classList.add('active');
    updateStorageCart();
  }
}

function fillPopupGood(good) { // Заполняем попап форму
  let elems = document.querySelectorAll(".popup-form-good");
  for (let i = 0; i < elems.length; i++) {
    if (elems[i].classList.contains("id")) elems[i].dataset.id = good.id;
    if (elems[i].classList.contains("name")) elems[i].textContent = good.name;
    if (elems[i].classList.contains("description")) elems[i].innerHTML = good.description;
    if (elems[i].classList.contains("cost")) elems[i].textContent = good.cost/*.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')*/ + "руб.";
    if (elems[i].classList.contains("img")) elems[i].setAttribute("src", good.img);
  }
}

for (let i = 0; i < closePopupButton.length; i++) {
  closePopupButton[i].addEventListener('click', () => { // Вешаем обработчик на крестик
    closePopup();
  });

}

document.addEventListener('click', (e) => { // Вешаем обработчик на весь документ
  if (e.target === popupBg) { // Если цель клика - фот, то:
    closePopup();
  }
});

function closePopup() {
  popupBg.classList.remove('active'); // Убираем активный класс с фона
  popupGood.classList.remove('active'); // И с окна
  buttonAddToCart.classList.remove('act');
}