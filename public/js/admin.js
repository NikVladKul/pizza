const curCategory = document.getElementById("cur-category"); // текущая категория
const container = document.getElementById("listGoods"); // содержимое товары
const containerCat = document.getElementById("listCats"); // содержимое category
const containerUsers = document.getElementById("listUsers"); // содержимое user
const checkActiv = document.getElementById("activ"); // фильтр по активности
const checkActivCat = document.getElementById("activCat"); // фильтр по активности
const checkActivUser = document.getElementById("activUser"); // фильтр по активности
const checkStock = document.getElementById("stock"); // фильтр по акции
const popupBg = document.querySelector(".popup__bg"); // Фон попап окна
const popupGood = document.querySelector(".popup-good"); // Само окно попап фото
const popupNewGoods = document.querySelector(".popup-new"); // Само окно попап создание нового продукта
const popupNewCat = document.querySelector(".popup-new-cat"); // Само окно попап создание нового category
const popupUpload = document.querySelector(".popup-upload"); // Само окно попап загрузка фото
const buttonNewGoods = document.getElementById("new-goods"); // кнопка добавить новый продукт
const buttonNewCat = document.getElementById("new-cat"); // кнопка добавить новый category
const preview = document.getElementById("preview"); // превью фото
const previewNew = document.getElementById("previewNew"); // превью фото для нового
const uploadImg = document.getElementById("uploadImg"); // форма загрузки фото
const createGoods = document.getElementById("createGoods"); // форма создания нового goods
const createCat = document.getElementById("createCat"); // форма создания нового goods
const fileInput = document.getElementById("fileInput"); // инпут загрузка фото
const fileInputNew = document.getElementById("fileInputNew"); // инпут загрузка фото для нового
import updateDb from "../js/lib/libadmin.js";

let elemLoad = "";

checkActiv.addEventListener("change", renderTable);
checkActivCat.addEventListener("change", renderCat);
checkActivUser.addEventListener("change", renderUsers);
checkStock.addEventListener("change", renderTable);
curCategory.addEventListener("change", renderTable);
buttonNewGoods.addEventListener("click", showFormNew);
buttonNewCat.addEventListener("click", showFormNew);

createCat.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(createCat);
  fetch("/newcat", {
    method: "POST",
    body: formData,
  })
    .then((result) => result.text())
    .then((textResult) => {
      if (textResult) {
        // Обновить базу и объекты
        closePopup();
        allCats.push({
          id: JSON.parse(textResult).insertId,
          name: formData.get("name"),
          activ: formData.get("activ") ? 1 : 0,
        });
        //fillGoodsOfCat();
        renderCat();
      }
    })
    .catch((err) => console.log(err));
});

createGoods.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(createGoods);
  fetch("/newgoods", {
    method: "POST",
    body: formData,
  })
    .then((result) => result.text())
    .then((textResult) => {
      if (textResult) {
        // Обновить базу и объекты
        if (textResult === "no file") alert("Не корректный файл изображения");
        else {
          closePopup();
          removeFilesItem();
          allGoods.push({
            id: JSON.parse(textResult).insertId,
            name: formData.get("name"),
            img: JSON.parse(textResult).img,
            description: formData.get("description"),
            category: +formData.get("category"),
            cost: formData.get("cost"),
            activ: formData.get("activ") ? 1 : 0,
            stock: formData.get("stock") ? 1 : 0,
          });
          fillGoodsOfCat();
          renderTable();
        }
      }
    })
    .catch((err) => console.log(err));
});

uploadImg.addEventListener("submit", (e) => {
  e.preventDefault();
  if (
    confirm("!!!!! ВНИМАНИЕ!!!!!! Старое фото будет УДАЛЕНО! Подтверждаете?")
  ) {
    const formData = new FormData(uploadImg);
    formData.append("oldUrl", elemLoad.dataset.url);
    fetch("/upload", {
      method: "POST",
      body: formData,
    })
      .then((result) => result.text())
      .then((textResult) => {
        if (textResult) {
          // Обновить базу и объекты
          closePopup();
          updateDb(
            elemLoad.dataset.id,
            elemLoad.dataset.field,
            textResult,
            "goods"
          );
          elemLoad.parentElement.children[0].dataset.url = textResult;
          removeFilesItem();
        }
      })
      .catch((err) => console.log(err));
  }
});

function showFormNew(e) {
  popupBg.classList.add("active"); // Добавляем класс 'active' для фона
  if (e.target.id === "new-goods") popupNewGoods.classList.add("active");
  else if (e.target.id === "new-cat") popupNewCat.classList.add("active");
}

function clickOut(e) {
  if (!e.target.classList.contains("edit")) editable.close(false);
}

const editable = {
  // (A) PROPERTIES
  selected: null, // current selected cell
  value: "", // current selected cell value

  // (B) "CONVERT" TO EDITABLE CELL
  edit: (cell) => {
    // (B1) REMOVE "DOUBLE CLICK TO EDIT"
    cell.ondblclick = "";

    // (B2) EDITABLE CONTENT
    cell.contentEditable = true;
    cell.focus();

    // (B3) "MARK" CURRENT SELECTED CELL
    cell.classList.add("edit");
    editable.selected = cell;
    editable.value = cell.innerHTML;
    cell.textContent = editable.value;
    // (B4) PRESS ENTER/ESC OR CLICK OUTSIDE TO END EDIT
    window.addEventListener("click", clickOut);
    cell.onkeydown = (evt) => {
      if (evt.key == "Enter" || evt.key == "Escape") {
        editable.close(evt.key == "Enter" ? true : false);
        return false;
      }
    };
  },

  // (C) END "EDIT MODE"
  close: (evt) => {
    if (evt.target != editable.selected) {
      // (C1) CANCEL - RESTORE PREVIOUS VALUE
      if (
        evt === false ||
        (editable.selected.dataset.field === "cost" &&
          !Number.isFinite(+editable.selected.innerHTML))
      ) {
        editable.selected.innerHTML = editable.value;
      }
      //if ((editable.selected.dataset.field === "cost") && (!Number.isFinite(editable.selected.innerHTML)))

      // (C2) REMOVE "EDITABLE"
      //window.getSelection().removeAllRanges();
      editable.selected.contentEditable = false;

      // (C3) RESTORE CLICK LISTENERS
      window.removeEventListener("click", editable.close);
      window.removeEventListener("click", clickOut);
      let cell = editable.selected;
      cell.onkeydown = "";
      cell.ondblclick = (e) => editable.edit(cell);
      let textHtml = cell.textContent;
      cell.innerHTML = textHtml;
      // (C5) DO WHATEVER YOU NEED
      if (evt !== false) {
        if (editable.selected.innerHTML !== editable.value) {
          if (editable.selected.closest("tbody").id === "listCats")
            updateDb(
              editable.selected.dataset.id,
              editable.selected.dataset.field,
              textHtml,
              "cat"
            );
          else if (editable.selected.closest("tbody").id === "listGoods")
            updateDb(
              editable.selected.dataset.id,
              editable.selected.dataset.field,
              textHtml,
              "goods"
            );
        }
      }
      // (C4) "UNMARK" CURRENT SELECTED CELL
      editable.selected.classList.remove("edit");
      editable.selected = null;
      editable.value = "";
    }
  },
};

document.addEventListener("click", (e) => {
  // Вешаем обработчик на весь документ
  if (e.target === popupBg) {
    // Если цель клика - фот, то:
    closePopup();
  }
});

// (D) INITIALIZE - DOUBLE CLICK TO EDIT CELL
window.addEventListener("DOMContentLoaded", setHandlers);
function setHandlers() {
  for (let cell of document.querySelectorAll(".table-goods td")) {
    if (!cell.classList.contains("check"))
      cell.ondblclick = (e) => editable.edit(cell);
  }
  for (let cell of document.querySelectorAll(".table-category td")) {
    if (!cell.classList.contains("check"))
      cell.ondblclick = (e) => editable.edit(cell);
  }
  for (let buttonShow of document.querySelectorAll(".table-goods .show-img")) {
    buttonShow.onclick = (e) => showImg(buttonShow);
  }
  for (let buttonDownload of document.querySelectorAll(
    ".table-goods .download-img"
  )) {
    buttonDownload.onclick = (e) => loadImg(buttonDownload);
  }
  for (let buttonClose of document.querySelectorAll(".close-popup")) {
    buttonClose.onclick = (e) => closePopup();
  }
}

function removeFilesItem() {
  preview.innerHTML = "";
  previewNew.innerHTML = "";
  fileInput.value = ""; //for IE11, latest Chrome/Firefox/Opera...
  fileInputNew.value = ""; //for IE11, latest Chrome/Firefox/Opera...
}

function showLoad(elem) {
  const reader = new FileReader();
  const file = elem.files.item(0);
  let code = "";
  if (file) {
    reader.readAsDataURL(file);
    reader.onload = () => {
      code = `<img src=${reader.result} style="max-height: 500px;">
      <a href="#" onclick="removeFilesItem(); return false;" class="input-file-list-remove">X</a>`;
      if (elem.parentNode.parentNode.id === "uploadImg")
        preview.innerHTML = code;
      else if (elem.parentNode.parentNode.id === "createGoods")
        previewNew.innerHTML = code;
    };
  }
}

function loadImg(elem) {
  elemLoad = elem;
  popupBg.classList.add("active"); // Добавляем класс 'active' для фона
  popupUpload.classList.add("active");
}

function showImg(elem) {
  popupGood.children[0].setAttribute("src", elem.dataset.url);
  popupBg.classList.add("active"); // Добавляем класс 'active' для фона
  popupGood.classList.add("active");
}

function closePopup() {
  popupBg.classList.remove("active"); // Убираем активный класс с фона
  popupGood.classList.remove("active"); // И с окна
  popupNewGoods.classList.remove("active"); // И с окна
  popupNewCat.classList.remove("active"); // И с окна
  popupUpload.classList.remove("active"); // И с окна
}

function renderUsers() {
  containerUsers.innerHTML = "";
  for (let i = 0; i < allUsers.length; i++) {
    if (!checkActivUser.checked && allUsers[i].activ === 0) continue;
    const newRow = containerUsers.insertRow();
    let newCell = newRow.insertCell();
    newCell.innerHTML = allUsers[i].name;
    newCell = newRow.insertCell();
    newCell.innerHTML = allUsers[i].phone;
    newCell = newRow.insertCell();
    newCell.innerHTML = allUsers[i].email;
    newCell = newRow.insertCell();
    newCell.classList.add("check");
    newCell.innerHTML = `<input type="checkbox" name=${
      "check" + allUsers[i].id
    } ${allUsers[i].activ ? "checked" : ""} data-id=${
      allUsers[i].id
    } data-field="activ">`;
    newCell.addEventListener("click", onCheked);
    newCell = newRow.insertCell();
    newCell.classList.add("check");
    newCell.innerHTML = `<input type="checkbox" name=${
      "check" + allUsers[i].id
    } ${allUsers[i].isAdmin ? "checked" : ""} data-id=${
      allUsers[i].id
    } data-field="isAdmin">`;
    newCell.addEventListener("click", onCheked);
    newCell = newRow.insertCell();
    newCell.classList.add("check");
    newCell.innerHTML = `<input type="checkbox" name=${
      "check" + allUsers[i].id
    } ${allUsers[i].isCook ? "checked" : ""} data-id=${
      allUsers[i].id
    } data-field="isCook">`;
    newCell.addEventListener("click", onCheked);
    newCell = newRow.insertCell();
    newCell.innerHTML = allUsers[i].addres;
  }
}

function renderCat() {
  containerCat.innerHTML = "";
  for (let i = 0; i < allCats.length; i++) {
    if (!checkActivCat.checked && allCats[i].activ === 0) continue;
    const newRow = containerCat.insertRow();
    let newCell = newRow.insertCell();
    newCell.dataset.id = allCats[i].id;
    newCell.dataset.field = "name";
    newCell.innerHTML = allCats[i].name;
    newCell = newRow.insertCell();
    newCell.classList.add("check");
    newCell.innerHTML = `<input type="checkbox" name=${
      "check" + allCats[i].id
    } ${allCats[i].activ ? "checked" : ""} data-id=${
      allCats[i].id
    } data-field="activ">`;
    newCell.addEventListener("click", onCheked);
  }
}

function renderTable() {
  const goods =
    curCategory.options[curCategory.selectedIndex].value === "all"
      ? allGoods
      : goodsOfCat[curCategory.selectedIndex]
      ? goodsOfCat[curCategory.selectedIndex]
      : {};
  container.innerHTML = "";
  for (let i = 0; i < goods.length; i++) {
    if (!checkActiv.checked && goods[i].activ === 0) continue;
    if (checkStock.checked && goods[i].stock === 0) continue;
    const newRow = container.insertRow();
    //const cat = allCats.find((elem) => elem.id === goods[i].category)
    let newCell = newRow.insertCell();
    newCell.innerHTML = `<select name="category" data-id=${goods[i].id} data-field="category" data-index=${goods[i].category}></select>`;
    newCell.classList.add("check");
    let sel = newCell.children[0];
    for (let j = 0; j < allCats.length; j++) {
      let opt = document.createElement("option");
      opt.value = allCats[j].id;
      opt.innerHTML = allCats[j].name;
      opt.selected = allCats[j].id === goods[i].category;
      sel.appendChild(opt);
    }
    newCell.addEventListener("change", onChangedCat);
    newCell = newRow.insertCell();
    newCell.dataset.id = goods[i].id;
    newCell.dataset.field = "name";
    newCell.innerHTML = goods[i].name;
    newCell = newRow.insertCell();
    let codeButtonImg = `
        <button class="show-img" data-url=${goods[i].img}>Смотреть</button>
        <button class="download-img" data-url=${goods[i].img} data-id=${goods[i].id} data-field="img">Загрузить</button>`;
    newCell.innerHTML = codeButtonImg;
    newCell = newRow.insertCell();
    newCell.dataset.id = goods[i].id;
    newCell.dataset.field = "description";
    newCell.innerHTML = goods[i].description;
    newCell = newRow.insertCell();
    newCell.dataset.id = goods[i].id;
    newCell.dataset.field = "cost";
    newCell.innerHTML = goods[i].cost;
    newCell = newRow.insertCell();
    newCell.classList.add("check");
    newCell.innerHTML = `<input type="checkbox" name=${"check" + goods[i].id} ${
      goods[i].activ ? "checked" : ""
    } data-id=${goods[i].id} data-field="activ">`;
    newCell.addEventListener("click", onCheked);
    //goods[i].activ;
    newCell = newRow.insertCell();
    newCell.classList.add("check");
    newCell.innerHTML = `<input type="checkbox" name=${
      "checkStock" + goods[i].id
    } ${goods[i].stock ? "checked" : ""} data-id=${
      goods[i].id
    } data-field="stock">`;
    newCell.addEventListener("click", onCheked);
    //goods[i].stock;
    //}
    setHandlers();
  }
}

function onChangedCat(e) {
  if (e.target.dataset.index !== e.target.selectedIndex + 1)
    updateDb(
      e.target.dataset.id,
      e.target.dataset.field,
      e.target.selectedIndex + 1,
      "goods"
    );
}

function onCheked(e) {
  if (e.target.closest("tbody").id === "listGoods")
    updateDb(
      e.target.dataset.id,
      e.target.dataset.field,
      e.target.checked ? 1 : 0,
      "goods"
    );
  else if (e.target.closest("tbody").id === "listCats")
    updateDb(
      e.target.dataset.id,
      e.target.dataset.field,
      e.target.checked ? 1 : 0,
      "cat"
    );
  else if (e.target.closest("tbody").id === "listUsers")
    updateDb(
      e.target.dataset.id,
      e.target.dataset.field,
      e.target.checked ? 1 : 0,
      "users"
    );
}

getUsers()
  .then((result) => result.json())
  .then((users) => {
    allUsers = users;
    renderUsers();
  });
renderTable();
renderCat();
