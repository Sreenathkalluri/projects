import React, { useEffect, useState, useCallback, useRef } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./StatsComparison.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StatsComparison = () => {
  const [playersData, setPlayersData] = useState([]);
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [search1, setSearch1] = useState("");
  const [search2, setSearch2] = useState("");
  const [player1Stats, setPlayer1Stats] = useState(null);
  const [player2Stats, setPlayer2Stats] = useState(null);
  const [showDropdown1, setShowDropdown1] = useState(false);
  const [showDropdown2, setShowDropdown2] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [highlightedStat, setHighlightedStat] = useState(null);
  const dropdownRef1 = useRef(null);
  const dropdownRef2 = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("https://sreenathkalluri.github.io/AD3_2/all_stats.json");
        const data = await response.json();
        setPlayersData(data);
      } catch (error) {
        console.error("Error fetching player data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef1.current && !dropdownRef1.current.contains(event.target)) {
        setShowDropdown1(false);
      }
      if (dropdownRef2.current && !dropdownRef2.current.contains(event.target)) {
        setShowDropdown2(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getBestPlayerMatch = useCallback(
    (name) => {
      if (!name) return null;
      const matches = playersData.filter((p) => p.player === name);
      if (matches.length === 0) return null;
      return matches.reduce((merged, current) => ({ ...merged, ...current }), {});
    },
    [playersData]
  );

  useEffect(() => {
    setPlayer1Stats(getBestPlayerMatch(player1));
  }, [player1, getBestPlayerMatch]);

  useEffect(() => {
    setPlayer2Stats(getBestPlayerMatch(player2));
  }, [player2, getBestPlayerMatch]);

  const getPlayerOptions = () => {
    return [...new Set(playersData.map((p) => p.player))].sort();
  };

  const filteredOptions1 = getPlayerOptions().filter((name) =>
    name.toLowerCase().includes(search1.toLowerCase())
  );
  const filteredOptions2 = getPlayerOptions().filter((name) =>
    name.toLowerCase().includes(search2.toLowerCase())
  );

  const handleSearch1Change = (e) => {
    setSearch1(e.target.value);
    setShowDropdown1(e.target.value.length > 0);
    if (e.target.value === "") {
      setPlayer1("");
    }
  };

  const handleSearch2Change = (e) => {
    setSearch2(e.target.value);
    setShowDropdown2(e.target.value.length > 0);
    if (e.target.value === "") {
      setPlayer2("");
    }
  };

  const selectPlayer1 = (name) => {
    setPlayer1(name);
    setSearch1(name);
    setShowDropdown1(false);
  };

  const selectPlayer2 = (name) => {
    setPlayer2(name);
    setSearch2(name);
    setShowDropdown2(false);
  };

  const PlayerCard = ({ stats, position }) => {
    const [activeTab, setActiveTab] = useState('batting');
    
    if (!stats) return (
      <div className={`player-card empty-card ${position}`}>
        <div className="empty-card-content">
          <span>Select {position === 'left' ? 'Player 1' : 'Player 2'}</span>
        </div>
      </div>
    );

    const primaryImage = `https://scores.iplt20.com/ipl/playerimages/${stats.player.replaceAll(" ", "%20")}.png?v=1`;

    const renderStat = (label, value, key) => (
      <div 
        className={`stat-item ${highlightedStat === key ? 'highlighted' : ''}`}
        onMouseEnter={() => setHighlightedStat(key)}
        onMouseLeave={() => setHighlightedStat(null)}
      >
        <strong>{label}:</strong> {value !== undefined ? value : "N/A"}
        {player1Stats && player2Stats && highlightedStat === key && (
          <div className="stat-comparison">
            <span className={player1Stats[key] > player2Stats[key] ? 'better-stat' : ''}>
              {player1Stats[key] || 0}
            </span>
            <span> vs </span>
            <span className={player2Stats[key] > player1Stats[key] ? 'better-stat' : ''}>
              {player2Stats[key] || 0}
            </span>
          </div>
        )}
      </div>
    );

    return (
      <div className={`player-card ${position}`}>
        <div className="player-header">
          <img
            src={primaryImage}
            alt={stats.player}
            className="player-img"
            onError={(e) => {
              if (stats.image_url) {
                e.target.onerror = null;
                e.target.src = stats.image_url;
              } else {
                e.target.style.display = "none";
              }
            }}
          />
          <h2>{stats.player}</h2>
        </div>

        <div className="stat-tabs">
          <button 
            className={`tab-button ${activeTab === 'batting' ? 'active' : ''}`}
            onClick={() => setActiveTab('batting')}
          >
            Batting
          </button>
          <button 
            className={`tab-button ${activeTab === 'bowling' ? 'active' : ''}`}
            onClick={() => setActiveTab('bowling')}
          >
            Bowling
          </button>
          <button 
            className={`tab-button ${activeTab === 'fielding' ? 'active' : ''}`}
            onClick={() => setActiveTab('fielding')}
          >
            Fielding
          </button>
        </div>

        <div className="stats-scroll-container">
          {activeTab === 'batting' && stats.total_runs !== undefined && (
            <div className="stat-section">
              {renderStat("Total Runs", stats.total_runs, 'total_runs')}
              {renderStat("Balls Faced", stats.balls_faced, 'balls_faced')}
              {renderStat("Fours", stats.fours, 'fours')}
              {renderStat("Sixes", stats.sixes, 'sixes')}
              {renderStat("Dismissals", stats.dismissals, 'dismissals')}
              {renderStat("Strike Rate", stats.strike_rate, 'strike_rate')}
              {renderStat("Batting Avg", stats.batting_avg, 'batting_avg')}
            </div>
          )}

          {activeTab === 'bowling' && stats.wickets !== undefined && (
            <div className="stat-section">
              {renderStat("Wickets", stats.wickets, 'wickets')}
              {renderStat("Runs Conceded", stats.runs_conceded, 'runs_conceded')}
              {renderStat("Balls Bowled", stats.balls_bowled, 'balls_bowled')}
              {renderStat("Overs", stats.overs, 'overs')}
              {renderStat("Economy", stats.economy, 'economy')}
              {renderStat("Best Figures", stats.best_figures, 'best_figures')}
            </div>
          )}

          {activeTab === 'fielding' && (
            <div className="stat-section">
              {renderStat("Catches", stats.catches, 'catches')}
              {renderStat("Stumpings", stats.stumpings, 'stumpings')}
              {renderStat("Run Outs", stats.run_outs, 'run_outs')}
            </div>
          )}
        </div>
      </div>
    );
  };

  const getComparisonChart = () => {
    if (!player1Stats || !player2Stats) return (
      <div className="chart-column empty-chart">
        <div className="empty-chart-content">
          <span>Select two players to compare stats</span>
        </div>
      </div>
    );

    const compareFields = [
      { label: "Total Runs", key: "total_runs" },
      { label: "Wickets", key: "wickets" },
      { label: "Catches", key: "catches" },
      { label: "Strike Rate", key: "strike_rate" },
      { label: "Batting Avg", key: "batting_avg" },
      { label: "Economy", key: "economy" },
    ];

    const labels = compareFields.map((field) => field.label);
    const player1Values = compareFields.map(
      (field) => -(player1Stats[field.key] || 0)
    );
    const player2Values = compareFields.map(
      (field) => player2Stats[field.key] || 0
    );

    const data = {
      labels,
      datasets: [
        {
          label: player1Stats.player,
          data: player1Values,
          backgroundColor: "#00e5ff",
          borderColor: "#00e5ff",
          borderWidth: 1,
          hoverBackgroundColor: "#00bcd4",
        },
        {
          label: player2Stats.player,
          data: player2Values,
          backgroundColor: "#ff4081",
          borderColor: "#ff4081",
          borderWidth: 1,
          hoverBackgroundColor: "#e91e63",
        },
      ],
    };

    const options = {
      responsive: true,
      indexAxis: "y",
      plugins: {
        legend: {
          position: "top",
          labels: { 
            color: "#fff",
            font: {
              size: 14
            }
          },
        },
        title: {
          display: true,
          text: "Stat Comparison",
          color: "#fff",
          font: {
            size: 18
          }
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return `${context.dataset.label}: ${Math.abs(context.raw)}`;
            },
          },
          bodyFont: {
            size: 14
          }
        },
      },
      scales: {
        x: {
          stacked: true,
          ticks: {
            color: "#fff",
            callback: function (value) {
              return Math.abs(value);
            },
            font: {
              size: 12
            }
          },
          grid: { 
            color: "#444",
            drawBorder: false
          },
        },
        y: {
          stacked: true,
          ticks: { 
            color: "#fff",
            font: {
              size: 12
            }
          },
          grid: { 
            color: "#444",
            drawBorder: false
          },
        },
      },
      animation: {
        duration: 1000,
        easing: 'easeOutQuart'
      },
      maintainAspectRatio: false
    };

    return (
      <div className="chart-column">
        <Bar 
          data={data} 
          options={options} 
          height={400}
          redraw={true}
        />
      </div>
    );
  };

  const swapPlayers = () => {
    const tempPlayer = player1;
    const tempSearch = search1;
    setPlayer1(player2);
    setSearch1(search2);
    setPlayer2(tempPlayer);
    setSearch2(tempSearch);
  };

  return (
    <div className="comparison-container">
      <h1>Player Stats Comparison</h1>
      
      {isLoading ? (
        <div className="loading-spinner">Loading player data...</div>
      ) : (
        <>
          <div className="dropdowns">
            <div className="search-container" ref={dropdownRef1}>
              <input
                type="text"
                placeholder="Search Player 1"
                value={search1}
                onChange={handleSearch1Change}
                className="search-input"
                onFocus={() => setShowDropdown1(search1.length > 0)}
              />
              {showDropdown1 && (
                <div className="search-dropdown">
                  {filteredOptions1.length > 0 ? (
                    filteredOptions1.map((name) => (
                      <div
                        key={name}
                        className={`dropdown-item ${player1 === name ? 'selected' : ''}`}
                        onClick={() => selectPlayer1(name)}
                      >
                        {name}
                      </div>
                    ))
                  ) : (
                    <div className="dropdown-item no-results">No players found</div>
                  )}
                </div>
              )}
            </div>

            <button 
              className="swap-button"
              onClick={swapPlayers}
              disabled={!player1 || !player2}
              title="Swap players"
            >
              ⇄
            </button>

            <div className="search-container" ref={dropdownRef2}>
              <input
                type="text"
                placeholder="Search Player 2"
                value={search2}
                onChange={handleSearch2Change}
                className="search-input"
                onFocus={() => setShowDropdown2(search2.length > 0)}
              />
              {showDropdown2 && (
                <div className="search-dropdown">
                  {filteredOptions2.length > 0 ? (
                    filteredOptions2.map((name) => (
                      <div
                        key={name}
                        className={`dropdown-item ${player2 === name ? 'selected' : ''}`}
                        onClick={() => selectPlayer2(name)}
                      >
                        {name}
                      </div>
                    ))
                  ) : (
                    <div className="dropdown-item no-results">No players found</div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="stats-compare-section">
            <PlayerCard stats={player1Stats} position="left" />
            {getComparisonChart()}
            <PlayerCard stats={player2Stats} position="right" />
          </div>
        </>
      )}
    </div>
  );
};

export default StatsComparison;