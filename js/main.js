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

// ---------- Flip counter: total time teaching ----------
const counter = document.querySelector(".flip-counter");

if (counter) {
  const start = new Date(counter.dataset.start);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const labels = ["Years", "Months", "Days", "Hours", "Minutes", "Seconds"];
  const digits = [];

  // Build 6 groups of 2 digits with colons between
  labels.forEach((label, i) => {
    if (i > 0) {
      const colon = document.createElement("span");
      colon.className = "flip-colon";
      colon.setAttribute("aria-hidden", "true");
      colon.textContent = ":";
      counter.appendChild(colon);
    }
    const group = document.createElement("div");
    group.className = "flip-group";
    const row = document.createElement("div");
    row.className = "flip-digits";
    for (let d = 0; d < 2; d++) {
      const digit = document.createElement("span");
      digit.className = "flip-digit";
      digit.innerHTML = '<span class="half top"><span></span></span><span class="half bottom"><span></span></span>';
      row.appendChild(digit);
      digits.push(digit);
    }
    const name = document.createElement("span");
    name.className = "flip-label";
    name.textContent = label;
    group.append(row, name);
    counter.appendChild(group);
  });

  function setDigit(el, value) {
    const old = el.dataset.value;
    if (old === value) return;
    el.dataset.value = value;

    const topText = el.querySelector(".top span");
    const bottomText = el.querySelector(".bottom span");

    // Clear any flip still running (e.g. after the tab was in the background)
    el.querySelectorAll(".flap-top, .flap-bottom").forEach((f) => f.remove());

    if (old === undefined || reduceMotion) {
      topText.textContent = value;
      bottomText.textContent = value;
      return;
    }

    topText.textContent = value;
    bottomText.textContent = old;

    const flapTop = document.createElement("span");
    flapTop.className = "half top flap-top";
    flapTop.innerHTML = `<span>${old}</span>`;

    const flapBottom = document.createElement("span");
    flapBottom.className = "half bottom flap-bottom";
    flapBottom.innerHTML = `<span>${value}</span>`;

    flapBottom.addEventListener("animationend", () => {
      bottomText.textContent = value;
      flapTop.remove();
      flapBottom.remove();
    });

    el.append(flapTop, flapBottom);
  }

  // Calendar-accurate years, months, then days/hours/minutes/seconds
  function elapsed(now) {
    let months = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
    let anchor = new Date(start);
    anchor.setMonth(start.getMonth() + months);
    if (anchor > now) {
      months--;
      anchor = new Date(start);
      anchor.setMonth(start.getMonth() + months);
    }
    const secs = Math.floor((now - anchor) / 1000);
    return [
      Math.floor(months / 12),
      months % 12,
      Math.floor(secs / 86400),
      Math.floor((secs % 86400) / 3600),
      Math.floor((secs % 3600) / 60),
      secs % 60,
    ];
  }

  function tick() {
    const text = elapsed(new Date()).map((n) => String(n).padStart(2, "0")).join("");
    digits.forEach((el, i) => setDigit(el, text[i]));
  }

  tick();
  setInterval(tick, 1000);
}

// ---------- Count-up numbers (runs once when scrolled into view) ----------
document.querySelectorAll(".count-up").forEach((el) => {
  const target = Number(el.dataset.target) || 0;
  const suffix = el.dataset.suffix || "";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const show = (n) => (el.textContent = n.toLocaleString() + suffix);

  if (reduceMotion || !("IntersectionObserver" in window)) {
    show(target);
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    if (!entries[0].isIntersecting) return;
    observer.disconnect();

    const duration = 2000;
    const startTime = performance.now();

    function step(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // fast start, slow finish
      show(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }, { threshold: 0.5 });

  observer.observe(el);
});
