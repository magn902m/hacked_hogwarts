`use strict`;
// Trying out how to use module, but did not work
// import getData from "./getData.js";

document.addEventListener("DOMContentLoaded", setup);
// --------- Variables ---------
// Array for all students
let allStudents = [];
let expelledList = [];
let bloodHistory = [];

const settings = {
  filterBy: "all",
  sortBy: "firstName",
  sortDir: "asc",
  search: "",
};

const HTML = {};

// --------- Setup ---------
async function setup() {
  // console.log("setup");
  const urlList = "https://petlatkea.dk/2021/hogwarts/students.json";
  const urlBlood = "https://petlatkea.dk/2021/hogwarts/families.json";

  const studentList = await getData(urlList);
  const bloodList = await getData(urlBlood);

  allStudents = studentList.map(cleanUpData);
  addBlood(bloodList);

  // const combinedList = combineLists(studentList, bloodList);
  // const cleandData = cleanUpData(combinedList);

  buildList();
  regBtn();

  // getData(urlList, urlBlood);
}

// --------- registerButtons ---------
function regBtn() {
  document.querySelector("#searchbar").addEventListener("input", searchFieldInput);
  document
    .querySelectorAll("[data-action='filter']")
    .forEach((btn) => btn.addEventListener("click", selectFilter));
  document
    .querySelectorAll("[data-action='sort']")
    .forEach((btn) => btn.addEventListener("click", selectSort));
}

// function combineLists(students, bloodList) {
//   allStudents = students.map(cleanUpData);
//   addBlood(bloodList);
// }

// --------- getData ---------
async function getData(url) {
  const response = await fetch(url);
  const jsonData = await response.json();
  return jsonData;
}

function cleanUpData(studentsList) {
  // console.log(studentsList);

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
    expelled: false,
    initPure: false,
    inqSquad: false,
  };

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

  student.gender = gender.charAt(0).toUpperCase() + gender.substring(1).toLowerCase();

  return student;
}

function addBlood(bloodStatus) {
  const pure = bloodStatus.pure;
  const half = bloodStatus.half;

  allStudents.forEach((student) => {
    if (half.includes(student.lastName)) {
      student.blood = "half";
    } else if (pure.includes(student.lastName)) {
      student.blood = "pure";
      student.initPure = true;
    } else {
      student.blood = "muggle";
    }

    // console.log(student.lastName + " " + student.blood);
    // console.log("**************************************");
  });
}

function displayList(students) {
  // console.table(students);
  console.log(students);
  // clear the list
  document.querySelector("#student_list tbody").innerHTML = "";

  // console.table(students);
  // count students
  const studentCounted = studentCounter(students);
  displayCount(studentCounted);

  // build a new list
  students.forEach(displayStudent);
}

// Counting all the houses form all students, and looking at the lenght of allStudents, expelledList and students.
function studentCounter(students) {
  const result = {
    total: 0,
    Gryffindor: 0,
    Hufflepuff: 0,
    Ravenclaw: 0,
    Slytherin: 0,
    displaying: 0,
    expelled: 0,
  };

  allStudents.forEach((student) => {
    result[student.house]++;
  });

  result.total = allStudents.length;
  result.displaying = students.length;

  return result;
}

function displayCount(studentConuted) {
  document.querySelector("#counter_bar #total_count").textContent = studentConuted.total;
  document.querySelector("#counter_bar #gryffindor_count").textContent = studentConuted.Gryffindor;
  document.querySelector("#counter_bar #hufflepuff_count").textContent = studentConuted.Hufflepuff;
  document.querySelector("#counter_bar #ravenclaw_count").textContent = studentConuted.Ravenclaw;
  document.querySelector("#counter_bar #slytherin_count").textContent = studentConuted.Slytherin;
  document.querySelector("#counter_bar #expelled_count").textContent = studentConuted.expelled;
  document.querySelector("#counter_bar #displaying_count").textContent = studentConuted.displaying;
}

function displayStudent(student) {
  const clone = document.querySelector("template#student").content.cloneNode(true);

  clone.querySelector(
    "[data-field=firstname]"
  ).textContent = `${student.firstName} ${student.nickName} ${student.middleName}`;
  clone.querySelector("[data-field=lastname]").textContent = student.lastName;
  clone.querySelector("[data-field=house]").textContent = student.house;
  // clone.querySelector("[data-field=inq-squad]").textContent = "";

  // --------- Prefects ---------
  // append clone to list
  clone.querySelector("[data-field=prefect]").dataset.prefect = student.prefect;
  clone.querySelector("[data-field=inq-squad]").dataset.inqSquad = student.inqSquad;

  // Make prefect and inq squad clickable
  clone.querySelector("[data-field=prefect]").addEventListener("click", selectPrefect);
  clone.querySelector("[data-field=inq-squad]").addEventListener("click", selectInqSquad);

  // ------ make inq squad ------
  function selectInqSquad() {
    // console.log("Try make inqSquad");
    if (student.initPure) {
      if (student.inqSquad) {
        student.inqSquad = false;
      } else {
        student.inqSquad = true;
      }
      buildList();
    }
  }

  function selectPrefect() {
    if (student.prefect === true) {
      student.prefect = false;
    } else {
      tryToMakeAPrefect(student);
      // student.prefect = true;
    }
    buildList();
  }

  clone
    .querySelector("[data-field=show_more]")
    .addEventListener("click", () => showDetails(student));

  document.querySelector("tbody").appendChild(clone);
}

// ------ prefect ------
function tryToMakeAPrefect(selectedStudent) {
  const prefects = allStudents.filter(
    (student) => student.prefect && student.house === selectedStudent.house
  );

  const numberOfPrefects = prefects.length;

  if (numberOfPrefects >= 2) {
    console.log("There can only be two prefects!");
    removeAorB(prefects[0], prefects[1]);
  } else {
    makePrefect(selectedStudent);
  }

  function removeAorB(prefectA, prefectB) {
    // ask the user to ignnore, or remove A or B
    document.querySelector("#remove_aorb").classList.add("show");
    document.querySelector("#remove_aorb .close_dialog").addEventListener("click", closeDialog);
    document
      .querySelector("#remove_aorb [data-action=remove1]")
      .addEventListener("click", clickRemoveA);
    document
      .querySelector("#remove_aorb [data-action=remove2]")
      .addEventListener("click", clickRemoveB);

    // show names on buttons
    document.querySelector("#remove_aorb .student1").textContent = prefectA.firstName;
    document.querySelector("#remove_aorb .student2").textContent = prefectB.firstName;

    // if ignore - do nothing ..
    function closeDialog() {
      document.querySelector("#remove_aorb").classList.remove("show");
      document
        .querySelector("#remove_aorb .close_dialog")
        .removeEventListener("click", closeDialog);
      document
        .querySelector("#remove_aorb [data-action=remove1]")
        .removeEventListener("click", clickRemoveA);
      document
        .querySelector("#remove_aorb [data-action=remove2]")
        .removeEventListener("click", clickRemoveB);
    }

    function clickRemoveA() {
      // if remove other:
      removeWinner(prefectA);
      makePrefect(selectedStudent);
      buildList();
      closeDialog();
    }

    function clickRemoveB() {
      // else - if removeB
      removeWinner(prefectB);
      makePrefect(selectedStudent);
      buildList();
      closeDialog();
    }
  }

  function removeWinner(studentPrefect) {
    studentPrefect.prefect = false;
  }

  function makePrefect(studentPrefect) {
    studentPrefect.prefect = true;
  }
}

// --------- popup ---------
function closePopUp() {
  document.querySelector("#pop_up").classList.remove("show");
}

function showDetails(student) {
  const popUp = document.querySelector("#pop_up");
  popUp.classList.add("show");
  // window.scrollTo(0, 0);

  // --------- student info ---------
  popUp.querySelector(".student_img").src = student.imgSrc;
  popUp.querySelector(
    "#fullname"
  ).textContent = `${student.firstName} ${student.nickName} ${student.middleName} ${student.lastName}`;
  popUp.querySelector("#house").textContent = student.house;
  popUp.querySelector("#firstname").textContent = student.firstName;
  popUp.querySelector("#nickname").textContent = student.nickName;
  popUp.querySelector("#middlename").textContent = student.middleName;
  popUp.querySelector("#lastname").textContent = student.lastName;

  // --------- show status ---------
  popUp.querySelector(
    ".student_status p:nth-child(2)"
  ).textContent = `Expelled: ${student.expelled}`;
  popUp.querySelector(
    ".student_status p:nth-child(3)"
  ).textContent = `Blood History: ${student.blood}`;

  if (student.prefect) {
    popUp.querySelector(".student_status p:nth-child(4)").textContent = `Part of prefect: Yes`;
  } else {
    popUp.querySelector(".student_status p:nth-child(4)").textContent = `Part of prefect: No`;
  }

  if (student.inqSquad) {
    popUp.querySelector(
      ".student_status p:nth-child(5)"
    ).textContent = `Inq. squad: ${student.inqSquad}`;
  } else {
    popUp.querySelector(
      ".student_status p:nth-child(5)"
    ).textContent = `Inq. squad: ${student.inqSquad}`;
  }

  const crestImg = document.querySelector("#pop_up .crest_img");
  const crestColor = document.querySelector("#pop_up .content");

  if (student.house === "Gryffindor") {
    crestImg.src = "assets/crests/gryffindor.png";
    crestColor.style.borderColor = "#9c1203";
  } else if (student.house === "Slytherin") {
    crestImg.src = "assets/crests/slytherin.png";
    crestColor.style.borderColor = "#033807";
  } else if (student.house === "Hufflepuff") {
    crestImg.src = "assets/crests/hufflepuff.png";
    crestColor.style.borderColor = "#e3a000";
  } else if (student.house === "Ravenclaw") {
    crestImg.src = "assets/crests/ravenclaw.png";
    crestColor.style.borderColor = "#00165e";
  }

  // --------- eventListener ---------
  document.querySelector(".close").addEventListener("click", closePopUp);
  const expelBtn = document.querySelector("#expel_btn");
  expelBtn.addEventListener("click", expelledStudent);

  document.addEventListener("mouseup", function (elm) {
    const popUpContainer = document.querySelector("#pop_up .content");
    if (!popUpContainer.contains(elm.target)) {
      closePopUp();
    }
  });

  // --------- expelled ---------
  function expelledStudent() {
    console.log("expelledStudent");
    document.querySelector("#expel_btn").removeEventListener("click", expelledStudent);

    const indexOfStudent = allStudents.indexOf(student);
    expelledList.push(allStudents.splice(indexOfStudent, 1));
    buildList();
    console.log(expelledList);

    closePopUp();
  }
}

// --------- searchbar ---------
function searchFieldInput(evt) {
  settings.search = evt.target.value;
  buildList();
}

function searchList(list) {
  return list.filter((student) => {
    // write to the list with only those elemnts in the allAnimals array that has properties containing the search frase
    // comparing in uppercase so that m is the same as M
    return (
      student.firstName.toUpperCase().includes(settings.search.toUpperCase()) ||
      student.lastName.toUpperCase().includes(settings.search.toUpperCase()) ||
      student.house.toUpperCase().includes(settings.search.toUpperCase())
    );
  });
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

function filterList(filteredList) {
  // filteredList = allStudents;

  let filterOnHouse = "house";
  let filterOnGender = "gender";
  let filterOnBlood = "blood";
  let filterOnPrefect = "prefect";
  let filterOnSquad = "squad";
  let filterOnExpelled = "expelled";
  let filterOnNonExpelled = "nonexpelled";

  if (settings.filterBy === "all") {
    filteredList = allStudents;
  } else if (settings.filterBy === "Gryffindor") {
    filteredList = allStudents.filter(isStudentsHouse);
  } else if (settings.filterBy === "Slytherin") {
    filteredList = allStudents.filter(isStudentsHouse);
  } else if (settings.filterBy === "Hufflepuff") {
    filteredList = allStudents.filter(isStudentsHouse);
  } else if (settings.filterBy === "Ravenclaw") {
    filteredList = allStudents.filter(isStudentsHouse);
  } else if (settings.filterBy === "Boy") {
    filteredList = allStudents.filter(isStudentsGender);
  } else if (settings.filterBy === "Girl") {
    filteredList = allStudents.filter(isStudentsGender);
  } else if (settings.filterBy === "pure") {
    filteredList = allStudents.filter(isStudentsBlood);
  } else if (settings.filterBy === "half") {
    filteredList = allStudents.filter(isStudentsBlood);
  } else if (settings.filterBy === "muggle") {
    filteredList = allStudents.filter(isStudentsBlood);
  } else if (settings.filterBy === "prefect") {
    filteredList = expelledList.filter(isStudentsPrefect);
  } else if (settings.filterBy === "squad") {
    filteredList = expelledList.filter(isStudentsSquad);
  } else if (settings.filterBy === "expelled") {
    filteredList = expelledList.filter(isStudentsExpelled);
  } else if (settings.filterBy === "nonexpelled") {
    filteredList = expelledList.filter(isStudentsNonExpelled);
  }

  // if (settings.filterBy !== "all") {
  //   filteredList = allStudents.filter(isStudentsHouse);
  // } else {
  //   filteredList = allStudents;
  // }

  function isStudentsHouse(student) {
    // console.log("student", student[toFilterOn]);
    // console.log("filter", settings.filterBy);
    if (student[filterOnHouse] === settings.filterBy) {
      return true;
    } else {
      return false;
    }
  }

  function isStudentsGender(student) {
    if (student[filterOnGender] === settings.filterBy) {
      return true;
    } else {
      return false;
    }
  }

  function isStudentsBlood(student) {
    if (student[filterOnBlood] === settings.filterBy) {
      return true;
    } else {
      return false;
    }
  }

  function isStudentsPrefect(student) {
    if (student[filterOnPrefect] === settings.filterBy) {
      return true;
    } else {
      return false;
    }
  }

  function isStudentsSquad(student) {
    if (student[filterOnSquad] === settings.filterBy) {
      return true;
    } else {
      return false;
    }
  }

  function isStudentsExpelled(student) {
    if (student[filterOnNonExpelled] === settings.filterBy) {
      return true;
    } else {
      return false;
    }
  }

  function isStudentsNonExpelled(student) {
    if (student[filterOnExpelled] === settings.filterBy) {
      return true;
    } else {
      return false;
    }
  }

  return filteredList;
}

// --------- sorting ---------
// sort allStudents with the correct sort function and put info filterAnimals
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
    direction = 1;
  }

  sortedList = sortedList.sort(sortByProperty);

  // closure
  function sortByProperty(a, b) {
    if (a[settings.sortBy] < b[settings.sortBy]) {
      return -1 * direction;
    } else {
      return 1 * direction;
    }
  }
  return sortedList;
}

function buildList() {
  const filteredList = filterList(allStudents);
  const sortedList = sortList(filteredList);
  const searchedList = searchList(sortedList);
  // console.log(searchedList);

  // return sortedList;
  // displayList(currentList);
  displayList(searchedList);
}
