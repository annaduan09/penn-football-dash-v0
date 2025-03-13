// search by name or postiion
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