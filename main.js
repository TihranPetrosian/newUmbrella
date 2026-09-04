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

/* ============================================================
   LANGUAGE SWITCH (UA / RU)
   ============================================================ */
(function () {
  const STORAGE_KEY = 'site-lang';
  const DEFAULT_LANG = 'uk';

  const switchEl = document.getElementById('langSwitch');
  if (!switchEl) return;

  const buttons = switchEl.querySelectorAll('.lang-switch__btn');
  const translatable = document.querySelectorAll('[data-uk][data-ru]');
  const translatableImages = document.querySelectorAll('[data-uk-src][data-ru-src]');

  function applyLang(lang, saveToStorage = true) {
    if (lang !== 'uk' && lang !== 'ru') {
      lang = DEFAULT_LANG;
    }

    translatable.forEach((el) => {
      const value = el.getAttribute('data-' + lang);
      if (value != null) {
        el.innerHTML = value;
      }
    });

    translatableImages.forEach((img) => {
      const src = img.getAttribute('data-' + lang + '-src');
      const alt = img.getAttribute('data-' + lang + '-alt');

      if (src) img.src = src;
      if (alt != null) img.alt = alt;
    });

    document.documentElement.setAttribute('lang', lang);

    buttons.forEach((btn) => {
      btn.classList.toggle('is-active', btn.dataset.lang === lang);
    });

    if (saveToStorage) {
      try {
        localStorage.setItem(STORAGE_KEY, lang);
      } catch (e) {}
    }
  }

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;

      // Меняем язык на странице
      applyLang(lang);

      // Меняем URL на ?lang=uk или ?lang=ru
      const url = new URL(window.location.href);
      url.searchParams.set('lang', lang);

      window.history.replaceState({}, '', url);
    });
  });

  // Сначала смотрим язык в URL
  const params = new URLSearchParams(window.location.search);
  const urlLang = params.get('lang');

  if (urlLang === 'uk' || urlLang === 'ru') {
    applyLang(urlLang);
    return;
  }

  // Если языка в URL нет — берём сохранённый
  let savedLang = DEFAULT_LANG;

  try {
    savedLang = localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
  } catch (e) {}

  applyLang(savedLang);
})();
/* ============================================================
   MAP
   ============================================================ */
const cities = [
  { name: "Харків",   coords: [49.9935, 36.2304] },
  { name: "Одеса",    coords: [46.4825, 30.7233] },
  { name: "Черкаси",  coords: [49.4444, 32.0598] },
  { name: "Київ",     coords: [50.4501, 30.5234] },
  { name: "Полтава",  coords: [49.5883, 34.5514] },
  { name: "Житомир",  coords: [50.2547, 28.6587] },
];

const map = L.map('map', {
  scrollWheelZoom: false,
}).setView([48.5, 33.0], 5.3);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors',
  maxZoom: 18,
}).addTo(map);

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