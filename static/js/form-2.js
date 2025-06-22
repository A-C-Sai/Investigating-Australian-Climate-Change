const state = document.querySelector('select[name="state-sidebar"]');
const referenceStation = document.querySelector('select[name="reference-station-sidebar"]');
const periodOne = document.querySelector('select[name="period-1-sidebar"]');
const periodTwo = document.querySelector('select[name="period-2-sidebar"]');
// const climateMetric = document.querySelector('select[name="climate-metric-sidebar"]');
const topN = document.querySelector('input[name="top-n-sidebar"]');
const submitBtn = document.querySelector('button[type="submit"]');

state.addEventListener('change', function () {
  if (this.value) {
    fetch(`http://127.0.0.1:8090/get_stations_in_state/${this.value}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        let html = '<option value="">--</option>';
        data.forEach(function ({ name, site_id }) {
          html += `<option value=${site_id}>${name}</option>`;
        });
        referenceStation.innerHTML = '';
        referenceStation.insertAdjacentHTML('afterbegin', html);
        referenceStation.disabled = false;
      });
  } else {
    referenceStation.value = '';
    periodOne.value = '';
    periodTwo.value = '';
    // climateMetric.value = '';
    topN.value = '';
    referenceStation.disabled = true;
    periodOne.disabled = true;
    periodTwo.disabled = true;
    // climateMetric.disabled = true;
    topN.disabled = true;
    submitBtn.disabled = true;
  }
});

referenceStation.addEventListener('change', function () {
  if (this.value) {
    periodOne.disabled = false;
  } else {
    periodOne.value = '';
    periodTwo.value = '';
    // climateMetric.value = '';
    topN.value = '';
    periodOne.disabled = true;
    periodTwo.disabled = true;
    // climateMetric.disabled = true;
    topN.disabled = true;
    submitBtn.disabled = true;
  }
});

periodOne.addEventListener('change', function () {
  if (this.value) {
    periodTwo.disabled = false;
  } else {
    periodTwo.value = '';
    // climateMetric.value = '';
    topN.value = '';
    periodTwo.disabled = true;
    // climateMetric.disabled = true;
    topN.disabled = true;
    submitBtn.disabled = true;
  }
});

periodTwo.addEventListener('change', function () {
  if (this.value) {
    // climateMetric.disabled = false;
    topN.disabled = false;
  } else {
    // climateMetric.value = '';
    topN.value = '';
    // climateMetric.disabled = true;
    topN.disabled = true;
    submitBtn.disabled = true;
  }
});

// climateMetric.addEventListener('change', function () {
//   if (this.value) {
//     topN.disabled = false;
//   } else {
//     topN.value = '';
//     topN.disabled = true;
//     submitBtn.disabled = true;
//   }
// });

topN.addEventListener('change', function () {
  if (this.value) {
    submitBtn.disabled = false;
  } else {
    submitBtn.disabled = true;
  }
});

const frm = document.querySelector('form[name="sidebar-form"]');

frm.addEventListener('submit', function (e) {
  if (Number(this.elements['period-2-sidebar'].value) <= Number(this.elements['period-1-sidebar'].value)) {
    e.preventDefault();
    alert(
      "Please Ensure:\n\n\t1. TIME PERIOD 2 doesn't occur before TIME\n\t    PERIOD 1\n\n\t2. Both TIME PERIODS are NOT the same"
    );
  }
});
