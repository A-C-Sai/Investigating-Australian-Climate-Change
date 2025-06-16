// // storing inputs into session storage to persist form inputs
// const rememberFormData = function (...form_feilds) {
//   // local storage is an API that the browser provides
//   for (const feild of form_feilds) {
//     sessionStorage.setItem(feild.getAttribute('name'), feild.value);
//   }
// };

// const retrieveFormData = function (...form_feilds) {
//   // session storage is an API that the browser provides
//   for (const feild of form_feilds) {
//     feild.value = sessionStorage.getItem(feild.getAttribute('name')) ?? '';
//   }
// };

const state = document.querySelector('select[name="state-sidebar"]');
const startLatitude = document.querySelector('input[name="start-latitude-sidebar"]');
const endLatitude = document.querySelector('input[name="end-latitude-sidebar"]');
const climateMetric = document.querySelector('select[name="climate-metric-sidebar"]');
const minLatSpan = document.querySelector('.min-lat');
const maxLatSpan = document.querySelector('.max-lat');
const period = document.querySelector('select[name="period-sidebar"]');
const submitBtn = document.querySelector('button[type="submit"]');

// retrieveFormData(state, startLatitude, endLatitude, climateMetric, period);

let currState = state.value;
state.addEventListener('change', function () {
  if (this.value) {
    fetch(`http://127.0.0.1:8090/get_min_max_lat/${this.value}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        const step = ((data[0].max_lat - data[0].min_lat) / 50).toFixed(3);
        startLatitude.step = endLatitude.step = step;
        startLatitude.min = endLatitude.min = Number(data[0].min_lat);
        startLatitude.max = endLatitude.max = Number(data[0].max_lat);

        startLatitude.value = endLatitude.value = '';
        climateMetric.value = '';
        period.value = '';

        minLatSpan.textContent = `(${Number(data[0].min_lat)})`;
        maxLatSpan.textContent = `(${Number(data[0].max_lat)})`;
      });
    startLatitude.disabled = false;
  } else {
    minLatSpan.textContent = ``;
    maxLatSpan.textContent = ``;
    startLatitude.disabled = true;
    startLatitude.value = '';
    endLatitude.disabled = true;
    endLatitude.value = '';
    climateMetric.disabled = true;
    climateMetric.value = '';
    period.disabled = true;
    period.value = '';
    submitBtn.disabled = true;
  }
});

startLatitude.addEventListener('change', function () {
  if (this.value) {
    // DONT FORGET VALUE IS OF TYPE STRING
    endLatitude.min = startLatitude.value;

    endLatitude.disabled = false;
  } else {
    endLatitude.disabled = true;
    endLatitude.value = '';
    climateMetric.disabled = true;
    climateMetric.value = '';
    period.disabled = true;
    period.value = '';
    submitBtn.disabled = true;
  }
});

endLatitude.addEventListener('change', function () {
  if (this.value) {
    // DONT FORGET VALUE IS OF TYPE STRING

    climateMetric.disabled = false;
  } else {
    climateMetric.disabled = true;
    climateMetric.value = '';
    period.disabled = true;
    period.value = '';
    submitBtn.disabled = true;
  }
});

climateMetric.addEventListener('change', function () {
  if (this.value) {
    period.disabled = false;
  } else {
    period.disabled = true;
    period.value = '';
    submitBtn.disabled = true;
  }
});
period.addEventListener('change', function () {
  if (this.value) {
    submitBtn.disabled = false;
  } else {
    submitBtn.disabled = true;
  }
});

const frm = document.querySelector('form[name="sidebar-form"]');

frm.addEventListener('submit', function (e) {
  if (this.elements['start-latitude-sidebar'].value === this.elements['end-latitude-sidebar'].value) {
    e.preventDefault();
    alert('Please Ensure Start & End Latitudes are NOT the same!');
  }
  // } else {
  //   rememberFormData(state, startLatitude, endLatitude, climateMetric, period);
  // }
});

// PROGRESSIVE DISCLOSURE, MAY IRRITATE THE USER OLD VERSION
// state.addEventListener('click', function () {
//   if (this.value) {
//     fetch(`http://127.0.0.1:8090/get_min_max_lat/${this.value}`)
//       .then((response) => response.json())
//       .then((data) => {
//         console.log(data);
//         const step = ((data[0].max_lat - data[0].min_lat) / 10).toFixed(3);
//         startLatitude.step = endLatitude.step = step;
//         startLatitude.min = endLatitude.min = Number(data[0].min_lat);
//         startLatitude.max = endLatitude.max = Number(data[0].max_lat);
//         startLatitude.disabled = false; // can use .setAttribute('disable', false) also
//       });
//   } else {
//     startLatitude.disabled = true;
//     startLatitude.value = '';
//     endLatitude.disabled = true;
//     endLatitude.value = '';
//     climateMetric.disabled = true;
//     climateMetric.value = '';
//     period.disabled = true;
//     period.value = '';
//     submitBtn.disabled = true;
//   }
// });

// startLatitude.addEventListener('click', function () {
//   if (this.value) {
//     // DONT FORGET VALUE IS OF TYPE STRING

//     endLatitude.disabled = false;
//   } else {
//     endLatitude.disabled = true;
//     endLatitude.value = '';
//     climateMetric.disabled = true;
//     climateMetric.value = '';
//     period.disabled = true;
//     period.value = '';
//     submitBtn.disabled = true;
//   }
// });

// endLatitude.addEventListener('click', function () {
//   if (this.value) {
//     climateMetric.disabled = false;
//   } else {
//     climateMetric.disabled = true;
//     climateMetric.value = '';
//     period.disabled = true;
//     period.value = '';
//     submitBtn.disabled = true;
//   }
// });

// climateMetric.addEventListener('click', function () {
//   if (this.value) {
//     period.disabled = false;
//   } else {
//     period.disabled = true;
//     period.value = '';
//     submitBtn.disabled = true;
//   }
// });

// period.addEventListener('click', function () {
//   if (this.value) {
//     submitBtn.disabled = false;
//   } else {
//     submitBtn.disabled = true;
//   }
// });

// const frm = document.querySelector('form');

// frm.addEventListener('submit', function (e) {
//   if (this.elements['start-latitude'].value === this.elements['end-latitude'].value) {
//     e.preventDefault();
//     alert('Please Ensure Start & End Latitudes are NOT the same!');
//   } else {
//     rememberFormData(state, startLatitude, endLatitude, climateMetric, period);
//   }
// });
