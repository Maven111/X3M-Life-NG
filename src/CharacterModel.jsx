import React, { useMemo, useEffect, useState } from 'react';
import * as THREE from 'three';
import { FBXLoader } from 'three-stdlib';

export function CharacterModel({ url, onModelLoaded, onError }) {
  const [model, setModel] = useState(null);
  const [loadProgress, setLoadProgress] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const loader = new FBXLoader();

    setLoadProgress(0);
    loader.load(
      url,
      (fbx) => {
        if (!isMounted) return;

        // Inspect model properties without altering original geometry/skeleton/materials
        let meshCount = 0;
        let skinnedMeshCount = 0;
        let boneCount = 0;
        const materialsList = new Set();

        fbx.traverse((child) => {
          if (child.isMesh) {
            meshCount++;
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.isSkinnedMesh) {
              skinnedMeshCount++;
            }
            if (Array.isArray(child.material)) {
              child.material.forEach((m) => materialsList.add(m.name || 'unnamed'));
            } else if (child.material) {
              materialsList.add(child.material.name || 'unnamed');
            }
          }
          if (child.isBone) {
            boneCount++;
          }
        });

        // Compute original bounding box
        const bbox = new THREE.Box3().setFromObject(fbx);
        const size = new THREE.Vector3();
        bbox.getSize(size);
        const center = new THREE.Vector3();
        bbox.getCenter(center);

        const stats = {
          meshCount,
          skinnedMeshCount,
          boneCount,
          materials: Array.from(materialsList),
          size: { x: size.x, y: size.y, z: size.z },
          center: { x: center.x, y: center.y, z: center.z },
          rawBbox: { min: bbox.min, max: bbox.max }
        };

        setModel(fbx);
        if (onModelLoaded) onModelLoaded(stats, fbx);
      },
      (xhr) => {
        if (xhr.lengthComputable && xhr.total > 0) {
          const percent = Math.round((xhr.loaded / xhr.total) * 100);
          setLoadProgress(percent);
        } else if (xhr.loaded > 0) {
          // If total is not provided, track loaded MB
          const loadedMB = (xhr.loaded / (1024 * 1024)).toFixed(1);
          setLoadProgress(loadedMB);
        }
      },
      (err) => {
        console.error('FBXLoader error:', err);
        if (onError) onError(err);
      }
    );

    return () => {
      isMounted = false;
    };
  }, [url]);

  if (!model) {
    return null;
  }

  return <primitive object={model} />;
}

