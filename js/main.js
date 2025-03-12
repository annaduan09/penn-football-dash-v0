import { addAthleteReport } from './firebase.js';
import { initChart } from './barchart.js';
import { initStatEntry } from './stat_entry.js';
import { calculateChartData } from './chart_data.js';

import {
  collectAthleteData,
  loadAthleteDropdown,
  setupAthleteSelectionListener
} from './athlete_report.js';


// Default/switch tabs
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("defaultOpen").click();
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



// Calculate chart data
const chartData = calculateChartData(indivStats, events);

const { positionMedians, playerPercentiles, playerStats, playerStatsValues, categoryPercentiles } =
    chartData.getCalculatedData();





// Init chart

let anthro = document.querySelector('#anthropometrics-chart')

let strength = document.querySelector('#strength-chart')

let speed = document.querySelector('#speed-chart')

let power = document.querySelector('#power-chart')

let agility = document.querySelector('#agility-chart')

initChart(anthro)
initChart(strength)
initChart(speed)
initChart(power)
initChart(agility)


// Load athletes
document.getElementById('load-athletes').addEventListener('click', loadAthleteDropdown);

// Enable athlete selection from dropdown
setupAthleteSelectionListener();

// Save/update athlete data
document.getElementById('save-athlete').addEventListener('click', () => {
  const data = collectAthleteData();
  addAthleteReport(data);
});
