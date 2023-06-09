const cssContent = `
.my-widget-trigger {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 10px;
  background: #13AA78;
  color: white;
  cursor: pointer;
  border-radius: 5px;
}
.my-widget-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}
.my-widget-overlay .button-close {
  position: absolute;
  top: 20px;
  right: 20px;
  cursor: pointer;
}
.my-widget-overlay iframe {
  width: 80%;
  height: 80%;
}
.my-widget-overlay.hidden {
  display: none;
}`;

const styleElement = document.createElement('style');
styleElement.textContent = cssContent;
document.head.appendChild(styleElement);

// HTML structure for the widget
const htmlContent = `
  <a class="my-widget-trigger" href="#">
    Open My Website
  </a>
  <div class="my-widget-overlay hidden" style="visibility: hidden;">
    <a href="#" class="button-close">
      Close
    </a>
    <iframe id="myWidgetIframe"></iframe>
  </div>
`;

const show = config => {
  let body;
  let widgetIframe = document.getElementById("myWidgetIframe");

  if (!widgetIframe) {
    // convert plain HTML string into DOM elements
    const temporary = document.createElement("div");
    temporary.innerHTML = htmlContent;

    // append elements to body
    body = document.getElementsByTagName("body")[0];
    while (temporary.children.length > 0) {
      body.appendChild(temporary.children[0]);
    }
  }

  // load iFrame
  widgetIframe = document.getElementById("myWidgetIframe");
  widgetIframe.src = config.website_url;

  // activate triggers
  const widgetTrigger = document.getElementsByClassName("my-widget-trigger")[0];
  widgetTrigger.removeEventListener("click", open);
  widgetTrigger.addEventListener("click", open);
};

const open = ev => {
  if (ev) {
    ev.preventDefault();
  }
  const widgetWrapper = document.getElementsByClassName("my-widget-overlay")[0];
  widgetWrapper.classList.add("shown");
  widgetWrapper.classList.remove("hidden");
  widgetWrapper.style.visibility = "visible";
};

const close = ev => {
  if (ev) {
    ev.preventDefault();
  }
  const widgetWrapper = document.getElementsByClassName("my-widget-overlay")[0];
  widgetWrapper.classList.add("hidden");
  widgetWrapper.classList.remove("shown");
  widgetWrapper.style.visibility = "hidden";
};

window.MyWidget = {};
window.MyWidget.open = open;
window.MyWidget.close = close;

const supportedAPI = ["init"]; // enlist all methods supported by API

const app = window => {
  let configurations = {};

  let globalObject = window[window["myWidget"]];
  const queue = globalObject.q;

  if (queue) {
    for (var i = 0; i < queue.length; i++) {
      if (supportedAPI.indexOf(queue[i][0]) !== -1) {
        configurations = extendObject(configurations, queue[i][1]);
      }
    }
  }

  globalObject = apiHandler;
  globalObject.configurations = configurations;

  show(globalObject.configurations);
};

const apiHandler = api => {
  if (!api) throw Error("API method required");

  if (supportedAPI.indexOf(api) === -1)
    throw Error(`Method ${api} is not supported`);

  console.warn(`No handler defined for ${api}`);
};

const extendObject = (a, b) => {
  for (var key in b)
    if (b.hasOwnProperty(key)) a[key] = b[key];
  return a;
};

app(window);
