`use strict`;
// Trying out how to use module, but did not work
// import getData from "./getData.js";

document.addEventListener("DOMContentLoaded", setup);
window.addEventListener("keydown", getHackPassword);

// --------- Variables ---------
// Array for all students
let allStudents = [];
let expelledList = [];
let bloodHistory = [];

//hackTheSystem
let isHacked = false;

const settings = {
  filterBy: "all",
  filterType: "all",
  sortBy: "student_id",
  sortDir: "desc",
  search: "",
};

let keySaved = "";

// --------- Setup ---------
async function setup() {
  // console.log("setup");
  const urlList = "https://petlatkea.dk/2021/hogwarts/students.json";
  const urlBlood = "https://petlatkea.dk/2021/hogwarts/families.json";

  const studentList = await getData(urlList);
  const bloodList = await getData(urlBlood);

  allStudents = studentList.map(cleanUpData);
  addBlood(bloodList);

  buildList();
  regBtn();
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

// --------- Control if password is true ---------
function getHackPassword(event) {
  const password = "hack";
  const key = event.key;
  const currentIndex = keySaved.length;
  const keyToMatch = password.charAt(currentIndex);

  if (key === keyToMatch) {
    keySaved += key;
  } else {
    keySaved = "";
  }
  if (keySaved === password) {
    hackTheSystem();
  }
}

// --------- getData ---------
async function getData(url) {
  const response = await fetch(url);
  const jsonData = await response.json();
  return jsonData;
}

function cleanUpData(studentsList, i) {
  // console.log(studentsList);

  // Student object
  const Student = {
    id: null,
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
    inqSquad: false,
    hacker: null,
  };

  const student = Object.create(Student);

  // Variable for holding data and trim elm for whitespace
  let house = studentsList.house.trim();
  let gender = studentsList.gender.trim();
  let originalName = studentsList.fullname.trim();

  student.id = i + 1;

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
  let imgSrcHolder;
  if (originalName.includes("-")) {
    imgSrcHolder = `./assets/images/students_img/${originalName
      .substring(originalName.lastIndexOf("-") + 1)
      .toLowerCase()}_${student.firstName.charAt(0).toLowerCase()}.png`;
  } else if (!originalName.includes(" ")) {
    imgSrcHolder = `./assets/images/students_img/no_picture.png`;
  } else if (originalName.toLowerCase().includes("patil")) {
    if (originalName.toLowerCase().includes("padma")) {
      imgSrcHolder = "./assets/images/students_img/patil_padma.png";
    } else if (originalName.toLowerCase().includes("parvati"))
      imgSrcHolder = "./assets/images/students_img/patil_parvati.png";
  } else {
    imgSrcHolder = `./assets/images/students_img/${originalName
      .substring(originalName.lastIndexOf(" ") + 1)
      .toLowerCase()}_${student.firstName.charAt(0).toLowerCase()}.png`;
  }
  student.imgSrc = imgSrcHolder;

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
    } else {
      student.blood = "muggle";
    }
  });
}

function displayList(students) {
  // console.table(students);
  // console.log(students);
  // clear the list
  document.querySelector("#student_list").innerHTML = "";

  // count students
  const studentCounted = studentCounter(students);
  displayCount(studentCounted);

  // build a new list
  students.forEach(displayStudent);
}

// Counting all the houses form all students, and looking at the lenght of allStudents, expelledList and students.
function studentCounter(students) {
  const countStudents = {
    total: 0,
    Gryffindor: 0,
    Hufflepuff: 0,
    Ravenclaw: 0,
    Slytherin: 0,
    displaying: 0,
    expelled: 0,
  };

  allStudents.forEach((student) => {
    countStudents[student.house]++;
  });

  countStudents.total = allStudents.length;
  countStudents.expelled = expelledList.length;
  countStudents.displaying = students.length;

  return countStudents;
}

function displayCount(studentCounted) {
  document.querySelector("#counter_bar #total_count").textContent = studentCounted.total;
  document.querySelector("#counter_bar #gryffindor_count").textContent = studentCounted.Gryffindor;
  document.querySelector("#counter_bar #hufflepuff_count").textContent = studentCounted.Hufflepuff;
  document.querySelector("#counter_bar #ravenclaw_count").textContent = studentCounted.Ravenclaw;
  document.querySelector("#counter_bar #slytherin_count").textContent = studentCounted.Slytherin;
  document.querySelector("#counter_bar #expelled_count").textContent = studentCounted.expelled;
  document.querySelector("#counter_bar #displaying_count").textContent = studentCounted.displaying;
}

function displayStudent(student) {
  const clone = document.querySelector("template#student").content.cloneNode(true);

  clone.querySelector(
    "[data-field=fullname]"
  ).textContent = `${student.firstName} ${student.nickName} ${student.middleName} ${student.lastName}`;
  clone.querySelector("[data-field=house]").textContent = student.house;
  clone.querySelector("[data-field=student_img]").src = student.imgSrc;
  clone.querySelector(
    "[data-field=student_img]"
  ).alt = `Picture of ${student.firstName} ${student.lastName}`;
  clone.querySelector(".student_id").textContent = `Id: ${student.id}`;

  // --------- House color and crests ---------
  const studCont = clone.querySelector(".student_container");
  const badgesCrest = clone.querySelector(`[data-field=crest]`);
  if (student.house === "Gryffindor") {
    studCont.style.borderColor = "#9c1203";
    badgesCrest.src = "assets/crests/gryffindor.png";
  } else if (student.house === "Slytherin") {
    studCont.style.borderColor = "#033807";
    badgesCrest.src = "assets/crests/slytherin.png";
  } else if (student.house === "Hufflepuff") {
    studCont.style.borderColor = "#e3a000";
    badgesCrest.src = "assets/crests/hufflepuff.png";
  } else if (student.house === "Ravenclaw") {
    studCont.style.borderColor = "#00165e";
    badgesCrest.src = "assets/crests/ravenclaw.png";
  }

  // // --------- Prefects ---------
  // // Make prefect and inq squad clickable
  // clone.querySelector("[data-field=prefect]").addEventListener("click", selectPrefect);
  // clone.querySelector("[data-field=inq-squad]").addEventListener("click", selectInqSquad);

  // // ------ make prefect ------
  // function selectPrefect() {
  //   document
  //     .querySelector(".student_container [data-field=prefect]")
  //     .removeEventListener("click", selectPrefect);
  //   console.log("Try make prefect", student.firstName);

  //   if (student.prefect === true) {
  //     student.prefect = false;
  //   } else {
  //     tryToMakeAPrefect(student);
  //     // student.prefect = true;
  //   }
  //   console.log(student.firstName, "is now", student.prefect, "in prefect");
  //   buildList();
  // }

  // // ------ make inq squad ------
  // function selectInqSquad() {
  //   document
  //     .querySelector(".student_container [data-field=inq-squad]")
  //     .removeEventListener("click", selectInqSquad);

  //   if (isHacked) {
  //     student.inqSquad = true;
  //     buildList();

  //     setTimeout(removeInqSquad, 3000);
  //   } else {
  //     if (student.blood === "pure" || student.house === "Slytherin") {
  //       if (student.inqSquad) {
  //         student.inqSquad = false;
  //       } else {
  //         student.inqSquad = true;
  //       }
  //       buildList();
  //     } else {
  //       alert(`${student.firstName} can't be in the Inq. squad!
  //       Only pureblood and Slytherin are allowed!`);
  //     }
  //   }

  //   function removeInqSquad() {
  //     student.inqSquad = false;
  //     buildList();
  //   }
  // }

  // append clone to list
  clone.querySelector("[data-field=prefect]").dataset.prefect = student.prefect;
  clone.querySelector("[data-field=inq-squad]").dataset.inqSquad = student.inqSquad;

  if (student.expelled) {
    clone.querySelector(".student_container").classList.add("expelled");
  }

  // Make prefect and inq squad clickable
  clone
    .querySelector("[data-field=inq-squad]")
    .addEventListener("click", () => showDetails(student));
  clone.querySelector("[data-field=prefect]").addEventListener("click", () => showDetails(student));

  clone
    .querySelector("[data-field=show_more]")
    .addEventListener("click", () => showDetails(student));

  document.querySelector("#student_list").appendChild(clone);
}

// --------- popup ---------
function showDetails(student) {
  // Remove prefect and inq squad clickable
  document
    .querySelector(".student_container [data-field=inq-squad]")
    .removeEventListener("click", () => showDetails(student));
  document
    .querySelector(".student_container [data-field=prefect]")
    .removeEventListener("click", () => showDetails(student));

  document
    .querySelector(".student_container [data-field=show_more]")
    .removeEventListener("click", () => showDetails(student));

  const popUp = document.querySelector("#pop_up");
  popUp.classList.add("show");

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
  popUp.querySelector("#pop_up .blood").textContent = student.blood;

  // --------- show status ---------
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

  if (student.expelled) {
    popUp.querySelector("#pop_up .content").classList.add("expelled");
  }

  // --------- Prefects ---------
  // append popUp to list
  popUp.querySelector("[data-field=prefect]").dataset.prefect = student.prefect;
  popUp.querySelector("[data-field=inq-squad]").dataset.inqSquad = student.inqSquad;

  //--------- eventListener ---------
  // Make prefect and inq squad clickable
  popUp.querySelector("[data-field=prefect]").addEventListener("click", selectPrefect);
  popUp.querySelector("[data-field=inq-squad]").addEventListener("click", selectInqSquad);
  popUp.querySelector("#prefect_btn").addEventListener("click", selectPrefect);
  popUp.querySelector("#squad_btn").addEventListener("click", selectInqSquad);

  // expel
  document.querySelector("#expel_btn").addEventListener("click", expelledStudent);
  // closing
  document.querySelector(".close").addEventListener("click", closePopUp);

  document.addEventListener("mouseup", function (elm) {
    const popUpContainer = document.querySelector("#pop_up .content");
    if (!popUpContainer.contains(elm.target)) {
      closePopUp();
    }
  });

  // ------ make prefect ------
  function selectPrefect() {
    removeAllEvtListener();

    if (student.prefect === true) {
      student.prefect = false;
    } else {
      tryToMakeAPrefect(student);
      // student.prefect = true;
    }
    closePopUp();
    buildList();
  }

  // ------ make inq squad ------
  function selectInqSquad() {
    removeAllEvtListener();

    if (isHacked) {
      student.inqSquad = true;
      closePopUp();
      buildList();

      setTimeout(removeInqSquad, 3000);
    } else {
      if (student.blood === "pure" || student.house === "Slytherin") {
        if (student.inqSquad) {
          student.inqSquad = false;
        } else {
          student.inqSquad = true;
        }
        closePopUp();
        buildList();
      } else {
        alert(`${student.firstName} can't be in the Inq. squad!
        Only pureblood and Slytherin are allowed!`);
      }
    }

    function removeInqSquad() {
      student.inqSquad = false;
      closePopUp();
      buildList();
    }
  }

  if (student.prefect) {
    popUp.querySelector(".badges_btn #prefect_btn").textContent = "Remove Perfect";
  } else {
    popUp.querySelector(".badges_btn #prefect_btn").textContent = "Make Perfect";
  }

  if (student.inqSquad) {
    popUp.querySelector(".badges_btn #squad_btn").textContent = "Remove from Inq. squad";
  } else {
    popUp.querySelector(".badges_btn #squad_btn").textContent = "Add to Inq. squad";
  }

  // --------- expelled ---------
  function expelledStudent() {
    console.log("TryMakeExpelledStudent");
    document.querySelector("#expel_btn").removeEventListener("click", expelledStudent);

    if (student.hacker !== true) {
      const indexOfStudent = allStudents.indexOf(student);
      const expStudent = allStudents.splice(indexOfStudent, 1)[0];
      expStudent.expelled = true;

      expelledList.push(expStudent);
      buildList();
      console.log(expelledList);
      console.log(expStudent);
    } else {
      alert("Can't be expelled!");
    }
    closePopUp();
  }

  function removeAllEvtListener() {
    document
      .querySelector("#pop_up [data-field=prefect]")
      .removeEventListener("click", selectPrefect);
    document.querySelector("#pop_up #prefect_btn").removeEventListener("click", selectPrefect);

    document
      .querySelector("#pop_up [data-field=inq-squad]")
      .removeEventListener("click", selectInqSquad);
    document.querySelector("#pop_up #squad_btn").removeEventListener("click", selectInqSquad);

    document.querySelector("#expel_btn").removeEventListener("click", expelledStudent);
    document.querySelector(".close").removeEventListener("click", closePopUp);
  }

  function closePopUp() {
    document.querySelector("#pop_up .content").classList.remove("expelled");
    // console.log("Closing the popup and removing events");
    document.querySelector(".close").removeEventListener("click", closePopUp);
    document.querySelector("#pop_up").classList.remove("show");
  }
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
      removePrefect(prefectA);
      makePrefect(selectedStudent);
      buildList();
      closeDialog();
    }

    function clickRemoveB() {
      // else - if removeB
      removePrefect(prefectB);
      makePrefect(selectedStudent);
      buildList();
      closeDialog();
    }
  }

  function removePrefect(studentPrefect) {
    studentPrefect.prefect = false;
  }

  function makePrefect(studentPrefect) {
    studentPrefect.prefect = true;
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
  const filterBy = event.target.dataset.filter;
  const filterType = event.target.dataset.filter_type;
  setFilter(filterBy, filterType);
}

function setFilter(filterBy, filterType) {
  if (filterBy === "true") {
    settings.filterBy = true;
  } else {
    settings.filterBy = filterBy;
  }
  settings.filterType = filterType;
  buildList();
}

function filterList(student) {
  // filteredList = allStudents;
  // console.log("type", settings.filterType, "by", settings.filterBy);
  // console.log(student.prefect);
  // console.log(student[settings.filterType]);

  if (student[settings.filterType] === settings.filterBy || settings.filterBy === "all") {
    return true;
  } else {
    return false;
  }
}

// --------- sorting ---------
// sort allStudents with the correct sort function and put info filteredList
function selectSort(event) {
  const sortBy = event.target.value;
  const sortDir = event.target.dataset.sortDirection;
  console.log(sortDir);

  //find old sortBy element
  // const oldElement = document.querySelector(`[data-sort='${settings.sortBy}']`);
  const oldElement = document.querySelector(`[value="${settings.sortBy}"]`);
  // console.log(oldElement);
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
    // console.log(a[settings.sortBy] < b[settings.sortBy]);
    if (a[settings.sortBy] < b[settings.sortBy]) {
      return -1 * direction;
    } else {
      return 1 * direction;
    }
  }
  return sortedList;
}

function getSelectedList() {
  if (settings.filterType === "expelled") {
    // settings.filterType = "all";
    // settings.filterBy = "all";
    return expelledList;
  } else {
    return allStudents;
  }
}

function buildList() {
  const selectedList = getSelectedList();
  const filteredList = selectedList.filter(filterList);
  const sortedList = sortList(filteredList);
  const searchedList = searchList(sortedList);
  // console.log(searchedList);

  // return sortedList;
  // displayList(currentList);
  displayList(searchedList);
}

function hackTheSystem() {
  console.log("hackTheSystem");
  if (isHacked) {
    console.log("The system is hacked");
  } else {
    document.querySelector("h1").textContent = "Welcome to Pinkwarts Students List";
    document.querySelector("body").style.backgroundColor = "pink";
    document.querySelector("body").style.backgroundImage = "none";
    isHacked = true;
    ruinBlood();
    const mySelf = createMyself();
    allStudents.push(mySelf);
    buildList();
    // console.log(allStudents);
  }
}

function createMyself() {
  const mySelf = Object.create(allStudents);
  mySelf.firstName = "Magnus";
  mySelf.lastName = "Nielsen";
  mySelf.middleName = "Macen";
  mySelf.nickName = `"Hacker"`;
  mySelf.gender = "boy";
  mySelf.imgSrc = "../assets/images/students_img/nielsen_m.jpg";
  mySelf.house = "Gryffindor";
  mySelf.blood = "Muggle";
  mySelf.hacker = true;
  mySelf.id = "777";
  // console.log(mySelf);

  return mySelf;
}

function ruinBlood() {
  allStudents.forEach((student) => {
    const randomNum = Math.floor(Math.random() * 3);
    const randomArr = ["muggle", "half", "pure"];

    if (student.blood === "half" || student.blood === "muggle") {
      student.blood = "pure";
    } else if (student.blood === "pure") {
      student.blood = randomArr[randomNum];
    }
  });
}
