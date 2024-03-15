document.querySelectorAll(".item-minus").forEach(function (elem) { elem.onclick = cartMinus }); //Навешиваем события плюс и минус
document.querySelectorAll(".item-plus").forEach(function (elem) { elem.onclick = cartPlus });
const cartElem = document.getElementById("cart"); //елемент вормы для отправки заказа
const orderUser = document.getElementById("orderUser"); //елемент вормы для отправки заказа
const amount = document.getElementById("amount");
const goods = JSON.parse(cartElem.value).goods;
const elemTotal = document.getElementById("total"); //элемент итоговой суммы
let total = +elemTotal.innerHTML.replace(/[,\s]{1,}/, "");

amount.value = total;
orderUser.value = JSON.stringify(JSON.parse(user.dataset.id).user_id);
cartElem.value = JSON.stringify(goods);

function cartMinus(event) {
  const goodsId = this.dataset.goods_id;
  goods[goodsId].quantity--;// количество
  total -= goods[goodsId].cost;// ИТОГО
  amount.value = total;
  if (goods[goodsId].quantity) {
    goods[goodsId].amount = goods[goodsId].cost * goods[goodsId].quantity;// сумма
  }
  updateTable(goodsId);
}

function cartPlus(event) {
  const goodsId = this.dataset.goods_id;
  goods[goodsId].quantity++;// количество
  goods[goodsId].amount = goods[goodsId].cost * goods[goodsId].quantity;// сумма
  total += +goods[goodsId].cost;// ИТОГО
  amount.value = total;
  updateTable(goodsId);
}

function updateTable(goodsId) {
  const elem = document.getElementById(goodsId);
  const elemAmount = document.getElementById(goodsId + "a");
  elemTotal.innerHTML = total.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  if (goods[goodsId].quantity) {
    elem.innerHTML = goods[goodsId].quantity;
    elemAmount.innerHTML = goods[goodsId].amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    cart[goodsId] = goods[goodsId].quantity;
  } else {
    const tableRow = elem.closest("tr");
    tableRow.remove();
    delete goods[goodsId];
    delete cart[goodsId];
  }
  cartElem.value = JSON.stringify(goods);
  updateStorageCart();
  if (Object.keys(goods).length === 0) window.location.href = "/";
}