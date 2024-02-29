let allGoods = {};
let allCats = {};
let allUsers = {};
let goodsOfCat = {};

function inintCart(goods, cat) {
  allGoods = goods;
  allCats = cat;
}

function fillGoodsOfCat() {
  for (let i = 0; i < allGoods.length; i++) {
    goodsOfCat[allGoods[i].category] = [];
  }
  for (let i = 0; i < allGoods.length; i++) {
    goodsOfCat[allGoods[i].category].push(allGoods[i]);
  }
}

function getUsers() {
  return fetch('/getusers', { method: 'GET' });
}
