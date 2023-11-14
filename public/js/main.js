//let goodForPopup = { id: 0, name: "", img: "", description: "", cost: 0 }
let cart = {};
let cartOrder = document.querySelector('.cart-order');
let popupBg = document.querySelector('.popup__bg'); // Фон попап окна
let popupGood = document.querySelector('.popup-good'); // Само окно
let closePopupButton = document.querySelector('.close-popup'); // Кнопка для 
let content = document.getElementById("content");
let carousel = document.getElementById("carousel-inner");
let addToCart = document.querySelectorAll(".add-to-cart");
content.addEventListener('click', function (event) { getGoodId(event) });
carousel.addEventListener('click', function (event) { getGoodId(event) });


function getGoodId(event) {
  event.preventDefault();
  if (event.target.tagName === "IMG") {
    let url = "/mysql?good_id=" + event.target.dataset.id;
    fetch(url).then((result) => result.json()).then((body) => fillPopupGood(body[0]));

    popupBg.classList.add('active'); // Добавляем класс 'active' для фона
    popupGood.classList.add('active');
  }
}

function fillPopupGood(good) {
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

for (let i = 0; i < addToCart.length; i++) {
  addToCart[i].addEventListener('click', (event) => {
    if ("id" + event.target.dataset.id in cart) {
      cart["id" + event.target.dataset.id] += 1;
    } else {
      cart["id" + event.target.dataset.id] = 1;
    }
    if (cart) {
      cartOrder.classList.add('active');
    }
    console.log(cart);
  });
}



