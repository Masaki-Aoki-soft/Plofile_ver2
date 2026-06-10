/* 3Dモデル表示コンポーネント */

'use client';

import React, { Suspense, useRef, useEffect, useCallback, useState } from 'react';
import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber';
import { useGLTF, useCursor } from '@react-three/drei';
import * as THREE from 'three';
import { type Skill, type SkillCategory } from '@/types/types';

function Model({
    model,
    position,
    onModelClick,
    onLoad,
}: {
    model: Skill;
    position: [number, number, number];
    onModelClick: (skill: Skill) => void;
    onLoad: () => void;
}) {
    const { scene } = useGLTF(model.path);
    const modelRef = useRef<THREE.Group>(null);

    const [hovered, setHovered] = useState(false);
    useCursor(hovered, 'pointer', 'auto');

    useEffect(() => {
        if (scene) onLoad();
    }, [scene, onLoad]);

    useFrame(({ clock }) => {
        if (!modelRef.current) return;
        const t = clock.getElapsedTime();

        const swingDeg = 10;
        const swingSpeed = 0.9;
        const yawAmp = THREE.MathUtils.degToRad(swingDeg);
        modelRef.current.rotation.y = Math.sin(t * swingSpeed + position[0] * 0.35) * yawAmp;

        modelRef.current.position.y = position[1] + Math.sin(t * 0.9 + position[0]) * 0.06;

        modelRef.current.rotation.x = 0;
        modelRef.current.rotation.z = 0;
    });

    return (
        <primitive
            ref={modelRef}
            object={scene}
            scale={1.2}
            position={position}
            onPointerOver={(e: ThreeEvent<PointerEvent>) => {
                e.stopPropagation();
                setHovered(true);
            }}
            onPointerOut={() => setHovered(false)}
            onClick={(e: ThreeEvent<PointerEvent>) => {
                e.stopPropagation();
                onModelClick(model);
            }}
        />
    );
}

function CategoryCanvas({
    category,
    onModelClick,
    onAllModelsLoaded,
    spacingX = 3.4,
    spacingY = 3.0,
    canvasClassName = 'w-full',
    columns = 3,
}: {
    category: SkillCategory;
    onModelClick: (skill: Skill) => void;
    onAllModelsLoaded: () => void;
    spacingX?: number;
    spacingY?: number;
    canvasClassName?: string;
    columns?: number;
}) {
    const loadedCount = useRef(0);

    const handleSingleModelLoad = useCallback(() => {
        loadedCount.current += 1;
        if (loadedCount.current === category.models.length) onAllModelsLoaded();
    }, [category.models.length, onAllModelsLoaded]);

    // 列数から行数を算出（例: 6個 ÷ 2列 = 3行）
    const rows = Math.ceil(category.models.length / columns);

    // columnsに応じてグリッド配置を計算（縦横ともに中央揃え）
    const getPosition = (index: number): [number, number, number] => {
        const row = Math.floor(index / columns);
        const col = index % columns;
        const x = (col - (columns - 1) / 2) * spacingX;
        const y = -(row - (rows - 1) / 2) * spacingY;
        return [x, y, 0];
    };

    // 行数が増える（=縦長になる）場合はカメラを引き、キャンバスも高くする
    const cameraZ = rows >= 3 ? 11.5 : 9;
    const heightClass = rows >= 3 ? 'h-[480px]' : 'h-[350px] md:h-[400px]';

    return (
        <div className={`mx-auto ${canvasClassName} ${heightClass}`}>
            <Canvas camera={{ position: [0, 0, cameraZ], fov: 50 }}>
                <ambientLight intensity={2.5} />
                <directionalLight position={[5, 5, 5]} intensity={4} />
                <Suspense fallback={null}>
                    {category.models.map((model, index) => (
                        <Model
                            key={model.name}
                            model={model}
                            position={getPosition(index)}
                            onModelClick={onModelClick}
                            onLoad={handleSingleModelLoad}
                        />
                    ))}
                </Suspense>
            </Canvas>
        </div>
    );
}

export default function MultiCanvasViewer({
    categories,
    onModelClick,
    onAllModelsLoaded,
    gridClassName = 'grid-cols-1 md:grid-cols-2',
    modelSpacingX = 3.4,
    modelSpacingY = 3.0,
    canvasClassName = 'w-full',
    cardClassName = 'w-full',
    columns = 3,
}: {
    categories: SkillCategory[];
    onModelClick: (skill: Skill) => void;
    onAllModelsLoaded: () => void;
    gridClassName?: string;
    modelSpacingX?: number;
    modelSpacingY?: number;
    canvasClassName?: string;
    cardClassName?: string;
    columns?: number;
}) {
    return (
        <div className={`grid ${gridClassName} gap-6 w-full`}>
            {categories.map((category) => (
                <div
                    key={category.title}
                    className={`bg-[#2a1a0a]/60 rounded-xl p-4 mx-auto ${cardClassName}`}
                >
                    <h2 className="text-center text-amber-300 text-xl font-bold mb-2">
                        {category.title}
                    </h2>
                    <CategoryCanvas
                        category={category}
                        onModelClick={onModelClick}
                        onAllModelsLoaded={onAllModelsLoaded}
                        spacingX={modelSpacingX}
                        spacingY={modelSpacingY}
                        canvasClassName={canvasClassName}
                        columns={columns}
                    />
                </div>
            ))}
        </div>
    );
}
