import React, { useEffect, useState } from 'react';
import AnswerSection from './modules/Answermodule/AnswerSection';
import QuestionField from './modules/Answermodule/QuestionField';
import useApp from './hooks/useApp'
import { observer } from 'mobx-react'
import loadinggif from './assets/loading.gif'
// import process from 'process'

interface MiniAppProps {
  closeWidget: () => void;
  cakeId: string;
  cubieAttributes: NamedNodeMap;
}

const MiniApp: React.FC<MiniAppProps> = observer(({ closeWidget, cakeId, cubieAttributes }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<any | null>(null);

  const cubieTitle = cubieAttributes?.getNamedItem('cubieTitle') ? cubieAttributes.getNamedItem('cubieTitle')?.value : "Ask Cubie"
  const app = useApp();
  
  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <button onClick={closeWidget} style={closeButton}>
          <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" stroke="black">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <h2>{cubieTitle}</h2>
        
        <QuestionField
          placeholder="Ask a question about your data..."
          autoFocus
          onFinish={(value: string) => {
            app.setInput(value)
            app.obtainAnswer()
          }}
          disabled={app.isThinking}
        />

        {app.isThinking &&
          <div style={{display:'flex', justifyContent: 'center', alignItems: 'center'}}>
            <div style={{marginTop:'40px', height:'40px', width:'40px'}}>
              <img src={loadinggif} style={{display:'inline', height:'40px'}} />
            </div>
          </div>
        }

        <div style={{ overflow: 'auto', minHeight: '84%' }}>
          {app.answerText && (
            <AnswerSection
              answerStr={app.answerText}
              answerData={app.answerData}
              answerChartData={app.answerChartData}
              answerChartHtml={app.answerChartHtml}
              answerInsight={app.answerInsight}
              answerRecommendation={null}
            />
          )}
        </div>
      </div>
      <div style={{position:'absolute', bottom:'5px', left:'10px', fontSize:'12px', opacity:'0.3', background:'white', padding:'2px 4px'}}>
        {process.env.VERSION}
      </div>
    </div>
  );
});

// Modal overlay style
const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  zIndex: 999,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

// Modal box style
const modalStyle: React.CSSProperties = {
  backgroundColor: '#fff',
  width: '80%',
  maxWidth: '800px',
  height: '80%',
  padding: '20px',
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
  borderRadius: '10px',
  position: 'relative',
};

// close button style
const closeButton: React.CSSProperties = {
  float: 'right',
  marginBottom: '10px',
  position: 'absolute',
  top: 10,
  right: 10,
  backgroundColor: 'transparent',
  color: 'white',
  border: 'none',
  cursor: 'pointer',
};

// Search form style
const searchFormStyle: React.CSSProperties = {
  display: 'flex',
  marginBottom: '20px',
};

// Input style
const inputStyle: React.CSSProperties = {
  flex: 1,
  padding: '10px',
  fontSize: '16px',
  border: '1px solid #ddd',
  borderRadius: '4px 0 0 4px',
};

// Search button style
const searchButtonStyle: React.CSSProperties = {
  padding: '10px 20px',
  fontSize: '16px',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '0 4px 4px 0',
  cursor: 'pointer',
};

// Result style
const resultStyle: React.CSSProperties = {
  marginTop: '20px',
  padding: '15px',
  backgroundColor: '#f0f0f0',
  borderRadius: '4px',
};

export default MiniApp;