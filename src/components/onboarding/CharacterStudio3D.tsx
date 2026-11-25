'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, OrbitControls, Float } from '@react-three/drei';
import * as THREE from 'three';
import {
  type AccessoryValue,
  type GenderPresentationValue,
  type HairstyleValue,
  type OutfitColorValue,
  type OutfitKeyValue,
  type SkinToneValue,
  getOutfitColorSwatch,
  getSkinToneHex
} from '@/config/character-options';

export type StudioPose = 'idle' | 'wave' | 'pitch';

export interface CharacterStudioProps {
  displayName: string;
  gender: GenderPresentationValue;
  skinTone: SkinToneValue;
  hairstyle: HairstyleValue;
  outfitKey: OutfitKeyValue;
  outfitColor: OutfitColorValue;
  accessories: AccessoryValue[];
  trackName?: string;
  unitCode?: string;
}

interface AvatarRigProps {
  gender: GenderPresentationValue;
  skinHex: string;
  hairstyle: HairstyleValue;
  outfitKey: OutfitKeyValue;
  primaryHex: string;
  accentHex: string;
  accessories: AccessoryValue[];
  pose: StudioPose;
  reactionKey: string;
}

function HairSculpture({
  hairstyle,
  hasCap
}: {
  hairstyle: HairstyleValue;
  hasCap: boolean;
}) {
  const hairColor = '#181412';
  const highlightColor = '#28201B';

  // When wearing a cap, keep lower hair elements visible while tucking the crown neatly
  return (
    <group>
      {/* Base scalp hair cap */}
      <mesh position={[0, 0.04, -0.015]} castShadow>
        <sphereGeometry args={[0.215, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.62]} />
        <meshStandardMaterial color={hairColor} roughness={0.85} />
      </mesh>

      {/* MALE HAIRSTYLES */}
      {hairstyle === 'low_fade' && !hasCap && (
        <mesh position={[0, 0.145, 0.01]} castShadow>
          <cylinderGeometry args={[0.175, 0.195, 0.095, 24]} />
          <meshStandardMaterial color={hairColor} roughness={0.9} />
        </mesh>
      )}

      {hairstyle === 'sponge_twists' && !hasCap && (
        <group position={[0, 0.18, 0]}>
          {[
            [0, 0.03, 0],
            [-0.08, 0.02, 0.06],
            [0.08, 0.02, 0.06],
            [-0.09, 0.01, -0.05],
            [0.09, 0.01, -0.05],
            [0, 0.02, 0.09],
            [0, 0.02, -0.09],
            [-0.12, -0.01, 0.01],
            [0.12, -0.01, 0.01]
          ].map(([x, y, z], idx) => (
            <mesh key={idx} position={[x, y, z]} castShadow>
              <dodecahedronGeometry args={[0.058, 0]} />
              <meshStandardMaterial color={idx % 2 === 0 ? hairColor : highlightColor} roughness={0.92} />
            </mesh>
          ))}
        </group>
      )}

      {hairstyle === 'neat_locs' && (
        <group>
          {[-0.14, -0.09, -0.04, 0.01, 0.06, 0.11, 0.15].map((x, idx) => (
            <mesh
              key={idx}
              position={[x, 0.06 - Math.abs(x) * 0.25, -0.15 - (idx % 2) * 0.03]}
              rotation={[0.25, 0, x * 0.8]}
              castShadow
            >
              <capsuleGeometry args={[0.026, 0.22, 6, 10]} />
              <meshStandardMaterial color={hairColor} roughness={0.88} />
            </mesh>
          ))}
          {!hasCap &&
            [-0.11, -0.04, 0.04, 0.11].map((x, idx) => (
              <mesh key={`top-${idx}`} position={[x, 0.21, 0.02]} rotation={[0.3, 0, 0]} castShadow>
                <capsuleGeometry args={[0.028, 0.12, 6, 10]} />
                <meshStandardMaterial color={highlightColor} roughness={0.88} />
              </mesh>
            ))}
        </group>
      )}

      {hairstyle === 'classic_waves' && !hasCap && (
        <mesh position={[0, 0.075, -0.01]} castShadow>
          <sphereGeometry args={[0.212, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.56]} />
          <meshStandardMaterial color={hairColor} roughness={0.55} metalness={0.12} />
        </mesh>
      )}

      {hairstyle === 'short_afro' && !hasCap && (
        <mesh position={[0, 0.14, -0.015]} castShadow>
          <sphereGeometry args={[0.235, 24, 24]} />
          <meshStandardMaterial color={hairColor} roughness={0.95} />
        </mesh>
      )}

      {hairstyle === 'clean_buzz' && !hasCap && (
        <mesh position={[0, 0.06, -0.01]}>
          <sphereGeometry args={[0.207, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
          <meshStandardMaterial color={highlightColor} roughness={0.9} />
        </mesh>
      )}

      {/* FEMALE HAIRSTYLES */}
      {hairstyle === 'knotless_braids' && (
        <group>
          {[-0.17, -0.13, -0.08, -0.03, 0.03, 0.08, 0.13, 0.17].map((x, idx) => (
            <mesh
              key={idx}
              position={[x, -0.1, -0.11 - (idx % 2) * 0.03]}
              rotation={[0.08, 0, x * 0.35]}
              castShadow
            >
              <capsuleGeometry args={[0.022, 0.42, 6, 10]} />
              <meshStandardMaterial color={hairColor} roughness={0.82} />
            </mesh>
          ))}
          {[-0.18, 0.18].map((x, idx) => (
            <mesh key={`front-${idx}`} position={[x, -0.08, 0.04]} rotation={[0.05, 0, x * 0.2]} castShadow>
              <capsuleGeometry args={[0.021, 0.34, 6, 10]} />
              <meshStandardMaterial color={highlightColor} roughness={0.82} />
            </mesh>
          ))}
        </group>
      )}

      {hairstyle === 'butterfly_locs' && (
        <group>
          {[-0.18, -0.12, -0.06, 0, 0.06, 0.12, 0.18].map((x, idx) => (
            <mesh
              key={idx}
              position={[x, -0.08, -0.12 - (idx % 2) * 0.03]}
              rotation={[0.12, 0, x * 0.45]}
              castShadow
            >
              <capsuleGeometry args={[0.034, 0.38, 6, 10]} />
              <meshStandardMaterial color={idx % 2 === 0 ? hairColor : highlightColor} roughness={0.9} />
            </mesh>
          ))}
        </group>
      )}

      {hairstyle === 'afro_puff' && !hasCap && (
        <group>
          <mesh position={[0, 0.28, -0.06]} castShadow>
            <sphereGeometry args={[0.165, 24, 24]} />
            <meshStandardMaterial color={hairColor} roughness={0.96} />
          </mesh>
          <mesh position={[0, 0.19, -0.05]} rotation={[0.3, 0, 0]}>
            <torusGeometry args={[0.08, 0.015, 10, 24]} />
            <meshStandardMaterial color="#F9A825" roughness={0.35} metalness={0.5} />
          </mesh>
        </group>
      )}

      {hairstyle === 'sleek_bob' && (
        <group>
          <mesh position={[0, 0.02, -0.03]} castShadow>
            <cylinderGeometry args={[0.22, 0.245, 0.28, 24, 1, false, Math.PI * 0.2, Math.PI * 1.6]} />
            <meshStandardMaterial color={hairColor} roughness={0.38} metalness={0.18} />
          </mesh>
          {!hasCap && (
            <mesh position={[0, 0.12, 0.02]} castShadow>
              <sphereGeometry args={[0.215, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
              <meshStandardMaterial color={hairColor} roughness={0.38} metalness={0.18} />
            </mesh>
          )}
        </group>
      )}

      {hairstyle === 'cornrows' && (
        <group>
          {[-0.12, -0.06, 0, 0.06, 0.12].map((x, idx) => (
            <mesh key={idx} position={[x, 0.11, -0.02]} rotation={[Math.PI * 0.5, 0, 0]} castShadow>
              <capsuleGeometry args={[0.022, 0.28, 6, 10]} />
              <meshStandardMaterial color={hairColor} roughness={0.85} />
            </mesh>
          ))}
          {[-0.08, 0, 0.08].map((x, idx) => (
            <mesh key={`tail-${idx}`} position={[x, -0.06, -0.19]} rotation={[0.18, 0, 0]} castShadow>
              <capsuleGeometry args={[0.018, 0.26, 6, 10]} />
              <meshStandardMaterial color={highlightColor} roughness={0.85} />
            </mesh>
          ))}
        </group>
      )}

      {hairstyle === 'high_ponytail' && (
        <group>
          {!hasCap && (
            <mesh position={[0, 0.24, -0.14]} rotation={[0.55, 0, 0]} castShadow>
              <capsuleGeometry args={[0.065, 0.34, 8, 14]} />
              <meshStandardMaterial color={hairColor} roughness={0.5} metalness={0.12} />
            </mesh>
          )}
          <mesh position={[0, 0.12, -0.22]} rotation={[0.25, 0, 0]} castShadow>
            <capsuleGeometry args={[0.055, 0.32, 8, 14]} />
            <meshStandardMaterial color={hairColor} roughness={0.5} metalness={0.12} />
          </mesh>
        </group>
      )}
    </group>
  );
}

function StylizedAgencyCharacter({
  gender,
  skinHex,
  hairstyle,
  outfitKey,
  primaryHex,
  accentHex,
  accessories,
  pose,
  reactionKey
}: AvatarRigProps) {
  const rootRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const torsoRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftEyeRef = useRef<THREE.Mesh>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);
  const reactionTimerRef = useRef(0);

  const isFemale = gender === 'female';
  const hasGlasses = accessories.includes('glasses');
  const hasCap = accessories.includes('cap');
  const hasEarrings = accessories.includes('earrings');
  const hasNeckChain = accessories.includes('neck_chain');

  // Trigger subtle celebration bounce/spin on any customization change
  useEffect(() => {
    reactionTimerRef.current = 1;
  }, [reactionKey]);

  const pantsColor = useMemo(() => {
    if (outfitKey === 'corporate') return primaryHex;
    if (outfitKey === 'y2k') return '#1E293B';
    if (outfitKey === 'casual') return '#2B3E5A';
    return '#1F2937';
  }, [outfitKey, primaryHex]);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // Decay customization reaction pulse
    if (reactionTimerRef.current > 0) {
      reactionTimerRef.current = Math.max(0, reactionTimerRef.current - delta * 2.4);
    }
    const pulse = Math.sin(reactionTimerRef.current * Math.PI);

    // Subtle living breathing + reaction lift
    if (rootRef.current) {
      rootRef.current.position.y = -0.96 + Math.sin(t * 2.1) * 0.018 + pulse * 0.06;
      rootRef.current.rotation.y = Math.sin(t * 0.7) * 0.1 + pulse * 0.28;
    }

    // Gentle head movement
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(t * 1.1) * 0.09;
      headRef.current.rotation.z = Math.sin(t * 0.85) * 0.035;
    }

    // Eye blinking every ~3.5 seconds
    const blinkCycle = t % 3.5;
    const eyeScaleY = blinkCycle > 3.34 && blinkCycle < 3.46 ? 0.1 : 1;
    if (leftEyeRef.current && rightEyeRef.current) {
      leftEyeRef.current.scale.y = eyeScaleY;
      rightEyeRef.current.scale.y = eyeScaleY;
    }

    // Pose-driven arm animation
    if (rightArmRef.current && leftArmRef.current) {
      if (pose === 'wave') {
        rightArmRef.current.rotation.z = THREE.MathUtils.lerp(
          rightArmRef.current.rotation.z,
          2.45 + Math.sin(t * 8) * 0.22,
          delta * 8
        );
        rightArmRef.current.rotation.x = THREE.MathUtils.lerp(
          rightArmRef.current.rotation.x,
          -0.2,
          delta * 8
        );
        leftArmRef.current.rotation.z = THREE.MathUtils.lerp(
          leftArmRef.current.rotation.z,
          -0.16,
          delta * 8
        );
      } else if (pose === 'pitch') {
        rightArmRef.current.rotation.z = THREE.MathUtils.lerp(
          rightArmRef.current.rotation.z,
          0.55 + Math.sin(t * 2.6) * 0.06,
          delta * 6
        );
        rightArmRef.current.rotation.x = THREE.MathUtils.lerp(
          rightArmRef.current.rotation.x,
          -0.45,
          delta * 6
        );
        leftArmRef.current.rotation.z = THREE.MathUtils.lerp(
          leftArmRef.current.rotation.z,
          -0.35,
          delta * 6
        );
      } else {
        rightArmRef.current.rotation.z = THREE.MathUtils.lerp(
          rightArmRef.current.rotation.z,
          0.16 + Math.sin(t * 1.9) * 0.03,
          delta * 6
        );
        rightArmRef.current.rotation.x = THREE.MathUtils.lerp(
          rightArmRef.current.rotation.x,
          0,
          delta * 6
        );
        leftArmRef.current.rotation.z = THREE.MathUtils.lerp(
          leftArmRef.current.rotation.z,
          -0.16 - Math.sin(t * 1.9) * 0.03,
          delta * 6
        );
      }
    }
  });

  const shoulderWidth = isFemale ? 0.25 : 0.305;
  const torsoTopRadius = isFemale ? 0.175 : 0.22;
  const torsoBottomRadius = isFemale ? 0.155 : 0.185;
  const hipRadius = isFemale ? 0.21 : 0.185;

  return (
    <group ref={rootRef} position={[0, -0.96, 0]}>
      {/* ================= HEAD & FACE ================= */}
      <group ref={headRef} position={[0, 1.56, 0]}>
        {/* Neck */}
        <mesh position={[0, -0.22, 0]} castShadow>
          <cylinderGeometry args={[0.068, 0.078, 0.14, 16]} />
          <meshStandardMaterial color={skinHex} roughness={0.62} />
        </mesh>

        {/* Head */}
        <mesh castShadow>
          <sphereGeometry args={[0.205, 28, 28]} />
          <meshStandardMaterial color={skinHex} roughness={0.58} />
        </mesh>

        {/* Ears */}
        <mesh position={[-0.2, -0.01, 0]} castShadow>
          <sphereGeometry args={[0.038, 12, 12]} />
          <meshStandardMaterial color={skinHex} roughness={0.6} />
        </mesh>
        <mesh position={[0.2, -0.01, 0]} castShadow>
          <sphereGeometry args={[0.038, 12, 12]} />
          <meshStandardMaterial color={skinHex} roughness={0.6} />
        </mesh>

        {/* Eyes */}
        <mesh ref={leftEyeRef} position={[-0.072, 0.02, 0.182]}>
          <sphereGeometry args={[0.022, 14, 14]} />
          <meshStandardMaterial color="#111827" roughness={0.2} metalness={0.1} />
        </mesh>
        <mesh ref={rightEyeRef} position={[0.072, 0.02, 0.182]}>
          <sphereGeometry args={[0.022, 14, 14]} />
          <meshStandardMaterial color="#111827" roughness={0.2} metalness={0.1} />
        </mesh>

        {/* Subtle eye highlights */}
        <mesh position={[-0.066, 0.027, 0.198]}>
          <sphereGeometry args={[0.006, 8, 8]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
        <mesh position={[0.078, 0.027, 0.198]}>
          <sphereGeometry args={[0.006, 8, 8]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>

        {/* Eyebrows */}
        <mesh position={[-0.072, 0.068, 0.182]} rotation={[0, 0, isFemale ? 0.12 : 0.04]}>
          <boxGeometry args={[0.056, 0.012, 0.012]} />
          <meshStandardMaterial color="#181412" roughness={0.9} />
        </mesh>
        <mesh position={[0.072, 0.068, 0.182]} rotation={[0, 0, isFemale ? -0.12 : -0.04]}>
          <boxGeometry args={[0.056, 0.012, 0.012]} />
          <meshStandardMaterial color="#181412" roughness={0.9} />
        </mesh>

        {/* Warm smile */}
        <mesh position={[0, -0.068, 0.186]} rotation={[0, 0, Math.PI]}>
          <torusGeometry args={[0.036, 0.008, 8, 16, Math.PI]} />
          <meshStandardMaterial color={isFemale ? '#9F2B3B' : '#3E1F1A'} roughness={0.45} />
        </mesh>

        {/* Hairstyle */}
        <HairSculpture hairstyle={hairstyle} hasCap={hasCap} />

        {/* ACCESSORY: GLASSES */}
        {hasGlasses && (
          <group position={[0, 0.022, 0.2]}>
            <mesh position={[-0.074, 0, 0]}>
              <torusGeometry args={[0.048, 0.008, 10, 24]} />
              <meshStandardMaterial color="#111827" roughness={0.25} metalness={0.75} />
            </mesh>
            <mesh position={[0.074, 0, 0]}>
              <torusGeometry args={[0.048, 0.008, 10, 24]} />
              <meshStandardMaterial color="#111827" roughness={0.25} metalness={0.75} />
            </mesh>
            {/* Tinted studio lenses */}
            <mesh position={[-0.074, 0, -0.003]}>
              <circleGeometry args={[0.044, 20]} />
              <meshStandardMaterial color="#F59E0B" transparent opacity={0.26} roughness={0.1} metalness={0.4} />
            </mesh>
            <mesh position={[0.074, 0, -0.003]}>
              <circleGeometry args={[0.044, 20]} />
              <meshStandardMaterial color="#F59E0B" transparent opacity={0.26} roughness={0.1} metalness={0.4} />
            </mesh>
            {/* Bridge */}
            <mesh position={[0, 0.006, 0]}>
              <boxGeometry args={[0.052, 0.009, 0.009]} />
              <meshStandardMaterial color="#F9A825" roughness={0.25} metalness={0.85} />
            </mesh>
          </group>
        )}

        {/* ACCESSORY: CAP */}
        {hasCap && (
          <group position={[0, 0.115, 0.01]} rotation={[-0.1, 0, 0]}>
            <mesh castShadow>
              <sphereGeometry args={[0.218, 24, 18, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
              <meshStandardMaterial color={primaryHex} roughness={0.65} />
            </mesh>
            {/* Cap brim */}
            <mesh position={[0, 0.008, 0.18]} rotation={[0.14, 0, 0]} castShadow>
              <boxGeometry args={[0.28, 0.018, 0.22]} />
              <meshStandardMaterial color={accentHex} roughness={0.6} />
            </mesh>
            {/* Crown button */}
            <mesh position={[0, 0.22, 0]}>
              <sphereGeometry args={[0.022, 10, 10]} />
              <meshStandardMaterial color={accentHex} roughness={0.4} />
            </mesh>
          </group>
        )}

        {/* ACCESSORY: EARRINGS */}
        {hasEarrings && (
          <group>
            {isFemale ? (
              <>
                <mesh position={[-0.218, -0.055, 0.01]} rotation={[0, Math.PI / 2, 0]}>
                  <torusGeometry args={[0.032, 0.006, 10, 20]} />
                  <meshStandardMaterial color="#FACC15" roughness={0.2} metalness={0.92} />
                </mesh>
                <mesh position={[0.218, -0.055, 0.01]} rotation={[0, Math.PI / 2, 0]}>
                  <torusGeometry args={[0.032, 0.006, 10, 20]} />
                  <meshStandardMaterial color="#FACC15" roughness={0.2} metalness={0.92} />
                </mesh>
              </>
            ) : (
              <>
                <mesh position={[-0.218, -0.026, 0.01]}>
                  <sphereGeometry args={[0.014, 12, 12]} />
                  <meshStandardMaterial color="#F8FAFC" roughness={0.12} metalness={0.95} />
                </mesh>
                <mesh position={[0.218, -0.026, 0.01]}>
                  <sphereGeometry args={[0.014, 12, 12]} />
                  <meshStandardMaterial color="#F8FAFC" roughness={0.12} metalness={0.95} />
                </mesh>
              </>
            )}
          </group>
        )}
      </group>

      {/* ================= TORSO & OUTFIT ================= */}
      <group ref={torsoRef} position={[0, 1.06, 0]}>
        {/* Main Upper Torso */}
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[torsoTopRadius, torsoBottomRadius, 0.56, 24]} />
          <meshStandardMaterial color={primaryHex} roughness={0.62} />
        </mesh>

        {/* Outfit-specific layered details */}
        {outfitKey === 'corporate' && (
          <group>
            {/* White inner dress shirt V */}
            <mesh position={[0, 0.12, torsoTopRadius * 0.72]}>
              <coneGeometry args={[0.085, 0.26, 4]} />
              <meshStandardMaterial color="#F8FAFC" roughness={0.5} />
            </mesh>
            {/* Power tie (male) or structured lapel accent (female) */}
            {!isFemale ? (
              <mesh position={[0, 0.03, torsoTopRadius * 0.88]}>
                <boxGeometry args={[0.034, 0.32, 0.014]} />
                <meshStandardMaterial color={accentHex} roughness={0.35} />
              </mesh>
            ) : (
              <mesh position={[0, -0.08, torsoTopRadius * 0.8]}>
                <boxGeometry args={[0.09, 0.024, 0.02]} />
                <meshStandardMaterial color={accentHex} roughness={0.3} metalness={0.6} />
              </mesh>
            )}
          </group>
        )}

        {outfitKey === 'smart_casual' && (
          <mesh position={[0, 0.03, torsoTopRadius * 0.76]}>
            <boxGeometry args={[0.11, 0.44, 0.04]} />
            <meshStandardMaterial color="#F8FAFC" roughness={0.65} />
          </mesh>
        )}

        {outfitKey === 'y2k' && (
          <group>
            {/* Bold Y2K athletic chest stripe + number block */}
            <mesh position={[0, 0.07, torsoTopRadius * 0.82]}>
              <boxGeometry args={[torsoTopRadius * 1.45, 0.09, 0.04]} />
              <meshStandardMaterial color={accentHex} roughness={0.45} />
            </mesh>
            <mesh position={[0, -0.08, torsoTopRadius * 0.8]}>
              <boxGeometry args={[0.11, 0.11, 0.03]} />
              <meshStandardMaterial color="#FFFFFF" roughness={0.45} />
            </mesh>
          </group>
        )}

        {outfitKey === 'casual' && (
          <mesh position={[0, 0.255, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.095, 0.022, 10, 24]} />
            <meshStandardMaterial color={accentHex} roughness={0.7} />
          </mesh>
        )}

        {/* ACCESSORY: NECK CHAIN */}
        {hasNeckChain && (
          <group position={[0, 0.25, 0.035]} rotation={[0.45, 0, 0]}>
            <mesh>
              <torusGeometry args={[0.115, 0.012, 10, 28]} />
              <meshStandardMaterial color="#FACC15" roughness={0.2} metalness={0.95} />
            </mesh>
            <mesh position={[0, -0.12, 0.01]}>
              <octahedronGeometry args={[0.024, 0]} />
              <meshStandardMaterial color="#FDE047" roughness={0.15} metalness={0.95} />
            </mesh>
          </group>
        )}

        {/* Pelvis / Skirt / Waist */}
        {isFemale && (outfitKey === 'y2k' || outfitKey === 'corporate') ? (
          <mesh position={[0, -0.34, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[torsoBottomRadius, hipRadius * 1.18, 0.28, 24]} />
            <meshStandardMaterial color={pantsColor} roughness={0.68} />
          </mesh>
        ) : (
          <mesh position={[0, -0.31, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[torsoBottomRadius, hipRadius, 0.18, 24]} />
            <meshStandardMaterial color={pantsColor} roughness={0.7} />
          </mesh>
        )}
      </group>

      {/* ================= ARMS ================= */}
      {/* Left Arm */}
      <group ref={leftArmRef} position={[-shoulderWidth, 1.27, 0]}>
        <mesh position={[0, -0.22, 0]} castShadow>
          <capsuleGeometry args={[0.056, 0.34, 8, 14]} />
          <meshStandardMaterial
            color={outfitKey === 'casual' || outfitKey === 'y2k' ? skinHex : primaryHex}
            roughness={0.62}
          />
        </mesh>
        {/* Sleeve cap */}
        <mesh position={[0, -0.06, 0]} castShadow>
          <capsuleGeometry args={[0.065, 0.14, 8, 14]} />
          <meshStandardMaterial color={primaryHex} roughness={0.62} />
        </mesh>
        {/* Hand */}
        <mesh position={[0, -0.44, 0]} castShadow>
          <sphereGeometry args={[0.052, 14, 14]} />
          <meshStandardMaterial color={skinHex} roughness={0.58} />
        </mesh>
      </group>

      {/* Right Arm */}
      <group ref={rightArmRef} position={[shoulderWidth, 1.27, 0]}>
        <mesh position={[0, -0.22, 0]} castShadow>
          <capsuleGeometry args={[0.056, 0.34, 8, 14]} />
          <meshStandardMaterial
            color={outfitKey === 'casual' || outfitKey === 'y2k' ? skinHex : primaryHex}
            roughness={0.62}
          />
        </mesh>
        {/* Sleeve cap */}
        <mesh position={[0, -0.06, 0]} castShadow>
          <capsuleGeometry args={[0.065, 0.14, 8, 14]} />
          <meshStandardMaterial color={primaryHex} roughness={0.62} />
        </mesh>
        {/* Hand */}
        <mesh position={[0, -0.44, 0]} castShadow>
          <sphereGeometry args={[0.052, 14, 14]} />
          <meshStandardMaterial color={skinHex} roughness={0.58} />
        </mesh>
      </group>

      {/* ================= LEGS & SHOES ================= */}
      {[-0.095, 0.095].map((xPos, idx) => (
        <group key={idx} position={[xPos, 0.42, 0]}>
          <mesh castShadow receiveShadow>
            <capsuleGeometry args={[0.068, 0.56, 8, 14]} />
            <meshStandardMaterial
              color={isFemale && outfitKey === 'y2k' ? skinHex : pantsColor}
              roughness={0.68}
            />
          </mesh>
          {/* Stylish Agency Kicks / Heels */}
          <mesh position={[0, -0.34, 0.04]} castShadow>
            <boxGeometry args={[0.11, 0.09, 0.21]} />
            <meshStandardMaterial
              color={outfitKey === 'corporate' ? '#111827' : '#F8FAFC'}
              roughness={0.35}
            />
          </mesh>
          <mesh position={[0, -0.375, 0.04]}>
            <boxGeometry args={[0.114, 0.024, 0.218]} />
            <meshStandardMaterial color={accentHex} roughness={0.4} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export function CharacterStudio3D({
  displayName,
  gender,
  skinTone,
  hairstyle,
  outfitKey,
  outfitColor,
  accessories,
  trackName,
  unitCode
}: CharacterStudioProps) {
  const [pose, setPose] = useState<StudioPose>('idle');

  const skinHex = getSkinToneHex(skinTone);
  const { hex: primaryHex, accentHex } = getOutfitColorSwatch(outfitColor);
  const reactionKey = `${gender}-${skinTone}-${hairstyle}-${outfitKey}-${outfitColor}-${accessories.join(',')}`;

  return (
    <div className="relative w-full h-[520px] lg:h-[640px] rounded-m3-xl overflow-hidden border border-brand-white/15 bg-gradient-to-b from-brand-charcoal via-brand-charcoal/95 to-brand-charcoal shadow-elevation-4 flex flex-col">
      {/* Warm ambient studio glow behind the character */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 35%, rgba(211,47,47,0.28) 0%, rgba(249,168,37,0.12) 40%, rgba(17,24,39,0) 75%)'
        }}
      />

      {/* Top Studio Header Pill */}
      <div className="relative z-10 flex items-center justify-between px-4 pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-m3-full bg-brand-white/10 border border-brand-white/15 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-[11px] font-display font-semibold tracking-wide text-brand-white/90 uppercase">
            Live 3D Avatar Studio
          </span>
        </div>

        {/* Pose Switcher */}
        <div className="flex items-center gap-1 p-1 rounded-m3-full bg-brand-charcoal/75 border border-brand-white/15 backdrop-blur-md">
          {(
            [
              { id: 'idle', label: 'Idle' },
              { id: 'wave', label: 'Wave' },
              { id: 'pitch', label: 'Pitch' }
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setPose(item.id)}
              className={`px-2.5 py-1 rounded-m3-full text-[11px] font-display font-semibold transition-all cursor-pointer ${
                pose === item.id
                  ? 'bg-primary text-primary-foreground shadow-elevation-1'
                  : 'text-brand-white/70 hover:text-brand-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3D Interactive Viewport */}
      <div className="relative flex-1 w-full">
        <Canvas
          shadows
          dpr={[1, 2]}
          camera={{ position: [0, 0.35, 3.35], fov: 36 }}
          className="w-full h-full cursor-grab active:cursor-grabbing"
        >
          <ambientLight intensity={0.72} />
          <directionalLight position={[2.8, 4.5, 3.2]} intensity={1.45} castShadow />
          <pointLight position={[-2.4, 2.2, -1.5]} intensity={1.8} color="#D32F2F" />
          <pointLight position={[2.4, 1.5, -1.5]} intensity={1.4} color="#F9A825" />

          <StylizedAgencyCharacter
            gender={gender}
            skinHex={skinHex}
            hairstyle={hairstyle}
            outfitKey={outfitKey}
            primaryHex={primaryHex}
            accentHex={accentHex}
            accessories={accessories}
            pose={pose}
            reactionKey={reactionKey}
          />

          {/* Glowing Studio Pedestal */}
          <group position={[0, -1.04, 0]}>
            <mesh receiveShadow>
              <cylinderGeometry args={[0.82, 0.92, 0.12, 40]} />
              <meshStandardMaterial color="#1F2937" roughness={0.35} metalness={0.55} />
            </mesh>
            <Float speed={2} rotationIntensity={0} floatIntensity={0.05}>
              <mesh position={[0, 0.07, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.84, 0.015, 12, 48]} />
                <meshBasicMaterial color="#F9A825" />
              </mesh>
            </Float>
          </group>

          <ContactShadows
            position={[0, -0.97, 0]}
            opacity={0.55}
            scale={3.5}
            blur={2.2}
            far={2.5}
          />

          <OrbitControls
            enablePan={false}
            enableZoom={false}
            minPolarAngle={Math.PI * 0.36}
            maxPolarAngle={Math.PI * 0.54}
          />
        </Canvas>
      </div>

      {/* Bottom Live X3M Employee Badge Overlay */}
      <div className="relative z-10 px-4 pb-4">
        <div className="p-3.5 rounded-m3-lg bg-brand-white/10 border border-brand-white/15 backdrop-blur-md flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[10px] font-display font-bold uppercase tracking-widest text-tertiary">
              X3M Ideas Staff Pass
            </div>
            <div className="text-sm font-display font-bold text-brand-white truncate">
              {displayName.trim() || 'New X3M Creative'}
            </div>
            <div className="text-[11px] font-body text-brand-white/75 truncate">
              {trackName || 'Choose your career track'} · {unitCode || 'BU1'}
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-[10px] font-body text-brand-white/60">Drag to rotate 360°</div>
            <div className="text-[11px] font-display font-semibold text-brand-white/90 capitalize">
              {gender} · {outfitKey.replace('_', ' ')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

