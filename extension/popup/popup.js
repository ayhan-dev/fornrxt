document.addEventListener("DOMContentLoaded", function () {
  var copyButton = document.getElementById("copyButton");
  copyButton.addEventListener("click", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var activeTab = tabs[0];
      var pageUrl = activeTab.url;
      sendUrlToServer(pageUrl);
    });
  });

  function sendUrlToServer(url) {
    var apiUrl = "https://devdiwan.com/API.php?text=" + encodeURIComponent(url);

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
