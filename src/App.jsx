import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, update, query, orderByChild } from 'firebase/database';
import './App.css';

// Configurazione Firebase
const firebaseConfig = {
  databaseURL: "https://sbd-ladder-default-rtdb.europe-west1.firebasedatabase.app/",
  // Aggiungi qui gli altri dettagli di configurazione
};

// Inizializza Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

function App() {
  const [currentPage, setCurrentPage] = useState('Me');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [topNumbers, setTopNumbers] = useState([0, 0, 0, 0]);
  const [bottomNumbers, setBottomNumbers] = useState([0, 0, 0, 0]);
  const [percentages, setPercentages] = useState([0, 0, 0, 0]);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const savedUsername = localStorage.getItem('username');
    if (savedUsername) {
      setUsername(savedUsername);
      setIsLoggedIn(true);
      loadUserData(savedUsername);
    }
  }, []);

  const loadUserData = async (username) => {
    const userRef = ref(db, `users/${username}`);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      const userData = snapshot.val();
      setTopNumbers([userData.s, userData.b, userData.d, userData.s + userData.b + userData.d]);
      setBottomNumbers([userData.s, userData.b, userData.d, userData.s + userData.b + userData.d]);
    }
  };

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

  const handleLogin = async () => {
    const userRef = ref(db, `users/${username}`);
    const snapshot = await get(userRef);
    if (snapshot.exists() && snapshot.val().password === password) {
      setIsLoggedIn(true);
      localStorage.setItem('username', username);
      loadUserData(username);
    } else {
      alert('Username o password non validi');
    }
  };

  const handleRegister = async () => {
    const userRef = ref(db, `users/${username}`);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      alert('Username già in uso');
    } else {
      await set(userRef, {
        username,
        password,
        s: 0,
        b: 0,
        d: 0
      });
      setIsLoggedIn(true);
      localStorage.setItem('username', username);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
    localStorage.removeItem('username');
  };

  const handleSave = async () => {
    const userRef = ref(db, `users/${username}`);
    await update(userRef, {
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

  const renderLoginPage = () => (
    <div className="login-page">
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleRegister}>Registrati</button>
    </div>
  );

  const renderMePage = () => (
    <>
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
      <button onClick={handleSave}>Salva</button>
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
      {isLoggedIn ? (
        <>
          {currentPage === 'Me' ? renderMePage() : renderLeaderboardPage()}
          <div className="menu-bar">
            <button onClick={() => setCurrentPage('Me')}>Me</button>
            <button onClick={() => setCurrentPage('Leaderboard')}>Classifica</button>
            <button onClick={handleLogout}>Logout</button>
          </div>
        </>
      ) : (
        renderLoginPage()
      )}
    </div>
  );
}

function getColor(percentage) {
  const hue = percentage * 1.2;
  return `hsl(${hue}, 100%, 50%)`;
}

export default App;
