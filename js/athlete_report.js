import { getAthleteReports } from './firebase.js';

function collectAthleteData() {
  const data = {};

  data.Name = document.getElementById('name-input').value.trim();
  data.Position = document.querySelector('#position-input select').value.trim();
  data.Status = document.getElementById('status-input').value.trim();
  data.Number = document.getElementById('number-input').value.trim();

  document.querySelectorAll('[id^="stat-entry-"]').forEach((input) => {
    data[input.name] = input.value ? parseFloat(input.value) : null;
  });
  return data;
}

async function loadAthleteDropdown(listEl, dropdownEl) {
  const athleteList = document.getElementById(listEl);
  const dropdown = document.getElementById(dropdownEl);
  toggleDropdownVisibility(dropdown);

  if (dropdown.classList.contains('visible')) {
    athleteList.innerHTML = '';
    const athletes = await getAthleteReports();

    athletes.forEach((athlete) => {
      const listItem = document.createElement('li');
      listItem.textContent = `${athlete.Name} (${athlete.Position}) - ${athlete.Status}`;
      listItem.dataset.athlete = JSON.stringify(athlete);
      listItem.classList.add('athlete-item');
      athleteList.appendChild(listItem);
    });
  }
}

function toggleDropdownVisibility(el) {
  el.classList.toggle('hidden');
  el.classList.toggle('visible');
}

// data entry page
function populateEntryPage(athleteData) {

  // Populate demographics
  document.getElementById('name-input').value = athleteData.Name || '';             
  document.getElementById('number-input').value = athleteData.Number || '';
  document.getElementById('status-input').value = athleteData.Status || '';

  // Populate stat fields
  document.querySelectorAll('[id^="stat-entry-"]').forEach((input) => {
    const statName = input.name;

    if (athleteData[statName] !== undefined) {
      input.value = athleteData[statName] !== null ? athleteData[statName] : '';
      input.dispatchEvent(new Event('input'));
    }
  });
}


// chart page
function populateChartPage(athleteData) {

  // Populate demographics
  document.getElementById('name-display').textContent = athleteData.Name || '';        
  document.getElementById('number-display').textContent = athleteData.Number || '';
  document.getElementById('status-display').textContent = athleteData.Status || '';

  // Update position 
  const positionDropdown = document.querySelector('#position-input select');
  
  if (positionDropdown) {
    positionDropdown.value = athleteData.Position || 'DB';
    document.getElementById('position-display').textContent = athleteData.Position || '';
    positionDropdown.dispatchEvent(new Event('change'));
  }

  // Resize demographic inputs
  const inputsToResize = ['#name-input', '#number-input', '#status-input'];
  inputsToResize.forEach((selector) => {
    const input = document.querySelector(selector);
    if (input) {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      const font = window.getComputedStyle(input).font;
      context.font = font;
      const textWidth = context.measureText(input.value || '').width;
      const padding = 15;
      const minWidth = 50;
      input.style.width = `${Math.max(textWidth + padding, minWidth)}px`;
    }
  });
}


// comparison page
function populateComparePage(athleteData, num) {

  // Populate demographics
  document.getElementById('athlete-' + num + '-name').textContent = athleteData.Name || '';         // Displays
  document.getElementById('athlete-' + num + '-year').textContent = athleteData.Status || '';
// rsi


  // Populate stat fields
  const prefix = `athlete-` + num + "-";

  document.querySelectorAll(`[id^="${prefix}"]`).forEach((element) => {
    const statName = element.id.replace(prefix, '');

    if (athleteData[statName] !== undefined) {
      element.textContent = athleteData[statName] !== null ? athleteData[statName] : '';
    }
  });

// Get RSI
let squat1 = Number(document.getElementById('athlete-1-Squat').textContent);
let bench1 = Number(document.getElementById('athlete-1-Bench').textContent);
let weight1 = Number(document.getElementById('athlete-1-Weight').textContent);



let squat2 = Number(document.getElementById('athlete-2-Squat').textContent);
let bench2 = Number(document.getElementById('athlete-2-Bench').textContent);
let weight2 = Number(document.getElementById('athlete-2-Weight').textContent);

let rsi1 = weight1 ? ((squat1 + bench1) / (weight1 * 2)).toFixed(2) : '';
let rsi2 = weight2 ? ((squat2 + bench2) / (weight2 * 2)).toFixed(2) : '';

document.getElementById('athlete-1-rsi').textContent = "RSI: " + rsi1 || '';
document.getElementById('athlete-2-rsi').textContent = "RSI: " + rsi2 || '';
}

function setupAthleteSelectionListener(listEl, dropdownEl, dropdownContainerEl) {
  const athleteList = document.getElementById(listEl);
  const dropdown = document.getElementById(dropdownEl);


  // Close dropdown
  document.addEventListener('click', (event) => {
    const dropdownContainer = document.getElementById(dropdownContainerEl);

    if (!dropdownContainer.contains(event.target)) {
      dropdown.classList.add('hidden');
      dropdown.classList.remove('visible');
    }
  });

  // On athlete selection..
  athleteList.addEventListener('click', (event) => {
    const target = event.target;


    if (target.classList.contains('athlete-item')) {
      const athleteData = JSON.parse(target.dataset.athlete);

      if (dropdownEl == "myDropdown") {
        populateChartPage(athleteData);
        populateEntryPage(athleteData);
        
      } else if (dropdownEl == "myDropdown-1") {
        populateEntryPage(athleteData);
      } else if (dropdownEl == "myDropdown-2") {
        populateComparePage(athleteData, 1);
      } else {
        populateComparePage(athleteData, 2);
      }

      dropdown.classList.add('hidden');
      dropdown.classList.remove('visible');
    }
  });
}

export { collectAthleteData, loadAthleteDropdown, setupAthleteSelectionListener };
