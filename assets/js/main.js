(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
  const gsapReady = window.gsap && window.ScrollTrigger;

  if (gsapReady) gsap.registerPlugin(ScrollTrigger);

  // ---- Footer year ----
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---- Mobile nav toggle ----
  const navToggle = document.getElementById('navToggle');
  const mobileNav = document.getElementById('mobileNav');

  const closeMobileNav = () => {
    mobileNav.classList.remove('open');
    mobileNav.setAttribute('aria-hidden', 'true');
    navToggle.setAttribute('aria-expanded', 'false');
  };

  navToggle.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    mobileNav.setAttribute('aria-hidden', String(!isOpen));
  });

  mobileNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMobileNav);
  });

  document.addEventListener('click', (event) => {
    if (!mobileNav.classList.contains('open')) return;

    if (!mobileNav.contains(event.target) && !navToggle.contains(event.target)) {
      closeMobileNav();
    }
  });

  // ---- Sliding nav indicator (GSAP quickTo) ----
  const navLinksList = document.getElementById('navLinks');
  const navIndicator = document.getElementById('navIndicator');
  const desktopNavAnchors = Array.from(navLinksList.querySelectorAll('a[data-nav]'));

  const indicatorX = gsapReady
    ? gsap.quickTo(navIndicator, 'x', { duration: 0.45, ease: 'power3.out' })
    : null;
  const indicatorWidth = gsapReady
    ? gsap.quickTo(navIndicator, 'width', { duration: 0.45, ease: 'power3.out' })
    : null;

  const moveIndicatorTo = (link) => {
    if (!link || navLinksList.offsetWidth === 0) {
      if (gsapReady) gsap.to(navIndicator, { opacity: 0, duration: 0.2 });
      return;
    }

    const containerRect = navLinksList.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    const targetX = linkRect.left - containerRect.left;

    if (gsapReady) {
      gsap.to(navIndicator, { opacity: 1, duration: 0.2 });
      indicatorX(targetX);
      indicatorWidth(linkRect.width);
    } else {
      navIndicator.style.opacity = '1';
      navIndicator.style.transform = `translateX(${targetX}px)`;
      navIndicator.style.width = `${linkRect.width}px`;
    }
  };

  const activeDesktopLink = () => desktopNavAnchors.find((a) => a.classList.contains('active'));

  desktopNavAnchors.forEach((link) => {
    link.addEventListener('mouseenter', () => moveIndicatorTo(link));
  });
  navLinksList.addEventListener('mouseleave', () => moveIndicatorTo(activeDesktopLink()));
  window.addEventListener('resize', () => moveIndicatorTo(activeDesktopLink()), { passive: true });

  // ---- Scroll-spy active nav link ----
  const sections = Array.from(document.querySelectorAll('main section[id]'));
  const navAnchors = Array.from(document.querySelectorAll('[data-nav]'));

  const spyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const id = entry.target.getAttribute('id');
        navAnchors.forEach((a) => {
          a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
        });
        moveIndicatorTo(activeDesktopLink());
      });
    },
    { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
  );
  sections.forEach((section) => spyObserver.observe(section));

  // ---- Hero typewriter ----
  const typewriterEl = document.getElementById('typewriterText');
  const typewriterPhrases = [
    { text: 'Senior Full Stack Developer.', tone: '' },
    { text: 'Fintech & banking systems.', tone: 'violet' },
    { text: 'Booking & rental platforms.', tone: 'teal' },
  ];

  const setTypewriterTone = (tone) => {
    if (!typewriterEl) return;

    if (tone) {
      typewriterEl.setAttribute('data-tone', tone);
    } else {
      typewriterEl.removeAttribute('data-tone');
    }
  };

  const startTypewriter = () => {
    if (!typewriterEl) return;

    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;

    setTypewriterTone(typewriterPhrases[0].tone);

    const tick = () => {
      const phrase = typewriterPhrases[phraseIndex];
      typewriterEl.textContent = phrase.text.slice(0, charIndex);

      if (!deleting) {
        if (charIndex < phrase.text.length) {
          charIndex += 1;
          window.setTimeout(tick, 58);
          return;
        }

        deleting = true;
        window.setTimeout(tick, 1700);
        return;
      }

      if (charIndex > 0) {
        charIndex -= 1;
        window.setTimeout(tick, 34);
        return;
      }

      deleting = false;
      phraseIndex = (phraseIndex + 1) % typewriterPhrases.length;
      setTypewriterTone(typewriterPhrases[phraseIndex].tone);
      window.setTimeout(tick, 280);
    };

    tick();
  };

  // ---- GSAP: hero entrance timeline ----
  if (gsapReady && !prefersReducedMotion) {
    document.querySelectorAll('.line-inner').forEach((el) => {
      gsap.set(el, { y: el.offsetHeight * 1.15 });
    });

    gsap.timeline({ defaults: { ease: 'power4.out' } })
      .to('.line-inner', { y: 0, duration: 1, stagger: 0.14 })
      .to('.hero-photo.hero-anim', { opacity: 1, y: 0, duration: 0.7 }, 0)
      .to('.eyebrow.hero-anim', { opacity: 1, y: 0, duration: 0.6 }, 0.08)
      .to('.hero-lead.hero-anim', { opacity: 1, y: 0, duration: 0.7 }, 0.5)
      .to('.hero-actions.hero-anim', { opacity: 1, y: 0, duration: 0.7 }, 0.62)
      .to('.hero-socials.hero-anim', { opacity: 1, y: 0, duration: 0.7 }, 0.72)
      .to('.tech-marquee.hero-anim', { opacity: 1, y: 0, duration: 0.7 }, 0.82)
      .add(startTypewriter, 1.05);
  } else {
    document.querySelectorAll('.hero-anim, .line-inner').forEach((el) => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });

    if (typewriterEl) {
      typewriterEl.textContent = typewriterPhrases[0].text;
    }
  }

  // ---- GSAP: word-by-word mask reveal for section titles ----
  if (gsapReady && !prefersReducedMotion) {
    document.querySelectorAll('.section-title').forEach((title) => {
      const words = title.textContent.trim().split(/\s+/);
      title.innerHTML = words
        .map((word) => `<span class="word-mask"><span class="word-inner">${word}</span></span>`)
        .join(' ');

      const inners = title.querySelectorAll('.word-inner');
      inners.forEach((el) => gsap.set(el, { y: el.offsetHeight * 1.1 }));

      ScrollTrigger.create({
        trigger: title,
        start: 'top 88%',
        once: true,
        onEnter: () => {
          gsap.to(inners, { y: 0, duration: 0.9, ease: 'power4.out', stagger: 0.05 });
        },
      });
    });
  }

  // ---- GSAP: scroll-triggered reveals (batched + staggered) ----
  if (gsapReady) {
    ScrollTrigger.batch('.reveal', {
      start: 'top 88%',
      once: true,
      onEnter: (batch) => {
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.1,
          overwrite: true,
        });
      },
    });
  } else {
    document.querySelectorAll('.reveal').forEach((el) => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  }

  // ---- GSAP: stat count-up ----
  document.querySelectorAll('[data-count-to]').forEach((el) => {
    const target = Number(el.dataset.countTo);
    const suffix = el.dataset.suffix || '';

    if (!gsapReady || prefersReducedMotion || Number.isNaN(target)) {
      el.textContent = `${target}${suffix}`;
      return;
    }

    const counter = { value: 0 };

    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(counter, {
          value: target,
          duration: 1.3,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = `${Math.round(counter.value)}${suffix}`;
          },
        });
      },
    });
  });

  // ---- GSAP: magnetic buttons ----
  if (gsapReady && hasFinePointer && !prefersReducedMotion) {
    document.querySelectorAll('.btn-magnetic').forEach((btn) => {
      const moveX = gsap.quickTo(btn, 'x', { duration: 0.35, ease: 'power3.out' });
      const moveY = gsap.quickTo(btn, 'y', { duration: 0.35, ease: 'power3.out' });

      btn.addEventListener('mousemove', (event) => {
        const rect = btn.getBoundingClientRect();
        moveX((event.clientX - rect.left - rect.width / 2) * 0.35);
        moveY((event.clientY - rect.top - rect.height / 2) * 0.35);
      });

      btn.addEventListener('mouseleave', () => {
        moveX(0);
        moveY(0);
      });
    });
  }

  // ---- GSAP: tilt on hover for glass tiles ----
  if (gsapReady && hasFinePointer && !prefersReducedMotion) {
    const tiltCards = document.querySelectorAll('.skill-card, .work-card, .project-showcase-card, .timeline-card, .stat, .edu-card');

    tiltCards.forEach((card) => {
      const rotateX = gsap.quickTo(card, 'rotationX', { duration: 0.5, ease: 'power3.out' });
      const rotateY = gsap.quickTo(card, 'rotationY', { duration: 0.5, ease: 'power3.out' });
      const lift = gsap.quickTo(card, 'y', { duration: 0.5, ease: 'power3.out' });
      const scale = gsap.quickTo(card, 'scale', { duration: 0.5, ease: 'power3.out' });

      gsap.set(card, { transformPerspective: 800, transformOrigin: 'center' });

      card.addEventListener('mousemove', (event) => {
        const rect = card.getBoundingClientRect();
        const relX = (event.clientX - rect.left) / rect.width - 0.5;
        const relY = (event.clientY - rect.top) / rect.height - 0.5;
        rotateY(relX * 10);
        rotateX(relY * -10);
        lift(-6);
        scale(1.02);
      });

      card.addEventListener('mouseleave', () => {
        rotateX(0);
        rotateY(0);
        lift(0);
        scale(1);
      });
    });
  }

  // ---- Scroll progress, nav compact, hide scroll cue ----
  const progressBar = document.getElementById('scrollProgress');
  const navWrap = document.querySelector('.nav-wrap');
  const scrollCue = document.querySelector('.scroll-cue');

  const onPageScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = max > 0 ? window.scrollY / max : 0;

    if (progressBar) progressBar.style.transform = `scaleX(${progress})`;
    if (navWrap) navWrap.classList.toggle('is-scrolled', window.scrollY > 24);
    if (scrollCue) scrollCue.classList.toggle('is-hidden', window.scrollY > 80);
  };

  window.addEventListener('scroll', onPageScroll, { passive: true });
  window.addEventListener('resize', onPageScroll, { passive: true });
  onPageScroll();

  // ---- Timeline fill as you read ----
  const timelineEl = document.querySelector('.timeline');
  const timelineFill = document.getElementById('timelineProgress');

  if (timelineFill) {
    if (gsapReady && !prefersReducedMotion && timelineEl) {
      ScrollTrigger.create({
        trigger: timelineEl,
        start: 'top 65%',
        end: 'bottom 55%',
        onUpdate: (self) => {
          timelineFill.style.transform = `scaleY(${self.progress})`;
        },
      });
    } else {
      timelineFill.style.transform = 'scaleY(1)';
    }
  }

  // ---- Project showcase filters ----
  const projectFilters = document.querySelectorAll('.project-filter');
  const projectCards = document.querySelectorAll('.project-showcase-card');

  projectFilters.forEach((filterBtn) => {
    filterBtn.addEventListener('click', () => {
      const filter = filterBtn.dataset.filter;

      projectFilters.forEach((btn) => {
        const isActive = btn === filterBtn;

        btn.classList.toggle('is-active', isActive);
        btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      projectCards.forEach((card) => {
        const company = card.dataset.company;
        const isVisible = filter === 'all' || company === filter;

        card.classList.toggle('is-filtered-out', !isVisible);
      });
    });
  });
})();
