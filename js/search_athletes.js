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
    { inputId: "myInput", dropdownId: "myDropdown", pageName: "chart page" },
    { inputId: "myInput-1", dropdownId: "myDropdown-1", pageName: "stat page" },
    { inputId: "myInput-2", dropdownId: "myDropdown-2", pageName: "page 2" },
    { inputId: "myInput-3", dropdownId: "myDropdown-3", pageName: "page 3" }
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
