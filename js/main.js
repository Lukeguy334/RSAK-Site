// Shared script for every page

// Mobile menu toggle
const toggle = document.querySelector(".nav-toggle");
const nav = document.getElementById("site-nav");

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open);
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });

  // Close the menu after tapping a link
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
    });
  });
}

// Trial form (mock only: shows a message, doesn't send anything yet)
const form = document.getElementById("trial-form");
const note = document.getElementById("form-note");

if (form && note) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    note.textContent = "Thanks! We'll reach out soon to set up your trial class.";
    form.reset();
  });
}

// Keep the footer year current
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

// Keep current year from blackbelt until today.
const yearsTeaching = document.getElementById("years-teaching");
if (yearsTeaching) yearsTeaching.textContent = new Date().getFullYear() - 1984;
