import React, { FC, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import MiniApp from './MiniApp';
import { AppContext } from './contexts/AppContext'
import { SettingsContext } from './contexts/SettingsContext'
import { UserContext } from './contexts/UserContext'
import { AppStore } from './stores/AppStore'
import { SettingsStore } from './stores/SettingsStore'
import { UserStore } from './stores/UserStore'

const userStore = new UserStore()
const appStore = new AppStore()
const settingsStore = new SettingsStore(appStore)

interface IApp {
  cakeId: string;
}

const App: FC<IApp> = ({cakeId}) => {
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);

  const handleButtonClick = () => {
    setIsWidgetOpen(!isWidgetOpen);
  };

  return (
    <UserContext.Provider value={userStore}>
      <AppContext.Provider value={appStore}>
        <SettingsContext.Provider value={settingsStore}>
          <div>
            <button onClick={handleButtonClick} style={buttonStyle}>
              Open Widget
            </button>
            {isWidgetOpen && ReactDOM.createPortal(<MiniApp cakeId={cakeId} closeWidget={handleButtonClick} />, document.body)}
          </div>
        </SettingsContext.Provider>
      </AppContext.Provider>
    </UserContext.Provider>
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
