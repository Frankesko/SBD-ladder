import React, { useState, useMemo } from 'react';
import './Leaderboard.css';

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
      <div className="sort-container">
        <span className="sort-label">Ordina</span>
        <select
          className="sort-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="sDesc">S</option>
          <option value="bDesc">B</option>
          <option value="dDesc">D</option>
          <option value="bwDesc">BW</option>
          <option value="totalDesc">Totale</option>
          <option value="ratioDesc">Totale/BW</option>
        </select>
      </div>
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th></th>
            <th>Nome</th>
            <th>S</th>
            <th>B</th>
            <th>D</th>
            <th>BW</th>
            <th>Totale</th>
            <th>Coefficiente</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((item, index) => (
            <tr key={item.username}>
              <td className="position">{index + 1}</td>
              <td className="username">{item.username}</td>
              <td>{item.s}</td>
              <td>{item.b}</td>
              <td>{item.d}</td>
              <td>{item.bw}</td>
              <td className="total">{item.total}</td>
              <td>{(item.total / parseFloat(item.bw)).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderboardWithSorting;
