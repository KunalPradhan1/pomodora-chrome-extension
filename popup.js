let timer;
let time = 10; // 25 minutes in seconds
var round = 0;
let breakUrl = 'https://www.youtube.com'
let pomtime = 25;
let breaktime = 5;
let workWindowId = null;

function updateTimer() {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  document.getElementById('timer').innerText = `${minutes}:${seconds}`;
}

function startTimer() {
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

document.getElementById('settingForm').addEventListener('submit', function(event) {
  event.preventDefault();
  updateSettings();
  form1 = document.getElementById("settingForm");
  console.log(pomtime);
  console.log(breakUrl);
  form1.style.display = "none";
})




document.getElementById('start').addEventListener('click', startTimer);
document.getElementById('reset').addEventListener('click', resetTimer);
document.getElementById('break').addEventListener('click', breakTimer);
document.getElementById('settings').addEventListener('click',settingsOpen);

updateTimer();