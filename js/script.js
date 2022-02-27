`use strict`;
// Trying out how to use module, but did not work
// import getData from "./getData.js";

document.addEventListener("DOMContentLoaded", setup);
// --------- Variables ---------
// Array for all students
let allStudents = [];

// Student object
const Student = {
  firstName: "",
  lastName: "",
  middleName: "",
  nickName: "",
  gender: "",
  imgSrc: "",
  house: "",
  blood: "",
  prefect: false,
};

const settings = {
  filterBy: "all",
  sortBy: "firstname",
  sortDir: "asc",
  direction: 1,
};

const HTML = {};

// --------- Setup ---------
function setup() {
  // console.log("setup");
  const urlList = "https://petlatkea.dk/2021/hogwarts/students.json";
  const urlBlood = "https://petlatkea.dk/2021/hogwarts/families.json";

  regBtn();
  getData(urlList, urlBlood);
}

// --------- registerButtons ---------
function regBtn() {
  document
    .querySelectorAll("[data-action='filter']")
    .forEach((btn) => btn.addEventListener("click", selectFilter));
  document
    .querySelectorAll("[data-action='sort']")
    .forEach((btn) => btn.addEventListener("click", selectSort));
}

// --------- getData ---------
async function getData(urlList, urlBlood) {
  const responseList = await fetch(urlList);
  const jsonDataList = await responseList.json();
  const responseBlood = await fetch(urlBlood);
  const jsonDataBlood = await responseBlood.json();
  // console.log(jsonData);
  // return allStudents;
  preparecleanUp(jsonDataList, jsonDataBlood);
}

function preparecleanUp(jsonDataList, jsonDataBlood) {
  const studentsList = jsonDataList;
  const bloodStatus = jsonDataBlood;
  console.log(bloodStatus);
  allStudents = studentsList.map(cleanUpData);
  displayList(allStudents);
}

function cleanUpData(studentsList, bloodStatus) {
  // console.log(studentsList, bloodStatus);

  const student = Object.create(Student);

  // Variable for holding data and trim elm for whitespace
  let house = studentsList.house.trim();
  let gender = studentsList.gender.trim();
  let originalName = studentsList.fullname.trim();

  // -- Setting values for the object --
  // Firstname: take the first char and set it to upper case and set the rest to lower case.
  if (originalName.includes(" ")) {
    student.firstName =
      originalName.substring(0, 1).toUpperCase() +
      originalName.substring(1, originalName.indexOf(" ")).toLowerCase();
  } else {
    student.firstName =
      originalName.substring(0, 1).toUpperCase() + originalName.substring(1).toLowerCase();
  }

  // Lastname: take the first char in the lastname and make it upper case and the rest lower case.
  if (originalName.includes(" ")) {
    student.lastName =
      originalName
        .substring(originalName.lastIndexOf(" ") + 1, originalName.lastIndexOf(" ") + 2)
        .toUpperCase() + originalName.substring(originalName.lastIndexOf(" ") + 2).toLowerCase();
  }

  // if (originalName.includes("-")) {
  //   student.lastName = originalName.substring(originalName.indexOf("-")).toUpperCase();
  // }

  // Middlename: take the middlename and make the first char upper case and the rest lower case.

  student.middleName = originalName.substring(
    originalName.indexOf(" ") + 1,
    originalName.lastIndexOf(" ")
  );
  student.middleName =
    student.middleName.substring(0, 1).toUpperCase() +
    student.middleName.substring(1).toLowerCase();

  // Nickname: find the nickname with "" in a if statement.
  if (originalName.includes(`"`)) {
    student.middleName = "";
    student.nickName = originalName.substring(
      originalName.indexOf(`"`),
      originalName.lastIndexOf(`"`) + 1
    );
  }

  // Gender: first char set to upper case, rest to lower case.
  student.gender = gender.charAt(0).toUpperCase() + gender.substring(1).toLowerCase();

  // Imgsrc: find the destation and make it all to lower case.
  student.imgSrc = `./assets/images/${originalName
    .substring(0, originalName.indexOf(" "))
    .toLowerCase()}_.png`;
  student.imgSrc = `./assets/images/${
    originalName
      .substring(originalName.lastIndexOf(" ") + 1, originalName.lastIndexOf(" ") + 2)
      .toLowerCase() + originalName.substring(originalName.lastIndexOf(" ") + 2).toLowerCase()
  }_${originalName.substring(0, 1).toUpperCase().toLowerCase()}.png`;

  // House: set the first char to upper case and the rest to lower case.
  student.house = house.charAt(0).toUpperCase() + house.substring(1).toLowerCase();

  return student;
}

function displayList(students) {
  // console.table(students);
  // clear the list
  document.querySelector("#student_list tbody").innerHTML = "";
  // build a new list
  students.forEach(displayStudent);
}

function displayStudent(student) {
  const clone = document.querySelector("template#student").content.cloneNode(true);

  clone.querySelector(
    "[data-field=firstname]"
  ).textContent = `${student.firstName} ${student.nickName} ${student.middleName}`;
  clone.querySelector("[data-field=lastname]").textContent = student.lastName;
  clone.querySelector("[data-field=house]").textContent = student.house;
  clone.querySelector("[data-field=prefect]").textContent = "🎖";
  //   clone.querySelector(".popup_button").addEventListener("click", openPopup);
  document.querySelector("tbody").appendChild(clone);
}

// --------- filter ---------
function selectFilter(event) {
  // console.log("selectFilter");
  const filter = event.target.dataset.filter;
  setFilter(filter);
}

function setFilter(filter) {
  settings.filterBy = filter;
  buildList();
}

// function filterList(filteredList) {
//   if (settings.filterBy === "gryffindor") {
//     filteredList = allStudents.filter(isGryffindor);
//   } else if (settings.filterBy === "slytherin") {
//     filteredList = allStudents.filter(isSlytherin);
//   } else if (settings.filterBy === "hufflepuff") {
//     filteredList = allStudents.filter(isHufflepuff);
//   } else if (settings.filterBy === "ravenclaw") {
//     filteredList = allStudents.filter(isRavenclaw);
//   }
//   return filteredList;
// }

// function isGryffindor(student) {
//   console.log(student);
//   const gHouse = student.house

//   gHouse === "gryffindor";
//   return student.house === "gryffindor";
// }
// function isSlytherin(student) {
//   return student.house === "slytherin";
// }
// function isHufflepuff(student) {
//   return student.house === "hufflepuff";
// }
// function isRavenclaw(student) {
//   return student.house === "ravenclaw";
// }

function filterList(filteredList) {
  // filteredList = allStudents;

  let toFilterOn = "house";

  if (settings.filterBy !== "all") {
    filteredList = allStudents.filter(isStudentsAll);
  } else {
    filteredList = allStudents;
  }

  function isStudentsAll(student) {
    // console.log("student", student[toFilterOn]);
    // console.log("filter", settings.filterBy);
    if (student[toFilterOn] === settings.filterBy) {
      return true;
    } else {
      return false;
    }
  }
  return filteredList;
}

// --------- sorting ---------
// sort allAnimals with the correct sort function and put info filterAnimals
function selectSort(event) {
  const sortBy = event.target.dataset.sort;
  const sortDir = event.target.dataset.sortDirection;

  //find old sortBy element
  const oldElement = document.querySelector(`[data-sort='${settings.sortBy}']`);
  oldElement.classList.remove("sortby");

  //indicate active sort
  event.target.classList.add("sortby");

  //toggle the direction
  if (sortDir === "asc") {
    event.target.dataset.sortDirection = "desc";
  } else {
    event.target.dataset.sortDirection = "asc";
  }

  console.log(`user selected: ${sortBy} and ${sortDir}`);
  setSort(sortBy, sortDir);
}

function setSort(sortBy, sortDir) {
  settings.sortBy = sortBy;
  settings.sortDir = sortDir;
  buildList();
}

function sortList(sortedList) {
  let direction = 1;
  if (settings.sortDir === "desc") {
    direction = -1;
  } else {
    settings.direction = 1;
  }

  sortedList = sortedList.sort(sortByProperty);

  // closure
  function sortByProperty(a, b) {
    if (a[settings.sortBy] < b[settings.sortBy]) {
      return -1 * settings.direction;
    } else {
      return 1 * settings.direction;
    }
  }
  return sortedList;
}

function buildList() {
  const currentList = filterList(allStudents);
  const sortedList = sortList(currentList);

  // console.log(allStudents);

  displayList(sortedList);
  // displayList(currentList);
}
