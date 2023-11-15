let cart = {}; // Корзина
let cartOrder = document.querySelector('.cart-order'); // Оформление корзины
let popupBg = document.querySelector('.popup__bg'); // Фон попап окна
let popupGood = document.querySelector('.popup-good'); // Само окно попап
let closePopupButton = document.querySelector('.close-popup'); // Кнопка для закрытия попап
let content = document.getElementById("content"); // Содержимое категории
let carousel = document.getElementById("carousel-inner"); // Карусель
//let createOrder = document.getElementById("create-order"); // кнопка оформить покупку
content.addEventListener('click', function (event) { getGoodId(event) }); // обработчик на содержимое
carousel.addEventListener('click', function (event) { getGoodId(event) }); // обработчик на карусель
popupGood.addEventListener('click', function (event) { getGoodId(event) }); // обработчик на попап
cartOrder.addEventListener('click', function (event) { // обработчик на Оформление корзины
  console.log(cart);
});

function getGoodId(event) {
  event.preventDefault();
  if ((event.target.tagName === "IMG") && (event.currentTarget === content)) { // Если клик по картинке открываем попап
    let url = "/mysql?good_id=" + event.target.dataset.id;
    fetch(url).then((result) => result.json()).then((body) => fillPopupGood(body[0]));

    popupBg.classList.add('active'); // Добавляем класс 'active' для фона
    popupGood.classList.add('active');
  } else if (event.target.tagName === "BUTTON") { // Если клик по кнопке добавляем в корзину
    if ("id" + event.target.dataset.id in cart) {
      cart["id" + event.target.dataset.id] += 1;
    } else {
      cart["id" + event.target.dataset.id] = 1;
    }
  }
  if (cart) {
    cartOrder.classList.add('active');
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

closePopupButton.addEventListener('click', () => { // Вешаем обработчик на крестик
  popupBg.classList.remove('active'); // Убираем активный класс с фона
  popupGood.classList.remove('active');;
});

document.addEventListener('click', (e) => { // Вешаем обработчик на весь документ
  if (e.target === popupBg) { // Если цель клика - фот, то:
    popupBg.classList.remove('active'); // Убираем активный класс с фона
    popupGood.classList.remove('active'); // И с окна
  }
});

//popupGood.addEventListener('click', (event) => { // Добавляем обработчик на кнопкe в попапе
//  console.log(event.currentTarget);
//  if ("id" + event.target.dataset.id in cart) {
//    cart["id" + event.target.dataset.id] += 1;
//  } else {
//    cart["id" + event.target.dataset.id] = 1;
//  }
//  if (cart) {
//    cartOrder.classList.add('active');
//  }
//});




