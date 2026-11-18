import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);

const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)',
).matches;

if (!prefersReducedMotion) {
  /* ---------- El nombre: letra por letra, con máscara ---------- */
  const name = document.querySelector('.hero__name');
  name.setAttribute('aria-label', name.textContent.trim());
  name.innerHTML = [...name.textContent.trim()]
    .map((ch) => `<span class="ch" aria-hidden="true"><span>${ch}</span></span>`)
    .join('');

  /* ---------- Amanecer: el sol sube, el paisaje se levanta ---------- */
  gsap
    .timeline({ defaults: { ease: 'power3.out' } })
    .from('.sun', { yPercent: 75, duration: 2.6, ease: 'power2.out' }, 0)
    .from('.hero__glow', { opacity: 0, duration: 2.4, ease: 'sine.out' }, 0)
    .from('.land__far', { yPercent: 14, opacity: 0, duration: 1.8 }, 0.15)
    .from('.land__mid', { yPercent: 20, opacity: 0, duration: 1.7 }, 0.3)
    .from('.land__near', { yPercent: 30, opacity: 0, duration: 1.6 }, 0.45)
    .from('.cactus', { y: 40, opacity: 0, duration: 1.3, stagger: 0.12 }, 0.9)
    .from('.hero__eyebrow', { y: 14, opacity: 0, duration: 0.9 }, 0.7)
    .from('.hat', { y: -60, rotate: -14, opacity: 0, duration: 1.2, ease: 'back.out(1.2)' }, 0.85)
    .from('.badge', { scale: 0.4, rotate: -30, opacity: 0, duration: 1.2, ease: 'back.out(1.5)' }, 1.0)
    .from('.badge__num', { scale: 0, opacity: 0, duration: 0.7, ease: 'back.out(2.6)' }, 1.5)
    .from('.hero__name .ch > span', { yPercent: 118, rotate: 5, duration: 1.15, ease: 'expo.out', stagger: 0.06 }, 1.15)
    .from('.hero__age, .hero__lede', { y: 20, opacity: 0, duration: 0.9, stagger: 0.12 }, 1.75)
    .from('.hero__facts, .hero .cta', { y: 18, opacity: 0, duration: 0.8, stagger: 0.12 }, 2.0)
    .from('.hero__scroll', { opacity: 0, duration: 0.8 }, 2.4);

  /* ---------- Al hacer scroll: el sol se pone y las capas se separan ---------- */
  const heroScrub = { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true };
  gsap.to('.sun', { yPercent: -70, opacity: 0, ease: 'none', scrollTrigger: heroScrub });
  gsap.to('.land__far', { yPercent: 8, ease: 'none', scrollTrigger: heroScrub });
  gsap.to('.land__mid', { yPercent: 16, ease: 'none', scrollTrigger: heroScrub });
  gsap.to('.hero__inner', { y: -40, opacity: 0.2, ease: 'none', scrollTrigger: heroScrub });

  /* Los rayos del distintivo giran muy despacio. */
  gsap.to('.badge__rays', {
    rotate: 20,
    duration: 22,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });

  /* ---------- Apariciones al hacer scroll ---------- */
  gsap.utils.toArray('[data-reveal]').forEach((element) => {
    gsap.from(element, {
      y: 36,
      opacity: 0,
      duration: 0.95,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 86%',
        once: true,
      },
    });
  });

  /* ---------- Cinta vaquera ---------- */
  gsap.fromTo(
    '.marquee__track',
    { x: 0 },
    {
      x: -140,
      ease: 'none',
      scrollTrigger: {
        trigger: '.marquee',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.6,
      },
    },
  );

  gsap.fromTo(
    '.tumbleweed',
    { x: 0, rotate: 0 },
    {
      x: () => window.innerWidth + 160,
      rotate: 540,
      ease: 'none',
      scrollTrigger: {
        trigger: '.marquee',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.2,
        invalidateOnRefresh: true,
      },
    },
  );

  /* ---------- La cuerda se dibuja ---------- */
  gsap.from('.rope path', {
    drawSVG: '0%',
    duration: 1.4,
    ease: 'power2.inOut',
    scrollTrigger: {
      trigger: '.rope',
      start: 'top 90%',
      once: true,
    },
  });

  /* ---------- El letrero se balancea al entrar ---------- */
  gsap.from('.sign', {
    y: 34,
    rotate: -5,
    opacity: 0,
    duration: 1.15,
    ease: 'power3.out',
    onComplete: () =>
      gsap.to('.sign', { rotate: -0.2, duration: 3.4, yoyo: true, repeat: -1, ease: 'sine.inOut' }),
    scrollTrigger: {
      trigger: '.sign',
      start: 'top 86%',
      once: true,
    },
  });

  /* ---------- Vida: la estrella respira y estalla al tocarla ---------- */
  gsap.to('.badge__star', { scale: 1.045, duration: 2.2, yoyo: true, repeat: -1, ease: 'sine.inOut' });

  const badge = document.querySelector('.badge');
  const palette = ['#d9a13b', '#b04a2a', '#6d7c55', '#2f4757'];
  const burst = () => {
    const r = badge.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    for (let i = 0; i < 16; i += 1) {
      const star = document.createElement('span');
      star.className = 'confetti';
      star.textContent = '✦';
      star.style.cssText = `left:${cx}px;top:${cy}px;color:${palette[i % 4]}`;
      document.body.append(star);
      const angle = (Math.PI * 2 * i) / 16 + Math.random() * 0.4;
      const dist = 80 + Math.random() * 110;
      gsap.fromTo(
        star,
        { scale: 0.3, opacity: 1 },
        {
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist + 40,
          rotate: Math.random() * 400 - 200,
          scale: 0.9 + Math.random() * 1.1,
          opacity: 0,
          duration: 1.1 + Math.random() * 0.6,
          ease: 'power2.out',
          onComplete: () => star.remove(),
        },
      );
    }
    gsap.fromTo('.badge__num', { scale: 0.7 }, { scale: 1, duration: 0.9, ease: 'elastic.out(1, 0.4)' });
  };
  badge.setAttribute('role', 'button');
  badge.setAttribute('tabindex', '0');
  badge.setAttribute('aria-label', 'Lanzar estrellas');
  badge.addEventListener('click', burst);
  badge.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      burst();
    }
  });

  /* ---------- El cartel cuelga de un clavo y se columpia ---------- */
  gsap.from('.wanted', {
    rotate: 8,
    transformOrigin: '50% 0%',
    duration: 1.8,
    ease: 'elastic.out(1, 0.5)',
    scrollTrigger: { trigger: '.wanted', start: 'top 85%', once: true },
  });

  /* ---------- Sale la luna ---------- */
  gsap.from('.footer__moon', {
    y: 70,
    opacity: 0,
    duration: 1.8,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.footer', start: 'top 85%', once: true },
  });

  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

/* ---------- Cuenta regresiva ---------- */
const countdown = document.querySelector('[data-countdown]');

if (countdown) {
  const target = new Date(countdown.dataset.countdown).getTime();
  const cells = Object.fromEntries(
    [...countdown.querySelectorAll('[data-unit]')].map((el) => [el.dataset.unit, el]),
  );
  const title = countdown.querySelector('.countdown__title');
  const pad = (n) => String(n).padStart(2, '0');

  const tick = () => {
    const diff = Math.max(0, target - Date.now());
    const s = Math.floor(diff / 1000);
    cells.d.textContent = pad(Math.floor(s / 86400));
    cells.h.textContent = pad(Math.floor((s % 86400) / 3600));
    cells.m.textContent = pad(Math.floor((s % 3600) / 60));
    cells.s.textContent = pad(s % 60);
    if (!prefersReducedMotion) {
      gsap.fromTo(cells.s, { yPercent: -35, opacity: 0.25 }, { yPercent: 0, opacity: 1, duration: 0.35, ease: 'power2.out', overwrite: true });
    }

    if (diff === 0) {
      title.textContent = '¡Ya empezó la fiesta!';
      clearInterval(timer);
    }
  };

  const timer = setInterval(tick, 1000);
  tick();
}

/* ---------- Estrellas del cielo nocturno ---------- */
const sky = document.querySelector('.footer__stars');
if (sky) {
  for (let i = 0; i < 32; i += 1) {
    const dot = document.createElement('i');
    dot.style.cssText = `left:${Math.random() * 100}%;top:${Math.random() * 100}%;--s:${(1 + Math.random() * 2).toFixed(1)}px;--d:${(Math.random() * 4).toFixed(1)}s`;
    sky.append(dot);
  }
}

/* ---------- Barra de acciones: aparece al salir del hero ---------- */
const dock = document.querySelector('.dock');
if (dock && 'IntersectionObserver' in window) {
  const hidden = new Set(['.hero']);
  const sync = () => dock.classList.toggle('is-on', hidden.size === 0);
  ['.hero', '.footer'].forEach((selector) => {
    const el = document.querySelector(selector);
    if (!el) return;
    new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) hidden.add(selector);
        else hidden.delete(selector);
        sync();
      },
      { threshold: 0.15 },
    ).observe(el);
  });
  sync();
}
