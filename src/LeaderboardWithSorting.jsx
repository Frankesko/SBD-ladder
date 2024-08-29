import React, { useState, useMemo } from 'react';
import './Leaderboard.css';

const LeaderboardWithSorting = ({ data }) => {
  const [sortBy, setSortBy] = useState('totalDesc');

  const calculateIPFPoints = (total, bw, gender) => {
    if (!gender || (gender !== 'M' && gender !== 'F')) {
      return 0;
    }

    const ln = Math.log;
    if (gender === 'M') {
      return 500 + 100 * ((total - (310.6700 * ln(bw) - 857.7850)) / (53.2160 * ln(bw) - 147.0835));
    } else {
      return 500 + 100 * ((total - (125.1435 * ln(bw) - 228.0300)) / (34.5246 * ln(bw) - 86.8301));
    }
  };

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
        case 'ipfDesc':
          return calculateIPFPoints(b.total, parseFloat(b.bw), b.gender) - calculateIPFPoints(a.total, parseFloat(a.bw), a.gender);
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
            <option value="sDesc">Squat</option>
            <option value="bDesc">Bench</option>
            <option value="dDesc">Deadlift</option>
            <option value="bwDesc">Categoria</option>
            <option value="totalDesc">Totale</option>
            <option value="ratioDesc">Totale/BW</option>
            <option value="ipfDesc">IPF Points</option>
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
                    <th className="position-name">Nome</th>
                    {sortBy !== 'ratioDesc' && sortBy !== 'bwDesc' && sortBy !== 'ipfDesc' && <th>Squat</th>}
                    {sortBy !== 'ratioDesc' && sortBy !== 'bwDesc' && sortBy !== 'ipfDesc' && <th>Bench</th>}
                    {sortBy !== 'ratioDesc' && sortBy !== 'bwDesc' && sortBy !== 'ipfDesc' && <th>Deadlift</th>}
                    {(sortBy === 'ratioDesc' || sortBy === 'bwDesc') && <th>BW</th>}
                    {sortBy !== 'ipfDesc' && <th>Totale</th>}
                    {sortBy === 'ratioDesc' && <th>T/BW</th>}
                    {sortBy === 'ipfDesc' && <th>IPF Points</th>}
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={item.username}>
                      <td className="position-name">
                        <span className="position">{index + 1}.</span> {item.username}
                      </td>
                      {sortBy !== 'ratioDesc' && sortBy !== 'bwDesc' && sortBy !== 'ipfDesc' && <td>{item.s}</td>}
                      {sortBy !== 'ratioDesc' && sortBy !== 'bwDesc' && sortBy !== 'ipfDesc' && <td>{item.b}</td>}
                      {sortBy !== 'ratioDesc' && sortBy !== 'bwDesc' && sortBy !== 'ipfDesc' && <td>{item.d}</td>}
                      {(sortBy === 'ratioDesc' || sortBy === 'bwDesc') && <td className="bw">{item.bw}</td>}
                      {sortBy !== 'ipfDesc' && <td className="total">{item.total}</td>}
                      {sortBy === 'ratioDesc' && (
                        <td>{(item.total / parseFloat(item.bw)).toFixed(2)}</td>
                      )}
                      {sortBy === 'ipfDesc' && (
                        <td>{calculateIPFPoints(item.total, parseFloat(item.bw), item.gender).toFixed(2)}</td>
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
