import { metadata, textdata } from "./data.js";

let bookdata = textdata;
let bookAmount = bookdata.length;
let loadAmount = 0;

function customScrollbar() {
  let {
      OverlayScrollbars,
      ScrollbarsHidingPlugin,
      SizeObserverPlugin,
      ClickScrollPlugin
  } = OverlayScrollbarsGlobal;
  OverlayScrollbars(document.querySelector('#content'), {
      overflow: {
          x: 'hidden',
      },
  });
}

function colorBook() {
  let eleBookcontainer = document.querySelector(".book-container");
  let rows = window.getComputedStyle(eleBookcontainer).getPropertyValue('grid-template-rows').split(" ").length;
  let columns = window.getComputedStyle(eleBookcontainer).getPropertyValue('grid-template-columns').split(" ").length;
  let colorArray = [];
  for (let i=0; i<rows; i++) {
    colorArray.push(chroma.random().brighten(2));
  }
  let eleBooks = document.querySelectorAll(".show");
  [...eleBooks].forEach((ele, index) => {
    ele.style.background = colorArray[Math.floor(index / columns)];
  })
}

function initSearch() {
  let eleContainer = document.querySelector(".book-container");
  while (eleContainer.firstChild) {
    eleContainer.removeChild(eleContainer.firstChild);
  }
  eleContainer.scrollIntoView();
  hideNoResult();
}

function searchBook() {
  let elelSearchTerm = document.querySelector(".search-term");
  let searchResult = [];
  let searchTerm = elelSearchTerm.value;
  textdata.forEach((data) => {
    if (data.file_name.includes(searchTerm) || data.file_tag.includes(searchTerm)) {
      searchResult.push(data);
    }
  })
  if (searchResult.length === 0) {
    displayNoResult();
  }
  bookdata = searchResult;
  bookAmount = bookdata.length;
  loadAmount = 0;
}


function displayNoResult() {
  let eleNoResult = document.querySelector("#no-result");
  eleNoResult.style.display = 'block';
}

function hideNoResult() {
  let eleNoResult = document.querySelector("#no-result");
  eleNoResult.style.display = 'none';
}


function loadCover() {
  let eleBooks = document.querySelectorAll(".show");
  let height = window.innerHeight;
  [...eleBooks].forEach((ele) => {
    let top = ele.getBoundingClientRect().top;
    if (height - top > 100) {
      let eleImg = ele.querySelector("img");
      let cover_url = eleImg.getAttribute("data-url");
      fetch(cover_url, {
        "referrer": "https://basic.smartedu.cn/"
      }).then(res => {
        return res.blob();
      }).then(blob => {
        let imgSrc = URL.createObjectURL(blob);
        eleImg.src = imgSrc;
      })
    }
  })
}


function loadBook(n=10) {
  let eleContainer = document.querySelector(".book-container");
  function createElement(imgUrl, fileUrl, fileName) {
    let eleBook = document.createElement("div");
    eleBook.classList.add("book");
    eleBook.classList.add("show");
    let eleBookCover = document.createElement("div");
    eleBookCover.classList.add("book-cover");
    let eleImg = document.createElement("img");
    eleImg.setAttribute("referrerpolicy", "no-referrer");
    eleImg.setAttribute("loading", "lazy");
    eleImg.src = imgUrl;
    eleBookCover.appendChild(eleImg);
    eleBook.appendChild(eleBookCover);
    let eleBookName = document.createElement("div");
    eleBookName.classList.add("book-name");
    let eleA = document.createElement("a");
    eleA.href = fileUrl;
    eleA.setAttribute("target", "_blank");
    eleA.setAttribute("rel", "noopener noreferrer");
    eleA.innerText = fileName;
    eleBookName.appendChild(eleA);
    eleBook.appendChild(eleBookName);
    eleContainer.appendChild(eleBook);
  }
  if (loadAmount < bookAmount) {
    for (let i=0; i<n; i++) {
      let imgUrl = bookdata[loadAmount].file_cover_url;
      let fileUrl = metadata.prefix + bookdata[loadAmount].file_id + metadata.suffix;
      let fileName = bookdata[loadAmount].file_name + "-" + bookdata[loadAmount].file_tag;
      createElement(imgUrl, fileUrl, fileName);
      loadAmount ++;
      if (loadAmount === bookAmount) {
        break;
      }
    }
  }
}

function listener() {
  let eleSearchButton = document.querySelector(".search-button");
  eleSearchButton.addEventListener("pointerdown", () => {
    initSearch();
    searchBook();
    loadBook(30);
  });

  document.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
      initSearch();
      searchBook();
      loadBook(30);
    }
  })

  window.addEventListener("wheel", () => {
    let eleLastBook = document.querySelector(".book:last-child");
    let eleLastBookTop = eleLastBook.getBoundingClientRect().top;
    let windowHeight = window.innerHeight;
    if (eleLastBookTop - windowHeight < 0) {
      loadBook();
    }
  })
}


customScrollbar();
loadBook(30);
listener();