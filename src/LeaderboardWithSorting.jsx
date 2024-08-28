import React, { useState, useMemo } from 'react';
import './Leaderboard.css'; // Assicurati di creare questo file CSS

const LeaderboardWithSorting = ({ data }) => {
  const [sortBy, setSortBy] = useState('totalDesc');

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      switch (sortBy) {
        case 'sDesc':
          return b.s - a.s;
        case 'bDesc':
          return b.b - a.b;
        case 'dDesc':
          return b.d - a.d;
        case 'bwDesc':
          return parseFloat(b.bw) - parseFloat(a.bw);
        case 'totalDesc':
          return b.total - a.total;
        case 'ratioDesc':
          return (b.total / parseFloat(b.bw)) - (a.total / parseFloat(a.bw));
        default:
          return b.total - a.total;
      }
    });
  }, [data, sortBy]);

  return (
    <div className="leaderboard-container">
      <div className="sort-select">
        <label htmlFor="sortSelect">Ordina per: </label>
        <select
          id="sortSelect"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="sDesc">S (maggiore)</option>
          <option value="bDesc">B (maggiore)</option>
          <option value="dDesc">D (maggiore)</option>
          <option value="bwDesc">BW (maggiore)</option>
          <option value="totalDesc">Totale (maggiore)</option>
          <option value="ratioDesc">Rapporto Totale/BW (maggiore)</option>
        </select>
      </div>
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Posizione</th>
            <th>Nome</th>
            <th>S</th>
            <th>B</th>
            <th>D</th>
            <th>BW</th>
            <th>Totale</th>
            <th>Rapporto Totale/BW</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((item, index) => (
            <tr key={item.username}>
              <td>{index + 1}</td>
              <td>{item.username}</td>
              <td>{item.s}</td>
              <td>{item.b}</td>
              <td>{item.d}</td>
              <td>{item.bw}</td>
              <td>{item.total}</td>
              <td>{(item.total / parseFloat(item.bw)).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderboardWithSorting;
