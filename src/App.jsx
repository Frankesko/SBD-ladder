import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [topNumbers, setTopNumbers] = useState([0, 0, 0, 0]);
  const [bottomNumbers, setBottomNumbers] = useState([0, 0, 0, 0]);
  const [percentages, setPercentages] = useState([0, 0, 0, 0]);

  const handleNumberChange = (index, isTop, newValue) => {
    if (isTop) {
      const newTopNumbers = [...topNumbers];
      newTopNumbers[index] = Number(newValue);
      setTopNumbers(newTopNumbers);
    } else {
      const newBottomNumbers = [...bottomNumbers];
      newBottomNumbers[index] = Number(newValue);
      setBottomNumbers(newBottomNumbers);
    }
  };

  useEffect(() => {
    const newTopNumbers = [...topNumbers];
    const newBottomNumbers = [...bottomNumbers];
    const newPercentages = [];

    // Calculate totals
    newTopNumbers[3] = newTopNumbers.slice(0, 3).reduce((a, b) => a + b, 0);
    newBottomNumbers[3] = newBottomNumbers.slice(0, 3).reduce((a, b) => a + b, 0);

    // Calculate percentages
    for (let i = 0; i < 4; i++) {
      newPercentages[i] = newTopNumbers[i] !== 0 ? (newBottomNumbers[i] / newTopNumbers[i]) * 100 : 0;
    }

    setTopNumbers(newTopNumbers);
    setBottomNumbers(newBottomNumbers);
    setPercentages(newPercentages);
  }, [topNumbers.slice(0, 3), bottomNumbers.slice(0, 3)]);

  return (
    <div className="app">
      <div className="labels">
        <span>S</span>
        <span>B</span>
        <span>D</span>
        <span>T</span>
      </div>
      <div className="number-container">
        {topNumbers.map((num, index) => (
          <input
            key={`top-${index}`}
            type="number"
            value={num}
            onChange={(e) => handleNumberChange(index, true, e.target.value)}
            className="number-input"
            readOnly={index === 3}
          />
        ))}
      </div>
      <div className="number-container">
        {bottomNumbers.map((num, index) => (
          <input
            key={`bottom-${index}`}
            type="number"
            value={num}
            onChange={(e) => handleNumberChange(index, false, e.target.value)}
            className="number-input"
            readOnly={index === 3}
          />
        ))}
      </div>
      <div className="percentage-container">
        {percentages.map((percentage, index) => (
          <div key={`percentage-${index}`} className="percentage-item">
            <div className="percentage-bar" style={{ width: `${percentage}%`, backgroundColor: getColor(percentage) }}></div>
            <span className="percentage-text">{percentage.toFixed(2)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function getColor(percentage) {
  const hue = percentage * 1.2; // This will give a red to green gradient
  return `hsl(${hue}, 100%, 50%)`;
}

export default App;