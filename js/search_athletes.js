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

document.addEventListener("DOMContentLoaded", () => {
  const inputEl = document.getElementById("myInput");
  const dropdownEl = document.getElementById("myDropdown");

  console.log(inputEl);
  console.log(inputEl.value);

  const inputEl1 = document.getElementById("myInput-1");
  const dropdownEl1 = document.getElementById("myDropdown-1");

  console.log(inputEl1);
  console.log(inputEl1.value);

  if (inputEl && dropdownEl) {
  inputEl.addEventListener("keyup", () => {
    console.log("chart page");
    filterFunction(inputEl, dropdownEl);
  })
  };

  if (inputEl1 && dropdownEl1) {
  inputEl1.addEventListener("keyup", () => {
    console.log("stat page");
    filterFunction(inputEl1, dropdownEl1);
  })
};

});

  export { filterFunction };
