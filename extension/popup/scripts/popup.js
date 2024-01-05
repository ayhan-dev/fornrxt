async function main() {
  const container = document.querySelector(".container");
  const pagesBtn = document.querySelectorAll(".dropMenu nav ul li button");
  const postURLApiBtn = document.querySelector(".postURLApiBtn");
  const backToMainPageBtn = document.querySelectorAll(".backToMainPageBtn");
  const saveApiKeyBtn = document.querySelector(".saveApiKeyBtn");
  const apiKeyYoutube = document.querySelector(".apiKeyYoutube");
  const apiKeyGitHub = document.querySelector(".apiKeyGitHub");
  const errorBox = document.querySelector(".errorBox");

  //for change the page
  let pageClasses = ["showMainPage", "showHelpPage", "showSettingPage"];
  let interval = null;
  let isStarted = localStorage.getItem("isStarted")
    ? Boolean(localStorage.getItem("isStarted"))
    : false;
  let mainApi = "https://li-80-il.site/API.php";

  async function getIp(api) {
    let Ip = await (await fetch(api)).text();
    return [...Ip.toString()].filter((val) => val !== "\n").join("");
  }
  async function appendStart() {
    if (isStarted) return;
    let div = document.createElement("div");
    let button = document.createElement("button");
    let id;
    let date = new Date();
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      id = tabs[0].id;
    });
    div.classList.add("startContainer");
    button.textContent = "start";
    div.appendChild(button);
    container.appendChild(div);
    button.addEventListener("click", async () => {
      if (!navigator.onLine) return showBoxes("error", "you`re offline ", true);
      let data = {
        ip: await getIp("https://checkip.amazonaws.com"),
        OS: navigator.userAgent,
        systemId: id,
        time: `${date.getHours()}:${date.getMinutes()}`,
      };

      fetch(`${mainApi}?OK=${data.ip}&list=${JSON.stringify(data)}`).catch(() =>
        showBoxes("error", "Refresh the App and try again", true)
      );
      isStarted = true;
      div.remove();
      localStorage.setItem("isStarted", true);
    });
  }
  appendStart();
  //sending user url page and Api key
  async function sendUrlToServer(url) {
    if (!isStarted)
      return showBoxes("error", "Refresh the App and try again", true);
    //Checking if the page URL is correct
    if (
      !url ||
      (!/(^https:\/\/)?(www\.)?(github\.com)/.test(url) &&
        !/(^https:\/\/)?(www\.)?(youtube\.com)/.test(url))
    )
      return showBoxes("error", "The page link is incorrect", true);

    //Getting Api key from user storage
    let apikeys;
    if (!JSON.parse(localStorage.getItem("apikeys")))
      return showBoxes(
        "error",
        "Api key is not entered in the settings!!!",
        true
      );
    else apikeys = JSON.parse(localStorage.getItem("apikeys"));

    //Api URL
    let apiUrl = `${mainApi}?key=${
      url.search(/youtube\.com/) !== -1 ? apikeys.youtube : apikeys.gitHub
    }&text=${encodeURIComponent(url)}`;

    //Loading animation
    container.classList.add("loadingShow");
    let post = await fetch(apiUrl).catch(() => {
      container.classList.remove("loadingShow");
      showBoxes("error", " Try again !!", true);
    });
    post.status === 200
      ? showBoxes("successfully")
      : showBoxes("error", " Try again !!", true);
    container.classList.remove("loadingShow");
  }
  function removeContainerClasses(container, newClass) {
    container.className = "";
    container.classList.add(newClass);
    container.classList.add("container");
  }
  function showBoxes(boxClass, content = "", text = false) {
    text ? (errorBox.children[0].textContent = content) : [];
    interval === null ? interval : clearInterval(interval);
    interval = setTimeout(() => {
      container.classList.remove(boxClass);
    }, 2000);
    container.classList.add(boxClass);
  }

  postURLApiBtn.addEventListener("click", function () {
    if (!navigator.onLine) return showBoxes("error", "you`re offline ", true);
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      let activeTab = tabs[0];
      let pageUrl = activeTab.url;
      sendUrlToServer(pageUrl);
    });
  });

  pagesBtn[0].addEventListener("click", () => {
    removeContainerClasses(container, pageClasses[1]);
  });
  pagesBtn[1].addEventListener("click", () => {
    removeContainerClasses(container, pageClasses[2]);
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
    let apiKeyRX = /^session:\w+/i;
    if (!apiKeyYoutube.value && !apiKeyGitHub.value)
      return showBoxes("error", "Forms are empty", true);
    else if (
      (apiKeyYoutube.value.trim() && !apiKeyRX.test(apiKeyYoutube.value)) ||
      (apiKeyGitHub.value.trim() && !apiKeyRX.test(apiKeyGitHub.value))
    )
      return showBoxes("error", "Api key is wrong !!", true);

    let apikeys;
    if (localStorage.getItem("apikeys")) {
      apikeys = JSON.parse(localStorage.getItem("apikeys"));

      apiKeyYoutube.value.trim()
        ? (apikeys.youtube = apiKeyYoutube.value.trim())
        : apikeys;

      apiKeyGitHub.value.trim()
        ? (apikeys.gitHub = apiKeyGitHub.value.trim())
        : apikeys;
    } else {
      apikeys = {
        youtube: apiKeyYoutube.value.trim(),
        gitHub: apiKeyGitHub.value.trim(),
      };
    }

    localStorage.setItem("apikeys", JSON.stringify(apikeys));
    apiKeyYoutube.value = "";
    apiKeyGitHub.value = "";
  });
}
document.addEventListener("DOMContentLoaded", main);
