import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

/* ── Indian cities with positions as % of SVG W×H ── */
const CITIES = [
  { id: 'mumbai',     name: 'Mumbai',     x: 22,  y: 60 },
  { id: 'delhi',      name: 'Delhi',      x: 40,  y: 24 },
  { id: 'bangalore',  name: 'Bangalore',  x: 34,  y: 74 },
  { id: 'hyderabad',  name: 'Hyderabad',  x: 38,  y: 63 },
  { id: 'chennai',    name: 'Chennai',    x: 42,  y: 78 },
  { id: 'kolkata',    name: 'Kolkata',    x: 64,  y: 40 },
  { id: 'jaipur',     name: 'Jaipur',     x: 34,  y: 32 },
  { id: 'pune',       name: 'Pune',       x: 26,  y: 64 },
  { id: 'ahmedabad',  name: 'Ahmedabad',  x: 21,  y: 44 },
  { id: 'lucknow',    name: 'Lucknow',    x: 49,  y: 32 },
  { id: 'chandigarh', name: 'Chandigarh', x: 38,  y: 18 },
  { id: 'surat',      name: 'Surat',      x: 20,  y: 52 },
];

const CONNECTIONS = [
  ['mumbai', 'delhi'],
  ['mumbai', 'bangalore'],
  ['mumbai', 'pune'],
  ['mumbai', 'ahmedabad'],
  ['delhi', 'jaipur'],
  ['delhi', 'chandigarh'],
  ['delhi', 'lucknow'],
  ['delhi', 'kolkata'],
  ['bangalore', 'chennai'],
  ['bangalore', 'hyderabad'],
  ['hyderabad', 'chennai'],
  ['kolkata', 'lucknow'],
  ['ahmedabad', 'surat'],
  ['surat', 'pune'],
];

const W = 800;
const H = 480;
const pct = (p, total) => (p / 100) * total;

// Interpolate along a quadratic bezier curve t=[0,1]
const bezierPoint = (t, x0, y0, x1, y1, x2, y2) => ({
  x: (1 - t) ** 2 * x0 + 2 * (1 - t) * t * x1 + t ** 2 * x2,
  y: (1 - t) ** 2 * y0 + 2 * (1 - t) * t * y1 + t ** 2 * y2,
});

const CityNetworkMap = () => {
  const svgRef = useRef(null);
  const masterRef = useRef(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    if (masterRef.current) masterRef.current.kill();
    masterRef.current = gsap.timeline({ repeat: -1, repeatDelay: 0.5 });

    CONNECTIONS.forEach(([fromId, toId], i) => {
      const fromCity = CITIES.find(c => c.id === fromId);
      const toCity   = CITIES.find(c => c.id === toId);

      const x0 = pct(fromCity.x, W);
      const y0 = pct(fromCity.y, H);
      const x2 = pct(toCity.x, W);
      const y2 = pct(toCity.y, H);

      // Control point for the arc (bulge upward)
      const cpX = (x0 + x2) / 2;
      const cpY = (y0 + y2) / 2 - Math.abs(x2 - x0) * 0.35;

      /* Create animated glow dot */
      const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      dot.setAttribute('r', '4');
      dot.setAttribute('fill', '#d4af37');
      dot.setAttribute('filter', 'url(#glow)');
      dot.setAttribute('opacity', '0');
      dot.setAttribute('cx', x0);
      dot.setAttribute('cy', y0);
      svg.appendChild(dot);

      /* Create a trailing glow dot (slightly bigger, more transparent) */
      const trail = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      trail.setAttribute('r', '7');
      trail.setAttribute('fill', '#d4af37');
      trail.setAttribute('filter', 'url(#glow)');
      trail.setAttribute('opacity', '0');
      trail.setAttribute('cx', x0);
      trail.setAttribute('cy', y0);
      svg.insertBefore(trail, dot);

      const STEPS = 60;
      const dotKeyframes = { cx: [], cy: [], opacity: [] };
      const trailKeyframes = { cx: [], cy: [], opacity: [] };

      for (let s = 0; s <= STEPS; s++) {
        const t = s / STEPS;
        const pt = bezierPoint(t, x0, y0, cpX, cpY, x2, y2);
        const trailT = Math.max(0, t - 0.07);
        const trailPt = bezierPoint(trailT, x0, y0, cpX, cpY, x2, y2);

        const opacity = t < 0.1 ? t * 10 : t > 0.9 ? (1 - t) * 10 : 1;

        dotKeyframes.cx.push(pt.x);
        dotKeyframes.cy.push(pt.y);
        dotKeyframes.opacity.push(opacity);

        trailKeyframes.cx.push(trailPt.x);
        trailKeyframes.cy.push(trailPt.y);
        trailKeyframes.opacity.push(opacity * 0.35);
      }

      const delay = i * 0.55;
      const dur = 1.6;

      masterRef.current
        .to(dot,   { keyframes: dotKeyframes,   duration: dur, ease: 'none' }, delay)
        .to(trail, { keyframes: trailKeyframes, duration: dur, ease: 'none' }, delay);
    });

    /* Pulse all city dots */
    svg.querySelectorAll('.city-ring').forEach((el, i) => {
      gsap.to(el, {
        attr: { r: 7 },
        opacity: 0.15,
        duration: 1.4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: i * 0.18,
      });
    });

    return () => {
      if (masterRef.current) masterRef.current.kill();
      gsap.killTweensOf(svg.querySelectorAll('.city-ring'));
    };
  }, []);

  return (
    <section
      className="relative py-24 px-6 overflow-hidden"
      style={{
        background: '#050505',
        borderTop: '1px solid rgba(212,175,55,0.12)',
        borderBottom: '1px solid rgba(212,175,55,0.12)',
      }}
    >
      {/* Dotted grid background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(rgba(212,175,55,0.22) 1px, transparent 1px)',
          backgroundSize: '26px 26px',
        }}
      />
      {/* Edge fades */}
      {['top', 'bottom'].map(d => (
        <div
          key={d}
          className="absolute inset-x-0 pointer-events-none z-10"
          style={{
            [d]: 0, height: 80,
            background: `linear-gradient(to ${d === 'top' ? 'bottom' : 'top'}, #050505, transparent)`,
          }}
        />
      ))}
      {['left', 'right'].map(d => (
        <div
          key={d}
          className="absolute inset-y-0 pointer-events-none z-10"
          style={{
            [d]: 0, width: 60,
            background: `linear-gradient(to ${d === 'left' ? 'right' : 'left'}, #050505, transparent)`,
          }}
        />
      ))}

      {/* Header */}
      <div className="relative z-20 text-center mb-10">
        <p className="text-[#d4af37] text-[10px] tracking-[0.45em] uppercase mb-2">Pan India Coverage</p>
        <h2 className="text-3xl md:text-4xl font-display font-bold text-white">
          We Deliver{' '}
          <span
            style={{
              background: 'linear-gradient(135deg,#f5d76e,#d4af37,#b8912a)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Everywhere
          </span>
        </h2>
        <p className="text-xs text-white/35 mt-3 max-w-sm mx-auto">
          Premium VIP numbers shipped to every major city across India
        </p>
      </div>

      {/* Map SVG */}
      <div className="relative z-20 max-w-3xl mx-auto select-none">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-auto"
          style={{ maxHeight: 400 }}
        >
          <defs>
            <filter id="glow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="cityGlow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d4af37" stopOpacity="0" />
              <stop offset="50%" stopColor="#d4af37" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Static arc connection lines */}
          {CONNECTIONS.map(([fromId, toId], i) => {
            const f = CITIES.find(c => c.id === fromId);
            const t = CITIES.find(c => c.id === toId);
            const x0 = pct(f.x, W), y0 = pct(f.y, H);
            const x2 = pct(t.x, W), y2 = pct(t.y, H);
            const cpX = (x0 + x2) / 2;
            const cpY = (y0 + y2) / 2 - Math.abs(x2 - x0) * 0.35;
            return (
              <path
                key={i}
                d={`M ${x0} ${y0} Q ${cpX} ${cpY} ${x2} ${y2}`}
                stroke="rgba(212,175,55,0.2)"
                strokeWidth="1"
                fill="none"
                strokeDasharray="4 6"
              />
            );
          })}

          {/* City dots + labels */}
          {CITIES.map(({ id, name, x, y }) => {
            const cx = pct(x, W);
            const cy = pct(y, H);
            const above = y > 55;
            return (
              <g key={id}>
                {/* Pulse ring */}
                <circle
                  className="city-ring"
                  cx={cx} cy={cy} r={4}
                  fill="none"
                  stroke="#d4af37"
                  strokeWidth="1"
                  opacity="0.4"
                />
                {/* Core dot */}
                <circle
                  cx={cx} cy={cy} r={3}
                  fill="#d4af37"
                  filter="url(#cityGlow)"
                />
                {/* Label */}
                <text
                  x={cx}
                  y={above ? cy + 17 : cy - 10}
                  textAnchor="middle"
                  fontSize="10"
                  fill="rgba(212,175,55,0.75)"
                  fontFamily="Inter, sans-serif"
                  letterSpacing="0.4"
                >
                  {name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Stats row */}
      <div className="relative z-20 max-w-3xl mx-auto mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        {[
          { val: '28+',  label: 'States Covered' },
          { val: '500+', label: 'Cities Served' },
          { val: '4',    label: 'Major Operators' },
          { val: '2-5',  label: 'Days Delivery' },
        ].map(({ val, label }, i) => (
          <div
            key={i}
            className="rounded-xl py-4 px-3"
            style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.12)' }}
          >
            <p
              className="text-2xl md:text-3xl font-display font-bold"
              style={{
                background: 'linear-gradient(135deg,#f5d76e,#d4af37)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {val}
            </p>
            <p className="text-[10px] text-white/35 mt-1 uppercase tracking-wider">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CityNetworkMap;
