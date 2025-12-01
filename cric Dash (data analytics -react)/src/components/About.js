// src/components/About.js
import React from "react";
import "./About.css"; // Optional: For styling

const About = () => {
  return (
    <div className="about-container">
      <h1>About CRIC DASH</h1>
      <p>
        <strong>CRIC DASH</strong> is a powerful cricket data analytics platform built for fans, analysts, and researchers to explore comprehensive statistics from the Indian Premier League (IPL). It visualizes and compares player performance, match trends, venue statistics, and more through clean and interactive dashboards.
      </p>

      <h2>Understanding IPL & Cricket Terminologies</h2>
      <p>
        To fully appreciate the insights from CRIC DASH, it's essential to understand key cricket terms, especially those related to T20 and IPL formats. Here's a breakdown:
      </p>

      <h3>🏏 Match Basics</h3>
      <ul>
        <li><strong>Match Format:</strong> The IPL is played in the T20 (Twenty20) format, where each team bats for a maximum of 20 overs.</li>
        <li><strong>Innings:</strong> A turn during which a team bats and tries to score runs while the other team bowls and fields.</li>
        <li><strong>Overs:</strong> A set of 6 legal deliveries bowled by a bowler.</li>
        <li><strong>Powerplay:</strong> The first 6 overs of an innings where only 2 fielders are allowed outside the 30-yard circle. Meant to encourage aggressive batting.</li>
        <li><strong>Death Overs:</strong> The final overs (usually 16–20), where batsmen aim to score quickly and bowlers aim to restrict runs.</li>
      </ul>

      <h3>🧍 Player Roles</h3>
      <ul>
        <li><strong>Batsman:</strong> A player whose primary role is to score runs with the bat.</li>
        <li><strong>Bowler:</strong> A player who delivers the ball to dismiss batsmen and restrict scoring.</li>
        <li><strong>All-Rounder:</strong> A player skilled in both batting and bowling.</li>
        <li><strong>Wicketkeeper:</strong> The player behind the stumps who catches, stumps, and supports the bowler.</li>
        <li><strong>Captain:</strong> The team leader who decides bowling changes, field placement, and overall game strategy.</li>
      </ul>

      <h3>📊 Batting Metrics</h3>
      <ul>
        <li><strong>Runs:</strong> The basic unit of scoring in cricket.</li>
        <li><strong>Strike Rate:</strong> (Runs ÷ Balls faced) × 100. Higher is better for T20 formats.</li>
        <li><strong>Average:</strong> Total Runs ÷ Number of times out. Measures consistency.</li>
        <li><strong>Boundaries:</strong> Includes 4s (balls reaching the boundary) and 6s (clearing the boundary).</li>
        <li><strong>Dot Balls:</strong> Balls where no run is scored. Critical in pressure-building.</li>
      </ul>

      <h3>🎯 Bowling Metrics</h3>
      <ul>
        <li><strong>Wickets:</strong> Dismissals taken by a bowler.</li>
        <li><strong>Economy Rate:</strong> Runs conceded per over bowled. Lower is better.</li>
        <li><strong>Bowling Average:</strong> Runs conceded ÷ Wickets taken.</li>
        <li><strong>Strike Rate (Bowling):</strong> Balls bowled ÷ Wickets taken. Indicates wicket-taking ability.</li>
        <li><strong>Maiden Over:</strong> An over where no runs are conceded.</li>
      </ul>

      <h3>🎮 Match Situations</h3>
      <ul>
        <li><strong>Chasing:</strong> The team batting second attempts to surpass the target score.</li>
        <li><strong>Defending:</strong> The team bowling second tries to prevent the opponent from reaching the target.</li>
        <li><strong>Run Rate:</strong> (Total Runs Scored ÷ Overs Faced). Crucial in setting/chasing targets.</li>
        <li><strong>Required Run Rate:</strong> Runs needed ÷ Remaining Overs.</li>
        <li><strong>Match-winning Knock:</strong> A high-impact batting performance that changes the game.</li>
      </ul>

      <h3>📍 Venues & Pitches</h3>
      <ul>
        <li><strong>Pitch:</strong> The 22-yard strip where bowling and batting take place. Can be batting-friendly or assist bowlers (spin/seam).</li>
        <li><strong>Venue Statistics:</strong> Some grounds favor high scoring (like Wankhede) while others suit spinners (like Chepauk).</li>
      </ul>

      <h3>🏆 IPL Specific Terms</h3>
      <ul>
        <li><strong>Orange Cap:</strong> Awarded to the tournament's highest run-scorer.</li>
        <li><strong>Purple Cap:</strong> Awarded to the highest wicket-taker.</li>
        <li><strong>Impact Player:</strong> New IPL rule allowing a team to substitute a player mid-game to impact performance.</li>
        <li><strong>Super Over:</strong> A tie-breaker where each team plays 1 over with 2 wickets.</li>
        <li><strong>Net Run Rate (NRR):</strong> Used to rank teams when points are tied. It’s a mathematical measure of run scoring vs conceding.</li>
        <li><strong>Playoffs:</strong> The knockout stage with Qualifier 1, Eliminator, Qualifier 2, and Final.</li>
      </ul>

      <h3>📈 How CRIC DASH Uses This Data</h3>
      <ul>
        <li>Compare players based on <strong>batting, bowling, and fielding</strong> stats.</li>
        <li>Visualize performance trends like <strong>strike rate progression</strong> or <strong>wicket-taking patterns</strong>.</li>
        <li>Filter by <strong>stadium</strong>, <strong>opposition</strong>, or <strong>season</strong>.</li>
        <li>Track <strong>top performers</strong> like Highest Run Scorers or Best Bowling Figures.</li>
        <li>Run a <strong>head-to-head stats comparison</strong> between players.</li>
      </ul>

      <p>
        Whether you're a casual fan or a serious analyst, CRIC DASH brings IPL statistics to your fingertips with deep insights, intuitive visuals, and real-time tracking. Dive deep into every match, every player, and every delivery like never before.
      </p>
    </div>
  );
};

export default About;
