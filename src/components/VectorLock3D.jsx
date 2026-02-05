import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import { Quaternion, Vector3 } from 'three';

const tupleData = [
  { id: 1, point: [0.29, 0.184, 0.702], anchor: [0.12, 0.34, 0.58] },
  { id: 2, point: [0.756, 0.537, 0.494], anchor: [0.085, 0.192, 0.731] },
  { id: 3, point: [0.365, 0.635, 0.945], anchor: [0.172, 0.287, 0.654] },
  { id: 4, point: [0.512, 0.412, 0.221], anchor: [0.098, 0.456, 0.341] },
  { id: 5, point: [0.128, 0.792, 0.318], anchor: [0.302, 0.265, 0.617] },
  { id: 6, point: [0.902, 0.174, 0.684], anchor: [0.411, 0.325, 0.284] },
  { id: 7, point: [0.447, 0.286, 0.911], anchor: [0.233, 0.178, 0.602] },
  { id: 8, point: [0.623, 0.804, 0.273], anchor: [0.264, 0.389, 0.512] },
  { id: 9, point: [0.219, 0.457, 0.812], anchor: [0.186, 0.241, 0.693] },
  { id: 10, point: [0.541, 0.368, 0.593], anchor: [0.147, 0.312, 0.563] },
  { id: 11, point: [0.781, 0.612, 0.154], anchor: [0.329, 0.452, 0.297] },
  { id: 12, point: [0.318, 0.248, 0.487], anchor: [0.205, 0.318, 0.547] },
  { id: 13, point: [0.684, 0.931, 0.342], anchor: [0.356, 0.276, 0.621] },
  { id: 14, point: [0.412, 0.523, 0.703], anchor: [0.265, 0.345, 0.579] },
  { id: 15, point: [0.274, 0.362, 0.915], anchor: [0.197, 0.284, 0.742] },
  { id: 16, point: [0.593, 0.718, 0.458], anchor: [0.287, 0.398, 0.534] },
  { id: 17, point: [0.832, 0.266, 0.327], anchor: [0.401, 0.291, 0.418] },
  { id: 18, point: [0.365, 0.884, 0.619], anchor: [0.228, 0.364, 0.658] },
  { id: 19, point: [0.517, 0.543, 0.842], anchor: [0.314, 0.223, 0.705] },
  { id: 20, point: [0.606, 0.193, 0.769], anchor: [0.241, 0.309, 0.632] },
  { id: 21, point: [0.437, 0.672, 0.584], anchor: [0.298, 0.355, 0.571] },
  { id: 22, point: [0.155, 0.538, 0.427], anchor: [0.182, 0.267, 0.493] },
  { id: 23, point: [0.709, 0.458, 0.619], anchor: [0.348, 0.331, 0.557] },
  { id: 24, point: [0.487, 0.338, 0.756], anchor: [0.259, 0.301, 0.648] }
];

const connectionColors = [
  '#10b981',
  '#22d3ee',
  '#f472b6',
  '#f59e0b',
  '#38bdf8',
  '#f97316',
  '#6366f1',
  '#ec4899',
  '#fde047',
  '#14b8a6',
  '#c084fc',
  '#60a5fa'
];
const sweepDuration = 3.5;
const translationPhasePortion = 0.35;
const measurementPhasePortion = 1 - translationPhasePortion;
const measurementDuration = sweepDuration * measurementPhasePortion;
const translationDuration = sweepDuration * translationPhasePortion;

const calculateMeasurementOrder = (anchorIndex, translation) => {
  const anchorVector = new Vector3(...tupleData[anchorIndex].anchor);
  return tupleData
    .map((entry, index) => ({
      index,
      distance: anchorVector.distanceTo(new Vector3(...entry.point).add(translation))
    }))
    .sort((a, b) => a.distance - b.distance)
    .map(({ index }) => index);
};

function MeasurementLink({ start, end, color, opacity, label }) {
  const { position, quaternion, length, labelPosition } = useMemo(() => {
    const startVec = new Vector3(...start);
    const endVec = new Vector3(...end);
    const direction = endVec.clone().sub(startVec);
    const length = direction.length();
    const midpoint = startVec.clone().add(direction.clone().multiplyScalar(0.5));
    const orientation = new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), direction.clone().normalize());
    const labelPosition = startVec.clone().add(direction.clone().multiplyScalar(0.55));
    return {
      position: midpoint,
      quaternion: orientation,
      length,
      labelPosition
    };
  }, [start, end]);

  return (
    <group>
      <mesh position={position} quaternion={quaternion}>
        <cylinderGeometry args={[0.001, 0.001, length, 20, 1, true]} />
        <meshStandardMaterial color={color} transparent opacity={opacity} metalness={0.25} roughness={0.25} />
      </mesh>
      <Html position={labelPosition.toArray()} center className="pointer-events-none select-none">
        <div className="rounded-full bg-slate-900/80 px-2 py-0.5 text-[10px] font-semibold text-emerald-200 shadow-md">
          {label}
        </div>
      </Html>
    </group>
  );
}

MeasurementLink.propTypes = {
  start: PropTypes.arrayOf(PropTypes.number).isRequired,
  end: PropTypes.arrayOf(PropTypes.number).isRequired,
  color: PropTypes.string.isRequired,
  opacity: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired
};

function AnchorPoint({ position }) {
  return (
    <mesh position={position}>
      <icosahedronGeometry args={[0.03, 0]} />
      <meshStandardMaterial color="#ef4444" emissive="#f87171" emissiveIntensity={0.45} roughness={0.35} />
    </mesh>
  );
}

AnchorPoint.propTypes = {
  position: PropTypes.arrayOf(PropTypes.number).isRequired
};

function DataPoint({ position }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.025, 36, 36]} />
      <meshStandardMaterial color="#2563eb" emissive="#3b82f6" emissiveIntensity={0.35} roughness={0.2} />
    </mesh>
  );
}

DataPoint.propTypes = {
  position: PropTypes.arrayOf(PropTypes.number).isRequired
};

function VectorLockObject({ anchorIndex, translation, measuredRecords, activeMeasurement }) {
  const translationVector = useMemo(() => new Vector3(...translation), [translation]);
  const translatedPoints = useMemo(
    () =>
      tupleData.map((entry) => ({
        id: entry.id,
        point: new Vector3(...entry.point).add(translationVector).toArray(),
        anchor: entry.anchor
      })),
    [translationVector]
  );

  return (
    <group>
      {tupleData.map((entry) => (
        <AnchorPoint key={`anchor-${entry.id}`} position={entry.anchor} />
      ))}
      {translatedPoints.map((entry) => (
        <DataPoint key={`point-${entry.id}`} position={entry.point} />
      ))}
      {measuredRecords.map((record) => (
        <MeasurementLink
          key={`record-${record.anchorIndex}-${record.pointIndex}`}
          start={tupleData[record.anchorIndex].anchor}
          end={translatedPoints[record.pointIndex].point}
          color={connectionColors[record.colorIndex % connectionColors.length]}
          opacity={0.95}
          label={`A${record.anchorIndex + 1}→P${record.pointIndex + 1}: ${record.distance.toFixed(3)}`}
        />
      ))}
      {activeMeasurement && (
        <MeasurementLink
          key={`active-${activeMeasurement.anchorIndex}-${activeMeasurement.pointIndex}`}
          start={tupleData[activeMeasurement.anchorIndex].anchor}
          end={translatedPoints[activeMeasurement.pointIndex].point}
          color={connectionColors[activeMeasurement.colorIndex % connectionColors.length]}
          opacity={Math.max(activeMeasurement.progress, 0.25)}
          label={`A${activeMeasurement.anchorIndex + 1}→P${activeMeasurement.pointIndex + 1}: ${activeMeasurement.distance.toFixed(3)}`}
        />
      )}
      <mesh position={tupleData[anchorIndex].anchor}>
        <sphereGeometry args={[0.035, 24, 24]} />
        <meshStandardMaterial color="#fbbf24" emissive="#facc15" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

VectorLockObject.propTypes = {
  anchorIndex: PropTypes.number.isRequired,
  translation: PropTypes.arrayOf(PropTypes.number).isRequired,
  measuredRecords: PropTypes.arrayOf(
    PropTypes.shape({
      anchorIndex: PropTypes.number.isRequired,
      pointIndex: PropTypes.number.isRequired,
      distance: PropTypes.number.isRequired,
      colorIndex: PropTypes.number.isRequired
    })
  ).isRequired,
  activeMeasurement: PropTypes.shape({
    anchorIndex: PropTypes.number.isRequired,
    pointIndex: PropTypes.number.isRequired,
    distance: PropTypes.number.isRequired,
    progress: PropTypes.number.isRequired,
    colorIndex: PropTypes.number.isRequired
  })
};

function AnimatedGrid() {
  const lines = useMemo(() => {
    const grid = [];
    const size = 1.2;
    const divisions = 8;
    for (let i = -divisions; i <= divisions; i++) {
      const offset = (i / divisions) * size;
      grid.push([
        [-size, offset, -size],
        [size, offset, -size]
      ]);
      grid.push([
        [-size, offset, size],
        [size, offset, size]
      ]);
      grid.push([
        [offset, -size, -size],
        [offset, size, -size]
      ]);
      grid.push([
        [offset, -size, size],
        [offset, size, size]
      ]);
    }
    return grid;
  }, []);

  return (
    <group>
      {lines.map(([[x1, y1, z1], [x2, y2, z2]], idx) => (
        <line key={`grid-${idx}`}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([x1, y1, z1, x2, y2, z2])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#cbd5f5" transparent opacity={0.08} />
        </line>
      ))}
    </group>
  );
}

function SceneContent({ zoom, onFrameData }) {
  const lightRef = useRef();
  const anchorIndexRef = useRef(0);
  const sweepStartRef = useRef(0);
  const translationStartRef = useRef(0);
  const lastAnchorIndexRef = useRef(-1);
  const modeRef = useRef('measure');
  const baseOffsetRef = useRef(new Vector3(0, 0, 0));
  const targetOffsetRef = useRef(new Vector3(0, 0, 0));
  const measurementOrderRef = useRef(calculateMeasurementOrder(0, baseOffsetRef.current));
  const anchorMeasurementIndexRef = useRef(0);
  const sessionMeasurementsRef = useRef([]);
  const controlsRef = useRef();
  const pressedKeysRef = useRef(new Set());
  const [state, setState] = useState({
    anchorIndex: 0,
    translation: baseOffsetRef.current.toArray(),
    measuredRecords: [],
    activeMeasurement: null,
    measurementOrder: measurementOrderRef.current
  });

  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key.toLowerCase();
      if (['w', 'a', 's', 'd', 'q', 'e', 'c', ' '].includes(key)) {
        event.preventDefault();
        pressedKeysRef.current.add(key);
      }
    };

    const handleKeyUp = (event) => {
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key.toLowerCase();
      pressedKeysRef.current.delete(key);
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    window.addEventListener('keyup', handleKeyUp, { passive: true });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const handleFrame = useCallback((frameState) => {
    if (!lightRef.current) return;
    const { clock } = frameState;
    lightRef.current.position.x = 2 * Math.sin(clock.elapsedTime * 0.25);
    lightRef.current.position.z = 2 * Math.cos(clock.elapsedTime * 0.25);

    const controls = controlsRef.current;
    if (controls) {
      const camera = controls.object;
      const target = controls.target;
      const delta = frameState.clock.getDelta();
      const moveSpeed = Math.min(delta ?? 0.016, 0.05) * 1.6;
      const rotationSpeed = Math.min(delta ?? 0.016, 0.05) * 1.2;

      if (pressedKeysRef.current.size > 0) {
        const forward = new Vector3().subVectors(target, camera.position).normalize();
        const right = new Vector3().crossVectors(forward, new Vector3(0, 1, 0)).normalize();
        const up = new Vector3(0, 1, 0);

        if (pressedKeysRef.current.has('w')) {
          camera.position.add(forward.clone().multiplyScalar(moveSpeed));
          target.add(forward.clone().multiplyScalar(moveSpeed));
        }
        if (pressedKeysRef.current.has('s')) {
          camera.position.add(forward.clone().multiplyScalar(-moveSpeed));
          target.add(forward.clone().multiplyScalar(-moveSpeed));
        }
        if (pressedKeysRef.current.has('a')) {
          camera.position.add(right.clone().multiplyScalar(-moveSpeed));
          target.add(right.clone().multiplyScalar(-moveSpeed));
        }
        if (pressedKeysRef.current.has('d')) {
          camera.position.add(right.clone().multiplyScalar(moveSpeed));
          target.add(right.clone().multiplyScalar(moveSpeed));
        }
        if (pressedKeysRef.current.has('q')) {
          camera.position.add(up.clone().multiplyScalar(moveSpeed * 0.6));
          target.add(up.clone().multiplyScalar(moveSpeed * 0.6));
        }
        if (pressedKeysRef.current.has('e')) {
          camera.position.add(up.clone().multiplyScalar(-moveSpeed * 0.6));
          target.add(up.clone().multiplyScalar(-moveSpeed * 0.6));
        }
        if (pressedKeysRef.current.has('c')) {
          controls.reset();
        }
      }

      if (pressedKeysRef.current.has(' ')) {
        const offset = camera.position.clone().sub(target);
        offset.applyAxisAngle(new Vector3(0, 1, 0), rotationSpeed);
        camera.position.copy(target.clone().add(offset));
      }

      controls.update();
    }

    const anchorIndex = anchorIndexRef.current;

    if (modeRef.current === 'measure') {
      if (anchorIndex !== lastAnchorIndexRef.current) {
        measurementOrderRef.current = calculateMeasurementOrder(anchorIndex, baseOffsetRef.current);
        lastAnchorIndexRef.current = anchorIndex;
        anchorMeasurementIndexRef.current = 0;
      }

      const elapsed = delta.elapsedTime - sweepStartRef.current;
      const normalized = Math.min(elapsed / measurementDuration, 1);
      const order = measurementOrderRef.current;
      const total = normalized * tupleData.length;
      const completed = Math.floor(total);
      let partialProgress = total - completed;
      let measuredCount = completed + (partialProgress > 0 ? 1 : 0);

      if (measuredCount >= tupleData.length) {
        measuredCount = tupleData.length;
        partialProgress = 1;
      }

      const measuredRecords = sessionMeasurementsRef.current;
      while (anchorMeasurementIndexRef.current < completed && anchorMeasurementIndexRef.current < order.length) {
        const pointIndex = order[anchorMeasurementIndexRef.current];
        const anchorVector = new Vector3(...tupleData[anchorIndex].anchor).add(baseOffsetRef.current);
        const pointVector = new Vector3(...tupleData[pointIndex].point).add(baseOffsetRef.current);
        const distance = anchorVector.distanceTo(pointVector);
        measuredRecords.push({
          anchorIndex,
          pointIndex,
          distance,
          colorIndex: measuredRecords.length,
        });
        anchorMeasurementIndexRef.current += 1;
      }

      let activeMeasurement = null;
      if (partialProgress > 0 && anchorMeasurementIndexRef.current < order.length) {
        const pointIndex = order[anchorMeasurementIndexRef.current];
        const anchorVector = new Vector3(...tupleData[anchorIndex].anchor).add(baseOffsetRef.current);
        const pointVector = new Vector3(...tupleData[pointIndex].point).add(baseOffsetRef.current);
        const distance = anchorVector.distanceTo(pointVector);
        activeMeasurement = {
          anchorIndex,
          pointIndex,
          distance,
          progress: partialProgress,
          colorIndex: sessionMeasurementsRef.current.length,
        };
      }

      const nextState = {
        anchorIndex,
        translation: baseOffsetRef.current.toArray(),
        measuredRecords: [...measuredRecords],
        activeMeasurement,
        measurementOrder: measurementOrderRef.current,
      };
      setState(nextState);
      if (onFrameData) onFrameData(nextState);

      if (normalized >= 1) {
        if (anchorIndex === tupleData.length - 1) {
          const currentAnchorVector = new Vector3(...tupleData[anchorIndex].anchor);
          const nextAnchorVector = new Vector3(...tupleData[0].anchor);
          const shiftVector = nextAnchorVector.clone().sub(currentAnchorVector);
          targetOffsetRef.current = baseOffsetRef.current.clone().add(shiftVector);

          modeRef.current = 'translate';
          translationStartRef.current = delta.elapsedTime;
        } else {
          anchorIndexRef.current = (anchorIndex + 1) % tupleData.length;
          lastAnchorIndexRef.current = -1;
          anchorMeasurementIndexRef.current = 0;
          sweepStartRef.current = delta.elapsedTime;
        }
      }
    } else {
      const elapsed = delta.elapsedTime - translationStartRef.current;
      const normalized = Math.min(elapsed / translationDuration, 1);
      const translationVector = baseOffsetRef.current
        .clone()
        .lerp(targetOffsetRef.current, normalized);

      const nextState = {
        anchorIndex,
        translation: translationVector.toArray(),
        measuredRecords: [...sessionMeasurementsRef.current],
        activeMeasurement: null,
        measurementOrder: measurementOrderRef.current,
      };
      setState(nextState);
      if (onFrameData) onFrameData(nextState);

      if (normalized >= 1) {
        baseOffsetRef.current.copy(targetOffsetRef.current);
        anchorIndexRef.current = 0;
        lastAnchorIndexRef.current = -1;
        measurementOrderRef.current = calculateMeasurementOrder(0, baseOffsetRef.current);
        anchorMeasurementIndexRef.current = 0;
        sessionMeasurementsRef.current = [];
        sweepStartRef.current = delta.elapsedTime;
        modeRef.current = 'measure';
      }
    }
  }, []);

  useFrame(handleFrame);

  return (
    <>
      <ambientLight intensity={0.65} />
      <directionalLight ref={lightRef} intensity={0.85} position={[2, 1.6, 2]} />
      <AnimatedGrid />
      <VectorLockObject
        anchorIndex={state.anchorIndex}
        translation={state.translation}
        measuredRecords={state.measuredRecords}
        activeMeasurement={state.activeMeasurement}
      />
      <OrbitControls ref={controlsRef} enablePan={false} enableZoom={zoom} minDistance={1.4} maxDistance={2.2} />
    </>
  );
}

SceneContent.propTypes = {
  zoom: PropTypes.bool,
  onFrameData: PropTypes.func,
};

SceneContent.defaultProps = {
  zoom: true,
  onFrameData: null,
};

function MeasurementPanel({ frameData, isFullscreen, onToggleFullscreen }) {
  const { anchorIndex, measuredRecords, activeMeasurement } = frameData;
  const currentAnchor = anchorIndex + 1;
  const anchorMeasurements = useMemo(
    () => measuredRecords.filter((record) => record.anchorIndex === anchorIndex),
    [anchorIndex, measuredRecords],
  );
  const recentRecords = useMemo(() => measuredRecords.slice(-12).reverse(), [measuredRecords]);
  const totalMeasurements = measuredRecords.length + (activeMeasurement ? activeMeasurement.progress : 0);

  return (
    <div
      className={`flex min-h-full flex-col gap-4 rounded-2xl border border-white/10 bg-slate-900/40 p-5 ${
        isFullscreen ? 'lg:max-w-sm xl:max-w-md 2xl:max-w-lg' : 'w-full'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-emerald-300">Measurement Stream</h3>
          <p className="text-sm text-slate-400">Anchor sweeps accumulate Euclidean distances before geometric translation.</p>
        </div>
        <button
          type="button"
          onClick={onToggleFullscreen}
          className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-500/20"
        >
          {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        </button>
      </div>
      <div className="grid gap-3 rounded-xl border border-white/5 bg-slate-900/60 p-4 text-sm text-slate-100">
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Active Anchor</span>
          <span className="font-semibold text-emerald-200">A{currentAnchor.toString().padStart(2, '0')}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Completed Measurements</span>
          <span className="font-semibold text-slate-100">{measuredRecords.length}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Current Anchor Samples</span>
          <span className="font-semibold text-slate-100">{anchorMeasurements.length}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Stream Entropy Units</span>
          <span className="font-semibold text-emerald-200">{totalMeasurements.toFixed(1)}</span>
        </div>
      </div>
      {activeMeasurement ? (
        <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-100">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Active Sweep</span>
            <span>{Math.round(activeMeasurement.progress * 100)}%</span>
          </div>
          <div className="mt-2 text-xs text-emerald-200">
            A{activeMeasurement.anchorIndex + 1} → P{activeMeasurement.pointIndex + 1} · Distance{' '}
            {activeMeasurement.distance.toFixed(4)}
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-500/20 bg-slate-500/10 p-4 text-sm text-slate-200">
          <span className="font-semibold">Awaiting next sweep…</span>
        </div>
      )}
      <div className="flex-1 overflow-hidden rounded-xl border border-white/5 bg-slate-900/70">
        <div className="border-b border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
          Recent Measurements
        </div>
        <div className="h-full overflow-y-auto">
          <table className="min-w-full divide-y divide-slate-800 text-xs">
            <thead className="bg-slate-900/80 text-slate-400">
              <tr>
                <th className="px-4 py-2 text-left">#</th>
                <th className="px-4 py-2 text-left">Anchor → Point</th>
                <th className="px-4 py-2 text-right">Distance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {recentRecords.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-slate-500">
                    Measurements will populate once the sweep begins.
                  </td>
                </tr>
              )}
              {recentRecords.map((record, idx) => (
                <tr key={`row-${record.anchorIndex}-${record.pointIndex}-${idx}`} className="hover:bg-slate-900/80">
                  <td className="px-4 py-2 text-slate-500">{measuredRecords.length - idx}</td>
                  <td className="px-4 py-2 font-semibold text-slate-100">
                    <span
                      className="mr-2 inline-flex h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: connectionColors[record.colorIndex % connectionColors.length] }}
                    ></span>
                    A{record.anchorIndex + 1} → P{record.pointIndex + 1}
                  </td>
                  <td className="px-4 py-2 text-right text-emerald-200">{record.distance.toFixed(4)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

MeasurementPanel.propTypes = {
  frameData: PropTypes.shape({
    anchorIndex: PropTypes.number.isRequired,
    measuredRecords: PropTypes.arrayOf(
      PropTypes.shape({
        anchorIndex: PropTypes.number.isRequired,
        pointIndex: PropTypes.number.isRequired,
        distance: PropTypes.number.isRequired,
        colorIndex: PropTypes.number.isRequired,
      }),
    ).isRequired,
    activeMeasurement: PropTypes.shape({
      anchorIndex: PropTypes.number.isRequired,
      pointIndex: PropTypes.number.isRequired,
      distance: PropTypes.number.isRequired,
      progress: PropTypes.number.isRequired,
      colorIndex: PropTypes.number.isRequired,
    }),
    measurementOrder: PropTypes.arrayOf(PropTypes.number),
  }).isRequired,
  isFullscreen: PropTypes.bool.isRequired,
  onToggleFullscreen: PropTypes.func.isRequired,
};

function VectorLock3D({ height, zoom, onFrameData }) {
  const [frameData, setFrameData] = useState({
    anchorIndex: 0,
    measuredRecords: [],
    activeMeasurement: null,
    measurementOrder: [],
  });
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleFrameData = useCallback((data) => {
    setFrameData(data);
  }, []);

  useEffect(() => {
    if (isFullscreen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isFullscreen]);

  const containerClass = isFullscreen
    ? 'fixed inset-0 z-[1200] flex flex-col overflow-hidden bg-slate-950/95 backdrop-blur-lg p-6'
    : 'relative w-full overflow-hidden rounded-3xl border border-slate-200 bg-slate-900/40 p-6';

  const layoutClass = isFullscreen
    ? 'flex h-full w-full min-h-0 flex-col gap-6 lg:flex-row'
    : 'flex w-full flex-col gap-6';

  const canvasWrapperClass = isFullscreen
    ? 'relative flex flex-1 min-h-[40vh] rounded-2xl border border-white/10 bg-slate-900/30'
    : 'relative w-full rounded-2xl border border-white/10 bg-slate-900/30 aspect-[16/9] overflow-hidden';

  const canvasWrapperStyle = isFullscreen ? undefined : { minHeight: typeof height === 'number' ? `${height}px` : height };
  const canvasStyle = { height: '100%', width: '100%' };

  return (
    <div className={containerClass}>
      <div className={`${layoutClass} flex-1`}>
        <div className={canvasWrapperClass} style={canvasWrapperStyle}>
          <Canvas camera={{ position: [0, 0.5, 1.7], fov: 42 }} style={canvasStyle}>
            <SceneContent zoom={zoom} onFrameData={handleFrameData} />
          </Canvas>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-900/0 to-slate-900/60" />
        </div>
        <MeasurementPanel
          frameData={frameData}
          isFullscreen={isFullscreen}
          onToggleFullscreen={() => setIsFullscreen((prev) => !prev)}
        />
      </div>
      {!isFullscreen && (
        <div className="mt-4 flex items-center justify-end">
          <button
            type="button"
            onClick={() => setIsFullscreen(true)}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-500/20"
          >
            Expand Visualization
          </button>
        </div>
      )}
    </div>
  );
};

VectorLock3D.propTypes = {
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  enableZoom: PropTypes.bool
};

VectorLock3D.defaultProps = {
  height: 520,
  enableZoom: false
};

export default VectorLock3D;
