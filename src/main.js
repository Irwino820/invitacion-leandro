import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);

const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)',
).matches;

const isFinePointer = window.matchMedia('(pointer: fine)').matches;

/* ---------- Toast accesible en capa superior (Popover API + fallback) ---------- */
const toast = document.getElementById('app-toast');
const toastMessage = toast?.querySelector('[data-toast-message]');
const supportsPopover =
  typeof HTMLElement !== 'undefined' && 'popover' in HTMLElement.prototype;
let toastTimer = 0;

const hideToast = () => {
  if (!toast) return;
  if (supportsPopover && toast.matches(':popover-open')) {
    toast.hidePopover();
  } else {
    toast.classList.remove('is-open');
  }
};

const showToast = (message) => {
  if (!toast || !toastMessage) return;
  window.clearTimeout(toastTimer);
  toastMessage.textContent = message;

  if (supportsPopover) {
    if (!toast.matches(':popover-open')) {
      toast.showPopover();
    }
  } else {
    toast.classList.add('is-open');
  }

  toastTimer = window.setTimeout(hideToast, 3400);
};

toast?.querySelector('.toast__close')?.addEventListener('click', () => {
  window.clearTimeout(toastTimer);
  if (!supportsPopover) hideToast();
});

/* ---------- Barra de progreso de lectura ---------- */
let scrollRaf = 0;
const updateScrollProgress = () => {
  scrollRaf = 0;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
  document.documentElement.style.setProperty('--scroll-progress', ratio.toFixed(4));
};

window.addEventListener(
  'scroll',
  () => {
    if (!scrollRaf) {
      scrollRaf = window.requestAnimationFrame(updateScrollProgress);
    }
  },
  { passive: true },
);
updateScrollProgress();

/* ---------- Carga progresiva de foto opcional (public/leandro.jpg) ---------- */
const photoFrame = document.querySelector('[data-photo-frame]');
if (photoFrame) {
  const probe = new Image();
  probe.decoding = 'async';
  probe.addEventListener('load', () => {
    const img = document.createElement('img');
    img.src = '/leandro.jpg';
    img.alt = 'Retrato de Leandro';
    img.width = 400;
    img.height = 400;
    img.loading = 'lazy';
    photoFrame.append(img);
  });
  probe.src = '/leandro.jpg';
}

/* ---------- Explosión festiva en la estrella del Sheriff ---------- */
const badge = document.querySelector('.badge');
const palette = ['#d9a13b', '#a24123', '#62734b', '#243846'];

const burstStars = () => {
  if (!badge) return;
  if (prefersReducedMotion) {
    showToast('¡Leandro cumple 2 años el 25 de diciembre!');
    return;
  }

  const r = badge.getBoundingClientRect();
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;
  const symbols = ['✦', '★', '✦', '✧'];

  for (let i = 0; i < 18; i += 1) {
    const star = document.createElement('span');
    star.className = 'confetti';
    star.textContent = symbols[i % symbols.length];
    star.style.left = `${cx}px`;
    star.style.top = `${cy}px`;
    star.style.color = palette[i % palette.length];
    document.body.append(star);

    const angle = (Math.PI * 2 * i) / 18 + Math.random() * 0.35;
    const dist = 85 + Math.random() * 120;

    gsap.fromTo(
      star,
      { scale: 0.35, opacity: 1 },
      {
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist + 44,
        rotate: Math.random() * 420 - 210,
        scale: 0.9 + Math.random() * 1.05,
        opacity: 0,
        duration: 1.05 + Math.random() * 0.55,
        ease: 'power2.out',
        onComplete: () => star.remove(),
      },
    );
  }

  gsap.fromTo(
    '.badge__num',
    { scale: 0.72 },
    { scale: 1, duration: 0.85, ease: 'elastic.out(1, 0.42)' },
  );
};

badge?.addEventListener('click', burstStars);

/* ---------- Brillo sutil del boleto al mover el cursor ---------- */
const ticket = document.querySelector('.ticket');
if (ticket && isFinePointer && !prefersReducedMotion) {
  ticket.addEventListener('pointermove', (event) => {
    const rect = ticket.getBoundingClientRect();
    ticket.style.setProperty('--mx', `${event.clientX - rect.left}px`);
    ticket.style.setProperty('--my', `${event.clientY - rect.top}px`);
  });
}

/* ---------- Copiar dirección ---------- */
const copyText = async (text) => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.append(textarea);
  textarea.select();
  document.execCommand('copy');
  textarea.remove();
};

document.querySelectorAll('[data-copy]').forEach((btn) => {
  btn.addEventListener('click', async () => {
    const text = btn.getAttribute('data-copy');
    if (!text) return;
    try {
      await copyText(text);
      showToast('Dirección copiada al portapapeles');
    } catch {
      showToast('José García #210, La Estación Rincón');
    }
  });
});

/* ---------- Compartir invitación (Web Share API + fallback) ---------- */
const sharePayload = {
  title: 'Leandro · Cumple 2 · Fiesta vaquera',
  text: '¡Acompáñanos a celebrar los 2 años de Leandro! Viernes 25 de diciembre de 2026 a las 3:00 p. m. en José García #210, La Estación Rincón.',
  url: window.location.href,
};

document.querySelectorAll('[data-share]').forEach((btn) => {
  btn.addEventListener('click', async () => {
    if (navigator.share) {
      try {
        await navigator.share(sharePayload);
        return;
      } catch (err) {
        if (err?.name === 'AbortError') return;
      }
    }

    try {
      await copyText(`${sharePayload.text}\n${sharePayload.url}`);
      showToast('Invitación y enlace copiados para compartir');
    } catch {
      showToast('Copia el enlace del navegador para compartir');
    }
  });
});

/* ---------- Coreografía GSAP ---------- */
if (!prefersReducedMotion) {
  const name = document.querySelector('.hero__name');
  if (name) {
    const raw = name.textContent.trim();
    name.setAttribute('aria-label', raw);
    name.innerHTML = [...raw]
      .map((ch) => `<span class="ch" aria-hidden="true"><span>${ch}</span></span>`)
      .join('');
  }

  /* Amanecer dorado en el rancho */
  gsap
    .timeline({ defaults: { ease: 'power3.out' } })
    .fromTo('.sun', { y: 46, scale: 0.84, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 2.1, ease: 'power2.out' }, 0)
    .from('.hero__glow', { opacity: 0, duration: 2.1, ease: 'sine.out' }, 0)
    .from('.hero__clouds', { y: -12, opacity: 0, duration: 1.8, ease: 'sine.out' }, 0.25)
    .from('.land__far', { yPercent: 14, opacity: 0, duration: 1.6 }, 0.15)
    .from('.land__mid', { yPercent: 20, opacity: 0, duration: 1.5 }, 0.28)
    .from('.land__near', { yPercent: 26, opacity: 0, duration: 1.4 }, 0.4)
    .fromTo('.hat', { y: -56, rotate: -14, opacity: 0 }, { y: 0, rotate: -3, opacity: 1, duration: 1.15, ease: 'back.out(1.2)' }, 0.65)
    .fromTo('.badge', { scale: 0.45, rotate: -28, opacity: 0 }, { scale: 1, rotate: 0, opacity: 1, duration: 1.15, ease: 'back.out(1.45)' }, 0.78)
    .from('.badge__num', { scale: 0, opacity: 0, duration: 0.65, ease: 'back.out(2.5)' }, 1.25)
    .from('.hero__crest-hint', { y: 8, opacity: 0, duration: 0.7 }, 1.5)
    .from('.hero__name .ch > span', { yPercent: 118, rotate: 5, duration: 1.1, ease: 'expo.out', stagger: 0.055 }, 0.95)
    .from('.hero__age, .hero__lede', { y: 18, opacity: 0, duration: 0.85, stagger: 0.12 }, 1.5)
    .from('.hero__facts, .hero__actions', { y: 16, opacity: 0, duration: 0.8, stagger: 0.12 }, 1.75)
    .from('.hero__scroll', { opacity: 0, duration: 0.75 }, 2.05);

  /* Parallax suave al hacer scroll: el sol desciende sin conflictos ni saltos */
  const heroScrub = {
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    scrub: 0.35,
    invalidateOnRefresh: true,
  };
  gsap.fromTo(
    '.sun-wrap',
    { y: 0, scale: 1 },
    { y: () => window.innerHeight * 0.32, scale: 0.92, ease: 'none', immediateRender: false, scrollTrigger: heroScrub },
  );
  gsap.fromTo(
    '.land__far',
    { yPercent: 0 },
    { yPercent: 8, ease: 'none', immediateRender: false, scrollTrigger: heroScrub },
  );
  gsap.fromTo(
    '.land__mid',
    { yPercent: 0 },
    { yPercent: 15, ease: 'none', immediateRender: false, scrollTrigger: heroScrub },
  );
  gsap.fromTo(
    '.hero__inner',
    { y: 0, opacity: 1 },
    { y: -32, opacity: 0.3, ease: 'none', immediateRender: false, scrollTrigger: heroScrub },
  );

  /* Rayos y respiración del distintivo */
  gsap.to('.badge__rays', {
    rotate: 22,
    duration: 24,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });

  gsap.to('.badge__star', {
    scale: 1.04,
    duration: 2.3,
    yoyo: true,
    repeat: -1,
    ease: 'sine.inOut',
  });

  /* Apariciones al hacer scroll */
  gsap.utils.toArray('[data-reveal]').forEach((element) => {
    gsap.from(element, {
      y: 30,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 88%',
        once: true,
      },
    });
  });

  /* Planta rodadora sobre la cinta */
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

  /* La cuerda se dibuja con DrawSVG */
  gsap.from('.rope path', {
    drawSVG: '0%',
    duration: 1.35,
    ease: 'power2.inOut',
    scrollTrigger: {
      trigger: '.rope',
      start: 'top 90%',
      once: true,
    },
  });

  /* Cartel "Se busca" colgado del clavo */
  gsap.from('.wanted', {
    rotate: 6,
    transformOrigin: '50% 4%',
    duration: 1.7,
    ease: 'elastic.out(1, 0.52)',
    scrollTrigger: { trigger: '.wanted', start: 'top 86%', once: true },
  });

  /* Letrero del rancho con balanceo sutil */
  gsap.from('.sign', {
    y: 30,
    rotate: -4.5,
    opacity: 0,
    duration: 1.1,
    ease: 'power3.out',
    onComplete: () =>
      gsap.to('.sign', {
        rotate: 0.4,
        duration: 3.6,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      }),
    scrollTrigger: {
      trigger: '.sign',
      start: 'top 86%',
      once: true,
    },
  });

  /* Sale la luna y el campo del rancho cobra vida */
  gsap.from('.footer__moon-wrap', {
    y: 56,
    opacity: 0,
    duration: 1.6,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.footer', start: 'top 80%', once: true },
  });

  gsap.from('.ranch__far', {
    yPercent: 10,
    opacity: 0,
    duration: 1.3,
    ease: 'power2.out',
    scrollTrigger: { trigger: '.footer', start: 'top 78%', once: true },
  });

  gsap.from('.ranch__mid, .ranch__fence, .ranch__barn, .ranch__windmill', {
    y: 26,
    opacity: 0,
    duration: 1.2,
    stagger: 0.08,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.footer', start: 'top 75%', once: true },
  });

  gsap.from('.ranch__animal', {
    y: 20,
    opacity: 0,
    duration: 1,
    stagger: 0.12,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.footer', start: 'top 72%', once: true },
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

    if (!prefersReducedMotion && diff > 0) {
      gsap.fromTo(
        cells.s,
        { yPercent: -28, opacity: 0.3 },
        { yPercent: 0, opacity: 1, duration: 0.32, ease: 'power2.out', overwrite: true },
      );
    }

    if (diff === 0 && title) {
      title.textContent = '¡Ya empezó la fiesta de Leandro!';
      clearInterval(timer);
    }
  };

  const timer = setInterval(tick, 1000);
  tick();
}

/* ---------- Estrellas del cielo nocturno ---------- */
const sky = document.querySelector('.footer__stars');
if (sky) {
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < 48; i += 1) {
    const dot = document.createElement('i');
    dot.style.left = `${(Math.random() * 100).toFixed(2)}%`;
    dot.style.top = `${(8 + Math.random() * 88).toFixed(2)}%`;
    dot.style.setProperty('--s', `${(1.2 + Math.random() * 2.4).toFixed(1)}px`);
    dot.style.setProperty('--d', `${(Math.random() * 4.2).toFixed(1)}s`);
    fragment.append(dot);
  }
  sky.append(fragment);
}

/* ---------- Visibilidad inteligente de la barra superior (desktop) ---------- */
const topbar = document.querySelector('.topbar');
const heroEl = document.querySelector('.hero');

if (topbar && heroEl && 'IntersectionObserver' in window) {
  new IntersectionObserver(
    ([entry]) => {
      topbar.classList.toggle('is-on', !entry.isIntersecting);
    },
    { threshold: 0.18 },
  ).observe(heroEl);
}

/* ---------- Música de fondo (Bartolito) con desbloqueo táctil en celular ---------- */
const audio = document.getElementById('bg-music');
const musicBtn = document.querySelector('[data-music-toggle]');
const musicLabel = document.querySelector('[data-music-label]');

if (audio && musicBtn) {
  audio.volume = 0.75;
  let userPaused = false;
  let wasPlayingBeforeHide = false;

  const syncMusicUI = (playing) => {
    musicBtn.classList.toggle('is-playing', playing);
    musicBtn.setAttribute('aria-pressed', String(playing));
    if (musicLabel) {
      musicLabel.textContent = playing ? 'Sonando' : 'Música';
    }
  };

  const tryPlay = async () => {
    if (userPaused) return;
    try {
      await audio.play();
      syncMusicUI(true);
    } catch {
      syncMusicUI(false);
    }
  };

  audio.addEventListener('play', () => syncMusicUI(true));
  audio.addEventListener('pause', () => syncMusicUI(false));

  musicBtn.addEventListener('click', async (event) => {
    event.stopPropagation();
    if (audio.paused) {
      userPaused = false;
      try {
        await audio.play();
        syncMusicUI(true);
      } catch {
        showToast('Toca de nuevo para reproducir la música');
      }
    } else {
      userPaused = true;
      audio.pause();
      syncMusicUI(false);
    }
  });

  /* En celulares, el navegador permite iniciar el audio al primer toque en la pantalla */
  const unlockEvents = ['click', 'touchstart', 'keydown'];
  const unlockOnFirstGesture = (event) => {
    if (musicBtn.contains(event.target)) return;
    if (!audio.paused || userPaused) {
      unlockEvents.forEach((evt) => document.removeEventListener(evt, unlockOnFirstGesture));
      return;
    }
    audio
      .play()
      .then(() => {
        syncMusicUI(true);
        unlockEvents.forEach((evt) => document.removeEventListener(evt, unlockOnFirstGesture));
      })
      .catch(() => {});
  };

  unlockEvents.forEach((evt) =>
    document.addEventListener(evt, unlockOnFirstGesture, { passive: true }),
  );

  /* Pausa amable al salir de la pestaña o bloquear el celular */
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      wasPlayingBeforeHide = !audio.paused;
      if (wasPlayingBeforeHide) audio.pause();
    } else if (wasPlayingBeforeHide && !userPaused) {
      tryPlay();
    }
  });

  tryPlay();
}
