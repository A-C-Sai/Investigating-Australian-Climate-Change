// Below code is for the functionality of the accordian in the "Use Cases by Sector Section"

// selecting all elements b/c we want the element corresponding to the arrow to open or close.
const elements = document.querySelectorAll(".element");
for (const element of elements) {
  const number = element.querySelector(".number");
  const sector = element.querySelector(".sector");
  const arrowMore = element.querySelector(".read-more");
  const arrowLess = element.querySelector(".read-less");
  const more = element.querySelector(".more");

  arrowMore.addEventListener("click", function () {
    more.classList.toggle("hidden");
    number.classList.toggle("changeTextColor");
    sector.classList.toggle("changeTextColor");
    element.classList.toggle("addBoxShadow");
  });

  arrowLess.addEventListener("click", function () {
    more.classList.toggle("hidden");
    number.classList.toggle("changeTextColor");
    sector.classList.toggle("changeTextColor");
    element.classList.toggle("addBoxShadow");
  });
}
