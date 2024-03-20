// background.js
function initializeBackground() {
  // Your existing initialization logic goes here
  let timer;
let time = 1500; // 25 minutes in seconds
var round = 0;
let breakUrl = 'https://www.youtube.com'
let pomtime = 1500;
let breaktime = 300;
let workWindowId = null;





  document.getElementById('settingForm').addEventListener('submit', function(event) {
    event.preventDefault();
    updateSettings();
    let form1 = document.getElementById("settingForm");
    console.log(pomtime);
    console.log(breakUrl);
    form1.style.display = "none";
  });
  // Your other script logic goes here
  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
  }
  
  function updateTimer() {
    document.getElementById('timer').innerText = formatTime(time);
  }
  function startTimer() {
    console.log("Recieved start");
    time = pomtime;
    if(workWindowId === null)
    {
      createWorkWindow();
    }
    else{
      chrome.windows.get(workWindowId, {}, function(existingWindow) {
        if (chrome.runtime.lastError || !existingWindow) {
          // Error occurred or window not found, tab has been closed
          createWorkWindow(); // Create a new window
        } else {
          // Window found, bring it to focus
          chrome.windows.update(workWindowId, { focused: true });
        }
      });
    }
    
    if (!timer) {
      timer = setInterval(function() {
        if (time > 0) {
          time--;
          updateTimer();
        } else {
          clearInterval(timer);
          timer = null;
          round ++;
          document.getElementById('start').style.display = 'none';
          document.getElementById('reset').style.display = 'none';
          document.getElementById('break').style.display = 'block';
          alert('Pomodoro complete! Round: ' + round);
        }
      }, 1000);
    }
  }
  
  function startTimerBreak() {
    if (!timer) {
      timer = setInterval(function() {
        if (time > 0) {
          time--;
          updateTimer();
        } else {
          clearInterval(timer);
          timer = null;
          document.getElementById('start').style.display = 'block';
          document.getElementById('reset').style.display = 'block';
          document.getElementById('break').style.display = 'none';
          alert('Break Over!');
          closeChromeWindow(windowId);
        }
      }, 1000);
    }
  }
  
  function resetTimer() {
    console.log('reset button clicked');
    clearInterval(timer);
    timer = null;
    time = pomtime;
    updateTimer();
  }
  
  function breakTimer() {
    clearInterval(timer);
    timer = null;
    time = breaktime; // 5 minutes in seconds
    updateTimer();
    createWindow();
    startTimerBreak();
  }
  
  function createWindow() {
    chrome.windows.create({
      type: 'normal', // Specify the window type
      url: breakUrl, // Replace with the URL you want to open
      state: 'maximized' // You can customize the window state
    }, function(window) {
      windowId = window.id; // Store the window ID
    });
  
  }
  
  function createWorkWindow() {
    chrome.windows.create({
      type: 'normal', // Specify the window type
      url: 'https://www.google.com', // Replace with the URL you want to open
      state: 'maximized' // You can customize the window state
    }, function(window) {
      workWindowId = window.id; // Store the window ID
    });
  
  }
  
  
  function closeChromeWindow(windowId) {
    chrome.windows.remove(windowId, function() {
      console.log('Window closed successfully.');
    });
  }
  
  function settingsOpen() {
    console.log('Settings button clicked');
    var form1 = document.getElementById("settingForm");
    if (form1.style.display === "block") {
      console.log('Form is currently visible. Hiding...');
      form1.style.display = "none";
    } else {
      console.log('Form is currently hidden. Showing...');
      form1.style.display = "block";
    }
  }
  
  function updateSettings() {
    pomtime = document.getElementById('pomtime').value * 60;
    breaktime = document.getElementById('breaktime').value * 60;
    breakUrl = document.getElementById('breakpage').value;
    updateTimer();
  
  
  }

  updateTimer();
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'startTimer') {
      console.log("Received startTimer message");
      startTimer();
    } else if (request.action === 'resetTimer') {
      console.log("Received resetTimer message");
      resetTimer();
    } else if (request.action === 'breakTimer') {
      console.log("Received breakTimer message");
      breakTimer();
    } else if (request.action === 'settingsOpen') {
      console.log("Received settingsOpen message");
      settingsOpen();
    }
    // Add more actions if needed...
  
    // Send a response if required
    // sendResponse({ status: 'Message received' });
  });


console.log("background.js is loaded")



  
  

  // Notify the popup script that the background has been initialized
  chrome.runtime.sendMessage({ message: 'backgroundInitialized' });
  console.log('Background script initialized');
}

// Listen for messages from the popup to trigger initialization
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === 'popupLoaded') {
    initializeBackground();
  }
});


















