import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, update, query, orderByChild } from 'firebase/database';
import './App.css';

// Configurazione Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAd7n_WQD_jUUPSTftZ6jtu8xidMun-jzc",
  authDomain: "sbd-ladder.firebaseapp.com",
  databaseURL: "https://sbd-ladder-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "sbd-ladder",
  storageBucket: "sbd-ladder.appspot.com",
  messagingSenderId: "111032615204",
  appId: "1:111032615204:web:c444cf45e5bd5733adb3b1",
  measurementId: "G-GCFF96NMEW"
};

// Inizializza Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

function App() {
  const [currentPage, setCurrentPage] = useState('Me');
  const [username, setUsername] = useState('');
  const [topNumbers, setTopNumbers] = useState([0, 0, 0, 0]);
  const [bottomNumbers, setBottomNumbers] = useState([0, 0, 0, 0]);
  const [percentages, setPercentages] = useState([0, 0, 0, 0]);
  const [leaderboard, setLeaderboard] = useState([]);

  const handleNumberChange = (index, isTop, newValue) => {
    const newNumbers = isTop ? [...topNumbers] : [...bottomNumbers];
    newNumbers[index] = Number(newValue);
    newNumbers[3] = newNumbers.slice(0, 3).reduce((a, b) => a + b, 0);
    if (isTop) {
      setTopNumbers(newNumbers);
    } else {
      setBottomNumbers(newNumbers);
    }
  };

  useEffect(() => {
    const newPercentages = topNumbers.map((top, index) => 
      top !== 0 ? (bottomNumbers[index] / top) * 100 : 0
    );
    setPercentages(newPercentages);
  }, [topNumbers, bottomNumbers]);

  const handleSave = async () => {
    if (!username) {
      alert('Per favore, inserisci un nome utente');
      return;
    }
    const userRef = ref(db, `users/${username}`);
    await update(userRef, {
      username,
      s: bottomNumbers[0],
      b: bottomNumbers[1],
      d: bottomNumbers[2]
    });
    alert('Dati salvati con successo');
  };

  const loadLeaderboard = async () => {
    const usersRef = ref(db, 'users');
    const usersQuery = query(usersRef, orderByChild('s'));
    const snapshot = await get(usersQuery);
    const leaderboardData = [];
    snapshot.forEach((childSnapshot) => {
      const userData = childSnapshot.val();
      leaderboardData.push({
        username: userData.username,
        total: userData.s + userData.b + userData.d
      });
    });
    leaderboardData.sort((a, b) => b.total - a.total);
    setLeaderboard(leaderboardData);
  };

  useEffect(() => {
    if (currentPage === 'Leaderboard') {
      loadLeaderboard();
    }
  }, [currentPage]);

  const renderMePage = () => (
    <>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Il tuo nome"
        className="username-input"
      />
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
            readOnly
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
            readOnly
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
      <button onClick={handleSave} className="save-button">Salva</button>
    </>
  );

  const renderLeaderboardPage = () => (
    <div className="leaderboard">
      <h2>Classifica</h2>
      <ul>
        {leaderboard.map((user, index) => (
          <li key={user.username}>
            {index + 1}. {user.username} - Total: {user.total}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="app">
      {currentPage === 'Me' ? renderMePage() : renderLeaderboardPage()}
      <div className="menu-bar">
        <button onClick={() => setCurrentPage('Me')}>Me</button>
        <button onClick={() => setCurrentPage('Leaderboard')}>Classifica</button>
      </div>
    </div>
  );
}

function getColor(percentage) {
  const hue = percentage * 1.2;
  return `hsl(${hue}, 100%, 50%)`;
}

export default App;
