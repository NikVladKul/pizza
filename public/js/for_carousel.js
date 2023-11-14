let myCarousel = document.getElementById('carouselExampleSlidesOnly');
let nameGoods = document.getElementById("name-goods");
let curSlide = document.getElementsByClassName("carousel-item active");
let nameHtml;

if (myCarousel) {
  myCarousel.addEventListener('slide.bs.carousel', function (event) {
    nameHtml = event.relatedTarget.firstChild.firstChild.dataset.name + " ";
    if (event.relatedTarget.firstChild.firstChild.dataset.cost > 0) {
      nameHtml += Number(event.relatedTarget.firstChild.firstChild.dataset.cost).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$& ') + "руб.";
    }
    nameGoods.innerHTML = nameHtml;
  });

  nameHtml = curSlide[0].firstChild.firstChild.dataset.name + " ";
  if (curSlide[0].firstChild.firstChild.dataset.cost > 0) {
    nameHtml += Number(curSlide[0].firstChild.firstChild.dataset.cost).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + "руб.";
  }
  nameGoods.innerHTML = nameHtml;
}

