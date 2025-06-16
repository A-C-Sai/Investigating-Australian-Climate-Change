// ##########################  CODE FOR POP UP CARD #################### //
const personas = document.querySelectorAll(".persona");
const closeBtns = document.querySelectorAll(".close-persona-more");
const body = document.querySelector("body");
const overlay = document.querySelector(".overlay");

personas.forEach(function (persona) {
  persona.addEventListener("click", function () {
    document
      .querySelector(`.${persona.classList[1]}-more`)
      .classList.remove("hidden");
    overlay.classList.remove("hidden");
    body.classList.add("disable-scroll");
  });
});

closeBtns.forEach(function (closeBtn) {
  closeBtn.addEventListener("click", function () {
    closeBtn.parentElement.classList.add("hidden");
    overlay.classList.add("hidden");
    body.classList.remove("disable-scroll");
  });
});
