chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.windows.create({
    url: chrome.runtime.getURL("analyse.html"),
    type: "popup",
    width: 1200,
    height: 800
  });
});
