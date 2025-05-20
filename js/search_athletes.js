function filterFunction(input, dropdown) {
  const filter = input.value.toUpperCase();
  const li = dropdown.getElementsByTagName("li");
  for (let i = 0; i < li.length; i++) {
    const txtValue = li[i].textContent || li[i].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
}

// load dropdowns
document.addEventListener("DOMContentLoaded", () => {
  const dropdownPairs = [
    { inputId: "name-search-main", dropdownId: "dropdown-main", pageName: "chart page" },
    { inputId: "name-search-add", dropdownId: "dropdown-add", pageName: "stat page" },
    { inputId: "name-search-comp-1", dropdownId: "dropdown-comp-1", pageName: "page 2" },
    { inputId: "name-search-comp-2", dropdownId: "dropdown-comp-2", pageName: "page 3" }
  ];

  dropdownPairs.forEach(({ inputId, dropdownId, pageName }) => {
    const inputEl = document.getElementById(inputId);
    const dropdownEl = document.getElementById(dropdownId);

    if (inputEl && dropdownEl) {
      inputEl.addEventListener("keyup", () => {
        console.log(pageName);
        filterFunction(inputEl, dropdownEl);
      });
    }
  });
});


  export { filterFunction };
