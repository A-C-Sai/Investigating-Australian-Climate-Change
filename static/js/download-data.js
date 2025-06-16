// Current metho is not reliable for large datasets as we hit the url length limit and get a 404 ERROR. Need to maybe store the queries and re-query the database to allow users to download the files. Maybe it can be done without the need of JS can jus using Flask.

// THIS IS NOT IN USE ANYMORE, IT IS EASIER TO JUST STORE THE QUERY AND RETRIEVE INFO USING QUERY.
const downloadBtns = document.querySelectorAll('.download-btn');

// we will have variable number of download btns throughout the websites
downloadBtns.forEach(function (downloadBtn) {
  // the below function will run when the download button is clicked
  downloadBtn.addEventListener('click', function () {
    // traversing the DOM to access the table
    const dataTable = this.parentElement.parentElement.querySelector('table');
    const tableName = this.parentElement.querySelector('.data-title').textContent;
    console.log(tableName);
    console.log(dataTable);

    // final structure of the object the will be sent to flask
    const data = { table: { title: '', columns: [], content: [] } };

    data['table']['title'] = tableName;

    const extractTableHeaders = function (table) {
      const tableHeader = table.querySelector('thead');
      const tableRows = tableHeader.querySelector('tr');
      const columns = tableRows.querySelectorAll('th p');

      columns.forEach(function (col) {
        data['table']['columns'].push(col.textContent);
      });
    };
    extractTableHeaders(dataTable);

    const extractTableData = function (table) {
      const tableBody = table.querySelector('tbody');
      const tableRows = tableBody.querySelectorAll('tr');

      tableRows.forEach(function (row) {
        const values = row.querySelectorAll('td');
        const temp = [];
        values.forEach(function (cell) {
          temp.push(cell.textContent);
        });
        data['table']['content'].push(temp);
      });
    };
    extractTableData(dataTable);
    console.log(data);

    // this is where we call the flask endpoint by send the table data extracted above, in return flask will send us a file which we will "catch" using javascript and prompt the user to download.
    fetch(`http://127.0.0.1:8090/download_data/${JSON.stringify(data)}`)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'your_data.csv';
        document.body.appendChild(a);
        a.click();
        a.remove();
      });
  });
});
