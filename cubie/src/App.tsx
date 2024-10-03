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
  const buttonColor = cubieAttributes?.getNamedItem('buttonColor') ? cubieAttributes.getNamedItem('buttonColor')?.value : "#fb56c00"
  const buttonText = cubieAttributes?.getNamedItem('buttonText') ? cubieAttributes.getNamedItem('buttonText')?.value : "Ask Cubie"

  const handleButtonClick = () => {
    setIsWidgetOpen(!isWidgetOpen);
  };

  const defaultButtonStyle: React.CSSProperties = {
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
  };
  
  useEffect(() => {
    if (cakeId) {
      appStore.setCakeId(cakeId);
      appStore.updateSources();
    }
  }, [cakeId, appStore])

  return (
      <AppContext.Provider value={appStore}>
          <div>
            <button onClick={handleButtonClick} style={defaultButtonStyle}>
              {buttonText}
            </button>
            {isWidgetOpen && ReactDOM.createPortal(<MiniApp cakeId={cakeId} closeWidget={handleButtonClick} cubieAttributes={cubieAttributes}/>, document.body)}
          </div>
      </AppContext.Provider>
  );
}


export default App;
