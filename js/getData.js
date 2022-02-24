`use strict`;

document.addEventListener("DOMContentLoaded", setup);

const HTML = {};

function setup() {
  // console.log("setup");
  HTML.urlList = "https://petlatkea.dk/2021/hogwarts/students.json";
  HTML.urlBlood = "https://petlatkea.dk/2021/hogwarts/families.json";
}

async function getData() {
  // const response = await fetch(HTML.urlListst);
  // const jsonData = await response.json();
  // console.log(jsonData);
  jsonData = "Hey";
  return jsonData;
  // prepareObjects(jsonData);
}

export default getData;
