import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [topNumbers, setTopNumbers] = useState(() => {
    const savedTopNumbers = localStorage.getItem('topNumbers');
    return savedTopNumbers ? JSON.parse(savedTopNumbers) : [0, 0, 0, 0];
  });

  const [bottomNumbers, setBottomNumbers] = useState(() => {
    const savedBottomNumbers = localStorage.getItem('bottomNumbers');
    return savedBottomNumbers ? JSON.parse(savedBottomNumbers) : [0, 0, 0, 0];
  });

  const [percentages, setPercentages] = useState(() => {
    const savedPercentages = localStorage.getItem('percentages');
    return savedPercentages ? JSON.parse(savedPercentages) : [0, 0, 0, 0];
  });

  const handleNumberChange = (index, isTop, newValue) => {
    if (isTop) {
      const newTopNumbers = [...topNumbers];
      newTopNumbers[index] = Number(newValue);
      setTopNumbers(newTopNumbers);
      localStorage.setItem('topNumbers', JSON.stringify(newTopNumbers));
    } else {
      const newBottomNumbers = [...bottomNumbers];
      newBottomNumbers[index] = Number(newValue);
      setBottomNumbers(newBottomNumbers);
      localStorage.setItem('bottomNumbers', JSON.stringify(newBottomNumbers));
    }
  };

  useEffect(() => {
    const newTopNumbers = [...topNumbers];
    const newBottomNumbers = [...bottomNumbers];
    const newPercentages = [];

    newTopNumbers[3] = newTopNumbers.slice(0, 3).reduce((a, b) => a + b, 0);
    newBottomNumbers[3] = newBottomNumbers.slice(0, 3).reduce((a, b) => a + b, 0);

    for (let i = 0; i < 4; i++) {
      newPercentages[i] = newTopNumbers[i] !== 0 ? (newBottomNumbers[i] / newTopNumbers[i]) * 100 : 0;
    }

    setPercentages(newPercentages);
    localStorage.setItem('percentages', JSON.stringify(newPercentages));
  }, [topNumbers.slice(0, 3), bottomNumbers.slice(0, 3)]);

  return (
    <div className="app">
      <div className="section-title">OBIETTIVI:</div>
      <div className="section">
        <div className="column">
          <div className="label">S</div>
          <input
            type="number"
            value={topNumbers[0]}
            onChange={(e) => handleNumberChange(0, true, e.target.value)}
            className="number-input"
          />
          <div className="label">D</div>
          <input
            type="number"
            value={topNumbers[2]}
            onChange={(e) => handleNumberChange(2, true, e.target.value)}
            className="number-input"
          />
        </div>
        <div className="column">
          <div className="label">B</div>
          <input
            type="number"
            value={topNumbers[1]}
            onChange={(e) => handleNumberChange(1, true, e.target.value)}
            className="number-input"
          />
          <div className="label">T</div>
          <input
            type="number"
            value={topNumbers[3]}
            onChange={(e) => handleNumberChange(3, true, e.target.value)}
            className="number-input"
          />
        </div>
      </div>
      <div className="section-title">PR:</div>
      <div className="section">
        <div className="column">
          <div className="label">S</div>
          <input
            type="number"
            value={bottomNumbers[0]}
            onChange={(e) => handleNumberChange(0, false, e.target.value)}
            className="number-input"
          />
          <div className="percentage-item">
            <div
              className="percentage-bar"
              style={{
                width: `${percentages[0]}%`,
                backgroundColor: getColor(percentages[0]),
              }}
            ></div>
            <span className="percentage-text">{percentages[0].toFixed(2)}%</span>
          </div>
          <div className="label">D</div>
          <input
            type="number"
            value={bottomNumbers[2]}
            onChange={(e) => handleNumberChange(2, false, e.target.value)}
            className="number-input"
          />
          <div className="percentage-item">
            <div
              className="percentage-bar"
              style={{
                width: `${percentages[2]}%`,
                backgroundColor: getColor(percentages[2]),
              }}
            ></div>
            <span className="percentage-text">{percentages[2].toFixed(2)}%</span>
          </div>
        </div>
        <div className="column">
          <div className="label">B</div>
          <input
            type="number"
            value={bottomNumbers[1]}
            onChange={(e) => handleNumberChange(1, false, e.target.value)}
            className="number-input"
          />
          <div className="percentage-item">
            <div
              className="percentage-bar"
              style={{
                width: `${percentages[1]}%`,
                backgroundColor: getColor(percentages[1]),
              }}
            ></div>
            <span className="percentage-text">{percentages[1].toFixed(2)}%</span>
          </div>
          <div className="label">T</div>
          <input
            type="number"
            value={bottomNumbers[3]}
            onChange={(e) => handleNumberChange(3, false, e.target.value)}
            className="number-input"
          />
          <div className="percentage-item">
            <div
              className="percentage-bar"
              style={{
                width: `${percentages[3]}%`,
                backgroundColor: getColor(percentages[3]),
              }}
            ></div>
            <span className="percentage-text">{percentages[3].toFixed(2)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function getColor(percentage) {
  const hue = percentage * 1.2;
  return `hsl(${hue}, 100%, 50%)`;
}

export default App;
