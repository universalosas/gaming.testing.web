/* =========================================================
   OSARO.HUB — script.js
   ========================================================= */
(function(){
  "use strict";

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- BOOT SEQUENCE ---------- */
  const boot = document.getElementById('boot');
  const bootPct = document.querySelector('.boot__pct');
  (function runBoot(){
    if(prefersReducedMotion){ boot.classList.add('is-done'); return; }
    let pct = 0;
    const timer = setInterval(() => {
      pct += Math.floor(Math.random()*18)+6;
      if(pct >= 100){ pct = 100; clearInterval(timer); }
      bootPct.textContent = String(pct).padStart(2,'0') + '%';
      if(pct === 100){
        setTimeout(() => boot.classList.add('is-done'), 350);
      }
    }, 220);
  })();

  /* ---------- CURSOR GLOW ---------- */
  const glow = document.getElementById('cursorGlow');
  if(glow && !prefersReducedMotion){
    window.addEventListener('pointermove', (e) => {
      glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%,-50%)`;
    }, { passive: true });
  }

  /* ---------- NAV: scroll state + mobile toggle + active link ---------- */
  const nav = document.getElementById('siteNav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const navAnchors = Array.from(document.querySelectorAll('[data-nav]'));

  const onScroll = () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 40);
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
  navAnchors.forEach(a => a.addEventListener('click', () => {
    navLinks.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  }));

  const sections = navAnchors
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  if('IntersectionObserver' in window && sections.length){
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const id = '#' + entry.target.id;
        const link = navAnchors.find(a => a.getAttribute('href') === id);
        if(!link) return;
        if(entry.isIntersecting){
          navAnchors.forEach(a => a.classList.remove('is-active'));
          link.classList.add('is-active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(s => navObserver.observe(s));
  }

  /* ---------- HUD TILE: rotate "now playing" line ---------- */
  const hudGame = document.getElementById('hudGame');
  const rotatingGames = ['Shattered Meridian', 'Nightfall Circuit', 'Voidrunner Protocol'];
  let hudIndex = 0;
  if(hudGame && !prefersReducedMotion){
    setInterval(() => {
      hudIndex = (hudIndex + 1) % rotatingGames.length;
      hudGame.style.opacity = 0;
      setTimeout(() => {
        hudGame.textContent = rotatingGames[hudIndex];
        hudGame.style.opacity = 1;
      }, 250);
    }, 5000);
    hudGame.style.transition = 'opacity .25s ease';
  }

  /* ---------- STATS TICKER ---------- */
  const tickerTrack = document.getElementById('tickerTrack');
  const stats = [
    { icon:'bi-controller', label:'Games in library', value:'128' },
    { icon:'bi-trophy', label:'Achievements unlocked', value:'742' },
    { icon:'bi-clock-history', label:'Hours logged', value:'3,410' },
    { icon:'bi-lightning-charge', label:'Current streak', value:'14 days' },
    { icon:'bi-people', label:'Squad members', value:'9' },
    { icon:'bi-graph-up-arrow', label:'Rank', value:'Diamond II' },
  ];
  function buildTicker(){
    const html = stats.map(s => `
      <span class="ticker__item"><i class="bi ${s.icon}"></i><strong>${s.value}</strong> ${s.label}</span>
    `).join('');
    tickerTrack.innerHTML = html + html; // duplicate for seamless loop
  }
  buildTicker();

  /* ---------- GAME LIBRARY ---------- */
  const libraryRow = document.getElementById('libraryRow');
  const games = [
    { title:'Shattered Meridian', genre:'Open-World RPG', platform:'bi-xbox', progress:64, icon:'bi-map', from:'#3a1c71', to:'#0f2b46' },
    { title:'Nightfall Circuit', genre:'Racing / Arcade', platform:'bi-playstation', progress:88, icon:'bi-speedometer2', from:'#1b3b5f', to:'#0a5c6b' },
    { title:'Voidrunner Protocol', genre:'Sci-Fi Shooter', platform:'bi-pc-display', progress:41, icon:'bi-crosshair', from:'#26362f', to:'#0f3d2e' },
    { title:'Emberfall Tactics', genre:'Strategy', platform:'bi-xbox', progress:100, icon:'bi-shield', from:'#4a2a1a', to:'#2b1a30' },
    { title:'Glass City Drift', genre:'Racing', platform:'bi-pc-display', progress:22, icon:'bi-flag', from:'#1a2a4a', to:'#301a3f' },
    { title:'Hollow Signal', genre:'Horror / Puzzle', platform:'bi-playstation', progress:76, icon:'bi-eye', from:'#22262f', to:'#111826' },
    { title:'Ridgeline Co-op', genre:'Survival Co-op', platform:'bi-xbox', progress:53, icon:'bi-tree', from:'#1e3320', to:'#0d1f22' },
  ];
  function buildLibrary(){
    libraryRow.innerHTML = games.map(g => {
      const circumference = 2 * Math.PI * 16;
      const offset = circumference - (g.progress/100)*circumference;
      return `
      <article class="game-card">
        <div class="game-card__art" style="background: linear-gradient(150deg, ${g.from}, ${g.to});">
          <i class="bi ${g.icon}"></i>
          <span class="game-card__platform"><i class="bi ${g.platform}"></i></span>
          <span class="game-card__ring">
            <svg viewBox="0 0 40 40">
              <circle class="track" cx="20" cy="20" r="16"></circle>
              <circle class="prog" cx="20" cy="20" r="16" stroke-dasharray="${circumference}" stroke-dashoffset="${offset}"></circle>
            </svg>
            ${g.progress}%
          </span>
        </div>
        <div class="game-card__body">
          <div class="game-card__title">${g.title}</div>
          <div class="game-card__genre">${g.genre}</div>
        </div>
      </article>`;
    }).join('');
  }
  buildLibrary();

  const scrollBtns = document.querySelectorAll('.scroll-btn');
  scrollBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const dir = Number(btn.dataset.dir);
      libraryRow.scrollBy({ left: dir * 320, behavior: 'smooth' });
    });
  });

  /* ---------- ACHIEVEMENTS ---------- */
  const achvSummary = document.getElementById('achvSummary');
  const achvGrid = document.getElementById('achvGrid');
  const achvSummaryData = [
    { icon:'bi-gem', label:'Platinum', value:6 },
    { icon:'bi-award', label:'Gold', value:38 },
    { icon:'bi-award-fill', label:'Silver', value:112 },
    { icon:'bi-patch-check', label:'Bronze', value:586 },
  ];
  const achievements = [
    { tier:'platinum', icon:'bi-gem', title:'Meridian Cartographer', desc:'Fully explored every region of Shattered Meridian.' },
    { tier:'gold', icon:'bi-lightning', title:'Zero to Redline', desc:'Hit top speed in Nightfall Circuit within the first lap.' },
    { tier:'gold', icon:'bi-crosshair2', title:'Void Marksman', desc:'Landed 500 precision hits in Voidrunner Protocol.' },
    { tier:'silver', icon:'bi-people-fill', title:'Squad Tactics', desc:'Won a co-op match without losing a teammate.' },
    { tier:'silver', icon:'bi-moon-stars', title:'Signal Lost', desc:'Survived the Hollow Signal night chapter solo.' },
    { tier:'bronze', icon:'bi-flag-fill', title:'First Blood', desc:'Completed the opening mission on release day.' },
    { tier:'bronze', icon:'bi-tree-fill', title:'Basecamp Builder', desc:'Built your first outpost in Ridgeline Co-op.' },
    { tier:'gold', icon:'bi-hourglass-split', title:'No Sleep Streak', desc:'Logged in for 14 consecutive days.' },
  ];
  function buildAchievements(){
    achvSummary.innerHTML = achvSummaryData.map(s => `
      <span class="achv-summary__chip"><i class="bi ${s.icon}"></i> <strong>${s.value}</strong> ${s.label}</span>
    `).join('');
    achvGrid.innerHTML = achievements.map(a => `
      <div class="achv-card achv-card--${a.tier} reveal">
        <div class="achv-card__icon"><i class="bi ${a.icon}"></i></div>
        <div>
          <div class="achv-card__title">${a.title}</div>
          <div class="achv-card__desc">${a.desc}</div>
          <span class="achv-card__tier">${a.tier.toUpperCase()} TIER</span>
        </div>
      </div>
    `).join('');
  }
  buildAchievements();

  /* ---------- SETUP / GEAR ---------- */
  const setupGrid = document.getElementById('setupGrid');
  const gear = [
    { tag:'Input', title:'Backlit Mechanical Keyboard', desc:'Hot-swappable switches tuned for fast inputs and long sessions.',
      img:'https://assets.mixkit.co/videos/51609/51609-thumb-360-0.jpg' },
    { tag:'Audio', title:'RGB Studio Headset', desc:'Closed-back drivers with a boom mic for squad comms.',
      img:'https://assets.mixkit.co/videos/51606/51606-thumb-360-0.jpg' },
    { tag:'Display', title:'Dual-Monitor RGB Rig', desc:'High refresh main panel plus a secondary for Discord and stats.',
      img:'https://assets.mixkit.co/videos/5460/5460-thumb-360-0.jpg' },
    { tag:'Desk', title:'Control Deck', desc:'Everything reachable without leaving the chair — the way it should be.',
      img:'https://assets.mixkit.co/videos/51603/51603-thumb-360-0.jpg' },
  ];
  function buildSetup(){
    setupGrid.innerHTML = gear.map(g => `
      <article class="gear-card reveal">
        <div class="gear-card__img"><img src="${g.img}" alt="${g.title}" loading="lazy"></div>
        <div class="gear-card__body">
          <span class="gear-card__tag">${g.tag}</span>
          <h3 class="gear-card__title">${g.title}</h3>
          <p class="gear-card__desc">${g.desc}</p>
        </div>
      </article>
    `).join('');
  }
  buildSetup();

  /* ---------- HIGHLIGHT CLIPS ---------- */
  const clipGrid = document.getElementById('clipGrid');
  const clips = [
    { title:'Clutch 1v3 — Voidrunner', meta:'Ranked · Season 04', src:'https://assets.mixkit.co/videos/51616/51616-360.mp4' },
    { title:'Podium Finish — Nightfall', meta:'Circuit Cup Finals', src:'https://assets.mixkit.co/videos/5527/5527-360.mp4' },
    { title:'Victory Screen', meta:'Emberfall Tactics', src:'https://assets.mixkit.co/videos/51612/51612-360.mp4' },
    { title:'Comms Chaos', meta:'Ridgeline Co-op', src:'https://assets.mixkit.co/videos/51621/51621-360.mp4' },
  ];
  function buildClips(){
    clipGrid.innerHTML = clips.map(c => `
      <article class="clip-card reveal">
        <video muted loop playsinline preload="metadata" src="${c.src}#t=0.5"></video>
        <span class="clip-card__play"><i class="bi bi-play-fill"></i></span>
        <div class="clip-card__overlay">
          <div class="clip-card__title">${c.title}</div>
          <div class="clip-card__meta">${c.meta}</div>
        </div>
      </article>
    `).join('');

    // hover-to-play
    clipGrid.querySelectorAll('.clip-card').forEach(card => {
      const video = card.querySelector('video');
      card.addEventListener('mouseenter', () => video.play().catch(()=>{}));
      card.addEventListener('mouseleave', () => { video.pause(); video.currentTime = 0.5; });
      card.addEventListener('touchstart', () => video.play().catch(()=>{}), { passive:true });
    });
  }
  buildClips();

  /* ---------- SCROLL REVEALS ---------- */
  function initReveals(){
    const revealEls = document.querySelectorAll('.reveal');
    if(!('IntersectionObserver' in window) || prefersReducedMotion){
      revealEls.forEach(el => el.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));
  }
  // static reveal targets get the class immediately; dynamic ones already have it from templates above
  document.querySelectorAll('.section__head, .achv-summary').forEach(el => el.classList.add('reveal'));
  initReveals();

  /* ---------- GAME CARD TILT ---------- */
  if(!prefersReducedMotion && window.matchMedia('(hover:hover)').matches){
    document.addEventListener('mousemove', (e) => {
      const card = e.target.closest && e.target.closest('.game-card');
      if(!card) return;
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(700px) rotateX(${y * -8}deg) rotateY(${x * 8}deg) translateY(-4px)`;
    });
    document.addEventListener('mouseout', (e) => {
      const card = e.target.closest && e.target.closest('.game-card');
      if(card) card.style.transform = '';
    });
  }

  /* ---------- CONTACT FORM (frontend only) ---------- */
  const form = document.getElementById('connectForm');
  const note = document.getElementById('connectNote');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    note.textContent = 'Transmission received — I\u2019ll reply from base soon.';
    form.reset();
  });

  /* ---------- BACK TO TOP ---------- */
  document.getElementById('toTop').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });

  /* ---------- FOOTER YEAR ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();

})();
