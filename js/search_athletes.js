function filterFunction(inputEl, dropdownEl) {
    const input = document.getElementById(inputEl);
    const filter = input.value.toUpperCase();
    const div = document.getElementById(dropdownEl);
    const li = div.getElementsByTagName("li");
    for (let i = 0; i < li.length; i++) {
      txtValue = li[i].textContent || li[i].innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        li[i].style.display = "";
      } else {
        li[i].style.display = "none";
      }
    }
  }

document.addEventListener("DOMContentLoaded", () => {
  const inputEl = document.getElementById("myInput");
  const dropdownEl = document.getElementById("myDropdown");

  const inputEl1 = document.getElementById("myInput-1");
  const dropdownEl1 = document.getElementById("myDropdown-1");

  if (inputEl && dropdownEl) {
  inputEl.addEventListener("keyup", () => {
    filterFunction(inputEl, dropdownEl);
  })
  };

  if (inputEl1 && dropdownEl1) {
  inputEl1.addEventListener("keyup", () => {
    filterFunction(inputEl1, dropdownEl1);
  })
};

});

  export { filterFunction };
