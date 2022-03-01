`use strict`;
// Trying out how to use module, but did not work
// import getData from "./getData.js";

document.addEventListener("DOMContentLoaded", setup);
// --------- Variables ---------
// Array for all students
let allStudents = [];
let expelledList = [];
let bloodHistory = [];

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
};

const settings = {
  filterBy: "all",
  sortBy: "firstName",
  sortDir: "asc",
  // direction: 1,
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
  document.querySelector("#searchbar").addEventListener("input", searchFieldInput);
  document
    .querySelectorAll("[data-action='filter']")
    .forEach((btn) => btn.addEventListener("click", selectFilter));
  document
    .querySelectorAll("[data-action='sort']")
    .forEach((btn) => btn.addEventListener("click", selectSort));

  document.querySelector(".close").addEventListener("click", closePopUp);
}

// --------- getData ---------
async function getData(urlList, urlBlood) {
  const jsonDataList = await loadFile1(urlList);
  async function loadFile1(urlList) {
    const responseList = await fetch(urlList);
    const jsonDataList = await responseList.json();
    return jsonDataList;
  }

  const jsonDataBlood = await loadFile2(urlBlood);
  async function loadFile2(urlBlood) {
    const responseBlood = await fetch(urlBlood);
    const jsonDataBlood = await responseBlood.json();
    return jsonDataBlood;
  }

  // const responseList = await fetch(urlList);
  // const jsonDataList = await responseList.json();
  // const responseBlood = await fetch(urlBlood);
  // const jsonDataBlood = await responseBlood.json();
  // console.log(jsonData);
  // return allStudents;
  preparecleanUp(jsonDataList, jsonDataBlood);
}

function preparecleanUp(jsonDataList, jsonDataBlood) {
  console.log(jsonDataList, jsonDataBlood);
  const studentsList = jsonDataList;
  const bloodStatus = jsonDataBlood;
  allStudents = studentsList.map(cleanUpData);
  buildList(allStudents);
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

  student.gender = gender.charAt(0).toUpperCase() + gender.substring(1).toLowerCase();

  return student;
}

function displayList(students) {
  // console.table(students);
  // clear the list
  document.querySelector("#student_list tbody").innerHTML = "";

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
  // clone.querySelector("[data-field=prefect]").textContent = "🎖";

  // --------- Prefects ---------
  // append clone to list
  clone.querySelector("[data-field=prefect]").dataset.prefect = student.prefect;
  // Make trophy clickable
  clone.querySelector("[data-field=prefect]").addEventListener("click", selectPrefect);

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
    .querySelector("[data-field=firstname]")
    .addEventListener("click", () => showDetails(student));
  clone
    .querySelector("[data-field=lastname]")
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
    document.querySelector("#remove_aorb").classList.remove("dialog");
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
      document.querySelector("#remove_aorb").classList.add("dialog");
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

function showDetails(details) {
  const popUp = document.querySelector("#pop_up");
  popUp.classList.add("show");
  // window.scrollTo(0, 0);

  popUp.querySelector(
    "#fullname"
  ).textContent = `${details.firstName} ${details.nickName} ${details.middleName} ${details.lastName}`;
  popUp.querySelector("#house").textContent = details.house;
  popUp.querySelector("img").src = details.imgSrc;

  document.addEventListener("mouseup", function (elm) {
    const popUpContainer = document.querySelector("#pop_up .content");
    if (!popUpContainer.contains(elm.target)) {
      closePopUp();
    }
  });
}

// --------- searchbar ---------
function searchFieldInput(evt) {
  // write to the list with only those elemnts in the allAnimals array that has properties containing the search frase
  displayList(
    allStudents.filter((student) => {
      // comparing in uppercase so that m is the same as M
      return (
        student.firstName.toUpperCase().includes(evt.target.value.toUpperCase()) ||
        student.lastName.toUpperCase().includes(evt.target.value.toUpperCase()) ||
        student.house.toUpperCase().includes(evt.target.value.toUpperCase())
      );
    })
  );
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
//   else if (settings.filterBy === "boys") {
//     filteredList = allStudents.filter(isBoys);
//   } else if (settings.filterBy === "girls") {
//     filteredList = allStudents.filter(isGirls);
//   }
//   return filteredList;
// }

// function isGryffindor(student) {
//   return student.house === "Gryffindor";
// }

// function isSlytherin(student) {
//   return student.house === "Slytherin";
// }

// function isHufflepuff(student) {
//   return student.house === "Hufflepuff";
// }

// function isRavenclaw(student) {
//   return student.house === "Ravenclaw";
// }

// function isBoys(student) {
//   return student.gender === "Boy";
// }

// function isGirls(student) {
//   return student.gender === "Girl";
// }

function filterList(filteredList) {
  // filteredList = allStudents;

  let filterOnHouse = "house";
  let filterOnGender = "gender";

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
  const currentList = filterList(allStudents);
  const sortedList = sortList(currentList);

  // console.log(allStudents);

  displayList(sortedList);
  // displayList(currentList);
}
