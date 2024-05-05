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

function searchBook() {
  let eleBookContainer = document.querySelector("#content");
  let eleContainer = document.querySelector(".book-container");
  let eleBooks = document.querySelectorAll(".book");
  let eleSearchButton = document.querySelector(".search-button");
  let elelSearchTerm = document.querySelector(".search-term");
  let eleLoader = document.querySelector("#loader");
  let eleNoResult = document.querySelector("#no-result");

  function initSearch() {
    [...eleBooks].forEach((ele) => {
      ele.style.display = "flex";
    })
  }

  function startSearch() {
    initSearch();
    hideNoResult();
    displayLoader();
    let keywords = elelSearchTerm.value;
    setTimeout(() => displayBook(keywords), 100);
    setTimeout(hideLoader, 100);
  }

  eleSearchButton.addEventListener('pointerdown', () => {
    startSearch();
  })

  document.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
      startSearch();
    }
  })

  function displayLoader() {
    eleLoader.style.display = 'block';
    eleBookContainer.style.filter = 'brightness(0.2)';
  }

  function hideLoader() {
    eleLoader.style.display = 'none';
    eleBookContainer.style.filter = 'brightness(1)';
  }


  function displayNoResult() {
    eleNoResult.style.display = 'block';
  }

  function hideNoResult() {
    eleNoResult.style.display = 'none';
  }

  function displayBook(keywords='') {
    let count = 0;
    Array.from(eleBooks).forEach((ele) => {
      let text = ele.querySelector(".book-name > a").innerText;
      if (text.includes(keywords)) {
        count ++;
      } else {
        ele.style.display = "none";
      }
    })
    if (count === 0) {
      displayNoResult();
    }
    eleContainer.scrollIntoView();
  }
}


function loadCover() {
  let eleBooks = document.querySelectorAll(".show");
  let height = window.innerHeight;
  [...eleBooks].forEach((ele) => {
    let top = ele.getBoundingClientRect().top;
    if (height - top > 100) {
      console.log(top);
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


customScrollbar();
// colorBook();
searchBook();
// loadCover();