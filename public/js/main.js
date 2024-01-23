let cart = {}; // Корзина
let logout = document.querySelector('.logout'); // Ссылка выход
let cartOrder = document.querySelector('.cart-order'); // Оформление корзины
let popupBg = document.querySelector('.popup__bg'); // Фон попап окна
let popupGood = document.querySelector('.popup-good'); // Само окно попап
//let popupLogin = document.querySelector('.popup-login'); // Само окно попап
let closePopupButton = document.querySelectorAll('.close-popup'); // Кнопка для закрытия попап
let content = document.getElementById("content"); // Содержимое категории
let user = document.getElementById("user"); // Содержимое категории
let carousel = document.getElementById("carousel-inner"); // Карусель
if (content) content.addEventListener('click', function (event) { getGoodId(event) }); // обработчик на содержимое
if (carousel) carousel.addEventListener('click', function (event) { getGoodId(event) }); // обработчик на карусель
popupGood.addEventListener('click', function (event) { getGoodId(event) }); // обработчик на попап

//*****************************************LOCALSTORAGE  */

function updateStorageCart() { // Обновляем корзину
  localStorage.setItem('cart' + user.dataset.id, JSON.stringify(cart));
}

if (logout) {
  logout.addEventListener('click', ajaxGetLogout);
  if (localStorage.getItem('cart' + user.dataset.id)) { //Если что-то осталось в корзине, загружаем
    cart = JSON.parse(localStorage.getItem('cart' + user.dataset.id));
    getGoodId();
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
    });
}

if (cartOrder) {
  cartOrder.addEventListener('click', function (event) { // обработчик на Оформление корзины
    event.preventDefault();
    console.log(cart);

    const encodedCart = encodeURIComponent(JSON.stringify(cart));
    window.location.href = "/order?cart=" + encodedCart;

    //popupBg.classList.add('active'); // Добавляем класс 'active' для фона
    //popupLogin.classList.add('active');
  });
}

function getGoodId(event) {
  if (event) {
    event.preventDefault();
    if ((event.target.tagName === "IMG") && ((event.currentTarget === content) || (event.currentTarget === carousel))) { // Если клик по картинке открываем попап
      let url = "/mysql?good_id=" + event.target.dataset.id;
      fetch(url).then((result) => result.json()).then((body) => fillPopupGood(body[0]));

      popupBg.classList.add('active'); // Добавляем класс 'active' для фона
      popupGood.classList.add('active');
    } else if (event.target.tagName === "BUTTON") { // Если клик по кнопке добавляем в корзину
      if (event.target.dataset.id in cart) {
        cart[event.target.dataset.id] += 1;
      } else {
        cart[event.target.dataset.id] = 1;
      }
    }
  }
  if (Object.keys(cart).length !== 0) {
    cartOrder.classList.add('active');
    updateStorageCart();
  }
}

function fillPopupGood(good) { // Заполняем попап форму
  let elems = document.querySelectorAll(".popup-form-good");
  for (let i = 0; i < elems.length; i++) {
    if (elems[i].classList.contains("id")) elems[i].dataset.id = good.id;
    if (elems[i].classList.contains("name")) elems[i].textContent = good.name;
    if (elems[i].classList.contains("description")) elems[i].innerHTML = good.description;
    if (elems[i].classList.contains("cost")) elems[i].textContent = good.cost.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + "руб.";
    if (elems[i].classList.contains("img")) elems[i].setAttribute("src", good.img);
  }
}

for (let i = 0; i < closePopupButton.length; i++) {
  closePopupButton[i].addEventListener('click', () => { // Вешаем обработчик на крестик
    popupBg.classList.remove('active'); // Убираем активный класс с фона
    popupGood.classList.remove('active');
    //popupLogin.classList.remove('active');
  });

}

document.addEventListener('click', (e) => { // Вешаем обработчик на весь документ
  if (e.target === popupBg) { // Если цель клика - фот, то:
    popupBg.classList.remove('active'); // Убираем активный класс с фона
    popupGood.classList.remove('active'); // И с окна
    //popupLogin.classList.remove('active'); // И с окна
  }
});





