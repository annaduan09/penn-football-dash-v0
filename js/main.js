
import { initChart } from './barchart.js';
import { initStatEntry } from './stat_entry.js';
import { calculateChartData } from './chart_data.js';

import {
    loadAthleteDropdown,
    setupAthleteSelectionListener,
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


// Load athletes
document.getElementById('load-athletes').addEventListener('click', loadAthleteDropdown);

// Enable athlete selection from dropdown
setupAthleteSelectionListener();


// Init chart

let anthro = document.querySelector('#anthropometrics-chart')

initChart(anthro)