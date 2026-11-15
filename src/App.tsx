import { useEffect, useRef, useState, type CSSProperties, type MouseEvent, type MutableRefObject } from "react";

const FROM = "George";

const WISHES = [
  "May your bugs be few and your coffee always strong. ☕",
  "May every plan you make this year compile on the first try.",
  "Wishing you a year with zero merge conflicts, in code and in life.",
  "May good news keep pushing straight to your main branch.",
  "You deserve a 200 OK in everything you try this year. ✅",
  "Distance is just latency. The connection never dropped. 📡",
  "Here's to more laughs, more long talks, and fewer 'seen' messages.",
  "May this year hand you everything you've been quietly working for.",
  "Another year, another upgrade. Version +1 is the best one yet. 🚀",
  "May luck follow you like a loyal dependency. 🍀",
  "Wishing you health, peace of mind, and a heart that stays this big. 🤍",
  "ربنا يفتح لك كل باب خير ويرزقك اللي قلبك يتمناه 🤍",
  "عقبال كل أحلامك يا شادي، وتتحقق واحدة ورا التانية ✨",
];

const SCRIPT = [
  { color: "cmd", prompt: "$ ", text: "python3 gift.py" },
  { color: "out", prompt: "↳ ", text: "loading friendship.db ... done" },
  { color: "code", prompt: ">>> ", text: 'shady = friendship.load("brother")' },
  { color: "code", prompt: ">>> ", text: "print(shady.value)" },
  { color: "ok", prompt: "↳ ", text: "∞   # OverflowError: too big to measure" },
  { color: "code", prompt: ">>> ", text: "check_distance(year=2026)" },
  { color: "warn", prompt: "↳ ", text: "warning: fewer hangouts than usual this year" },
  { color: "code", prompt: ">>> ", text: "bond.strength > distance" },
  { color: "ok", prompt: "↳ ", text: "True   # always has been" },
  { color: "code", prompt: ">>> ", text: 'deliver_message(to="Shady")' },
  { color: "ok", prompt: "↳ ", text: "compiling with love ... done ✔" },
] as const;

type TerminalLine = Omit<(typeof SCRIPT)[number], "text"> & { text: string };
type Burst = (x: number, y: number, count?: number) => void;

const sleep = (milliseconds: number) =>
  new Promise<void>((resolve) => window.setTimeout(resolve, milliseconds));

function ParticleBackground({
  hue,
  burstRef,
}: {
  hue: number;
  burstRef: MutableRefObject<Burst>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hueRef = useRef(hue);

  useEffect(() => {
    hueRef.current = hue;
  }, [hue]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (context === null) return;
    const drawingContext = context as CanvasRenderingContext2D;

    type Dot = {
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      opacity: number;
      phase: number;
    };
    type Glyph = {
      x: number;
      y: number;
      size: number;
      speed: number;
      symbol: string;
      opacity: number;
    };
    type Confetti = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      width: number;
      height: number;
      rotation: number;
      spin: number;
      color: string;
      lifetime: number;
    };

    const symbols = ["{ }", "</>", "01", "=>", "( )", "[ ]", "++", "git", "&&", "λ", ";"];
    const random = (min: number, max: number) => min + Math.random() * (max - min);
    const dots: Dot[] = [];
    const glyphs: Glyph[] = [];
    let confetti: Confetti[] = [];
    let width = 0;
    let height = 0;
    let animationFrame = 0;
    let hueValue = hueRef.current;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * pixelRatio;
      canvas.height = height * pixelRatio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      drawingContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      dots.length = 0;
      glyphs.length = 0;
      for (let index = 0; index < 44; index += 1) {
        dots.push({
          x: random(0, width),
          y: random(0, height),
          radius: random(0.8, 2.2),
          vx: random(-0.12, 0.12),
          vy: random(-0.32, -0.07),
          opacity: random(0.2, 0.7),
          phase: random(0, Math.PI * 2),
        });
      }
      for (let index = 0; index < 18; index += 1) {
        glyphs.push({
          x: random(0, width),
          y: random(0, height),
          size: random(12, 20),
          speed: random(0.12, 0.38),
          symbol: symbols[Math.floor(Math.random() * symbols.length)],
          opacity: random(0.04, 0.12),
        });
      }
    };

    const burst = (x: number, y: number, count = 50) => {
      for (let index = 0; index < count; index += 1) {
        const angle = random(0, Math.PI * 2);
        const speed = random(2, 8);
        confetti.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 3,
          width: random(4, 9),
          height: random(3, 6),
          rotation: random(0, Math.PI * 2),
          spin: random(-0.25, 0.25),
          color: `hsl(${hueRef.current + random(0, 260)} 90% 68%)`,
          lifetime: random(65, 110),
        });
      }
    };
    burstRef.current = burst;

    const onPointerDown = (event: PointerEvent) => {
      burst(event.clientX, event.clientY, 8);
    };
    const onBirthdayBurst = (event: Event) => {
      const { x, y, count } = (event as CustomEvent<{ x: number; y: number; count: number }>).detail;
      burst(x, y, count);
    };
    const onVisibilityChange = () => {
      if (document.hidden) {
        window.cancelAnimationFrame(animationFrame);
      } else {
        animationFrame = window.requestAnimationFrame(frame);
      }
    };

    function frame() {
      drawingContext.clearRect(0, 0, width, height);
      const destinationHue = hueRef.current;
      hueValue += (destinationHue - hueValue) * 0.035;

      for (const glyph of glyphs) {
        glyph.y -= glyph.speed;
        if (glyph.y < -24) {
          glyph.y = height + 24;
          glyph.x = random(0, width);
        }
        drawingContext.font = `${glyph.size}px ui-monospace, monospace`;
        drawingContext.fillStyle = `hsla(${hueValue + 55}, 85%, 72%, ${glyph.opacity})`;
        drawingContext.fillText(glyph.symbol, glyph.x, glyph.y);
      }

      for (const dot of dots) {
        dot.x += dot.vx;
        dot.y += dot.vy;
        dot.phase += 0.02;
        if (dot.y < -8) {
          dot.y = height + 8;
          dot.x = random(0, width);
        }
        if (dot.x < -8) dot.x = width + 8;
        if (dot.x > width + 8) dot.x = -8;
        const opacity = dot.opacity * (0.65 + 0.35 * Math.sin(dot.phase));
        drawingContext.beginPath();
        drawingContext.fillStyle = `hsla(${hueValue + dot.radius * 18}, 90%, 76%, ${opacity})`;
        drawingContext.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        drawingContext.fill();
      }

      confetti = confetti.filter((piece) => piece.lifetime > 0 && piece.y < height + 30);
      for (const piece of confetti) {
        piece.vy += 0.2;
        piece.vx *= 0.985;
        piece.x += piece.vx;
        piece.y += piece.vy;
        piece.rotation += piece.spin;
        piece.lifetime -= 1;
        drawingContext.save();
        drawingContext.globalAlpha = Math.min(1, piece.lifetime / 24);
        drawingContext.translate(piece.x, piece.y);
        drawingContext.rotate(piece.rotation);
        drawingContext.fillStyle = piece.color;
        drawingContext.fillRect(-piece.width / 2, -piece.height / 2, piece.width, piece.height);
        drawingContext.restore();
      }

      if (!reduceMotion) animationFrame = window.requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("birthday-burst", onBirthdayBurst);
    document.addEventListener("visibilitychange", onVisibilityChange);
    animationFrame = window.requestAnimationFrame(frame);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("birthday-burst", onBirthdayBurst);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      burstRef.current = () => undefined;
    };
  }, [burstRef]);

  return <canvas ref={canvasRef} className="particle-canvas" aria-hidden="true" />;
}

function App() {
  const [hue, setHue] = useState(263);
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [messageVisible, setMessageVisible] = useState(false);
  const [wish, setWish] = useState("Press the button for a wish made just for you.");
  const [wishCount, setWishCount] = useState(0);
  const [lastWish, setLastWish] = useState(-1);
  const [announcement, setAnnouncement] = useState("");
  const burstRef = useRef<Burst>(() => undefined);

  const runSurprise = async () => {
    if (isTyping) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setIsTyping(true);
    setMessageVisible(false);
    setTerminalLines([]);

    const terminal = document.getElementById("terminal");
    window.setTimeout(() => terminal?.scrollIntoView({ behavior: "smooth", block: "center" }), 50);

    for (const line of SCRIPT) {
      setTerminalLines((current) => [...current, { ...line, text: "" }]);
      const fast = line.color === "out" || line.color === "ok" || line.color === "warn";
      if (!reduceMotion) await sleep(fast ? 150 : 220);

      for (const character of line.text) {
        setTerminalLines((current) => {
          const next = [...current];
          const lastLine = next[next.length - 1];
          if (!lastLine) return current;
          next[next.length - 1] = { ...lastLine, text: lastLine.text + character };
          return next;
        });
        if (!reduceMotion) await sleep(fast ? 7 : 14 + Math.random() * 12);
      }
    }

    setMessageVisible(true);
    setAnnouncement("The birthday message is ready.");
    burstRef.current(window.innerWidth / 2, window.innerHeight * 0.35, 115);
    window.setTimeout(
      () => document.getElementById("birthday-message")?.scrollIntoView({ behavior: "smooth", block: "start" }),
      250,
    );
    setIsTyping(false);
  };

  const generateWish = (event: MouseEvent<HTMLButtonElement>) => {
    let index = Math.floor(Math.random() * WISHES.length);
    if (WISHES.length > 1 && index === lastWish) {
      index = (index + 1 + Math.floor(Math.random() * (WISHES.length - 1))) % WISHES.length;
    }

    setLastWish(index);
    setWish(WISHES[index]);
    setWishCount((count) => count + 1);
    setHue((current) => (current + 72 + Math.random() * 125) % 360);
    setAnnouncement(`Wish ${wishCount + 1}: ${WISHES[index]}`);

    const bounds = event.currentTarget.getBoundingClientRect();
    burstRef.current(bounds.left + bounds.width / 2, bounds.top, 48);
  };

  return (
    <div className="app-shell" style={{ "--hue": hue } as CSSProperties}>
      <ParticleBackground hue={hue} burstRef={burstRef} />
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />

      <main className="page">
        <header className="topbar">
          <a className="brand" href="#home" aria-label="Shady's birthday home">
            <span className="brand-mark" aria-hidden="true">s.</span>
            <span>shady<span className="brand-dot">.</span>birthday</span>
          </a>
          <span className="topbar-note"><span className="status-dot" /> MADE WITH LOVE</span>
        </header>

        <section className="hero" id="home" aria-labelledby="hero-title">
          <div className="hero-copy">
            <span className="eyebrow"><span aria-hidden="true">✳</span> A LITTLE SOMETHING FOR YOU</span>
            <h1 id="hero-title">
              <span className="hero-heading">Happy birthday,</span>
              <span className="hero-name">Shady<span className="name-period">.</span></span>
            </h1>
            <p className="hero-arabic" lang="ar" dir="rtl">كل سنة وإنت طيب يا شادي</p>
            <p className="hero-subtitle">Some gifts you unwrap. This one you run.</p>
            <button className="button button-primary hero-button" onClick={runSurprise} disabled={isTyping}>
              <span aria-hidden="true">{isTyping ? "◌" : "▶"}</span>
              {isTyping ? "Preparing your surprise…" : terminalLines.length ? "Replay the surprise" : "Run the surprise"}
              <span className="button-arrow" aria-hidden="true">↗</span>
            </button>
            <div className="hero-caption"><span className="caption-line" /> A FRIENDSHIP, STILL IN SYNC <span className="caption-line" /></div>
          </div>

          <div className="hero-art" aria-hidden="true">
            <div className="art-orbit orbit-outer" />
            <div className="art-orbit orbit-inner" />
            <div className="art-glow" />
            <span className="art-star star-one">✳</span>
            <span className="art-star star-two">✦</span>
            <span className="art-star star-three">·</span>
            <div className="birthday-card">
              <div className="card-sparkles">✦ <span>✧</span> ✦</div>
              <div className="cake">
                <span className="candle candle-one" />
                <span className="candle candle-two" />
                <span className="candle candle-three" />
                <span className="cake-icing" />
                <span className="cake-layer cake-top" />
                <span className="cake-layer cake-bottom" />
                <span className="cake-plate" />
              </div>
              <span className="card-label">YOUR DAY, YOUR WAY</span>
            </div>
            <div className="art-orbit orbit-dash" />
            <div className="floating-note note-top"><span>✦</span> +1 YEAR</div>
            <div className="floating-note note-bottom"><span>♥</span> ALWAYS FRIENDS</div>
          </div>
        </section>

        <section className="dashboard" aria-label="Birthday dashboard">
          <div className="dashboard-item">
            <span className="dashboard-icon icon-purple" aria-hidden="true">✳</span>
            <span><span className="dashboard-label">STATUS</span><strong>One of a kind</strong></span>
          </div>
          <div className="dashboard-divider" aria-hidden="true" />
          <div className="dashboard-item">
            <span className="dashboard-icon icon-green" aria-hidden="true">↗</span>
            <span><span className="dashboard-label">FRIENDSHIP</span><strong>Still in sync</strong></span>
          </div>
          <div className="dashboard-divider" aria-hidden="true" />
          <div className="dashboard-item">
            <span className="dashboard-icon icon-peach" aria-hidden="true">∞</span>
            <span><span className="dashboard-label">GOOD TIMES</span><strong>More on the way</strong></span>
          </div>
          <div className="dashboard-code">v.2026 <span>///</span> for shady</div>
        </section>

        {terminalLines.length > 0 && (
          <section className="glass-panel terminal-section entrance" id="terminal" aria-label="Birthday surprise terminal">
            <div className="terminal-bar">
              <div className="window-controls" aria-hidden="true"><i /><i /><i /></div>
              <span className="terminal-title">shady@birthday <span>~/gift</span></span>
              <span className="terminal-live"><i /> LIVE</span>
            </div>
            <div className="terminal-content" aria-live="off">
              {terminalLines.map((line, index) => (
                <div className={`terminal-line terminal-${line.color}`} key={`${index}-${line.prompt}`}>
                  <span className="terminal-prompt">{line.prompt}</span>
                  <span>{line.text}</span>
                  {index === terminalLines.length - 1 && <span className="terminal-cursor" aria-hidden="true" />}
                </div>
              ))}
            </div>
            <div className="terminal-footer"><span>PROCESSING WITH CARE</span><span>100% HEART</span></div>
          </section>
        )}

        {messageVisible && (
          <section className="glass-panel message-card entrance" id="birthday-message" aria-labelledby="message-title">
            <div className="section-kicker"><span>01</span> A NOTE FROM THE HEART <span className="kicker-line" /></div>
            <h2 id="message-title">Message received <span aria-hidden="true">✳</span></h2>
            <div className="message-body">
              <p><strong>Shady,</strong></p>
              <p>This year, life kept pulling us in different directions, and we haven't sat together as much as we used to. I won't pretend I didn't notice. I did, and I missed it.</p>
              <p>But here's what I know for sure: real friendships don't run on how often we meet. You're someone whose place in my life stays exactly the same whether we talk every day or once in a long while. Distance only slowed the connection. It never dropped it.</p>
              <p>You make any room feel lighter, and I'm genuinely grateful to have you, not just as a friend, but as a brother. May this year bring you peace, success, and joy that needs no reason.</p>
              <p className="arabic-note" lang="ar" dir="rtl">كل سنة وإنت طيب يا أخويا، وربنا يحفظك ويفرّح قلبك دايمًا. وحشتني، ولازم نتقابل قريب. 🤍</p>
              <p className="signature">Happy birthday, brother <span aria-hidden="true">🎂</span><br /><span>— {FROM}</span></p>
            </div>
          </section>
        )}

        <section className="glass-panel wish-card" aria-labelledby="wish-title">
          <div className="wish-topline">
            <div className="section-kicker"><span>02</span> A LITTLE EXTRA GOODNESS <span className="kicker-line" /></div>
            <span className="wish-counter">WISH <span>{String(wishCount).padStart(2, "0")}</span></span>
          </div>
          <div className="wish-content">
            <div className="wish-symbol" aria-hidden="true">✳</div>
            <div className="wish-copy">
              <h2 id="wish-title">A wish, just for you.</h2>
              <p className="wish-text" dir="auto" key={wish}>{wish}</p>
              <button className="button button-secondary" onClick={generateWish}>
                <span aria-hidden="true">✧</span> Generate a wish <span className="button-arrow" aria-hidden="true">↗</span>
              </button>
            </div>
            <span className="wish-stamp" aria-hidden="true">GOOD<br />THINGS<br /><span>ONLY</span></span>
          </div>
        </section>

        <footer className="footer">
          <span>BUILT WITH <span className="footer-heart">♥</span> FOR SHADY</span>
          <span className="footer-credit">A little code, a lot of love <span>·</span> {FROM}</span>
        </footer>
        <p className="sr-only" aria-live="polite" aria-atomic="true">{announcement}</p>
      </main>
    </div>
  );
}

export default App;
