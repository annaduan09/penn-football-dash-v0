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

  btnAdd.addEventListener("click", (evt) => openTab("stat", evt.currentTarget));
  btnMain.addEventListener("click", (evt) => openTab("chart", evt.currentTarget));
  btnComp.addEventListener("click", (evt) => openTab("comp", evt.currentTarget));
  btnAbout.addEventListener("click", (evt) => openTab("About", evt.currentTarget));

  openTab("chart", btnMain);
});

// Fetch individual stats data
const indivStatsResponse = await fetch('data/stats_20_25.json');
const indivStats = await indivStatsResponse.json();

// Event target for custom events
const events = new EventTarget();

// Set up references to DOM elements
const statListEl = document.querySelector('#stat-entry');
const positionDropdownEl = document.querySelector('#stat');

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
  const { playerTSA, positionMedians, playerPercentiles, playerStats, playerStatsValues, categoryPercentiles } =
    chartData.getCalculatedData();

    if (playerTSA > 0) 
      document.getElementById('TSA-display').textContent = "TSA: " + (Math.round((playerTSA + Number.EPSILON) * 100) / 100); 

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
document.getElementById('load-athletes-main').addEventListener('click', function() {
  loadAthleteDropdown('athlete-list-main', 'dropdown-main');
});

document.getElementById('load-athletes-add').addEventListener('click', function() {
  loadAthleteDropdown('athlete-list-add', 'dropdown-add');
});

document.getElementById('load-athletes-main-comp-1').addEventListener('click', function() {
  loadAthleteDropdown('athlete-list-comp-1', 'dropdown-comp-1');
});

document.getElementById('load-athletes-main-comp-2').addEventListener('click', function() {
  loadAthleteDropdown('athlete-list-comp-2', 'dropdown-comp-2');
});

// Enable athlete selection from dropdown
setupAthleteSelectionListener('athlete-list-main', 'dropdown-main', 'dropdown-container');
setupAthleteSelectionListener('athlete-list-add', 'dropdown-add', 'dropdown-container-add');
setupAthleteSelectionListener('athlete-list-comp-1', 'dropdown-comp-1', 'dropdown-container-comp-1');
setupAthleteSelectionListener('athlete-list-comp-2', 'dropdown-comp-2', 'dropdown-container-comp-2');

// Save/update athlete data
document.getElementById('save-athlete').addEventListener('click', () => {
  const data = collectAthleteData();
  addAthleteReport(data);
});


// Bulk stat upload
/* const finalStatsResponse = await fetch('data/latest_tests_20_25.json');
const finalStats = await finalStatsResponse.json();

finalStats.Name.forEach((Name, index) => {
  const athlete = {}
  athlete.Name = finalStats.Name[index]
  athlete.Position = finalStats.Position[index]
  athlete.Status = finalStats.Status[index]
  athlete.Number = finalStats.Number[index]
  athlete.Height = finalStats.Height[index]
  athlete.Weight = finalStats.Weight[index]
  athlete.Wingspan = finalStats.Wingspan[index]
  athlete.Bench = finalStats.Bench[index]
  athlete.Squat = finalStats.Squat[index]
  athlete['225lb Bench'] = finalStats['225lb Bench'][index]
  athlete['Vertical Jump'] = finalStats['Vertical Jump'][index]
  athlete['Broad Jump'] = finalStats['Broad Jump'][index]
  athlete['Hang Clean'] = finalStats['Hang Clean'][index]
  athlete['Power Clean'] = finalStats['Power Clean'][index]
  athlete['10Y Sprint'] = finalStats['10Y Sprint'][index]
  athlete['Flying 10'] = finalStats['Flying 10'][index]
  athlete['Pro Agility'] = finalStats['Pro Agility'][index]
  athlete['L Drill'] = finalStats['L Drill'][index]
  athlete['60Y Shuttle'] = finalStats['60Y Shuttle'][index]

  addAthleteReport(athlete)
}); */






export { renderCharts };
