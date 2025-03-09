
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


// Load athletes
document.getElementById('load-athletes').addEventListener('click', loadAthleteDropdown);

// Enable athlete selection from dropdown
setupAthleteSelectionListener();