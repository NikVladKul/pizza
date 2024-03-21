const listOrders = document.getElementById("listOrders");
const hideReady = document.getElementById("hide-ready");
const days = document.getElementById("days");
const evtSource = new EventSource("/events");
import updateDb from "../js/lib/libadmin.js";

function addHandlersRollup() {
  const headsOrders = document.querySelectorAll('[data-toggle="toggle"]');
  headsOrders.forEach((elem) =>
    elem.addEventListener("change", (event) => {
      const hideElement = event.target.closest(".head").nextElementSibling;
      hideElement.classList.toggle("hidden");
    })
  );
}

hideReady.addEventListener("change", handleHideReady);
days.addEventListener("change", handleHideReady);

evtSource.addEventListener("open", () => {
  console.log("connection opened");
});
evtSource.addEventListener("error", () => {
  console.log("Error");
});
evtSource.addEventListener("message", (event) => {
  if (event.data === "RENDER") {
    const audio = new Audio(); // Создаём новый элемент Audio
    audio.src = "../sound/zvuk.mp3"; // Указываем путь к звуку "клика"
    audio.autoplay = true;
    getOrders(days.value, hideReady.checked ? 1 : 0);
  }
});

function handleHideReady() {
  getOrders(days.value, hideReady.checked ? 1 : 0);
}

function getOrders(days, hide) {
  const param = {
    days: days,
    hide: hide,
  };
  fetch("/getorders", { method: "POST", body: JSON.stringify(param) })
    .then((result) => {
      if (!result.ok) {
        throw new Error("HTTP error " + response.status); // Or better, use an Error subclass
      }
      return result.json();
    })
    .then((body) => {
      renderTable(body);
    })
    .catch((err) => console.log(err));
}

getOrders(days.value, hideReady.checked ? 1 : 0);

function renderTable(orders) {
  const options = {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "numeric",
    minute: "numeric",
  };
  listOrders.innerHTML = "";
  for (let i = 0; i < orders.length; i++) {
    let newRow = listOrders.insertRow();
    newRow.classList.add("head");
    //const cat = allCats.find((elem) => elem.id === goods[i].category)
    let newCell = newRow.insertCell();
    let inp = document.createElement("input");
    inp.type = "checkbox";
    inp.dataset.toggle = "toggle";
    inp.checked = orders[i].ready ? true : false;
    inp.id = orders[i].id;
    let label = document.createElement("label");
    label.htmlFor = orders[i].id;
    label.classList.add("rollup");
    const date = new Date(+orders[i].id);
    label.innerHTML = date.toLocaleString("ru", options);
    newCell.appendChild(inp);
    newCell.appendChild(label);

    newCell = newRow.insertCell();
    newCell.innerHTML = orders[i].name; //"Имя"

    newCell = newRow.insertCell();
    newCell.innerHTML = orders[i].addres; //"Адрес"

    newCell = newRow.insertCell();
    newCell.innerHTML = orders[i].phone; //"Телефон"

    newCell = newRow.insertCell();
    newCell.innerHTML = orders[i].delivery ? "ДА" : "НЕТ";

    newCell = newRow.insertCell();
    newCell.innerHTML = orders[i].ready ? "ДА" : "НЕТ";

    newRow = listOrders.insertRow();
    newCell = newRow.insertCell();
    newCell.colSpan = 6;
    newRow.classList.add(orders[i].ready ? "hidden" : "r");
    const tList = document.createElement("table");
    tList.style = "width: 95%";
    const tListHead = document.createElement("thead");
    const headRow = tListHead.insertRow();
    let headCell = document.createElement("th");
    headCell.style = "width: 80%";
    headCell.innerHTML = "Название";
    headRow.appendChild(headCell);
    headCell = document.createElement("th");
    headCell.style = "width: 10%";
    headCell.innerHTML = "Кол-во";
    headRow.appendChild(headCell);
    headCell = document.createElement("th");
    headCell.style = "width: 10%";
    headCell.innerHTML = "Готов";
    headRow.appendChild(headCell);

    tList.appendChild(tListHead);
    for (let j = 0; j < orders[i].list.length; j++) {
      const newItem = tList.insertRow();
      let newCellList = newItem.insertCell();
      newCellList.innerHTML =
        orders[i].list[j].category + "/" + orders[i].list[j].name;

      newCellList = newItem.insertCell();
      newCellList.innerHTML = orders[i].list[j].quantity;

      newCellList = newItem.insertCell();
      newCellList.classList.add("check");
      newCellList.innerHTML = `<input type="checkbox" name=${
        "check" + orders[i].list[j].id
      } ${orders[i].list[j].ready ? "checked" : ""} data-id=${
        orders[i].list[j].id
      } data-orderid=${orders[i].id} data-field="ready">`;
      newCellList.addEventListener("click", onCheked);
    }
    newCell.appendChild(tList);
  }
  addHandlersRollup();
}

async function onCheked(e) {
  const update = await updateDb(
    e.target.dataset.id,
    e.target.dataset.field,
    e.target.checked ? 1 : 0,
    "orders",
    e.target.dataset.orderid
  );
  if (update) {
    //заказ готов
    getOrders(days.value, hideReady.checked ? 1 : 0); //перерисовать
    //Отправить сообщение доставщику!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //Отправить сообщение доставщику!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //Отправить сообщение доставщику!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //Отправить сообщение доставщику!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //Отправить сообщение доставщику!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  }
}
