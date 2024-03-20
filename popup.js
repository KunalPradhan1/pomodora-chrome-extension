document.addEventListener('DOMContentLoaded', function () {
  chrome.runtime.sendMessage({ message: 'popupLoaded' });
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === 'backgroundInitialized') {
    // Your existing popup script logic goes here
    document.getElementById('start').addEventListener('click', function() {
      chrome.runtime.sendMessage({ action: 'startTimer' });
      console.log("start hit");
    });

    document.getElementById('reset').addEventListener('click', function() {
      chrome.runtime.sendMessage({ action: 'resetTimer' });
      console.log("reset hit");
    });

    document.getElementById('break').addEventListener('click', function() {
      chrome.runtime.sendMessage({ action: 'breakTimer' });
      console.log("break hit");
    });

    document.getElementById('settings').addEventListener('click', function() {
      chrome.runtime.sendMessage({ action: 'settingsOpen' });
      console.log("settings hit");
    });

    // Your other popup script logic goes here

    console.log("popup.js is loaded");
    chrome.runtime.sendMessage({message: 'DOMContentLoaded'});
  }
});
