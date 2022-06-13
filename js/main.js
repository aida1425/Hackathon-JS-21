const API = "http://localhost:8000/cards";

let charName = document.getElementById("charName");
let originName = document.getElementById("originName");
let dateChar = document.getElementById("dateChar");
let addDesc = document.getElementById("addDesc");
let addImg = document.getElementById("addImg");
let modal = document.getElementsByClassName("modal");
let btnAdd = document.getElementById("btnAdd");
let sectionChar = document.getElementById("sectionChar");
// let btn;
let searchValue = "";
let currentPage = 1;
let countPage = 1;
readChars();

btnAdd.addEventListener("click", () => {
  if (
    !charName.value.trim() ||
    !originName.value.trim() ||
    !dateChar.value.trim() ||
    !addDesc.value.trim() ||
    !addImg.value.trim()
  ) {
    alert("Заполните все поля!");
    return;
  }
  let newChar = {
    name: charName.value,
    origin: originName.value,
    date: dateChar.value,
    desc: addDesc.value,
    img: addImg.value,
  };
  createChar(newChar);
  readChars(newChar);
});

function createChar(char) {
  fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(char),
  }).then(() => {
    console.log(char);
    readChars();
  });
  charName.value = "";
  originName.value = "";
  dateChar.value = "";
  addDesc.value = "";
  addImg.value = "";
  // modal.classList.toggle("hidden");
}

function readChars() {
  fetch(`${API}?q=${searchValue}&_page=${currentPage}&_limit=6`)
    .then(res => res.json())
    .then(data => {
      console.log(data);
      sectionChar.innerHTML = "";
      data.forEach(function (item, i) {
        sectionChar.innerHTML += `<div class="card" style="width: 18rem;">
          <img style="width: 100%; object-fit: contain; height:250px; object-fit: cover" src='${item.img}' class="card-img-top" alt="...">
          <div class ="card-body">
          <p class ="card-text">Кличка: ${item.name}</p>
          <p class ="card-text">По паспорту: ${item.origin}</p>
          <p class ="card-text">День рождения: ${item.date}</p>
          <p class ="card-text">Описание: ${item.desc}</p>
           
          <button class="btn btn-outline-danger btnDelete" id="${item.id}">Delete</button>
        <button class="btn btn-outline-warning" onclick="show_hero(${item.id})" id="${item.id}" data-bs-toggle="modal"
        data-bs-target="#editModal">Edit</button>

          </div>
      </div>`;
      });

      sumPage();
    });
}

// ! ============= DELETE =============

document.addEventListener("click", event => {
  let del_class = [...event.target.classList];
  if (del_class.includes("btnDelete")) {
    let del_id = event.target.id;
    fetch(`${API}/${del_id}`, {
      method: "DELETE",
    }).then(() => readChars());
  }
});

// ! =============== EDIT ==============

let charNameEdit = document.getElementById("charNameEdit");
let originNameEdit = document.getElementById("originNameEdit");
let dateCharEdit = document.getElementById("dateCharEdit");
let addDescEdit = document.getElementById("addDescEdit");
let addImgEdit = document.getElementById("addImgEdit");
let btnEdit = document.getElementById("btnEdit");
let body = document.getElementsByTagName("body");
console.log(body);

btnEdit.addEventListener("click", e => {
  console.log(charNameEdit.value);
  let objEditChar = {
    name: charNameEdit.value,
    origin: originNameEdit.value,
    date: dateCharEdit.value,
    desc: addDescEdit.value,
    img: addImgEdit.value,
    id: btnEdit.dataset.heroid,
  };
  fetch(`${API}/${btnEdit.dataset.heroid}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(objEditChar),
  }).then(() => readChars());
});

// ! ======== PAGINATION ========
let prevBtn = document.getElementById("prevBtn");
let nextBtn = document.getElementById("nextBtn");

prevBtn.addEventListener("click", () => {
  if (currentPage <= 1) return;
  currentPage = currentPage - 1;
  readChars();
});

nextBtn.addEventListener("click", () => {
  if (currentPage >= countPage) return;
  currentPage = currentPage + 1;
  readChars();
});

function sumPage() {
  fetch(API)
    .then(res => res.json())
    .then(data => {
      countPage = Math.ceil(data.length / 6);
    });
}

//! ========= SEARCH ========
let inpSearch = document.getElementById("inpSearch");
inpSearch.addEventListener("input", event => {
  searchValue = event.target.value;
  readChars();
});

function show_hero(hero_id) {
  fetch(API)
    .then(response => {
      return response.json();
    })
    .then(data => {
      var data = data.filter(function (val) {
        return val.id == hero_id;
      })[0];
      console.log(data);
      charNameEdit.value = data.name;
      originNameEdit.value = data.origin;
      dateCharEdit.value = data.date;
      addDescEdit.value = data.desc;
      addImgEdit.value = data.img;

      btnEdit.setAttribute("data-heroid", data.id);
    });
}
