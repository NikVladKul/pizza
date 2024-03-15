export default function updateDb(id, field, value, table, order = false) {
  let url = "";
  url = `/mysql?${table}_update_id=` + id;
  const param = {
    field: field,
    value: value
  }
  if (order) param.order = order;
  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(param)
  })
    .then((result) => {
      //UPDATE goods goodsOfCat
      if (table === "goods") {
        allGoods.find((x) => x.id === +id)[field] = value;
        fillGoodsOfCat();
      }
      else if (table === "users") {
        allUsers.find((x) => x.id === +id)[field] = value;
      }
      else if (table === "cat") {
        allCats.find((x) => x.id === +id)[field] = value;
      }
      return result.json();
    })
    .then(answer => {
      if (answer === 1) return true;
      return false;
    })
    .catch(err => console.log(err));
}
