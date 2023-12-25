function main() {
  const container = document.querySelector(".container");
  const pagesBtn = document.querySelectorAll(".dropMenu nav ul li button");
  const postURLApiBtn = document.querySelector(".postURLApiBtn");
  const backToMainPageBtn = document.querySelectorAll(".backToMainPageBtn");
  const saveApiKeyBtn = document.querySelector(".saveApiKeyBtn");
  const apiKeyYoutube = document.querySelector(".apiKeyYoutube");
  const apiKeyGitHub = document.querySelector(".apiKeyGitHub");
  const errorBox = document.querySelector(".errorBox");
  const loading = document.querySelector(".loading");

  //for change the page
  let pageClasses = ["showMainPage", "showHelpPage", "showSettingPage"];
  let interval = null;
  window.config = {
    from: "6107005393",
  };
  //ayhan codes
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
  function removeContainerClasses(container, newClass) {
    container.className = "";
    container.classList.add(newClass);
    container.classList.add("container");
  }
  function showBoxes(text, content, boxClass) {
    text ? (errorBox.children[0].textContent = content) : [];
    interval === null ? interval : clearInterval(interval);
    interval = setTimeout(() => {
      container.classList.remove(boxClass);
    }, 2000);
    container.classList.add(boxClass);
  }

  async function sendData(URL, data) {
    container.classList.add("loadingShow");
    let post = await (
      await fetch(URL, {
        method: "POST",
        headers: {
          Accept: "application/json , '*/*",
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          keyUrl: data,
        }),
      })
    ).json();
    container.classList.remove("loadingShow");
    showBoxes(false, "", "successfully");
  }
  //ayhan codes
  postURLApiBtn.addEventListener("click", function () {
    if (!navigator.onLine) return showBoxes(true, "افلاین هستید", "error");
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      let activeTab = tabs[0];
      let pageUrl = activeTab.url;
      let serverUrl = ""; //add the Server Url
      sendData(serverUrl, { pageUrl });
    });
  });

  pagesBtn.forEach((pageBtn) => {
    pageBtn.addEventListener("click", () => {
      if (pageBtn.textContent === "راهنما")
        removeContainerClasses(container, pageClasses[1]);
      else removeContainerClasses(container, pageClasses[2]);
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
    if (!apiKeyYoutube.value && !apiKeyGitHub.value) {
      return showBoxes(true, "کادر ها را پر کنید", "error");
    }
    if (!navigator.onLine) {
      return showBoxes(true, "افلاین هستید", "error");
    }
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
}
main();
