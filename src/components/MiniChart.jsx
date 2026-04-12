import { useMemo } from 'react';

// ─── LineChart ────────────────────────────────────────────────────────────────
export function LineChart({ data = [], color = '#059669', height = 80, width = 300 }) {
  const { points, minVal, maxVal, range } = useMemo(() => {
    if (!data.length) return { points: [], minVal: 0, maxVal: 0, range: 1 };
    const vals = data.map(d => d.value);
    const minVal = Math.min(...vals);
    const maxVal = Math.max(...vals);
    const range = maxVal - minVal || 1;
    return { points: vals, minVal, maxVal, range };
  }, [data]);

  if (!data.length) return null;

  const svgW = width;
  const svgH = height;
  const padX = 10;
  const padY = 12;
  const innerW = svgW - padX * 2;
  const innerH = svgH - padY * 2;

  const xStep = innerW / (data.length - 1 || 1);

  const coords = data.map((d, i) => ({
    x: padX + i * xStep,
    y: padY + innerH - ((d.value - minVal) / range) * innerH,
    label: d.label,
    value: d.value,
  }));

  const polyline = coords.map(c => `${c.x},${c.y}`).join(' ');

  // Area fill path
  const areaPath =
    `M ${coords[0].x},${svgH - padY} ` +
    coords.map(c => `L ${c.x},${c.y}`).join(' ') +
    ` L ${coords[coords.length - 1].x},${svgH - padY} Z`;

  const gradId = `lg-${color.replace('#', '')}`;

  return (
    <svg viewBox={`0 0 ${svgW} ${svgH}`} width="100%" height={height} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Area */}
      <path d={areaPath} fill={`url(#${gradId})`} />
      {/* Grid lines */}
      {[0.25, 0.5, 0.75, 1].map(f => (
        <line
          key={f}
          x1={padX} y1={padY + innerH * (1 - f)}
          x2={svgW - padX} y2={padY + innerH * (1 - f)}
          stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 3"
        />
      ))}
      {/* Line */}
      <polyline
        points={polyline}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Dots with tooltips */}
      {coords.map((c, i) => (
        <g key={i} className="chart-dot-group">
          <circle cx={c.x} cy={c.y} r="4" fill="#fff" stroke={color} strokeWidth="2.5" />
          <circle cx={c.x} cy={c.y} r="10" fill="transparent" />
          <title>{`${c.label}: ${c.value}`}</title>
        </g>
      ))}
      {/* X labels */}
      {coords.map((c, i) => (
        <text
          key={i}
          x={c.x}
          y={svgH - 1}
          textAnchor="middle"
          fontSize="10"
          fill="#94a3b8"
          fontFamily="DM Sans, sans-serif"
        >
          {c.label}
        </text>
      ))}
    </svg>
  );
}

// ─── BarChart ─────────────────────────────────────────────────────────────────
export function BarChart({ data = [], color = '#059669', height = 120, width = 300 }) {
  const maxVal = useMemo(() => Math.max(...data.map(d => d.value), 1), [data]);

  if (!data.length) return null;

  const svgW = width;
  const svgH = height;
  const padX = 8;
  const padY = 24;
  const padBottom = 28;
  const innerW = svgW - padX * 2;
  const innerH = svgH - padY - padBottom;

  const barW = Math.min(40, innerW / data.length - 8);
  const step = innerW / data.length;

  const colors = ['#059669', '#6366f1', '#f59e0b', '#3b82f6', '#ef4444', '#10b981'];

  return (
    <svg viewBox={`0 0 ${svgW} ${svgH}`} width="100%" height={height} style={{ overflow: 'visible' }}>
      {/* Grid lines */}
      {[0.25, 0.5, 0.75, 1].map(f => (
        <line
          key={f}
          x1={padX} y1={padY + innerH * (1 - f)}
          x2={svgW - padX} y2={padY + innerH * (1 - f)}
          stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 3"
        />
      ))}
      {data.map((d, i) => {
        const barH = (d.value / maxVal) * innerH;
        const x = padX + i * step + (step - barW) / 2;
        const y = padY + innerH - barH;
        const barColor = d.color || colors[i % colors.length];
        return (
          <g key={i}>
            {/* Bar */}
            <rect
              x={x} y={y}
              width={barW} height={barH}
              fill={barColor}
              rx="4" ry="4"
              opacity="0.85"
            />
            {/* Value label */}
            <text
              x={x + barW / 2} y={y - 5}
              textAnchor="middle"
              fontSize="10"
              fontWeight="600"
              fill="#475569"
              fontFamily="DM Sans, sans-serif"
            >
              {d.value}
            </text>
            {/* X label */}
            <text
              x={x + barW / 2}
              y={svgH - 4}
              textAnchor="middle"
              fontSize="9"
              fill="#94a3b8"
              fontFamily="DM Sans, sans-serif"
            >
              {d.label.length > 8 ? d.label.slice(0, 7) + '…' : d.label}
            </text>
            <title>{`${d.label}: ${d.value}`}</title>
          </g>
        );
      })}
    </svg>
  );
}

// ─── DonutChart ───────────────────────────────────────────────────────────────
export function DonutChart({ data = [], size = 160 }) {
  const total = useMemo(() => data.reduce((s, d) => s + d.value, 0), [data]);
  const colors = ['#059669', '#6366f1', '#f59e0b', '#3b82f6', '#ef4444', '#10b981'];

  if (!data.length || total === 0) return null;

  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.35;
  const innerR = size * 0.22;
  const strokeW = r - innerR;

  let cumAngle = -90;
  const arcs = data.map((d, i) => {
    const pct = d.value / total;
    const angle = pct * 360;
    const start = cumAngle;
    cumAngle += angle;
    const end = cumAngle;
    const startRad = (start * Math.PI) / 180;
    const endRad = (end * Math.PI) / 180;
    const midAngle = ((start + end) / 2) * (Math.PI / 180);
    const offset = r - strokeW / 2;
    const x1 = cx + offset * Math.cos(startRad);
    const y1 = cy + offset * Math.sin(startRad);
    const x2 = cx + offset * Math.cos(endRad);
    const y2 = cy + offset * Math.sin(endRad);
    const largeArc = angle > 180 ? 1 : 0;
    const path = `M ${x1} ${y1} A ${offset} ${offset} 0 ${largeArc} 1 ${x2} ${y2}`;
    return { path, color: colors[i % colors.length], label: d.label, value: d.value, pct: (pct * 100).toFixed(1) };
  });

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {arcs.map((arc, i) => (
          <path
            key={i}
            d={arc.path}
            fill="none"
            stroke={arc.color}
            strokeWidth={strokeW}
            strokeLinecap="butt"
            opacity="0.9"
          >
            <title>{`${arc.label}: ${arc.value} (${arc.pct}%)`}</title>
          </path>
        ))}
        <text x={cx} y={cy - 8} textAnchor="middle" fontSize="20" fontWeight="700" fill="#1e293b" fontFamily="Playfair Display">
          {total}
        </text>
        <text x={cx} y={cy + 12} textAnchor="middle" fontSize="10" fill="#94a3b8" fontFamily="DM Sans, sans-serif">
          Total
        </text>
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {arcs.map((arc, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: arc.color, flexShrink: 0 }} />
            <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{arc.label}</span>
            <span style={{ color: 'var(--text-muted)', marginLeft: 'auto', paddingLeft: '12px' }}>{arc.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
