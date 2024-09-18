// Create template
const template = document.createElement('template');
template.innerHTML = /*html*/`
<style>
  #upload-button {
    display: flex;
    align-items: center;
    width: 150px;
    height: 150px;
    color: white;
    background-image: linear-gradient(270deg, #03e8fd, #d770ab);
    border: 1px solid #ccc;
    border-radius: 50%;
    box-shadow: 0 0 5px #fff;
    cursor: pointer;
    margin: 10px;
  }

  #upload-button:hover #file-icon {
    opacity: 0.5;
  }

  #upload-button.default #file-icon {
    animation = none;
  }

  #upload-button.loading {
    box-shadow: 0 0 10px #fff;
  }

  #upload-button.loading #file-icon {
    animation-play-state: running;
    opacity: 0.5;
  }

  @keyframes pulse {
    0% { transform: scale(1); }
    12.5% { transform: scale(1.035); }
    25% { transform: scale(1.05); }
    37.5% { transform: scale(1.035); }
    50% { transform: scale(1); }
    62.5% { transform: scale(.965); }
    75% { transform: scale(.95); }
    87.5% { transform: scale(.965); }
    100% { transform: scale(1); }
  }

  #file-icon {
    margin: 0 auto;
    display: block;
    width: 100px;
    height: 100px;
    fill: currentColor;
    overflow: hidden;
    animation-name: pulse;
    animation-duration: 1500ms;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
    transform-origin: 50% 50%;
    animation-play-state: paused;
  }
</style>
<label for="upload" id="upload-button">
  <svg class="default" id="file-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M854.6 288.6L639.4 73.4c-6-6-14.1-9.4-22.6-9.4H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V311.3c0-8.5-3.4-16.7-9.4-22.7zM790.2 326H602V137.8L790.2 326z m1.8 562H232V136h302v216c0 23.2 18.8 42 42 42h216v494z"  /><path d="M544 472c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v108H372c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h108v108c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V644h108c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H544V472z"  />
  </svg>
</label>
<input type="file" id="upload" hidden accept='.pdf,.csv,.doc,.docx,.txt,.png,.jpg'>
`;

class FileUpload extends HTMLElement {
  // credit to: https://muhimasri.com/blogs/finally-a-file-upload-component-that-works-everywhere/
  constructor() {
    // Inititialize custom component
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    // Add event listeners
    this.select('input').onchange = (e) => this.handleChange(e);
  }

  async handleChange(e) {
      this.select('label').className = 'loading';
      this.select("input").disabled = true;
      const response = await createBot(e.target.files);
      this.select('input').value = '';
      this.select('label').className = 'default';
      this.select("input").disabled = false;
      this.broadcast('datacakes-loader-response', response);
  }

  broadcast(event, arg) {
    this.dispatchEvent(new CustomEvent(event, {detail: arg, bubbles: true, composed: true}));
  }

  get select() {
    return this.shadowRoot.querySelector.bind(this.shadowRoot);
  }
}


async function createBot(files) {
  var data = new FormData();

  for (const file of files) {
    data.append('docs[]', file, file.name);
  }

  try {
    const response = await fetch('https://bots1.datacakes.ai/create-docs-bot', {
      method: 'POST',
      body: data
    });

    return response.json();

  } catch (error) {
    console.error(error);
    return {"status": "error", "message": error}
  }
}

window.customElements.define('datacakes-loader', FileUpload);
