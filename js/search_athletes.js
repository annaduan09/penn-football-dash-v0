// Pick athlete button clicked -> show dropdown
function showDropdown() {
  console.log("Toggle dropdown");
  document.getElementById("myDropdown").classList.toggle("visible");
  //document.getElementById("athlete-list").classList.toggle("visible");
  }
  
// search by name or postiion
  function filterFunction() {
    const input = document.getElementById("myInput");
    const filter = input.value.toUpperCase();
    const div = document.getElementById("myDropdown");
    const ul = div.getElementsByTagName("ul");
    for (let i = 0; i < ul.length; i++) {
      txtValue = ul[i].textContent || ul[i].innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        ul[i].style.display = "";
      } else {
        ul[i].style.display = "none";
      }
    }
  }

  window.showDropdown = showDropdown;