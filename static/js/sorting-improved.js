// The below code is the improved version of sorting functionality
// This sorting is in-build into the table, leading to a cleaner and more intuitive UI
// Users can reset the table to its original state by double-clicking on the column headers

const sortHeaderBtn = document.querySelectorAll('.sort-col-btn');
// NEW
const whichTableMenu = document.querySelector('select[name="which-table"]');
const showTableBtn = document.querySelector('.display-table-btn');
let currentTable = {};

showTableBtn.addEventListener('click', function () {
  if (currentTable['table']) {
    // FIXME: this function is repeating, change to function if time permits
    // resetting table when the user decides to look at a new table.
    console.log(currentTable['table']);
    currentTable['activeColObj'] = undefined;
    currentTable['activeCol'] = undefined;
    currentTable['sortOrder'] = undefined;
    console.log(currentTable);
    currentTable['table'].parentElement.querySelector('.sorted-by').textContent = 'N/A';
    currentTable['table'].parentElement.querySelector('.order').textContent = 'N/A';
    currentTable['table'].querySelectorAll('thead ion-icon').forEach((icon) => {
      icon.style.opacity = 0;
    });
    [...currentTable['table'].querySelectorAll('tbody td')].forEach((cell, idx, _) => {
      cell.textContent = currentTable['originalValues'][idx];
    });
    currentTable = {};
  }
  // table DOM object
  currentTable['table'] = document
    .querySelector(`.${whichTableMenu.value.replaceAll(' ', '-')}`)
    .querySelector('table');
  // number of columns in table will help us in breaking down the table
  currentTable['numCols'] = currentTable['table'].querySelector('thead tr').childElementCount - 1;
  // retrieving the col names will help use it lateer to decide which col index to sort by
  currentTable['cols'] = [...currentTable['table'].querySelectorAll('thead th p')].map((col) => col.textContent);
  // original values, if the user wants to revert to the default state
  currentTable['originalValues'] = [...currentTable['table'].querySelector('tbody').querySelectorAll('td')].map(
    (cell) => cell.textContent
  );
  currentTable['activeColObj'] = [];
  console.log(currentTable);
});
// END

let flag = 1;

const resetToDefault = function (e) {
  // THIS WILL ALLOW USERS TO RESET THE TABLE TO ORIGINAL FUNCTIONALITY BY DOUBLE CLICKING ANY HEADER
  flag = 0;
  console.log('RESETTING');
  currentTable['activeColObj'] = undefined;
  currentTable['activeCol'] = undefined;
  currentTable['sortOrder'] = undefined;
  this.parentElement.parentElement.parentElement.parentElement.parentElement.querySelector('.sorted-by').textContent =
    'N/A';
  this.parentElement.parentElement.parentElement.parentElement.parentElement.querySelector('.order').textContent =
    'N/A';
  currentTable['table'].querySelectorAll('thead ion-icon').forEach((icon) => {
    icon.style.opacity = 0;
  });
  [...currentTable['table'].querySelectorAll('tbody td')].forEach((cell, idx, _) => {
    cell.textContent = currentTable['originalValues'][idx];
  });
  setTimeout(() => {
    flag = 1;
  }, 1000);
};

// sortHeaderBtn.forEach(function (colBtn) {
//   colBtn.addEventListener('dblclick', function () {
//     console.log('DOUBLE CLICK DETECTED');
//     // dynamic paragraph
//     this.parentElement.parentElement.parentElement.parentElement.parentElement.querySelector('.sorted-by').textContent =
//       'N/A';
//     this.parentElement.parentElement.parentElement.parentElement.parentElement.querySelector('.order').textContent =
//       'N/A';
//   });
// });

sortHeaderBtn.forEach(function (colBtn) {
  colBtn.addEventListener('dblclick', resetToDefault);
});

// inputSortBy = currentTable['activeCol']
// sortOrder = currentTable['sortOrder']
// columns = currentTable['numCols']
// colNames = currentTable['cols']
sortHeaderBtn.forEach(function (colBtn) {
  colBtn.addEventListener('click', function () {
    setTimeout(() => {
      if (flag) {
        // RESET TABLE TO DEFAULT FUNCTIONALITY
        // if (currentTable['activeColObj'].length) {
        //   currentTable['activeColObj'].pop().removeEventListener('dblclick', resetToDefault);
        // }
        // currentTable['activeColObj'].push(this);
        // this.addEventListener('dblclick', resetToDefault);

        // removing the arrow icon from previously sorted column if any.
        // REMEMBER we cannot use the break statement in the forEach loop
        [...currentTable['table'].querySelectorAll('thead th')].forEach((colBtn) => {
          if (colBtn.querySelector('p').textContent === currentTable['activeCol']) {
            colBtn.querySelector('ion-icon').style.opacity = 0;
          }
        });

        // this fixes the problem where the sortOrder from previous column is linked with the new sort col
        if (this.querySelector('p').textContent.toLowerCase() !== currentTable['activeCol'])
          currentTable['sortOrder'] = undefined;

        // what column to sort by
        currentTable['activeCol'] = this.querySelector('p').textContent.toLowerCase();
        console.log(currentTable['activeCol']);

        [...currentTable['table'].querySelectorAll('thead th')].forEach((colBtn) => {
          if (colBtn.querySelector('p').textContent === currentTable['activeCol']) {
            colBtn.querySelector('ion-icon').style.opacity = 1;
          }
        });
        // 1 = sort ascending, 2 = sort descending
        if (!currentTable['sortOrder']) {
          currentTable['sortOrder'] = 1;
        } else if (currentTable['sortOrder'] === 1) currentTable['sortOrder'] = 2;
        else currentTable['sortOrder'] = 1;

        console.log('SORT ORDER', currentTable['sortOrder']);

        // dynamic paragraph
        this.parentElement.parentElement.parentElement.parentElement.parentElement.querySelector(
          '.sorted-by'
        ).textContent = currentTable['activeCol'];
        this.parentElement.parentElement.parentElement.parentElement.parentElement.querySelector('.order').textContent =
          currentTable['sortOrder'] === 1 ? 'asc' : 'desc';

        // finding which index to sort by, will help us later
        const sortIdx = currentTable['cols'].indexOf(currentTable['activeCol']);
        console.log(sortIdx);

        // need to convert NodeList to array
        const values = [...currentTable['table'].querySelector('tbody').querySelectorAll('td')];
        console.log(values);

        // processing values to their respective datatype
        const processedValues = values.map(function (value) {
          const v = value.textContent;
          if (isNaN(Number(v)) || v === '') {
            // empty string result in 0 so need to be careful
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
        const groupedValues = groupValues(processedValues, currentTable['numCols']);
        console.log(groupedValues);

        // ---------------------------------------------------------------------------------------
        // sorting values
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
        sortValues(groupedValues, sortIdx, currentTable['sortOrder']);
        console.log(groupedValues);

        const sortedValues = groupedValues.flat();

        // displaying sorted values in table
        values.forEach((n, idx, _) => (n.textContent = sortedValues[idx]));

        // toggle ascending to descending
        this.querySelector('ion-icon').name =
          currentTable['sortOrder'] === 1 ? 'arrow-up-outline' : 'arrow-down-outline';
      }
    }, 150);
  });
});

// ########################## OLD AND MINIMAL FUNCTIONALITY SORTING

// sortHeaderBtn.forEach(function (colBtn) {
//   colBtn.addEventListener('click', function () {
//     // what column to sort by
//     const inputSortBy = this.querySelector('p').textContent.toLowerCase();
//     console.log(inputSortBy);
//     // 1 = sort ascending, 2 = sort descending
//     const sortOrder = this.querySelector('ion-icon').name === 'arrow-up-outline' ? 1 : 2;
//     console.log(sortOrder);

//     // dynamic paragraph
//     this.parentElement.parentElement.parentElement.parentElement.parentElement.querySelector('.sorted-by').textContent =
//       inputSortBy;
//     this.parentElement.parentElement.parentElement.parentElement.parentElement.querySelector('.order').textContent =
//       sortOrder === 1 ? 'asc' : 'desc';

//     // number of columns in table will help us in breaking down the table
//     const columns = this.parentElement.parentElement.childElementCount - 1;
//     console.log(columns);

//     // retrieving the col names will help use late to decide which col index to sort by
//     const colNames = [...this.parentElement.parentElement.querySelectorAll('p')].map((n) => n.textContent);
//     console.log(colNames);

//     // finding which index to sort by, will help us later
//     const sortIdx = colNames.indexOf(inputSortBy);
//     console.log(sortIdx);

//     //   // need to convert NodeList to array
//     const values = [
//       ...this.parentElement.parentElement.parentElement.parentElement.querySelector('tbody').querySelectorAll('td'),
//     ];
//     console.log(values);

//     // processing values to their respective datatype
//     const processedValues = values.map(function (value) {
//       const v = value.textContent;
//       if (isNaN(Number(v))) {
//         return v;
//       }
//       return Number(v);
//     });
//     console.log(processedValues);

//     // grouping values b4 sorting
//     const groupValues = function (arr, cols) {
//       const n = arr.length / cols;
//       const temp = [];
//       for (let i = 0; i < n; i++) {
//         temp.push(arr.splice(0, cols));
//       }
//       return temp;
//     };
//     const groupedValues = groupValues(processedValues, columns);
//     console.log(groupedValues);

//     // sorting values
//     const sortValues = function (arr, sortIndex, sortOrder) {
//       if (sortOrder === 1) {
//         arr.sort(function (a, b) {
//           if (a[sortIndex] < b[sortIndex]) return -1;
//           else if (a[sortIndex] > b[sortIndex]) return 1;
//           return 0;
//         });
//       } else {
//         arr.sort(function (a, b) {
//           if (a[sortIndex] > b[sortIndex]) return -1;
//           else if (a[sortIndex] < b[sortIndex]) return 1;
//           return 0;
//         });
//       }
//     };
//     sortValues(groupedValues, sortIdx, sortOrder);
//     console.log(groupedValues);

//     const sortedValues = groupedValues.flat();

//     // displaying sorted values in table
//     values.forEach((n, idx, _) => (n.textContent = sortedValues[idx]));

//     // toggle ascending to descending
//     this.querySelector('ion-icon').name =
//       this.querySelector('ion-icon').name === 'arrow-up-outline' ? 'arrow-down-outline' : 'arrow-up-outline';
//   });
// });
