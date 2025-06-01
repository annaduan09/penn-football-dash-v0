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
      listItem.textContent = `${athlete.Name} - ${athlete.Position} - ${athlete.Status}`;
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

}

function updateHeadshot(name, imgElement) {
  if (!name || !imgElement) return;
  
  let processedName = name;
  
  // Check if name contains suffix
  const suffixPattern = /,\s*(jr\.?|sr\.?|ii|iii|iv|v|vi)$/i;
  const suffixMatch = name.match(suffixPattern);
  
  if (suffixMatch) {
      const suffix = suffixMatch[1].replace(/\./g, ''); 
      const nameWithoutSuffix = name.replace(suffixPattern, '');
      processedName = nameWithoutSuffix + '-' + suffix;
  }
  
  const fileName = processedName.toLowerCase().replace(/\s+/g, "-") + ".jpg";
  const imagePath = `www/headshots/${fileName}`;
  
  imgElement.onerror = () => {
      imgElement.src = "www/headshots/empty.jpg";
  };

  imgElement.src = imagePath;
}


function updateCompChecks() {
  const inverseStats = [ // better when lower
    'Flying 10', '10Y Sprint', '60Y Shuttle', 'L Drill', 'Pro Agility',
  ];
  const prefix = `athlete-1-`;

  document.querySelectorAll(`[id^="${prefix}"]`).forEach((element) => {
    const item = element.id.replace(prefix, '');
    const statName = item.replace("-check", '');

    const value1_id = `athlete-1-${statName}`;
    const value2_id = `athlete-2-${statName}`;

    const value1 = document.getElementById(value1_id);
    const value2 = document.getElementById(value2_id);

    const val1 = parseFloat(value1?.textContent);
    const val2 = parseFloat(value2?.textContent);


    // Hide both checkmarks first
    const check1 = document.getElementById(`athlete-1-${statName}-check`);
    const check2 = document.getElementById(`athlete-2-${statName}-check`);
    if (check1) check1.style.display = "none";
    if (check2) check2.style.display = "none";

    if (isNaN(val1) || isNaN(val2) || val1 <= 0 || val2 <= 0 || val2 == val1) return;

    let better_num;
    if (inverseStats.includes(statName)) {
      better_num = val1 < val2 ? 1 : 2;
    } else {
      better_num = val1 > val2 ? 1 : 2;
    }

    const check_id = `athlete-${better_num}-${statName}-check`;
    const checkElement = document.getElementById(check_id);
    if (checkElement) {
      checkElement.style.display = "block";
    }
  });
}




// comp page
function populateComparePage(athleteData, num) {

  // Populate demographics
  document.getElementById('athlete-' + num + '-name').textContent = athleteData.Name || '';         // Displays
  document.getElementById('athlete-' + num + '-position').textContent = athleteData.Position || '';
  document.getElementById('athlete-' + num + '-year').textContent = athleteData.Status || '';


  // Populate stat fields
  const prefix = `athlete-` + num + "-";

  document.querySelectorAll(`[id^="${prefix}"]`).forEach((element) => {
    const statName = element.id.replace(prefix, '');

    if (athleteData[statName] !== undefined) {
      if (statName == "Weight") {
        element.textContent = athleteData["Weight"]|| '';
      } else if (statName == "Height") {
        element.textContent = athleteData["Height"]|| '';
      } else {
      element.textContent = athleteData[statName] > 0 ? athleteData[statName] : '';
    }
  }
  });

// Get TSA
let squat1 = Number(document.getElementById('athlete-1-Squat').textContent); // in title case to be compatible with keys in latest_tests_2020_2024.json
let bench1 = Number(document.getElementById('athlete-1-Bench').textContent);
let weight1 = Number(document.getElementById('athlete-1-Weight').textContent);

let squat2 = Number(document.getElementById('athlete-2-Squat').textContent);
let bench2 = Number(document.getElementById('athlete-2-Bench').textContent);
let weight2 = Number(document.getElementById('athlete-2-Weight').textContent);

let TSA1 = weight1 ? ((squat1 + bench1) / (weight1 * 2)).toFixed(2) : '';
let TSA2 = weight2 ? ((squat2 + bench2) / (weight2 * 2)).toFixed(2) : '';

document.getElementById('athlete-1-tsa').textContent = "TSA: " + TSA1 || '';
document.getElementById('athlete-2-tsa').textContent = "TSA: " + TSA2 || '';
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

      if (dropdownEl == "dropdown-main") {
        populateChartPage(athleteData);
        populateEntryPage(athleteData);
        updateHeadshot(athleteData.Name, document.getElementById("headshot-main"));
        updateHeadshot(athleteData.Name, document.getElementById("headshot-add"));
        
      } else if (dropdownEl == "dropdown-add") {
        populateChartPage(athleteData);
        populateEntryPage(athleteData);
        updateHeadshot(athleteData.Name, document.getElementById("headshot-main"));
        updateHeadshot(athleteData.Name, document.getElementById("headshot-add"));

      } else if (dropdownEl == "dropdown-comp-1") {
        populateComparePage(athleteData, 1);
        updateHeadshot(athleteData.Name, document.getElementById("headshot-comp-1"));
        updateCompChecks()
      } else {
        populateComparePage(athleteData, 2);
        updateHeadshot(athleteData.Name, document.getElementById("headshot-comp-2"));
        updateCompChecks()
      }

      dropdown.classList.add('hidden');
      dropdown.classList.remove('visible');
    }
  });
}

export { collectAthleteData, loadAthleteDropdown, setupAthleteSelectionListener };
