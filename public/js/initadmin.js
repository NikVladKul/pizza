let allGoods = {};
let allCats = {};
let goodsOfCat = {};

function inintCart(goods, cat) {
  allGoods = goods;
  allCats = cat;
}

function fillGoodsOfCat() {
  for (var i = 0; i < allGoods.length; i++) {
    goodsOfCat[allGoods[i].category] = [];
  }
  for (var i = 0; i < allGoods.length; i++) {
    goodsOfCat[allGoods[i].category].push(allGoods[i]);
  }

}
