import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);

const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)',
).matches;

if (!prefersReducedMotion) {
  /* ---------- Entrada del hero ---------- */
  gsap
    .timeline({ defaults: { ease: 'power3.out' } })
    .from('.hero__eyebrow', { y: 18, opacity: 0, duration: 0.7 }, 0)
    .from(
      '.hat',
      {
        y: -70,
        rotate: -18,
        opacity: 0,
        duration: 1.05,
        ease: 'back.out(1.3)',
      },
      0.05,
    )
    .from(
      '.badge',
      {
        scale: 0.45,
        rotate: -25,
        opacity: 0,
        duration: 0.95,
        ease: 'back.out(1.6)',
      },
      0.22,
    )
    .from(
      '.badge__num',
      { scale: 0, opacity: 0, duration: 0.6, ease: 'back.out(2.4)' },
      0.62,
    )
    .from('.hero__name', { y: 46, opacity: 0, duration: 1.15 }, 0.36)
    .from(
      '.hero__age, .hero__lede',
      { y: 22, opacity: 0, duration: 0.85, stagger: 0.1 },
      0.66,
    )
    .from('.hero__facts', { y: 20, opacity: 0, duration: 0.8 }, 0.84)
    .from('.hero .cta', { y: 18, opacity: 0, duration: 0.7 }, 0.96)
    .from('.hero__scroll', { opacity: 0, duration: 0.8 }, 1.2)
    .from(
      '.cactus',
      { y: 30, opacity: 0, duration: 1.1, stagger: 0.1 },
      0.9,
    );

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
