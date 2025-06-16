'use strict';
// select[name='which-table']
// .display-table-btn
const whichTableDropdown = document.querySelector('select[name="which-table"]');
const displayTableBtn = document.querySelector('.display-table-btn');
const tables = [...document.querySelectorAll('.data-div')];
let selectedTable;
let currentlyDisplayed;

whichTableDropdown.addEventListener('change', function () {
  // remember arrow function don't get their own this keyword
  if (this.value) {
    selectedTable = this.value;
    console.log(selectedTable);
    displayTableBtn.disabled = false;
  } else {
    displayTableBtn.disabled = true;
  }
});

displayTableBtn.addEventListener('click', function () {
  whichTableDropdown.value = '';
  this.disabled = true;
  // hide previously displayed table
  currentlyDisplayed?.classList.add('hidden');

  for (const table of tables) {
    if (table.classList.contains(`${selectedTable.replaceAll(' ', '-')}`)) {
      currentlyDisplayed = table;
      table.classList.remove('hidden');
      break;
    }
  }
});
