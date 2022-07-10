const setPageBackgroundColor = (duration) => {
  const refreshButton = document.querySelector(
    '[aria-label="refresh investments"]'
  );

  if (refreshButton.getAttribute("data-on") === "true") {
    return "Already added refresher!!";
  }

  const REFRESH_INTERVAL = 10000;
  const refreshAction = (refreshButton) => {
    refreshButton.click();
  };
  const getRefreshInterval = () => duration * 1000 || REFRESH_INTERVAL;

  const interval = setInterval(
    refreshAction.bind(null, refreshButton),
    getRefreshInterval()
  );
  refreshButton.setAttribute("data-on", true);
  return interval ? "Congrats!! Enabled auto refresh" : "Some error occurred";
};

const refreshListener = async () => {
  const duration = document.getElementById("intervalDuration").value;

  if (+duration < 5) {
    alert("Minimum 5 seconds refresh interval required");
    return;
  }

  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  const interValSuccessCb = (msg) => {
    const formContainer = document.getElementById("formContainer");
    formContainer.innerHTML = `<h4 class="msg">${msg}<h4>`;
  };

  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      args: [+duration],
      func: setPageBackgroundColor,
    },
    (res) => {
      interValSuccessCb(res[0].result);
    }
  );
};

const init = () => {
  console.log(window.location.href);
  const startButton = document.getElementById("intervalSubmit");
  startButton.addEventListener("click", refreshListener);
};

init();
