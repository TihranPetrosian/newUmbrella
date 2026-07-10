/* ============================================================
   SCROLL REVEAL
   ============================================================ */
(function () {
  const revealEls = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealEls.forEach((el) => observer.observe(el));
})();

/* ============================================================
   NAV SHADOW ON SCROLL
   ============================================================ */
(function () {
  const nav = document.querySelector('.nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }, { passive: true });
})();

/* ============================================================
   SMOOTH ANCHOR SCROLL
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

const cities = [
  { name: "Харків",   coords: [49.9935, 36.2304] },
  { name: "Одеса",    coords: [46.4825, 30.7233] },
  { name: "Черкаси",  coords: [49.4444, 32.0598] },
  { name: "Київ",     coords: [50.4501, 30.5234] },
];

// Центр карты — примерно по центру между городами
const map = L.map('map', {
  scrollWheelZoom: false, // чтобы карта не мешала скроллу страницы
}).setView([48.5, 33.0], 5.3);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors',
  maxZoom: 18,
}).addTo(map);

// Кастомная синяя иконка под стиль сайта
const blueIcon = L.divIcon({
  className: 'custom-marker',
  html: `<div style="
      width: 18px; height: 18px;
      background:#1a73e8;
      border: 3px solid #fff;
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(26,115,232,0.5);
  "></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

cities.forEach(city => {
  L.marker(city.coords, { icon: blueIcon })
    .addTo(map)
    .bindPopup(`<b>${city.name}</b><br>Виїзд лікаря доступний`);
});