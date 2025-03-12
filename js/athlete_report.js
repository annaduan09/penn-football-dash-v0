import { getAthleteReports } from './firebase.js';

function collectAthleteData() {
  const data = {};

  data.Name = document.getElementById('name-input').value.trim();
  data.Position = document.querySelector('#position-input select').value.trim();
  data.Status = document.getElementById('status-input').value.trim();
  data.Number = document.getElementById('number-input').value.trim();
  data.Notes = document.getElementById('coach-notes').value.trim();

  document.querySelectorAll('[id^="stat-entry-"]').forEach((input) => {
    data[input.name] = input.value ? parseFloat(input.value) : null;
  });

  return data;
}

async function loadAthleteDropdown() {
  const athleteList = document.getElementById('athlete-list');
  const dropdown = document.getElementById('myDropdown');
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

function populateAthleteFields(athleteData) {
  console.log("populate athlete fields");

  // Populate demographics
  document.getElementById('name-input').value = athleteData.Name || '';                 // Inputs
  document.getElementById('number-input').value = athleteData.Number || '';
  document.getElementById('status-input').value = athleteData.Status || '';
  document.getElementById('coach-notes').value = athleteData.Notes || '';

  document.getElementById('name-display').textContent = athleteData.Name || '';         // Displays
  document.getElementById('number-display').textContent = athleteData.Number || '';
  document.getElementById('status-display').textContent = athleteData.Status || '';

  // Update position dropdown
  const positionDropdown = document.querySelector('#position-input select');
  if (positionDropdown) {
    positionDropdown.value = athleteData.Position || 'DB';
    document.getElementById('position-display').textContent = athleteData.Position || '';
    positionDropdown.dispatchEvent(new Event('change'));
  }

  // Populate stat fields
  document.querySelectorAll('[id^="stat-entry-"]').forEach((input) => {
    const statName = input.name;

    if (athleteData[statName] !== undefined) {
      input.value = athleteData[statName] !== null ? athleteData[statName] : '';
      input.dispatchEvent(new Event('input'));
    }
  });

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

function setupAthleteSelectionListener() {
  const athleteList = document.getElementById('athlete-list');
  const dropdown = document.getElementById('myDropdown');

  // Close dropdown
  document.addEventListener('click', (event) => {
    const dropdownContainer = document.getElementById('dropdown-container');

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

      populateAthleteFields(athleteData);

      dropdown.classList.add('hidden');
      dropdown.classList.remove('visible');
    }
  });
}

export { collectAthleteData, loadAthleteDropdown, setupAthleteSelectionListener, populateAthleteFields };
