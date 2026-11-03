import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const body = document.body;
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const isDesktop = () => matchMedia("(min-width: 901px)").matches;

gsap.registerPlugin(ScrollTrigger, SplitText, Flip, CustomEase);
CustomEase.create("lux", "0.77, 0, 0.18, 1");
CustomEase.create("silk", "0.16, 1, 0.3, 1");

/* =========================================================
   1. SMOOTH SCROLL (Lenis) synced with ScrollTrigger
   ========================================================= */
const lenis = new Lenis({ duration: 1.3, smoothWheel: true, wheelMultiplier: 0.9 });
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((t) => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);
lenis.stop();

$$('a[href^="#"]').forEach((a) =>
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href");
    const target = id === "#top" ? 0 : $(id);
    if (target === null) return;
    e.preventDefault();
    body.classList.remove("menu-open");
    lenis.scrollTo(target, { duration: 1.8, easing: (x) => 1 - Math.pow(1 - x, 4) });
  })
);

/* =========================================================
   2. THREE.JS HERO — video texture through a luxury shader
      (cursor liquid distortion, chromatic aberration on
       movement, scroll → zoom + fade to warm monochrome,
       vignette, film grain)
   ========================================================= */
const hero = {
  uniforms: null,
  renderer: null,
  visible: true,
  mouse: new THREE.Vector2(0.5, 0.5),
  target: new THREE.Vector2(0.5, 0.5),
  vel: 0,
  hover: 0,
  hoverTarget: 0,
};

function initHeroGL() {
  const canvas = $(".js-hero-gl");
  const video = $(".js-hero-video");
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: "high-performance" });
  } catch {
    document.documentElement.classList.add("no-webgl");
    video.play().catch(() => {});
    return;
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace; // pass-through: no double gamma

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  // Poster texture first, swapped to video as soon as it can play
  const poster = new THREE.TextureLoader().load("assets/img/haze-tower.jpg", (t) => {
    hero.uniforms.uTexRes.value.set(t.image.width, t.image.height);
  });
  poster.colorSpace = THREE.NoColorSpace;

  const uniforms = {
    uTex: { value: poster },
    uRes: { value: new THREE.Vector2(1, 1) },
    uTexRes: { value: new THREE.Vector2(1920, 1080) },
    uMouse: { value: hero.mouse },
    uTime: { value: 0 },
    uScroll: { value: 0 },
    uVel: { value: 0 },
    uHover: { value: 0 },
    uReveal: { value: 0 },
  };
  hero.uniforms = uniforms;

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() { vUv = uv; gl_Position = vec4(position, 1.0); }
    `,
    fragmentShader: /* glsl */ `
      precision highp float;
      uniform sampler2D uTex;
      uniform vec2 uRes, uTexRes, uMouse;
      uniform float uTime, uScroll, uVel, uHover, uReveal;
      varying vec2 vUv;

      vec2 hash(vec2 p) {
        p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
        return -1.0 + 2.0 * fract(sin(p) * 43758.5453);
      }
      float noise(vec2 p) {
        vec2 i = floor(p), f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(dot(hash(i), f), dot(hash(i + vec2(1, 0)), f - vec2(1, 0)), u.x),
                   mix(dot(hash(i + vec2(0, 1)), f - vec2(0, 1)), dot(hash(i + vec2(1, 1)), f - vec2(1, 1)), u.x), u.y);
      }
      vec2 cover(vec2 uv) {
        float rs = uRes.x / uRes.y, ri = uTexRes.x / uTexRes.y;
        vec2 s = rs > ri ? vec2(1.0, ri / rs) : vec2(rs / ri, 1.0);
        return (uv - 0.5) * s + 0.5;
      }

      void main() {
        vec2 uv = vUv;

        // intro settle + scroll push-in
        float zoom = 1.0 - 0.10 * uScroll - 0.22 * (1.0 - uReveal);
        uv = (uv - 0.5) * zoom + 0.5;
        uv.y -= uScroll * 0.05;

        // crisp sample — no cursor distortion over the footage
        vec3 col = texture2D(uTex, cover(uv)).rgb;

        // warm luxury grade
        col = mix(col, col * vec3(1.06, 0.98, 0.86), 0.35);
        col = (col - 0.5) * 1.06 + 0.5;

        // scroll → warm monochrome & dim (Lenval-style colour drain)
        float g = dot(col, vec3(0.299, 0.587, 0.114));
        col = mix(col, vec3(g) * vec3(1.04, 0.98, 0.9), uScroll * 0.9);
        col *= 1.0 - uScroll * 0.45;

        // vignette
        float v = smoothstep(1.25, 0.3, length((vUv - 0.5) * vec2(1.25, 1.0)));
        col *= mix(0.55, 1.0, v);

        // grain
        float n = fract(sin(dot(vUv * (uTime + 1.0), vec2(12.9898, 78.233))) * 43758.5453);
        col += (n - 0.5) * 0.045;

        // reveal from espresso
        col = mix(vec3(0.114, 0.09, 0.078), col, uReveal);
        gl_FragColor = vec4(col, 1.0);
      }
    `,
  });
  scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material));

  const useVideo = () => {
    const vt = new THREE.VideoTexture(video);
    vt.colorSpace = THREE.NoColorSpace;
    vt.minFilter = vt.magFilter = THREE.LinearFilter;
    uniforms.uTex.value = vt;
    uniforms.uTexRes.value.set(video.videoWidth || 1920, video.videoHeight || 1080);
  };
  video.addEventListener("loadeddata", useVideo, { once: true });
  video.load(); // buffer now; playback starts when the preloader hands over

  const resize = () => {
    const r = canvas.getBoundingClientRect();
    renderer.setSize(r.width, r.height, false);
    uniforms.uRes.value.set(r.width, r.height);
  };
  resize();
  addEventListener("resize", resize);

  const heroEl = $(".hero");
  heroEl.addEventListener("pointermove", (e) => {
    const r = heroEl.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width;
    const ny = 1 - (e.clientY - r.top) / r.height;
    hero.vel = Math.min(1, hero.vel + Math.hypot(nx - hero.target.x, ny - hero.target.y) * 6);
    hero.target.set(nx, ny);
    hero.hoverTarget = 1;
  });
  heroEl.addEventListener("pointerleave", () => (hero.hoverTarget = 0));

  ScrollTrigger.create({
    trigger: heroEl, start: "top top", end: "bottom top",
    onUpdate: (s) => (uniforms.uScroll.value = s.progress),
    onToggle: (s) => (hero.visible = s.isActive || s.progress === 0),
  });

  hero.renderer = renderer;
  gsap.ticker.add((time) => {
    if (!hero.visible) return;
    hero.mouse.lerp(hero.target, 0.08);
    hero.vel *= 0.92;
    hero.hover += (hero.hoverTarget - hero.hover) * 0.06;
    uniforms.uVel.value = hero.vel;
    uniforms.uHover.value = hero.hover;
    uniforms.uTime.value = time;
    renderer.render(scene, camera);
  });
}

/* =========================================================
   3. THREE.JS GOLD DUST — drifting particles behind
      "The Rovera Distinction", with cursor parallax
   ========================================================= */
function initDust() {
  const canvas = $(".js-dust");
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true }); } catch { return; }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 20);
  camera.position.z = 3;

  const COUNT = isDesktop() ? 2200 : 900;
  const pos = new Float32Array(COUNT * 3);
  const seed = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 7;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 5;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 4;
    seed[i * 3] = Math.random();            // size
    seed[i * 3 + 1] = 0.05 + Math.random() * 0.15; // rise speed
    seed[i * 3 + 2] = Math.random() * 6.28; // phase
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("aSeed", new THREE.BufferAttribute(seed, 3));

  const uniforms = {
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2() },
    uPR: { value: renderer.getPixelRatio() },
    uScroll: { value: 0 },
  };
  const mat = new THREE.ShaderMaterial({
    uniforms,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexShader: /* glsl */ `
      attribute vec3 aSeed;
      uniform float uTime, uPR, uScroll;
      uniform vec2 uMouse;
      varying float vAlpha;
      void main() {
        vec3 p = position;
        p.y = mod(p.y + uTime * aSeed.y + uScroll * 1.5 + 2.5, 5.0) - 2.5;
        p.x += sin(uTime * 0.4 + aSeed.z) * 0.12;
        p.xy += uMouse * (0.15 + (p.z + 2.0) * 0.08);
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = (7.0 + aSeed.x * 26.0) * uPR * (1.0 / -mv.z);
        vAlpha = (0.25 + aSeed.x * 0.75) * (0.6 + 0.4 * sin(uTime * 1.5 + aSeed.z * 3.0));
      }
    `,
    fragmentShader: /* glsl */ `
      varying float vAlpha;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        float a = smoothstep(0.5, 0.0, d);
        gl_FragColor = vec4(vec3(0.85, 0.72, 0.48) * a, a * vAlpha * 0.9);
      }
    `,
  });
  scene.add(new THREE.Points(geo, mat));

  const section = $(".distinction");
  const resize = () => {
    const r = section.getBoundingClientRect();
    renderer.setSize(r.width, r.height, false);
    camera.aspect = r.width / r.height;
    camera.updateProjectionMatrix();
  };
  resize();
  addEventListener("resize", resize);

  const m = new THREE.Vector2(), mt = new THREE.Vector2();
  section.addEventListener("pointermove", (e) => {
    mt.set((e.clientX / innerWidth - 0.5) * 2, -(e.clientY / innerHeight - 0.5) * 2);
  });

  let active = false;
  ScrollTrigger.create({
    trigger: section, start: "top bottom", end: "bottom top",
    onToggle: (s) => (active = s.isActive),
    onUpdate: (s) => (uniforms.uScroll.value = s.progress),
  });
  gsap.ticker.add((time) => {
    if (!active) return;
    m.lerp(mt, 0.04);
    uniforms.uMouse.value.copy(m);
    uniforms.uTime.value = time;
    renderer.render(scene, camera);
  });
}

/* =========================================================
   4. PRELOADER — Lenval-style Flip choreography
   ========================================================= */
function runPreloader(onDone) {
  const count = $(".js-count");
  const counter = { v: 0 };
  const words = $(".js-pl-words");
  const logo = $(".js-pl-logo");
  const img = $(".js-pl-img");
  const video = $(".js-hero-video");

  // Ready when the hero video can play (or after 5s), but never faster than 2s
  const ready = Promise.all([
    new Promise((r) => setTimeout(r, 2000)),
    Promise.race([
      new Promise((r) => (video.readyState >= 3 ? r() : video.addEventListener("canplay", r, { once: true }))),
      new Promise((r) => setTimeout(r, 5000)),
    ]),
  ]);

  const tl = gsap.timeline();
  tl.from(logo, { opacity: 0, letterSpacing: "0.9em", duration: 1.6, ease: "silk" }, 0)
    .to(".pl__w > span", { y: "0%", duration: 1.3, ease: "silk", stagger: 0.09 }, 0.3)
    .from(".pl__load, .pl__foot", { opacity: 0, duration: 1 }, 0.4)
    .to(counter, { v: 72, duration: 2, ease: "power2.out", onUpdate: () => (count.textContent = Math.round(counter.v)) }, 0);

  ready.then(() => {
    gsap.to(counter, { v: 100, duration: 0.6, ease: "power2.inOut", onUpdate: () => (count.textContent = Math.round(counter.v)) });

    const go = gsap.timeline({ delay: 0.6, onComplete: onDone });

    // Phase 2 — words scatter to the grid, logo docks to the top, portrait reveals
    go.add(() => {
      const st = Flip.getState(".pl__w", { props: "fontSize" });
      const lst = Flip.getState(logo, { props: "fontSize,letterSpacing" });
      words.classList.add("is-grid");
      logo.classList.add("is-top");
      Flip.from(st, { duration: 1.4, ease: "lux", stagger: 0.05 });
      Flip.from(lst, { duration: 1.4, ease: "lux" });
    })
      .to(".pl__load", { opacity: 0, duration: 0.5 }, 0)
      .to(img, { clipPath: "inset(0% 0 0 0)", duration: 1.4, ease: "lux" }, 0.3)
      .from(img.querySelector("img"), { scale: 1.4, duration: 1.8, ease: "silk" }, 0.3)

      // Phase 3 — words exit, portrait expands to fill the screen, reveal hero
      .to(".pl__w > span", { y: "-105%", duration: 0.9, ease: "power3.in", stagger: 0.05 }, 2.3)
      .to(".pl__foot", { opacity: 0, duration: 0.5 }, 2.3)
      .add(() => {
        const st = Flip.getState(img);
        img.classList.add("is-full");
        Flip.from(st, { duration: 1.5, ease: "lux", scale: false });
      }, 2.8)
      .add(() => { video.currentTime = 0; video.play().catch(() => {}); }, 3.3)
      .to(".pl__bg", { opacity: 0, duration: 0.8 }, 3.5)
      .add(() => hero.uniforms && gsap.to(hero.uniforms.uReveal, { value: 1, duration: 2.4, ease: "silk" }), 3.6)
      .to(img, { opacity: 0, duration: 1.1, ease: "power2.inOut" }, 4.0)
      .to(logo, { opacity: 0, duration: 0.4 }, 4.6);
  });
}

/* =========================================================
   5. SCROLL CHOREOGRAPHY
   ========================================================= */
function initScroll() {
  // Masked line reveals (SplitText)
  $$(".js-lines").forEach((el) => {
    const split = SplitText.create(el, { type: "lines", mask: "lines", linesClass: "split-line" });
    gsap.from(split.lines, {
      yPercent: 105, duration: 1.4, ease: "silk", stagger: 0.08,
      scrollTrigger: { trigger: el, start: "top 88%" },
    });
  });

  // About statement — words light up as you read
  $$(".js-words").forEach((el) => {
    const split = SplitText.create(el, { type: "words", wordsClass: "word" });
    gsap.to(split.words, {
      opacity: 1, stagger: 0.1, ease: "none",
      scrollTrigger: { trigger: el, start: "top 75%", end: "bottom 40%", scrub: true },
    });
  });

  // Quote — character reveal
  $$(".js-chars").forEach((el) => {
    const split = SplitText.create(el, { type: "words,chars" });
    gsap.set(split.chars, { opacity: 0.12 });
    gsap.to(split.chars, {
      opacity: 1, stagger: 0.02, ease: "none",
      scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 50%", scrub: true },
    });
  });

  // Fade-ups
  $$(".js-fade").forEach((el) =>
    gsap.from(el, { y: 50, opacity: 0, duration: 1.4, ease: "silk", scrollTrigger: { trigger: el, start: "top 90%" } })
  );

  // Clip-path image reveals with inner parallax
  $$(".js-clip").forEach((el) => {
    gsap.fromTo(el, { clipPath: "inset(100% 0% 0% 0%)" }, {
      clipPath: "inset(0% 0% 0% 0%)", duration: 1.8, ease: "lux",
      scrollTrigger: { trigger: el, start: "top 82%" },
    });
    gsap.fromTo(el.querySelector("img"), { scale: 1.25, yPercent: -6 }, {
      scale: 1.05, yPercent: 6, ease: "none",
      scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
    });
  });

  // Hero text drifts away on scroll
  gsap.to(".hero__content, .hero__tag", {
    yPercent: -60, opacity: 0, ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "60% top", scrub: true },
  });

  // Pinned inset image that expands to full bleed
  const ex = $(".js-expand");
  gsap.timeline({
    scrollTrigger: { trigger: ".expand", start: "top top", end: "+=110%", pin: true, scrub: 1 },
  })
    .fromTo(ex, { clipPath: isDesktop() ? "inset(16% 22% 16% 22%)" : "inset(10% 6% 10% 6%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "none" }, 0)
    .fromTo(ex.querySelector("img"), { scale: 1.35 }, { scale: 1, ease: "none" }, 0)
    .from(".expand__copy", { opacity: 0, y: 40, ease: "none", duration: 0.3 }, 0.6);

  // Film frame opens to full width
  gsap.fromTo(".js-expand-film", { clipPath: `inset(0% ${isDesktop() ? 48 : 0}px)` }, {
    clipPath: "inset(0% 0px)", ease: "none",
    scrollTrigger: { trigger: ".film", start: "top bottom", end: "top top", scrub: true },
  });

  // Collection — pinned horizontal scroll (desktop)
  const mm = gsap.matchMedia();
  mm.add("(min-width: 901px)", () => {
    const track = $(".js-track");
    const dist = () => track.scrollWidth - (innerWidth - track.getBoundingClientRect().left) + 48;
    gsap.timeline({
      scrollTrigger: { trigger: ".collection", start: "top top", end: () => "+=" + dist(), pin: ".collection__pin", scrub: 1, invalidateOnRefresh: true },
    })
      .to(track, { x: () => -dist(), ease: "none", duration: 1 }, 0)
      .to(".collection__head", { opacity: 0, xPercent: -25, ease: "none", duration: 0.28 }, 0);
  });
  mm.add("(max-width: 900px)", () => {
    $$(".estate").forEach((el) =>
      gsap.from(el, { y: 60, opacity: 0, duration: 1.2, ease: "silk", scrollTrigger: { trigger: el, start: "top 90%" } })
    );
  });

  // Counters
  $$(".js-count-up").forEach((el) => {
    const o = { v: 0 };
    gsap.to(o, {
      v: +el.dataset.to, duration: 2.6, ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 88%" },
      onUpdate: () => (el.textContent = Math.round(o.v).toLocaleString("en-IN")),
    });
  });

  // Marquee — speed reacts to scroll velocity
  const mq = $(".js-marquee");
  mq.innerHTML += mq.innerHTML;
  const loop = gsap.to(mq, { xPercent: -50, duration: 40, ease: "none", repeat: -1 });
  lenis.on("scroll", ({ velocity }) => {
    gsap.to(loop, { timeScale: 1 + Math.min(Math.abs(velocity) * 0.25, 5), duration: 0.3, overwrite: true });
    gsap.to(loop, { timeScale: 1, duration: 1.2, delay: 0.3 });
  });

  // Footer wordmark rises letter by letter
  const mark = SplitText.create(".js-mark", { type: "chars", mask: "chars" });
  gsap.from(mark.chars, {
    yPercent: 100, duration: 1.6, ease: "silk", stagger: 0.06,
    scrollTrigger: { trigger: ".js-mark", start: "top 95%" },
  });

  // Header: solid after hero, hides on scroll down
  const header = $(".header");
  let lastY = 0;
  lenis.on("scroll", ({ scroll }) => {
    header.classList.toggle("is-solid", scroll > innerHeight * 0.85);
    header.classList.toggle("is-hidden", scroll > lastY && scroll > innerHeight && !body.classList.contains("menu-open"));
    lastY = scroll;
  });
}

/* =========================================================
   6. UI — cursor, clock, menu, film modal, testimonials, form
   ========================================================= */
function initUI() {
  // Cursor
  const cur = $(".cursor"), label = $(".cursor__label");
  const xTo = gsap.quickTo(cur, "x", { duration: 0.45, ease: "power3" });
  const yTo = gsap.quickTo(cur, "y", { duration: 0.45, ease: "power3" });
  addEventListener("pointermove", (e) => { xTo(e.clientX); yTo(e.clientY); });
  document.addEventListener("pointerover", (e) => {
    const t = e.target.closest("[data-cursor]");
    if (t) { label.textContent = t.dataset.cursor; cur.classList.add("is-label"); }
  });
  document.addEventListener("pointerout", (e) => {
    const t = e.target.closest("[data-cursor]");
    if (t && !t.contains(e.relatedTarget)) cur.classList.remove("is-label");
  });

  // IST clock
  const clock = $(".js-clock");
  const tick = () => (clock.textContent = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" }).format(new Date()));
  tick(); setInterval(tick, 15000);

  // Menu
  $(".header__burger").addEventListener("click", () => body.classList.toggle("menu-open"));

  // Film modal
  const modal = $(".modal"), film = $(".modal__video");
  const close = () => { modal.classList.remove("is-open"); film.pause(); lenis.start(); };
  $(".js-expand-film").addEventListener("click", () => {
    modal.classList.add("is-open"); lenis.stop();
    film.currentTime = 0; film.play().catch(() => {});
  });
  $(".modal__close").addEventListener("click", close);
  addEventListener("keydown", (e) => e.key === "Escape" && modal.classList.contains("is-open") && close());

  // Testimonials
  const voices = $$(".voice"), dots = $$(".voices__dots button");
  let vi = 0;
  const show = (i) => { vi = i; voices.forEach((v, k) => v.classList.toggle("is-active", k === i)); dots.forEach((d, k) => d.classList.toggle("is-active", k === i)); };
  dots.forEach((d, i) => d.addEventListener("click", () => show(i)));
  setInterval(() => show((vi + 1) % voices.length), 6500);

  // Form (front-end only — connect to CRM / email / WhatsApp API)
  $(".js-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const f = e.currentTarget, d = Object.fromEntries(new FormData(f));
    // No backend yet: hand the enquiry to the owner's mail client, pre-filled.
    const body = `Name: ${d.name}\nPhone: ${d.phone}\nEmail: ${d.email}\nCity / Country: ${d.city || "-"}\nEstate of interest: ${d.estate}\n\n${d.message || ""}`;
    location.href = `mailto:svarunroyal999@gmail.com?subject=${encodeURIComponent("Rovera enquiry — " + d.name)}&body=${encodeURIComponent(body)}`;
    f.classList.add("is-sent"); f.reset();
  });
}

/* =========================================================
   BOOT
   ========================================================= */
initUI();
initHeroGL();
initDust();

document.fonts.ready.then(() => {
  initScroll();

  // Hero title prepared for its entrance
  const heroSplit = SplitText.create(".js-hero-title", { type: "lines", mask: "lines", linesClass: "split-line" });
  gsap.set(heroSplit.lines, { yPercent: 105 });
  gsap.set(".js-hero-fade, .header", { opacity: 0 });

  const finish = () => {
    $(".pl").remove();
    body.classList.remove("is-loading");
    lenis.start();
    ScrollTrigger.refresh();
    gsap.to(heroSplit.lines, { yPercent: 0, duration: 1.6, ease: "silk", stagger: 0.12 });
    gsap.to(".js-hero-fade, .header", { opacity: 1, duration: 1.4, ease: "power2.out", stagger: 0.1, delay: 0.4 });
  };

  if (reduced) {
    if (hero.uniforms) hero.uniforms.uReveal.value = 1;
    $(".js-hero-video").play().catch(() => {});
    finish();
  } else {
    runPreloader(finish);
  }
});
