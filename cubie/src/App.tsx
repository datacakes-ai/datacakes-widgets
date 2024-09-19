import React, { FC, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import MiniApp from './MiniApp';
import { AppContext } from './contexts/AppContext'
import { AppStore } from './stores/AppStore'
import useApp from './hooks/useApp'

const appStore = new AppStore()

interface IApp {
  cakeId: string;
}

const App: FC<IApp> = ({cakeId}) => {
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);

  const handleButtonClick = () => {
    setIsWidgetOpen(!isWidgetOpen);
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
            <button onClick={handleButtonClick} style={buttonStyle}>
              Ask Cubie
            </button>
            {isWidgetOpen && ReactDOM.createPortal(<MiniApp cakeId={cakeId} closeWidget={handleButtonClick} />, document.body)}
          </div>
      </AppContext.Provider>
  );
}

const buttonStyle: React.CSSProperties = {
  position: 'fixed',
  bottom: '20px',
  right: '20px',
  padding: '10px 20px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

export default App;
