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
  sortBy: "name",
  sortDir: "asc",
  direction: 1,
};

const HTML = {};

// --------- Setup ---------
function setup() {
  // console.log("setup");
  const urlList = "https://petlatkea.dk/2021/hogwarts/students.json";
  const urlBlood = "https://petlatkea.dk/2021/hogwarts/families.json";

  getData(urlList, urlBlood);
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
  console.table(students);
  // clear the list
  document.querySelector("#student_list tbody").innerHTML = ";";
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
