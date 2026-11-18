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
  gsap.to('.sun', { yPercent: 55, ease: 'none', scrollTrigger: heroScrub });
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
    scrollTrigger: {
      trigger: '.sign',
      start: 'top 86%',
      once: true,
    },
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

    if (diff === 0) {
      title.textContent = '¡Ya empezó la fiesta!';
      clearInterval(timer);
    }
  };

  const timer = setInterval(tick, 1000);
  tick();
}
