import { addAthleteReport } from './firebase.js';
import { initBar, destroyAllBars } from './barchart.js';
import { initRadar } from './radar.js';
import { initStatEntry } from './stat_entry.js';
import { calculateChartData } from './chart_data.js';
import {
  collectAthleteData,
  loadAthleteDropdown,
  setupAthleteSelectionListener
} from './athlete_report.js';
import { openTab } from "./open_tab.js";

// Default/switch tabs
document.addEventListener("DOMContentLoaded", () => {
  const btnAdd = document.getElementById("btnAdd");
  const btnMain = document.getElementById("btnMain");
  const btnComp = document.getElementById("btnComp");
  const btnAbout = document.getElementById("btnAbout");

  btnAdd.addEventListener("click", (evt) => openTab("Add", evt.currentTarget));
  btnMain.addEventListener("click", (evt) => openTab("main", evt.currentTarget));
  btnComp.addEventListener("click", (evt) => openTab("Comp", evt.currentTarget));
  btnAbout.addEventListener("click", (evt) => openTab("About", evt.currentTarget));

  openTab("main", btnMain);
});

// Fetch individual stats data
const indivStatsResponse = await fetch('data/stats_2020_2024.json');
const indivStats = await indivStatsResponse.json();

// Event target for custom events
const events = new EventTarget();

// Set up references to DOM elements
const statListEl = document.querySelector('#stat-entry');
const positionDropdownEl = document.querySelector('#Add');

// Extract positions and stat names
const positions = Object.keys(indivStats);
const statNames = Object.keys(Object.values(indivStats)[0][0]);

// Initialize stat entry
initStatEntry(statListEl, positionDropdownEl, statNames, positions, events);

// Calculate chart data *before* using it in renderCharts
const chartData = calculateChartData(indivStats, events);

// Get chart elements
const chartElements = {
  strength: document.querySelector('#strength-chart'),
  power: document.querySelector('#power-chart'),
  speed: document.querySelector('#speed-chart'),
  agility: document.querySelector('#agility-chart'),
  anthro: document.querySelector('#anthropometrics-chart'),
  radar: document.querySelector('#radar-chart'),
};

// Define renderCharts after chartData is declared
function renderCharts() {
  const { playerRSI, positionMedians, playerPercentiles, playerStats, playerStatsValues, categoryPercentiles } =
    chartData.getCalculatedData();

    if (playerRSI > 0) 
      document.getElementById('rsi-display').textContent = "RSI: " + (Math.round((playerRSI + Number.EPSILON) * 100) / 100); 

  Object.values(chartElements).forEach((chartEl, index) => {
    if (index < 5) {
      initBar(chartEl, positionMedians, playerStats, playerStatsValues, playerPercentiles);
    } else {
      initRadar(chartElements.radar, categoryPercentiles);
    }
  });
}

// Add this listener *after* chartData & renderCharts are defined
window.addEventListener("mainTabActivated", () => {
  destroyAllBars();
  renderCharts();
});

// Initial render
renderCharts();

// Update charts on custom events
events.addEventListener('statFilled', renderCharts);
events.addEventListener('positionSelected', renderCharts);

// Load athletes
document.getElementById('load-athletes').addEventListener('click', function() {
  loadAthleteDropdown('athlete-list', 'myDropdown');
});

document.getElementById('load-athletes-1').addEventListener('click', function() {
  loadAthleteDropdown('athlete-list-1', 'myDropdown-1');
});

// Enable athlete selection from dropdown
setupAthleteSelectionListener('athlete-list', 'myDropdown', 'dropdown-container');
setupAthleteSelectionListener('athlete-list-1', 'myDropdown-1', 'dropdown-container-1');

// Save/update athlete data
document.getElementById('save-athlete').addEventListener('click', () => {
  const data = collectAthleteData();
  addAthleteReport(data);
});

export { renderCharts };
