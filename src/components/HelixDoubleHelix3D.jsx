import React, { useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import { CatmullRomCurve3, Color, Vector3 } from 'three';

const palette = {
  background: '#0f172a',
  tableBase: '#1e293b',
  tableAccent: '#334155',
  tableBorder: '#3f4c66',
  tableGlow: '#60a5fa',
  digit: '#38bdf8',
  reservoir: '#cbd5f5',
  strandA: '#2563eb',
  strandB: '#0ea5e9',
  vectorAccent: '#f97316',
  identity: '#1d4ed8',
  entropy: '#f59e0b',
  session: '#64748b'
};

const anchorTable = new Array(8).fill(0).map((_, idx) => ({
  id: `B1-${idx}`,
  label: `L${idx.toString().padStart(2, '0')}`,
  value: (0.78 - idx * 0.043).toFixed(3),
  offset: (idx % 4) * 0.24 - 0.36,
  layer: Math.floor(idx / 4)
}));

const activationTable = new Array(8).fill(0).map((_, idx) => ({
  id: `Tn-${idx}`,
  label: `P${idx.toString().padStart(2, '0')}`,
  value: (0.32 + idx * 0.057).toFixed(3),
  offset: (idx % 4) * 0.24 - 0.36,
  layer: Math.floor(idx / 4)
}));

const digitHeaders = ['C₁', 'C₂', 'C₃', 'C₄', 'C₅', 'C₆', 'C₇', 'C₈'];

function TableCell({ label, value, position, isActive }) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[0.18, 0.04, 0.18]} />
        <meshStandardMaterial
          color={isActive ? palette.tableGlow : palette.tableAccent}
          emissive={isActive ? palette.tableGlow : palette.tableBorder}
          emissiveIntensity={isActive ? 0.75 : 0.2}
          roughness={0.35}
        />
      </mesh>
      <Html position={[0, 0.025, 0]} center className="pointer-events-none select-none">
        <div className="rounded-md bg-slate-900/80 px-2 py-1 text-[9px] font-semibold text-sky-100 shadow">
          <span className="text-sky-300">{label}</span> · {value}
        </div>
      </Html>
    </group>
  );
}

TableCell.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  position: PropTypes.arrayOf(PropTypes.number).isRequired,
  isActive: PropTypes.bool
};

TableCell.defaultProps = {
  isActive: false
};

function TableStack({ title, subtitle, rows, position, activeIndex }) {
  return (
    <group position={position}>
      <mesh position={[0, -0.09, 0]}>
        <boxGeometry args={[0.9, 0.02, 0.36]} />
        <meshStandardMaterial color={palette.tableBase} roughness={0.45} />
      </mesh>
      <Html position={[0, 0.18, 0]} center className="pointer-events-none select-none">
        <div className="w-36 rounded-lg border border-slate-700/60 bg-slate-900/85 px-3 py-2 text-center text-[11px] text-slate-200 shadow">
          <p className="font-semibold text-slate-100">{title}</p>
          <p className="text-[10px] text-slate-400">{subtitle}</p>
        </div>
      </Html>
      {rows.map((cell, idx) => (
        <TableCell
          key={cell.id}
          label={cell.label}
          value={cell.value}
          position={[cell.offset, cell.layer * 0.06, 0]}
          isActive={idx === activeIndex}
        />
      ))}
    </group>
  );
}

TableStack.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
  position: PropTypes.arrayOf(PropTypes.number).isRequired,
  activeIndex: PropTypes.number.isRequired
};

function HelixStrand({ color, phase }) {
  const points = useMemo(() => {
    const curvePoints = [];
    for (let i = -24; i <= 24; i++) {
      const t = i / 8;
      const y = t * 0.06;
      const radius = 0.18;
      const angle = t * Math.PI + phase;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      curvePoints.push(new Vector3(x, y, z));
    }
    return new CatmullRomCurve3(curvePoints);
  }, [phase]);

  const geom = useMemo(() => {
    const temp = [];
    const detail = 120;
    for (let i = 0; i <= detail; i++) {
      const point = points.getPoint(i / detail);
      temp.push(point.x, point.y, point.z);
    }
    return new Float32Array(temp);
  }, [points]);

  return (
    <line>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={geom.length / 3} array={geom} itemSize={3} />
      </bufferGeometry>
      <lineBasicMaterial color={color} linewidth={4} transparent opacity={0.85} />
    </line>
  );
}

HelixStrand.propTypes = {
  color: PropTypes.string.isRequired,
  phase: PropTypes.number.isRequired
};

function HeaderDigit({ label, position, opacity }) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[0.08, 0.08, 0.08]} />
        <meshStandardMaterial
          color={palette.digit}
          emissive={palette.digit}
          emissiveIntensity={0.6 * opacity}
          transparent
          opacity={0.9}
        />
      </mesh>
      <Html position={[0, 0, 0.06]} center className="pointer-events-none select-none">
        <div className="rounded bg-slate-900/85 px-1 py-0.5 text-[9px] font-semibold text-sky-100 shadow">
          {label}
        </div>
      </Html>
    </group>
  );
}

HeaderDigit.propTypes = {
  label: PropTypes.string.isRequired,
  position: PropTypes.arrayOf(PropTypes.number).isRequired,
  opacity: PropTypes.number.isRequired
};

function Reservoir({ position, label }) {
  return (
    <group position={position}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 0.16, 24, 1, true]} />
        <meshStandardMaterial color={palette.reservoir} transparent opacity={0.25} />
      </mesh>
      <Html position={[0, 0, 0.12]} center className="pointer-events-none select-none">
        <div className="rounded border border-slate-700/70 bg-slate-900/90 px-2 py-1 text-[10px] text-slate-100 shadow">
          {label}
        </div>
      </Html>
    </group>
  );
}

Reservoir.propTypes = {
  position: PropTypes.arrayOf(PropTypes.number).isRequired,
  label: PropTypes.string.isRequired
};

function IdentityBadge({ label, color, position }) {
  const luminance = useMemo(() => {
    const temp = new Color(color);
    return 0.2126 * temp.r + 0.7152 * temp.g + 0.0722 * temp.b;
  }, [color]);

  return (
    <Html position={position} center className="pointer-events-none select-none">
      <div
        className="rounded-full px-3 py-1 text-[10px] font-semibold shadow"
        style={{
          background: `${color}CC`,
          border: `1px solid ${color}`,
          color: luminance > 0.55 ? '#0f172a' : '#f8fafc'
        }}
      >
        {label}
      </div>
    </Html>
  );
}

IdentityBadge.propTypes = {
  label: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  position: PropTypes.arrayOf(PropTypes.number).isRequired
};

function HelixSceneContent({ enableZoom }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const timeRef = useRef(0);
  const headerRef = useRef(0);
  const helixGroupRef = useRef();

  useFrame((state, delta) => {
    timeRef.current += delta;
    if (timeRef.current > 1.25) {
      setActiveIndex((prev) => (prev + 1) % anchorTable.length);
      timeRef.current = 0;
    }
    headerRef.current += delta * 0.75;
    if (helixGroupRef.current) {
      helixGroupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.15;
    }
  });

  const digitPositions = useMemo(() =>
    digitHeaders.map((_, idx) => [0, idx * 0.08 - 0.28, Math.sin(idx * 0.6) * 0.08]),
  []);

  return (
    <>
      <ambientLight intensity={0.55} />
      <spotLight position={[1.2, 1.5, 1.2]} intensity={1.1} angle={0.4} penumbra={0.6} />
      <spotLight position={[-1.1, -1.2, -0.9]} intensity={0.8} angle={0.5} penumbra={0.4} color={palette.strandA} />

      <group position={[0, -0.1, 0]}>
        <TableStack
          title="B₁ Baseline Anchors"
          subtitle="Deterministic weight tuples"
          rows={anchorTable}
          position={[-0.58, 0, 0]}
          activeIndex={activeIndex}
        />
        <TableStack
          title="Tₙ Session Activations"
          subtitle="Entropy-aligned tuples"
          rows={activationTable}
          position={[0.58, 0, 0]}
          activeIndex={activeIndex}
        />

        <group position={[0, 0.05, 0]} ref={helixGroupRef}>
          <HelixStrand color={palette.strandA} phase={0} />
          <HelixStrand color={palette.strandB} phase={Math.PI} />

          {digitHeaders.map((label, idx) => {
            const basePos = digitPositions[idx];
            const offset = Math.sin(headerRef.current + idx * 0.45) * 0.12;
            return (
              <HeaderDigit
                key={label}
                label={label}
                position={[basePos[0], basePos[1], basePos[2] + offset]}
                opacity={0.6 + 0.4 * Math.sin(headerRef.current + idx * 0.65)}
              />
            );
          })}
        </group>

        <Reservoir position={[-0.3, -0.22, 0]} label="Originator Reservoir" />
        <Reservoir position={[0.3, -0.22, 0]} label="Recipient Reservoir" />

        <Html position={[0, 0.34, 0]} center className="pointer-events-none select-none">
          <div className="flex items-center gap-2 text-[10px] text-slate-200">
            <span className="rounded-full bg-blue-900/70 px-2 py-1 font-semibold">Identity</span>
            <span className="rounded-full bg-amber-500/80 px-2 py-1 font-semibold">Entropy</span>
            <span className="rounded-full bg-slate-600/70 px-2 py-1 font-semibold">Session</span>
          </div>
        </Html>

        <IdentityBadge label="Model A (Originator)" color={palette.identity} position={[-0.62, 0.32, 0]} />
        <IdentityBadge label="Model B (Recipient)" color={palette.session} position={[0.62, 0.32, 0]} />
        <IdentityBadge label="Helix Entropy Tables" color={palette.entropy} position={[0, 0.22, 0]} />
      </group>

      <OrbitControls enablePan={false} enableZoom={enableZoom} minDistance={1.2} maxDistance={2.2} />
    </>
  );
}

HelixSceneContent.propTypes = {
  enableZoom: PropTypes.bool
};

HelixSceneContent.defaultProps = {
  enableZoom: true
};

export default function HelixDoubleHelix3D({ height, enableZoom }) {
  return (
    <div
      className="relative overflow-hidden rounded-3xl border border-slate-800/60 bg-slate-950"
      style={{ background: palette.background }}
    >
      <div style={{ height }}>
        <Canvas camera={{ position: [0, 0.5, 1.7], fov: 42 }}>
          <HelixSceneContent enableZoom={enableZoom} />
        </Canvas>
      </div>
    </div>
  );
}

HelixDoubleHelix3D.propTypes = {
  height: PropTypes.number,
  enableZoom: PropTypes.bool
};

HelixDoubleHelix3D.defaultProps = {
  height: 360,
  enableZoom: true
};
