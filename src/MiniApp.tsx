import React, { useEffect, useState } from 'react';
import data from './assets/data.json';
import AnswerSection from './modules/Answermodule/AnswerSection';
import QuestionField from './modules/Answermodule/QuestionField';
import useApp from './hooks/useApp'
import { observer } from 'mobx-react'

interface MiniAppProps {
  closeWidget: () => void;
  cakeId: string;
}

const MiniApp: React.FC<MiniAppProps> = observer(({ closeWidget, cakeId }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<any | null>(null);

  const app = useApp();

  useEffect(() => {
    if (cakeId) {
      app.setCakeId(cakeId);
      app.updateSources();
    }
  }, [cakeId])

  const handleSearch = () => {
    // Use the data from data.json
    setSearchResult({
      answerStr: data.data.answer,
      answerData: data.data.data,
      answerChartData: data.data?.chart_data,
      answerChartHtml: data.data?.chart_html,
      answerInsight: data.data?.insight,
      answerRecommendation: data.data.recommendation
    });
  };

  return (
    <div style={overlayStyle}>
      <button onClick={closeWidget} style={closeButton}>
        <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
      <div style={modalStyle}>
        <h2>Welcome to the Mini App!</h2>
        <QuestionField
          placeholder="Ask a question about your data..."
          autoFocus
          onFinish={(value: string) => {
            app.setInput(value)
            app.obtainAnswer()
            // handleSearch();
          }}
          disabled={app.isThinking}
        />
        <div style={{ overflow: 'auto', minHeight: '84%' }}>
          {app.answerText && (
            <AnswerSection
              answerStr={app.answerText}
              answerData={app.answerData}
              answerChartData={app.answerChartData}
              answerChartHtml={app.answerChartHtml}
              answerInsight={app.answerInsight}
              answerRecommendation={app.answerRecommendation}
            />
          )}
        </div>
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