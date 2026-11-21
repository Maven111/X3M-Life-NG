'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import * as THREE from 'three';
import { FBXLoader } from 'three-stdlib';
import { office3DTheme } from '@/tokens/3d-materials';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DesignSystemShowcase } from '@/components/example/DesignSystemShowcase';

const CHARACTER_URL = '/api/assets/3d%20characters/Players/player-character.fbx';

const ANIMATION_FILES = [
  { id: 'Idle', label: 'Idle (Standing)', file: 'Idle.fbx', url: '/api/assets/3d%20characters/Players/Idle.fbx' },
  { id: 'Walking', label: 'Walking Cycle', file: 'Walking.fbx', url: '/api/assets/3d%20characters/Players/Walking.fbx' },
  { id: 'Typing', label: 'Typing at Desk', file: 'Typing.fbx', url: '/api/assets/3d%20characters/Players/Typing.fbx' },
  { id: 'Sitting Idle', label: 'Sitting Idle', file: 'Sitting Idle.fbx', url: '/api/assets/3d%20characters/Players/Sitting Idle.fbx' }
];

function AnimatedCharacter({
  modelObject,
  activeAnim,
  isPlaying,
  playbackSpeed,
  seekTime,
  wireframe,
  showSkeleton,
  onAnimProgress
}: {
  modelObject: THREE.Group;
  activeAnim: string;
  isPlaying: boolean;
  playbackSpeed: number;
  seekTime: number | null;
  wireframe: boolean;
  showSkeleton: boolean;
  onAnimProgress?: (current: number, total: number) => void;
}) {
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const actionsRef = useRef<Record<string, THREE.AnimationAction>>({});
  const activeActionRef = useRef<THREE.AnimationAction | null>(null);
  const skeletonHelperRef = useRef<THREE.SkeletonHelper | null>(null);

  useEffect(() => {
    if (!modelObject) return;
    modelObject.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (mesh.isMesh && mesh.material) {
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((m) => { (m as THREE.MeshStandardMaterial).wireframe = wireframe; });
        } else {
          (mesh.material as THREE.MeshStandardMaterial).wireframe = wireframe;
        }
      }
    });
  }, [modelObject, wireframe]);

  useEffect(() => {
    if (!modelObject) return;
    if (showSkeleton) {
      const helper = new THREE.SkeletonHelper(modelObject);
      skeletonHelperRef.current = helper;
      modelObject.add(helper);
    } else if (skeletonHelperRef.current) {
      modelObject.remove(skeletonHelperRef.current);
      skeletonHelperRef.current.dispose?.();
      skeletonHelperRef.current = null;
    }
  }, [modelObject, showSkeleton]);

  useEffect(() => {
    if (!modelObject) return;

    const mixer = new THREE.AnimationMixer(modelObject);
    mixerRef.current = mixer;
    actionsRef.current = {};

    return () => {
      mixer.stopAllAction();
      mixer.uncacheRoot(modelObject);
      mixerRef.current = null;
    };
  }, [modelObject]);

  const playAnimation = useCallback((animId: string, blendDuration = 0.35) => {
    const mixer = mixerRef.current;
    if (!mixer) return;

    if (animId === 'none') {
      if (activeActionRef.current) {
        activeActionRef.current.fadeOut(blendDuration);
        activeActionRef.current = null;
      }
      return;
    }

    const nextAction = actionsRef.current[animId];
    if (!nextAction) return;

    const prevAction = activeActionRef.current;

    if (prevAction && prevAction !== nextAction) {
      prevAction.fadeOut(blendDuration);
      nextAction.reset().fadeIn(blendDuration).play();
    } else if (!prevAction) {
      nextAction.reset().fadeIn(blendDuration).play();
    }

    activeActionRef.current = nextAction;
  }, []);

  useEffect(() => {
    if (!modelObject || !mixerRef.current) return;
    const mixer = mixerRef.current;

    if (modelObject.userData && modelObject.userData.clips) {
      Object.entries(modelObject.userData.clips).forEach(([id, clip]) => {
        if (!actionsRef.current[id]) {
          const action = mixer.clipAction(clip as THREE.AnimationClip);
          action.setEffectiveTimeScale(playbackSpeed);
          actionsRef.current[id] = action;
        }
      });

      playAnimation(activeAnim);
    }
  }, [modelObject, activeAnim, playAnimation, playbackSpeed]);

  useEffect(() => {
    const action = activeActionRef.current;
    if (action) {
      action.paused = !isPlaying;
      action.setEffectiveTimeScale(playbackSpeed);
    }
  }, [isPlaying, playbackSpeed]);

  useEffect(() => {
    const action = activeActionRef.current;
    if (action && seekTime !== null && !isPlaying) {
      action.time = seekTime;
      if (mixerRef.current) {
        mixerRef.current.update(0);
      }
    }
  }, [seekTime, isPlaying]);

  useFrame((_, delta) => {
    if (mixerRef.current && isPlaying) {
      mixerRef.current.update(delta * playbackSpeed);

      const action = activeActionRef.current;
      if (action && action.getClip() && onAnimProgress) {
        const duration = action.getClip().duration;
        const current = action.time % duration;
        onAnimProgress(current, duration);
      }
    }
  });

  return (
    <group scale={[0.01, 0.01, 0.01]}>
      <primitive object={modelObject} />
    </group>
  );
}

export function GameClientView() {
  const [model, setModel] = useState<THREE.Group | null>(null);
  const [characterLoading, setCharacterLoading] = useState(true);

  const [animationsStatus, setAnimationsStatus] = useState<Record<string, any>>({});
  const [loadedClips, setLoadedClips] = useState<Record<string, THREE.AnimationClip>>({});
  const [activeAnim, setActiveAnim] = useState('Idle');
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isScrubbing, setIsScrubbing] = useState(false);

  const [wireframe, setWireframe] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [showcaseOpen, setShowcaseOpen] = useState(false);

  const controlsRef = useRef<any>(null);

  useEffect(() => {
    const loader = new FBXLoader();
    setCharacterLoading(true);

    loader.load(
      CHARACTER_URL,
      (fbx) => {
        fbx.traverse((child) => {
          const mesh = child as THREE.Mesh;
          if (mesh.isMesh) {
            mesh.castShadow = true;
            mesh.receiveShadow = true;
          }
        });

        fbx.userData = { clips: {} };
        setModel(fbx);
        setCharacterLoading(false);
      },
      undefined,
      (err) => {
        console.error('Character load error:', err);
        setGeneralError('Failed to stream player-character.fbx: ' + (err.message || String(err)));
        setCharacterLoading(false);
      }
    );
  }, []);

  useEffect(() => {
    if (!model) return;
    const loader = new FBXLoader();

    ANIMATION_FILES.forEach((animMeta) => {
      setAnimationsStatus((prev) => ({
        ...prev,
        [animMeta.id]: { state: 'loading', label: animMeta.label }
      }));

      loader.load(
        animMeta.url,
        (animFbx) => {
          if (animFbx.animations && animFbx.animations.length > 0) {
            const rawClip = animFbx.animations[0];
            const clip = rawClip.clone();
            clip.name = animMeta.id;

            model.userData.clips[animMeta.id] = clip;

            setLoadedClips((prev) => ({ ...prev, [animMeta.id]: clip }));
            setAnimationsStatus((prev) => ({
              ...prev,
              [animMeta.id]: {
                state: 'ready',
                label: animMeta.label,
                duration: clip.duration,
                tracks: clip.tracks.length
              }
            }));

            if (animMeta.id === 'Idle') {
              setDuration(clip.duration);
            }
          } else {
            setAnimationsStatus((prev) => ({
              ...prev,
              [animMeta.id]: {
                state: 'error',
                label: animMeta.label,
                error: 'No animation tracks found'
              }
            }));
          }
        },
        undefined,
        (err) => {
          console.error(`Failed to load ${animMeta.file}:`, err);
          setAnimationsStatus((prev) => ({
            ...prev,
            [animMeta.id]: {
              state: 'error',
              label: animMeta.label,
              error: err?.message || 'Streaming error'
            }
          }));
        }
      );
    });
  }, [model]);

  const handleSelectAnimation = (animId: string) => {
    setActiveAnim(animId);
    setIsPlaying(true);
    setCurrentTime(0);

    if (animId === 'none') {
      setDuration(0);
    } else if (loadedClips[animId]) {
      setDuration(loadedClips[animId].duration);
    }
  };

  const handleTogglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleReplay = () => {
    setCurrentTime(0);
    setIsPlaying(true);
    if (model && model.userData && model.userData.clips[activeAnim]) {
      handleSelectAnimation(activeAnim);
    }
  };

  const handleProgress = (current: number, total: number) => {
    if (!isScrubbing) {
      setCurrentTime(current);
      setDuration(total);
    }
  };

  const handleScrubChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
  };

  const handleResetCamera = () => {
    if (!controlsRef.current) return;
    controlsRef.current.target.set(0, 0.9, 0);
    controlsRef.current.object.position.set(0, 1.2, 3.2);
    controlsRef.current.update();
  };

  return (
    <div className="w-screen h-screen relative bg-surface-container-lowest text-surface-foreground overflow-hidden font-body select-none">
      <Canvas
        shadows
        camera={{ position: [0, 1.2, 3.2], fov: 45, near: 0.05, far: 500 }}
        className="w-full h-full"
      >
        <ambientLight intensity={office3DTheme.lighting.ambient.intensity} />
        <hemisphereLight
          intensity={office3DTheme.lighting.hemisphere.intensity}
          color={office3DTheme.lighting.hemisphere.skyColor}
          groundColor={office3DTheme.lighting.hemisphere.groundColor}
        />
        <directionalLight
          castShadow
          position={[4, 10, 5]}
          intensity={office3DTheme.lighting.keyLight.intensity}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-bias={-0.0001}
        />
        <directionalLight
          position={[-5, 6, -5]}
          intensity={office3DTheme.lighting.fillLight.intensity}
          color={office3DTheme.lighting.fillLight.color}
        />
        <directionalLight
          position={[0, 3, -6]}
          intensity={office3DTheme.lighting.rimLight.intensity}
          color={office3DTheme.lighting.rimLight.color}
        />

        <group position={[0, 0, 0]}>
          <Grid
            infiniteGrid
            cellSize={office3DTheme.grid.cellSize}
            sectionSize={office3DTheme.grid.sectionSize}
            sectionColor={office3DTheme.grid.sectionColor}
            cellColor={office3DTheme.grid.cellColor}
            fadeDistance={office3DTheme.grid.fadeDistance}
            fadeStrength={office3DTheme.grid.fadeStrength}
          />
          <mesh receiveShadow position={[0, -0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[50, 50]} />
            <shadowMaterial opacity={0.3} />
          </mesh>
        </group>

        {model && (
          <AnimatedCharacter
            modelObject={model}
            activeAnim={activeAnim}
            isPlaying={isPlaying}
            playbackSpeed={playbackSpeed}
            seekTime={isScrubbing ? currentTime : null}
            wireframe={wireframe}
            showSkeleton={showSkeleton}
            onAnimProgress={handleProgress}
          />
        )}

        <OrbitControls
          ref={controlsRef}
          makeDefault
          target={[0, 0.9, 0]}
          enableDamping
          dampingFactor={0.08}
          minDistance={0.3}
          maxDistance={15}
        />
      </Canvas>

      {/* Top Header - Semantic Tokens */}
      <div className="absolute top-4 left-5 z-10 pointer-events-none">
        <div className="flex items-center gap-2.5">
          <div className="bg-brand-gradient-primary px-2.5 py-1 rounded-m3-xs text-xs font-display font-bold tracking-wider text-white uppercase shadow-elevation-1">
            X3M Life NG
          </div>
          <span className="text-xs text-surface-variant-foreground font-medium">
            Next.js App Router (TypeScript)
          </span>
        </div>
        <h1 className="font-display font-bold text-xl mt-1 tracking-tight text-white drop-shadow-sm">
          Technical Foundation Architecture
        </h1>
      </div>

      {/* Top Right Action: Open Design System Showcase */}
      <div className="absolute top-4 right-5 z-20 flex items-center gap-2">
        <Button
          variant="primary-gradient"
          size="sm"
          onClick={() => setShowcaseOpen(true)}
          className="shadow-elevation-2"
          icon={<span className="text-xs">🎨</span>}
        >
          View Design Tokens & HUD
        </Button>
      </div>

      {/* Loading Overlay */}
      {characterLoading && (
        <div className="absolute inset-0 bg-surface/85 backdrop-blur-md flex flex-col items-center justify-center z-50 text-surface-foreground">
          <div className="w-12 h-12 border-4 border-outline border-t-primary rounded-m3-full animate-spin" />
          <div className="mt-4 font-display font-bold text-base">
            Streaming Character & Rig from Assets...
          </div>
        </div>
      )}

      {/* Error Message */}
      {generalError && (
        <div className="absolute top-20 left-5 right-5 max-w-lg bg-error-container text-error-container-foreground border border-error/30 p-3.5 rounded-m3-md text-xs z-40 shadow-elevation-2">
          <strong className="font-bold">Error:</strong> {generalError}
        </div>
      )}

      {/* Bottom Floating Playback & Animation Controller Bar */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-3xl bg-secondary/90 text-secondary-foreground backdrop-blur-md border border-outline/30 rounded-m3-xl p-4 shadow-elevation-4 z-20 flex flex-col gap-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-surface-muted mr-1 tracking-wider uppercase">
              ANIMATIONS:
            </span>

            {ANIMATION_FILES.map((anim) => {
              const status = animationsStatus[anim.id];
              const isReady = status?.state === 'ready';
              const isSelected = activeAnim === anim.id;

              return (
                <button
                  key={anim.id}
                  onClick={() => handleSelectAnimation(anim.id)}
                  disabled={!isReady}
                  className={`
                    px-3 py-1.5 rounded-m3-full text-xs font-body transition-all flex items-center gap-1.5
                    ${isSelected
                      ? 'bg-brand-gradient-primary text-white font-bold shadow-elevation-1'
                      : isReady
                        ? 'bg-surface/10 text-white/90 hover:bg-surface/20'
                        : 'bg-surface/5 text-surface-muted opacity-40 cursor-not-allowed'
                    }
                  `}
                >
                  <span>{anim.label}</span>
                  {status?.state === 'loading' && <span className="w-2 h-2 rounded-m3-full bg-warning animate-ping" />}
                  {status?.state === 'error' && <span className="text-[10px] text-error">✕</span>}
                </button>
              );
            })}

            <button
              onClick={() => handleSelectAnimation('none')}
              className={`
                px-3 py-1.5 rounded-m3-full text-xs font-body transition-all
                ${activeAnim === 'none'
                  ? 'bg-brand-gradient-primary text-white font-bold shadow-elevation-1'
                  : 'bg-surface/10 text-surface-muted hover:text-white'
                }
              `}
            >
              Rest T-Pose
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-surface-muted uppercase font-bold tracking-wider">SPEED:</span>
            {[0.5, 1.0, 1.5].map((speed) => (
              <button
                key={speed}
                onClick={() => setPlaybackSpeed(speed)}
                className={`
                  px-2 py-0.5 rounded-m3-xs text-[11px] font-semibold transition-all
                  ${playbackSpeed === speed
                    ? 'bg-primary text-primary-foreground font-bold'
                    : 'bg-surface/10 text-surface-muted hover:text-white'
                  }
                `}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3.5">
          <button
            onClick={handleTogglePlay}
            disabled={activeAnim === 'none'}
            className="w-9 h-9 rounded-m3-full bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center font-bold text-sm shadow-elevation-1 active:scale-95 transition-transform disabled:opacity-40"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? '❚❚' : '▶'}
          </button>

          <button
            onClick={handleReplay}
            disabled={activeAnim === 'none'}
            className="w-8 h-8 rounded-m3-full bg-surface/10 hover:bg-surface/20 text-white flex items-center justify-center text-sm active:scale-95 transition-transform disabled:opacity-40"
            title="Replay from start"
          >
            ↺
          </button>

          <div className="flex-1 flex items-center gap-2.5">
            <span className="text-[11px] font-mono text-surface-muted min-w-[38px]">
              {currentTime.toFixed(1)}s
            </span>
            <input
              type="range"
              min="0"
              max={duration || 1}
              step="0.02"
              value={currentTime}
              disabled={activeAnim === 'none' || duration === 0}
              onChange={handleScrubChange}
              onMouseDown={() => setIsScrubbing(true)}
              onMouseUp={() => setIsScrubbing(false)}
              className="flex-1 accent-primary cursor-pointer disabled:opacity-40"
            />
            <span className="text-[11px] font-mono text-surface-muted min-w-[38px]">
              {duration.toFixed(1)}s
            </span>
          </div>

          <div className="flex items-center gap-2 border-l border-outline/30 pl-3">
            <button
              onClick={() => setWireframe(!wireframe)}
              className={`p-1.5 rounded-m3-xs text-xs transition-colors ${wireframe ? 'bg-primary text-white' : 'text-surface-muted hover:text-white'}`}
              title="Toggle Wireframe"
            >
              Wireframe
            </button>
            <button
              onClick={handleResetCamera}
              className="p-1.5 rounded-m3-xs text-xs text-surface-muted hover:text-white transition-colors"
              title="Reset Camera"
            >
              Reset View
            </button>
          </div>
        </div>
      </div>

      <DesignSystemShowcase
        isOpen={showcaseOpen}
        onClose={() => setShowcaseOpen(false)}
      />
    </div>
  );
}

