const curCategory = document.getElementById("cur-category");
const container = document.getElementById("listGoods");
const checkActiv = document.getElementById("activ");
const popupBg = document.querySelector('.popup__bg'); // Фон попап окна
const popupGood = document.querySelector('.popup-good'); // Само окно попап
const popupUpload = document.querySelector('.popup-upload'); // Само окно попап
const preview = document.getElementById('preview');
const uploadImg = document.getElementById('uploadImg');
const fileInput = document.getElementById('fileInput');
let elemLoad = '';

checkActiv.addEventListener('change', renderTable);
curCategory.addEventListener('change', renderTable);
uploadImg.addEventListener('submit', (e) => {
  e.preventDefault();
  if (confirm("!!!!! ВНИМАНИЕ!!!!!! Старое фото будет УДАЛЕНО! Подтверждаете?")) {
    const formData = new FormData(uploadImg);
    formData.append("oldUrl", elemLoad.dataset.url);
    fetch('/upload', {
      method: "POST",
      body: formData
    }).then((result) => result.text())
      .then((textResult) => {
        if (textResult) {
          // Обновить базу и объекты
          closePopup();
          updateDb(elemLoad.dataset.id, elemLoad.dataset.field, textResult);
          elemLoad.parentElement.children[0].dataset.url = textResult;
          removeFilesItem();
        }
      }).catch((err) => console.log(err));
  }
});


function clickOut(e) {
  if (!e.target.classList.contains("edit")) editable.close(false);
}

const editable = {
  // (A) PROPERTIES
  selected: null,  // current selected cell
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

    // (B4) PRESS ENTER/ESC OR CLICK OUTSIDE TO END EDIT
    window.addEventListener("click", clickOut);
    cell.onkeydown = evt => {
      if (evt.key == "Enter" || evt.key == "Escape") {
        editable.close(evt.key == "Enter" ? true : false);
        return false;
      }
    };
  },

  // (C) END "EDIT MODE"
  close: evt => {
    if (evt.target != editable.selected) {
      // (C1) CANCEL - RESTORE PREVIOUS VALUE
      if ((evt === false) || (editable.selected.dataset.field === "cost") && (!Number.isFinite(+editable.selected.innerHTML))) {
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

      // (C5) DO WHATEVER YOU NEED
      if (evt !== false) {
        if (editable.selected.innerHTML !== editable.value) {
          updateDb(editable.selected.dataset.id, editable.selected.dataset.field, cell.innerHTML);
        }
        // check value?
        // send value to server?
        // update calculations in table?
      }

      // (C4) "UNMARK" CURRENT SELECTED CELL
      editable.selected.classList.remove("edit");
      editable.selected = null;
      editable.value = "";

    }
  }
};

function updateDb(id, field, value) {
  let url = "/mysql?goods_udate_id=" + id;
  const param = {
    field: field,
    value: value
  }
  fetch(url, {
    method: 'POST',
    body: JSON.stringify(param)
  })
    .then(() => {
      //UPDATE goods goodsOfCat
      allGoods.find((x) => x.id === +id)[field] = value;
      fillGoodsOfCat();
    })
    .catch(err => console.log(err));
}

document.addEventListener('click', (e) => { // Вешаем обработчик на весь документ
  if (e.target === popupBg) { // Если цель клика - фот, то:
    closePopup();
  }
});

// (D) INITIALIZE - DOUBLE CLICK TO EDIT CELL
window.addEventListener("DOMContentLoaded", () => {
  for (let cell of document.querySelectorAll(".table-goods td")) {
    if (!cell.classList.contains("check")) cell.ondblclick = (e) => editable.edit(cell);
  }
  for (let buttonShow of document.querySelectorAll(".table-goods .show-img")) {
    buttonShow.onclick = (e) => showImg(buttonShow);
  }
  for (let buttonDownload of document.querySelectorAll(".table-goods .download-img")) {
    buttonDownload.onclick = (e) => loadImg(buttonDownload);
  }
  for (let buttonClose of document.querySelectorAll(".close-popup")) {
    buttonClose.onclick = (e) => closePopup();
  }
});

function removeFilesItem() {
  preview.innerHTML = "";
  fileInput.value = ''; //for IE11, latest Chrome/Firefox/Opera...
}

function showLoad(elem) {
  const reader = new FileReader();
  const file = elem.files.item(0);
  if (file) {
    reader.readAsDataURL(file)
    reader.onload = () => {
      preview.innerHTML = `<img src=${reader.result} style="width: 100%; max-height: 700px;">
      <a href="#" onclick="removeFilesItem(); return false;" class="input-file-list-remove">X</a>`;
    }
  }
}

function loadImg(elem) {
  elemLoad = elem;
  popupBg.classList.add('active'); // Добавляем класс 'active' для фона
  popupUpload.classList.add('active');
}

function showImg(elem) {
  popupGood.children[0].setAttribute("src", elem.dataset.url);
  popupBg.classList.add('active'); // Добавляем класс 'active' для фона
  popupGood.classList.add('active');
}

function closePopup() {
  popupBg.classList.remove('active'); // Убираем активный класс с фона
  popupGood.classList.remove('active'); // И с окна
  popupUpload.classList.remove('active'); // И с окна
}

function renderTable() {
  const goods = (curCategory.options[curCategory.selectedIndex].value === "all") ? allGoods : goodsOfCat[curCategory.selectedIndex];
  //if (curCategory.options[curCategory.selectedIndex].value === "all") renderTable(allGoods);
  //else renderTable(goodsOfCat[curCategory.selectedIndex]);

  if (goods) {
    container.innerHTML = "";
    for (let i = 0; i < goods.length; i++) {
      if ((!checkActiv.checked) && (goods[i].activ === 0)) continue;
      const newRow = container.insertRow();
      const cat = allCats.find((elem) => elem.id === goods[i].category)
      let newCell = newRow.insertCell();
      newCell.innerHTML = `<select name="category" data-id=${goods[i].id} data-field="category" data-index=${goods[i].category}></select>`;
      newCell.classList.add("check");
      let sel = newCell.children[0];
      for (let j = 0; j < allCats.length; j++) {
        opt = document.createElement('option');
        opt.value = allCats[j].id;
        opt.innerHTML = allCats[j].name;
        opt.selected = (allCats[j].id === goods[i].category);
        sel.appendChild(opt);
      }
      newCell.addEventListener('change', onChangedCat);
      newCell = newRow.insertCell();
      newCell.dataset.id = goods[i].id;
      newCell.dataset.field = "name";
      newCell.innerHTML = goods[i].name;
      newCell = newRow.insertCell();
      let codeButtonImg = `
        <button class="show-img" data-url=${goods[i].img}>Смотреть</button>
        <button class="download-img" data-url=${goods[i].img} data-id=${goods[i].id} data-field="img">Загрузить</button>`
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
      newCell.innerHTML = `<input type="checkbox" name=${"check" + goods[i].id} ${(goods[i].activ) ? "checked" : ""} data-id=${goods[i].id} data-field="activ">`;
      newCell.addEventListener('click', onCheked);
      //goods[i].activ;
      newCell = newRow.insertCell();
      newCell.classList.add("check");
      newCell.innerHTML = `<input type="checkbox" name=${"checkStock" + goods[i].id} ${(goods[i].stock) ? "checked" : ""} data-id=${goods[i].id} data-field="stock">`;
      newCell.addEventListener('click', onCheked);
      //goods[i].stock;
    }

  }
}

function onChangedCat(e) {
  if (e.target.dataset.index !== (e.target.selectedIndex + 1)) updateDb(e.target.dataset.id, e.target.dataset.field, e.target.selectedIndex + 1);
}

function onCheked(e) {
  updateDb(e.target.dataset.id, e.target.dataset.field, e.target.checked ? 1 : 0);
}

renderTable(allGoods);