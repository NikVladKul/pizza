let navs = document.querySelectorAll("a.nav-link"); // Все категории

for (let i = 0; i < navs.length; i++) { // вешаем обработчик на все категории
  if (navs[i].parentNode.tagName === 'NAV') {
    navs[i].addEventListener('click', function (event) {
      for (let i = 0; i < navs.length; i++) {
        if (navs[i].classList.contains('active')) navs[i].classList.remove('active');
        if (navs[i] == event.target) {
          navs[i].classList.add('active');
          getGoodInCat(event);
        }
      }
    });
  }
}

function getGoodInCat(event) { // запрос: все продукты из выбранной категории
  event.preventDefault();
  let url = "/mysql?goods_in_cat=" + event.target.dataset.id;
  fetch(url)
    .then((result) => result.json()).then((body) => {
      let container = document.getElementById("content");
      container.textContent = "";

      const range = new Range()
      let strCard = "";
      for (let i = 0; i < body.length; i++) {
        strCard = `
        <div class="col-sm-6 col-md-4">
          <div class="card text-center h-100">
            <div class="card-body d-flex flex-column justify-content-between">
              <h3 class="card-title">${body[i].name}</h3>
              <div class="align-items-center">
                <a class="open-card open-popup" href="#">
                  <img class="card-img" src=${body[i].img} data-id=${body[i].id} alt=${body[i].name} />
                </a>
                <h2 class="card-text">${body[i].cost.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}руб.</h2>
              </div>
              <button class="btn btn-primary" data-id=${body[i].id}>В корзину</button>
            </div>
          </div>`;
        let elemCard = range.createContextualFragment(strCard);
        container.append(elemCard);
      }
    });
}
