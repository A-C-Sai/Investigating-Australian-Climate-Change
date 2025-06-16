// Below code help with the functionality of the dropdown menu

// Store the required DOM objects
const btn_analysis = document.querySelector(".btn--nav");
const down_arrow = document.querySelector(".open-dropdown");
const up_arrow = document.querySelector(".close-dropdown");
const dropdown = document.querySelector(".dropdown");
const dropDownBtns = document.querySelectorAll(".dropdown-btn");

// When "Explore Data" is clicked show the dropdown menu and change arrow type to up.
// When clicked again, hide dropdown menu and change arrow type to down.
// Additionally close any layer 2 drowdowns if opened.
btn_analysis.addEventListener("click", function () {
  dropdown.classList.toggle("dropdown--close");
  down_arrow.classList.toggle("hidden");
  up_arrow.classList.toggle("hidden");

  dropDownBtns.forEach(function (btn) {
    if (
      !btn.parentElement
        .querySelector(".layer-2-dropdown")
        .classList.contains("layer-2-dropdown--close")
    ) {
      btn.parentElement
        .querySelector(".layer-2-dropdown")
        .classList.add("layer-2-dropdown--close");

      btn.querySelector(".right-arrow").classList.toggle("hidden");
      btn.querySelector(".left-arrow").classList.toggle("hidden");
    }
  });
});

// Below do is for the functionality of layer 2 dropdown menu
// We can not only open and close the layer 2 menu but if the user clicks one option and switches to the other, the current menu will close and the other one will open.
dropDownBtns.forEach(function (currentBtn) {
  const rightArrow = currentBtn.querySelector(".right-arrow");
  const leftArrow = currentBtn.querySelector(".left-arrow");
  const current_dropdown =
    currentBtn.parentElement.querySelector(".layer-2-dropdown");

  currentBtn.addEventListener("click", function () {
    rightArrow.classList.toggle("hidden");
    leftArrow.classList.toggle("hidden");
    current_dropdown.classList.toggle("layer-2-dropdown--close");

    dropDownBtns.forEach(function (otherBtn) {
      if (otherBtn !== currentBtn) {
        if (
          !otherBtn.parentElement
            .querySelector(".layer-2-dropdown")
            .classList.contains("layer-2-dropdown--close")
        ) {
          otherBtn.parentElement
            .querySelector(".layer-2-dropdown")
            .classList.add("layer-2-dropdown--close");
          otherBtn.parentElement
            .querySelector(".right-arrow")
            .classList.remove("hidden");
          otherBtn.parentElement
            .querySelector(".left-arrow")
            .classList.add("hidden");
        }
      }
    });
  });
});
