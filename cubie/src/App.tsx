import React, { FC, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import MiniApp from './MiniApp';
import { AppContext } from './contexts/AppContext'
import { AppStore } from './stores/AppStore'
import useApp from './hooks/useApp'

const appStore = new AppStore()

interface IApp {
  cakeId: string;
  cubieAttributes: NamedNodeMap;
}


const App: FC<IApp> = ({cakeId, cubieAttributes}) => {
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);
  const [buttonText, setButtonText] = useState<string>("Ask Cubie")

  const buttonCSS = (buttonColor='#fb6c00'): React.CSSProperties => {
    return {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      padding: '10px 20px',
      background: buttonColor,
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      zIndex: '999'
    }
  }
  const [buttonStyle, setButtonStyle] = useState<React.CSSProperties>(buttonCSS())
  
  const handleButtonClick = () => {
    setIsWidgetOpen(!isWidgetOpen);
  };

  useEffect(() => {
    if (cubieAttributes.getNamedItem('buttonColor')?.value) {
      setButtonStyle(buttonCSS(cubieAttributes.getNamedItem('buttonColor')?.value || '#fbc600'))
    }
    if (cubieAttributes.getNamedItem('buttonText')?.value) {
      setButtonText(cubieAttributes.getNamedItem('buttonText')?.value || "Ask Cubie")
    }
  }, [])

  useEffect(() => {
    if (cakeId) {
      appStore.setCakeId(cakeId);
      appStore.updateSources();
    }
  }, [cakeId, appStore])

  return (
      <AppContext.Provider value={appStore}>
          <div>
            <button onClick={handleButtonClick} style={buttonStyle}>
              {buttonText}
            </button>
            {isWidgetOpen && ReactDOM.createPortal(<MiniApp cakeId={cakeId} closeWidget={handleButtonClick} cubieAttributes={cubieAttributes}/>, document.body)}
          </div>
      </AppContext.Provider>
  );
}


export default App;
