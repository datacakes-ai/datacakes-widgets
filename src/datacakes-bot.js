import '@speechly/browser-ui/core/push-to-talk-button';
import Chart from 'chart.js/auto';


const createStyle = () => {
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    main {
      margin: 0 auto;
      position: relative;
      max-width: 800px;
    }

    #containerQuestion {
      display: flex;
      flex-direction: row;
      width: 100%;
      margin: 0 0 0 0;
      position: relative;
    }

    #input {
      width: 100%;
      font-family: Verdana;
      font-size: 1.5rem;
      border: 1px solid #ccc;
      padding: 0.5rem 3rem 0.5rem 3rem;
      border-radius: 100px; /*sufficiently large so it's circlular*/
      box-shadow: 0 0 5px #fff;
      background-color: #fff;
    }

    #input:focus {
      outline: none !important;
      box-shadow: 0 0 10px #fff;
    }

    ::placeholder {
      color: #aaa;
      opacity: 1;
    }

    .startAdornment {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      color: #aaa;
      padding: 0.5rem;
      font-size: 1.75rem;
    }

    .endAdornment {
      position: absolute;
      right: 0.1rem;
      top: 0;
      bottom: 0;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      color: #aaa;
      padding: 0rem;
    }

    #containerAnswer {
      display: none;
      border: 1px solid #ccc;
      background-color: rgb(30,121,141);
      border-radius: 2rem;
      width: 100%;
      text-align: left;
      padding: 10px 24px;
      margin: 5px 0 0 0;
      -moz-box-sizing: border-box;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      position: absolute;
      z-index: 10;
    }

    #div-question {
      padding: 10px 0px;
    }

    #question {
      display: block;
      font-size: 18px;
      font-family: Verdana;
      font-weight: normal;
      font-style: normal;
      color: #fff;
      line-height: 1.2;
    }

    #div-thoughts {
      display: flex;
      padding: 5px;
      border-radius: 10px;
      border: 1px;
      background-color: rgb(20,100,120);
    }

    #thoughts {
      font-size: 16px;
      font-family: Verdana;
      font-weight: normal;
      font-style: normal;
      color: #ccc;
      line-height: 1.1;
      overflow: scroll;
      max-height: 300px;
    }

    #div-answer {
      display: flex;
      padding: 10px 0px;
    }

    #answer-text {
      font-size: 18px;
      font-family: Verdana;
      font-weight: normal;
      font-style: normal;
      color: #fff;
      line-height: 1.2;
    }

    #answer-table {
      margin: 0 auto;
      font-size: 18px;
      font-family: Verdana;
      font-weight: normal;
      font-style: normal;
      color: #fff;
      line-height: 1.2;
    }

    table {
      border-collapse: collapse;
      width: 100%;
    }

    th, td {
      border: 1px solid #ccc;
      border-radius: 10px;
      padding: 8px;
      text-align: left;
      background-color: rgb(40,140,160);
    }

    th {
      background-color: rgb(20,100,120);
    }

    #answer-chart {
      width: 100%;
      background-color: #fff;
      margin: 10px auto;
      display: none;
      padding: 5px;
      border-radius: 5px;
    }
    
    #answer-tools {
      margin-left: auto;
    }

    #answer-flag {
      display: flex;
      align-items: center;
      justify-content: center;
      transform: rotate(90deg);
      height: 25px;
      width: 25px;
      color: #ccc;
      border-radius: 100px; /* large enough */
      border: 1px solid #ccc;
      font-size:16px;
      font-weight: normal;
      font-style: italic; /* so the mouth is crooked */
      cursor: pointer;
    }

    #answer-flag:hover {
      background-color: #FA9137;
      border: #FA9137;
      color: rgb(30,121,141);
    }

    #answer-flag.flagged {
      cursor: default;
      background-color: rgb(30,121,141);
      border: 1px solid #FA9137;
      color: #FA9137;
    }

    #error {
      display: block;
      font-size: 18px;
      font-family: Verdana;
      font-weight: normal;
      font-style: normal;
      color: #eed45d;
      line-height: 1.2;
    }
    .QCzoEc {
      display: inline-block;
      margin-top: 3px;
      color: #9aa0a6;
      position: relative;
    }
    
    #div-collapser {
      cursor: pointer
    }

    #collapser {
      margin: 0 auto;
      display: block;
      width: 20px;
      fill: none;
      stroke: #fff;
      stroke-width: 10px;
      stroke-linejoin: round;
    }

    #div-collapser:hover #collapser {
      fill: #fff;
    }

    #div-loader {
      text-align: center;
      padding: 5px 0px;
    }

  `;

  return styleElement;
};

const createBot = () => {
  const div = document.createElement('main');
  const html = `
    <div id="containerQuestion">
      <input id="input" type="text" placeholder="Ask the bot..." autofocus>
      <div class="startAdornment">
      <span class="QCzoEc" style="height:2rem;line-height:20px;width:2rem"><svg focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path></svg></span>
      </div>
      <push-to-talk-button id="microphoneButton" size="2.8rem" class="endAdornment" fontsize="0.90rem" backgroundcolor="#104864" intro="Tap or hold for voice search" showtime="30000" appid="f6682864-81dd-4e5c-baf6-b4ef92cd89f5"/>
    </div>
    <div id="containerAnswer">
      <div id="div-error">
        <span id="error"></span>
      </div>
      <div id="div-question">
        <div id="question"></div>
      </div>
      <div id="div-thoughts">
        <div id="thoughts"></div>
      </div>
      <div id="div-answer">
        <div id=div-answer-content">
          <div id="answer-text"></div>
          <div id="answer-table"></div>
          <canvas id="answer-chart"></canvas>
        </div>
        <div id="answer-tools">
          <div id="answer-flag"><span>=(</span></div>
        </div>
      </div>
      <div id="div-loader">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          width="150px"
          height="45px"
          viewBox="0 0 100 30"
          preserveAspectRatio="xMidYMid"
        >
          <g transform="translate(20 15)">
            <circle cx="0" cy="0" r="6" fill="#e15b64">
              <animateTransform
                attributeName="transform"
                type="scale"
                begin="-0.375s"
                calcMode="spline"
                keySplines="0.3 0 0.7 1;0.3 0 0.7 1"
                values="0;1;0"
                keyTimes="0;0.5;1"
                dur="1s"
                repeatCount="indefinite"
              ></animateTransform>
            </circle>
          </g>
          <g transform="translate(40 15)">
            <circle cx="0" cy="0" r="6" fill="#f8b26a">
              <animateTransform
                attributeName="transform"
                type="scale"
                begin="-0.25s"
                calcMode="spline"
                keySplines="0.3 0 0.7 1;0.3 0 0.7 1"
                values="0;1;0"
                keyTimes="0;0.5;1"
                dur="1s"
                repeatCount="indefinite"
              ></animateTransform>
            </circle>
          </g>
          <g transform="translate(60 15)">
            <circle cx="0" cy="0" r="6" fill="#abbd81">
              <animateTransform
                attributeName="transform"
                type="scale"
                begin="-0.125s"
                calcMode="spline"
                keySplines="0.3 0 0.7 1;0.3 0 0.7 1"
                values="0;1;0"
                keyTimes="0;0.5;1"
                dur="1s"
                repeatCount="indefinite"
              ></animateTransform>
            </circle>
          </g>
          <g transform="translate(80 15)">
            <circle cx="0" cy="0" r="6" fill="#81a3bd">
              <animateTransform
                attributeName="transform"
                type="scale"
                begin="0s"
                calcMode="spline"
                keySplines="0.3 0 0.7 1;0.3 0 0.7 1"
                values="0;1;0"
                keyTimes="0;0.5;1"
                dur="1s"
                repeatCount="indefinite"
              ></animateTransform>
            </circle>
          </g>
        </svg>
      </div>
      <div id="div-collapser"><svg xmlns="http://www.w3.org/2000/svg" id="collapser" viewBox="0 0 320 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M182.6 137.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-9.2 9.2-11.9 22.9-6.9 34.9s16.6 19.8 29.6 19.8H288c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-128-128z"/></svg></div>
    </div>
  `;
  div.innerHTML = html;
  return div;
};

class Bot extends HTMLElement {
  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: 'open' });
    this._shadow.appendChild(createStyle());
    this._shadow.appendChild(createBot());

    this._chatHistory = [];
    this.input = '';
    this.question = '';
    this.answerText = '';
    this.answerData = [];
    this.thoughtsText = '';
    this.error = '';
    this.query_id = null;
    this.baseURL = 'https://bots1.datacakes.ai';
    this.baseURL = 'http://localhost:5000';
    this._flagged = false;
    this._collapsed = true;
    this._chart = null;
  }

  connectedCallback() {
    this._shadow
      .getElementById('input')
      .addEventListener('focus', e => {
        this._collapsed = false;
        this.render();
      });

    this._shadow
      .getElementById('div-collapser')
      .addEventListener('click', e => {
        this._collapsed = true;
        this.render();
      });

    this._shadow
      .getElementById('answer-flag')
      .addEventListener('click', e => {
          this.handleClickFlag();
      });

    this._shadow
      .getElementById('microphoneButton')
      .addEventListener('speechsegment', e => {
        this.input = e.detail.words
          .filter(w => w.value)
          .map(w => w.value.toLowerCase())
          .join(' ')
          .trim();

        if (e.detail.isFinal) {
          this.handleRequest();
        }
      });

    this._shadow.getElementById('input').addEventListener('keyup', e => {
      this.input = this._shadow.getElementById('input').value.trim();
      if (e.key === 'Enter' && this.input.length) {
        this.handleRequest();
      }
    });
  }

  async checkBotExists(botId) {
    if (botId.trim() === '' | botId == null | botId === 'null') {
      this._botExists = false;
    } else {
      this._botExists = (await checkBotExists(this.baseURL, botId)).status === 'ok'? true: false;
      this.broadcast('datacakes-bot-loaded');
    }
  }

  async handleClickFlag() {
    if (this._flagged == false) {
      this._flagged = true;
      this.render();
      const response = await flagAnswer(this.baseURL, this.botId, this.queryId);
    }
  }

  async handleRequest() {
    if (this._botExists) {
      this.question = this.input;
      this.thoughtsText = '';
      this.answerText = '';
      this.answerData = [];
      this.error = '';
      this._thinking = true;
      this.render();

      const sseChannel = Math.random().toString(36).slice(2);
      const sseSource = new EventSource(this.baseURL + '/subscribe/' + sseChannel);
      /* Need to bind "handleSSE" to the _widget_ ("this"), else
       * the "this" within handleSSE will refer to the EventSource object
       * (which has no access to, say, thoughtsText).
       * Source: https://trekinbami.medium.com/its-not-magic-using-bind-in-javascript-18834e95cd8e
      */
      sseSource.addEventListener('message', this.handleSSE.bind(this));

      const response = await fetchAnswer(
          this.baseURL, this.botId, this.input,
          this.chatHistory, sseChannel);
      sseSource.close();
      this._thinking = false;
      this._collapsed = false;

      if (response.status == 'ok') {
        this.input = '';
        this.answerText = response.data.answer.trim();
        this.queryId = response.query_id;
        this.answerData = response.data.data ?? [];
        this.error = '';
        this.chatHistory = [this.question, this.answerText];
      } else if (response.status == 'error') {
        this.input = '';
        this.question = '';
        this.answerText = '';
        this.queryId = null;
        this.error = "I'm overwhelmed! Try reloading....";
      }
    } else {
      this.input = '';
      this.question = '';
      this.answerText = '';
      this.error = `Bot ${this.botId} was not found.`;
      this.queryId = null;
    }
    this._flagged = false;

    this.render();
  }

  handleSSE(event) {
    this.thoughtsText += JSON.parse(event['data'])['text'];
    this.render();
  }

  static get observedAttributes() {
    return ['bot-id', 'question'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'bot-id') {
      this.input = '';
      this.question = '';
      this.answerText = '';
      this.error = '';
      this._chatHistory = []; // yes, the private variable.
      this.botId = newValue;
      this.render();
    } else if (name === 'question') {
      this.input = newValue;
      this.handleRequest();
    }
  }

  set botId(value) {
    this._botId = value;
    // Need to send this._botId, not this.botId, since
    // the latter is updated only _after_ "set botId()" returns.
    this.checkBotExists(this._botId);
  }

  broadcast(event) {
    this.dispatchEvent(new CustomEvent(event, {bubbles: true, composed: true}));
  }

  get botId() {
      return this._botId;
  }

  set chatHistory(qa) {
    const max_length = 10;
    this._chatHistory.push(qa);
    this._chatHistory.splice(0, this._chatHistory.length - max_length);
  }

  get chatHistory() {
    return this._chatHistory;
  }

  render() {
    this._shadow.getElementById('div-loader').style.display = this._thinking?'block':'none';

    this._shadow.getElementById('input').value = this.input;

    /* FLAGGED */
    if (this._flagged) {
        this._shadow.getElementById('answer-flag').className = 'flagged';
    } else {
        this._shadow.getElementById('answer-flag').classList.remove('flagged');
    }

    /* RESPONSE CONTAINER */
    if (
        this._thinking ||
        (!this._collapsed &&
            (this.question.trim().length
                || this.answerText.trim().length
                || this.answerData.length
                || this.error.length)
        )
    ) {
      this._shadow.getElementById('containerAnswer').style.display = 'block';
    } else {
      this._shadow.getElementById('containerAnswer').style.display = 'none';
    }

    /* THINKING */
    if (this._thinking) {
      this._shadow.getElementById('div-collapser').style.display = 'none';
    } else {
      this._shadow.getElementById('div-collapser').style.display = 'block';
    }
    
    /* QUESTION */
    if (this.question.trim().length) {
      this._shadow.getElementById('div-question').style.display = 'block';
      this._shadow.getElementById('question').innerText = 'Q: ' + this.question;
    } else {
      this._shadow.getElementById('div-question').style.display = 'none';
    }

    /* THOUGHTS */
    if (this.thoughtsText.trim().length) {
      this._shadow.getElementById('div-thoughts').style.display = 'block';
      const thoughts = this._shadow.getElementById('thoughts')
      thoughts.innerHTML = '<pre>' + this.thoughtsText + '</pre>';
      thoughts.scrollTop = thoughts.scrollHeight;
    } else {
      this._shadow.getElementById('div-thoughts').style.display = 'none';
    }

    /* ANSWER */
    if (this.answerText.trim().length || this.answerData.length) {
      this._shadow.getElementById('div-answer').style.display = 'flex';
      if (this.answerText.length) {
        this._shadow.getElementById('answer-text').innerText = 'A: ' + this.answerText;
      }

      if (this.answerData.length) {
        drawTable(this._shadow.getElementById('answer-table'), this.answerData);
      } else {
        this._shadow.getElementById('answer-table').style.display = 'none';
      }

      if (this.answerChartData) {
        if (this._chart != null) {
          this._chart.destroy();
        }
        const canvas = this._shadow.getElementById('answer-chart');
        canvas.style.display = 'block';

        this._chart = drawChart(canvas.getContext('2d'), this.answerData);
      } else {
        this._shadow.getElementById('answer-chart').style.display = 'none';
      }

        
    } else {
      this._shadow.getElementById('div-answer').style.display = 'none';
    }

    /* ERROR */
    if (this.error.length) {
      this._shadow.getElementById('div-error').style.display = 'block';
      this._shadow.getElementById('error').innerText = this.error;
    } else {
      this._shadow.getElementById('div-error').style.display = 'none';
    }
  }
}

function drawTable(tableContainer, jsonData) {


  // Create the table dynamically
  var table = document.createElement("table");
  tableContainer.appendChild(table);

  // Create table header
  var thead = document.createElement("thead");
  table.appendChild(thead);

  var headerRow = document.createElement("tr");
  thead.appendChild(headerRow);

  // Get the keys from the first object to create table headers
  var keys = Object.keys(jsonData[0]);
  keys.forEach(function(key) {
      var th = document.createElement("th");
      th.textContent = key;
      headerRow.appendChild(th);
  });

  // Create table body
  var tbody = document.createElement("tbody");
  table.appendChild(tbody);

  // Loop through the JSON data and create table rows
  jsonData.forEach(function(obj) {
    var row = document.createElement("tr");

    keys.forEach(function(key) {
      var cell = document.createElement("td");
      cell.textContent = obj[key];
      row.appendChild(cell);
    });

    tbody.appendChild(row);
  });
}

function drawChart(ctx, data) {
  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data["x"],
      datasets: [{
        label: data["y_label"],
        data: data["y"],
        backgroundColor: 'rgb(30,121,141)',
        borderWidth: 1
      }]  
    },  
    options: {
      scales: {
        y: {
          beginAtZero: true
        }   
      }   
    }   
  }); 
}


async function checkBotExists(base_url, bot_id) {
  const response = await fetch(`${base_url}/bot/${bot_id}`, {
    method: 'GET'
  });

  return response.json()
}


async function fetchAnswer(base_url, bot_id, q, chat_history, sse_channel) {
  const query_id = Math.random().toString(36).slice(2);
  const response = await fetch(`${base_url}/bot/${bot_id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(
        { q: q, chat_history: chat_history, sse_channel: sse_channel, query_id: query_id }),
  });

  return response.json();
}

async function flagAnswer(base_url, bot_id, query_id) {
  const response = await fetch(`${base_url}/bot/${bot_id}/flag`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query_id: query_id }),
  });

  return response.json();
}

customElements.define('datacakes-bot', Bot);
