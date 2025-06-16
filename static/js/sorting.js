// sort-table-dropdown
// sort-dropdown hide-sort-dropdown

const sortDropdownBtn = document.querySelectorAll('.sort-table-dropdown');
const sortBy = document.querySelectorAll('input[name="column"]');
const orderBy = document.querySelectorAll('input[name="sort-order"]');
const sortFrm = document.querySelector('form[name="sort-form"]');
const sortTableBtn = document.querySelector('.sort-table');

let inputSortBy;
let inputOrderBy;

// toggle the sort menu
sortDropdownBtn.forEach(function (btn) {
  btn.addEventListener('click', function () {
    console.log('working...');
    this.parentElement.querySelector('.sort-dropdown').classList.toggle('hide-sort-dropdown');

    // clear inputs
    sortBy.forEach(function (option) {
      option.checked = false;
    });

    orderBy.forEach(function (option) {
      option.checked = false;
    });
  });
});

// storing which column to sort by and in what order
sortBy.forEach(function (option) {
  option.addEventListener('click', function () {
    inputSortBy = option.value.toLowerCase();
  });
});

orderBy.forEach(function (option) {
  option.addEventListener('click', function () {
    inputOrderBy = option.value.toLowerCase();
  });
});

// what to do when the sort button is clicked
sortTableBtn.addEventListener('click', function (e) {
  // don't trigger the submit event
  e.preventDefault();
  console.log(inputSortBy, inputOrderBy);
  // hide the sort menu
  this.parentElement.parentElement.parentElement.classList.toggle('hide-sort-dropdown');

  // clear inputs
  sortBy.forEach(function (option) {
    option.checked = false;
  });

  orderBy.forEach(function (option) {
    option.checked = false;
  });

  // number of columns in table will help us in breaking down the table
  const columns =
    this.parentElement.parentElement.parentElement.parentElement.querySelector('thead tr').childElementCount - 1;

  // retrieving the col names will help use late to decide which col index to sort by
  const colNames = [
    ...this.parentElement.parentElement.parentElement.parentElement.querySelectorAll('thead tr th'),
  ].map((n) => n.textContent);

  // finding which index to sort by, will help us later
  const sortIdx = colNames.indexOf(inputSortBy);
  console.log(sortIdx);

  console.log(colNames);

  // need to convert NodeList to array
  const values = [
    ...this.parentElement.parentElement.parentElement.parentElement.querySelector('tbody').querySelectorAll('td'),
  ];

  // processing values to their respective datatype
  const processedValues = values.map(function (value) {
    const v = value.textContent;
    if (isNaN(Number(v))) {
      return v;
    }
    return Number(v);
  });

  console.log(processedValues);

  // grouping values b4 sorting
  const groupValues = function (arr, cols) {
    const n = arr.length / cols;
    const temp = [];
    for (let i = 0; i < n; i++) {
      temp.push(arr.splice(0, cols));
    }
    return temp;
  };

  const groupedValues = groupValues(processedValues, columns);

  console.log(groupedValues);

  // ascending = 1, descending = 2
  const sortOrder = inputOrderBy === 'ascending' ? 1 : 2;

  const sortValues = function (arr, sortIndex, sortOrder) {
    if (sortOrder === 1) {
      arr.sort(function (a, b) {
        if (a[sortIndex] < b[sortIndex]) return -1;
        else if (a[sortIndex] > b[sortIndex]) return 1;
        return 0;
      });
    } else {
      arr.sort(function (a, b) {
        if (a[sortIndex] > b[sortIndex]) return -1;
        else if (a[sortIndex] < b[sortIndex]) return 1;
        return 0;
      });
    }
  };

  sortValues(groupedValues, sortIdx, sortOrder);

  console.log(groupedValues);

  const sortedValues = groupedValues.flat();

  values.forEach((n, idx, _) => (n.textContent = sortedValues[idx]));
});
