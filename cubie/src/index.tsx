import React from 'react';
// import ReactDOM from 'react-dom';
import ReactDOM from 'react-dom/client';
import './index.css'
import App from './App';

// Define a custom HTML element <react-widget></react-widget>
class ReactWidget extends HTMLElement {
  
  connectedCallback() {
    const cakeId = this.getAttribute('cakeId') || ''
    const cubieAttributes = this.attributes || new NamedNodeMap()

    // Create a shadow root for encapsulating styles
    const mountPoint = document.createElement('div');
    mountPoint.id = 'react-widget-container';
    document.body.appendChild(mountPoint);
    // this.attachShadow({ mode: 'open' }).appendChild(mountPoint);

    const root = ReactDOM.createRoot(mountPoint);
    // root.render(React.createElement(App, props));
    root.render(
      <React.StrictMode>
        <App cakeId={cakeId} cubieAttributes={cubieAttributes}/>
      </React.StrictMode>
    );
    // root.render(React.createElement(App));
    // ReactDOM.render(<App />, mountPoint);
  }
}

// Register the custom element
customElements.define('cubie-widget', ReactWidget);