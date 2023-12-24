const dropMenuBtn = document.querySelector(".dropMenuBtn");
const pagesBtn = document.querySelectorAll(".dropMenu nav ul li button");
const postURLApiBtn = document.querySelector(".postURLApiBtn");
const backToMainPageBtn = document.querySelectorAll(".backToMainPageBtn");
const saveApiKeyBtn = document.querySelector(".saveApiKeyBtn");
const apiKeyYoutube = document.querySelector(".apiKeyYoutube");
const apiKeyGitHub = document.querySelector(".apiKeyGitHub");

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
async function sendData(URL, data) {
  let post = await (
    await fetch(URL, {
      method: "POST",
      headers: {
        Accept: "application/json , '*/*",
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        apiKeys: data,
      }),
    })
  ).json();
  console.log(post);
}
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

saveApiKeyBtn.addEventListener("click", (e) => {
  e.preventDefault();
  let ApiServers;
  let apikey = {
    youTube: apiKeyYoutube.value,
    gitHub: apiKeyGitHub.value,
  };
  let URLServer = "https://jsonplaceholder.typicode.com/posts";
  localStorage.getItem("ApiServers")
    ? (ApiServers = JSON.parse(localStorage.getItem("ApiServers")))
    : (ApiServers = {
        youTube: [],
        gitHub: [],
      });
  if (apiKeyYoutube.value || apiKeyGitHub.value) {
    if (apiKeyYoutube.value) {
      ApiServers.youTube.push(apiKeyYoutube.value);
      localStorage.setItem("ApiServers", JSON.stringify(ApiServers));
    }
    if (apiKeyGitHub.value) {
      ApiServers.gitHub.push(apiKeyGitHub.value);
      localStorage.setItem("ApiServers", JSON.stringify(ApiServers));
    }
  }
  apiKeyYoutube.value = "";
  apiKeyGitHub.value = "";
  sendData(URLServer, apikey);
});
