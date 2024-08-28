import React, { useState, useMemo } from 'react';
import './Leaderboard.css';

const LeaderboardWithSorting = ({ data }) => {
  const [sortBy, setSortBy] = useState('totalDesc');

  const sortedAndGroupedData = useMemo(() => {
    const sorted = [...data].sort((a, b) => {
      switch (sortBy) {
        case 'sDesc':
          return b.s - a.s;
        case 'bDesc':
          return b.b - a.b;
        case 'dDesc':
          return b.d - a.d;
        case 'bwDesc':
          const categoryA = Math.floor(parseFloat(a.bw) / 10) * 10;
          const categoryB = Math.floor(parseFloat(b.bw) / 10) * 10;
          if (categoryA === categoryB) {
            return b.total - a.total;
          }
          return categoryA - categoryB;
        case 'totalDesc':
          return b.total - a.total;
        case 'ratioDesc':
          return b.total / parseFloat(b.bw) - a.total / parseFloat(a.bw);
        default:
          return b.total - a.total;
      }
    });

    if (sortBy === 'bwDesc') {
      const grouped = {};
      sorted.forEach((item) => {
        const category = Math.floor(parseFloat(item.bw) / 10) * 10;
        if (!grouped[category]) {
          grouped[category] = [];
        }
        grouped[category].push(item);
      });
      return grouped;
    }

    return { all: sorted };
  }, [data, sortBy]);

  return (
    <div className="leaderboard-container">
      <h2 className="leaderboard-title">Classifica</h2>
      <div className="leaderboard-content">
        <div className="sort-container">
          <div className="sort-label">Ordina</div>
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
        <div className="table-wrapper">
          {Object.entries(sortedAndGroupedData).map(([category, items]) => (
            <React.Fragment key={category}>
              {sortBy === 'bwDesc' && (
                <h3 className="weight-category">
                  Categoria {category}-{parseInt(category) + 9.9} kg
                </h3>
              )}
              <table className="leaderboard-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Nome</th>
                    {sortBy !== 'ratioDesc' && <th>S</th>}
                    {sortBy !== 'ratioDesc' && <th>B</th>}
                    {sortBy !== 'ratioDesc' && <th>D</th>}
                    <th>BW</th>
                    <th>T</th>
                    {sortBy === 'ratioDesc' && <th>T/BW</th>}
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={item.username}>
                      <td className="position">{index + 1}</td>
                      <td className="username">{item.username}</td>
                      {sortBy !== 'ratioDesc' && <td>{item.s}</td>}
                      {sortBy !== 'ratioDesc' && <td>{item.b}</td>}
                      {sortBy !== 'ratioDesc' && <td>{item.d}</td>}
                      <td>{item.bw}</td>
                      <td className="total">{item.total}</td>
                      {sortBy === 'ratioDesc' && (
                        <td>{(item.total / parseFloat(item.bw)).toFixed(2)}</td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardWithSorting;
