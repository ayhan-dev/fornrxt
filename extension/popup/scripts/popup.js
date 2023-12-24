const dropMenuBtn = document.querySelector(".dropMenuBtn");
const pagesBtn = document.querySelectorAll(".dropMenu nav ul li button");
const postURLApiBtn = document.querySelector(".postURLApiBtn");
const backToMainPageBtn = document.querySelectorAll(".backToMainPageBtn");

//for change the page
let pageClasses = ["showMainPage", "showHelpPage", "showSettingPage"];

window.config = {
  from: "6107005393",
};

function removeContainerClasses(container, newClass) {
  container.className = "";
  container.classList.add(newClass);
  container.classList.add("container");
}
document.addEventListener("DOMContentLoaded", function () {
  postURLApiBtn.addEventListener("click", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      let activeTab = tabs[0];
      let pageUrl = activeTab.url;
      sendUrlToServer(pageUrl);
    });
  });

  function sendUrlToServer(url) {
    let apiUrl =
      "https://devdiwan.com/API.php?api=" +
      config.from +
      "&text=" +
      encodeURIComponent(url);

    fetch(apiUrl, {
      method: "GET",
    })
      .then(function (response) {
        console.log("send url: " + url);
      })
      .catch(function (error) {
        console.error("error send:" + error);
      });
  }
});
pagesBtn.forEach((pageBtn) => {
  pageBtn.addEventListener("click", () => {
    if (pageBtn.textContent === "راهنما")
      removeContainerClasses(
        document.querySelector(".container"),
        pageClasses[1]
      );
    else
      removeContainerClasses(
        document.querySelector(".container"),
        pageClasses[2]
      );
  });
});
backToMainPageBtn.forEach((backBtn) => {
  backBtn.addEventListener("click", () => {
    removeContainerClasses(
      document.querySelector(".container"),
      pageClasses[0]
    );
  });
});
