// Toggle Sidebar Functionality
const toggleSidebarBtn = document.querySelector('.toggle-sidebar');
const sidebar = document.querySelector('.sidebar');
const main = document.querySelector('.main');

toggleSidebarBtn.addEventListener('click', function () {
  toggleSidebarBtn.querySelectorAll('ion-icon').forEach(function (icon) {
    icon.classList.toggle('hidden');
  });

  // sidebar.classList.toggle("hidden");
  // hide/ show sidebar when button is clicked
  sidebar.classList.toggle('move-sidebar');
  // if sidebar doesn't exist expand the main section to full width
  main.classList.toggle('full-width');
});
