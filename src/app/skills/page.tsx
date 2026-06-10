/* skillsページ */

'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { AnimatedLeaves } from '../components/leafAnimation';
import { CustomModal } from '../components/CustomModal';
import Loading from '../loading';
import { motion } from 'framer-motion';
import skillData from '../data/skillsData.json';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import { useSkillsContext } from '../context/SkillsContext';
import { YasashisaFont } from '../../../public/fonts/YasashisaFonts';

// スキルの型定義
export interface Skill {
    name: string;
    path: string;
    description: string;
}

// スキルカテゴリの型定義
export interface SkillCategory {
    title: string;
    models: Skill[];
}

// MultiCanvasViewerコンポーネントのプロパティの型定義
type MultiCanvasViewerProps = {
    categories: SkillCategory[];
    onModelClick: (skill: Skill) => void;
    onAllModelsLoaded: () => void;
    gridClassName?: string;
    modelSpacingX?: number;
    modelSpacingY?: number;
    canvasClassName?: string;
    cardClassName?: string;
    columns?: number; // 1行あたりのモデル数（レスポンシブ切替用）
};

// 3Dモデルビューアを動的にインポート（クライアントサイドでのみレンダリング）
const MultiCanvasViewer = dynamic<MultiCanvasViewerProps>(
    () => import('../components/MultiModelViewer').then((m) => m.default),
    { ssr: false, loading: () => <div className="w-full h-[350px] md:h-[400px]" /> } // ロード中は空のdivを表示
);

/**
 * 画面幅がモバイルサイズかどうかを判定するカスタムフック
 * @param breakpoint 境界となる幅（px）デフォルトはTailwindのsm（640px）
 */
const useIsMobile = (breakpoint = 640) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
        // 初期値を設定
        setIsMobile(mediaQuery.matches);
        // 画面幅の変化を監視
        const handleChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [breakpoint]);

    return isMobile;
};

/**
 * Skillsページコンポーネント
 * @returns {JSX.Element}
 */
const SkillsPage: NextPage = () => {
    // スキルコンテキストからロード状態とセッターを取得
    const { areSkillsLoaded, setSkillsLoaded } = useSkillsContext();
    // 選択されたスキルを管理するstate
    const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
    // ロード済みのカテゴリ数を管理するstate
    const [loadedCategories, setLoadedCategories] = useState(0);
    const totalCategories = skillData.length; // 全カテゴリ数
    // モバイル判定（640px未満）
    const isMobile = useIsMobile();

    // カテゴリがロードされるたびにカウントを増やすコールバック関数
    const handleCategoryLoad = useCallback(() => {
        setLoadedCategories((prev) => prev + 1);
    }, []);

    // 全てのカテゴリがロードされたら、スキルロード完了状態をtrueにする
    useEffect(() => {
        if (loadedCategories >= totalCategories) {
            setSkillsLoaded(true);
        }
    }, [loadedCategories, totalCategories, setSkillsLoaded]);

    // 3Dモデルがクリックされたときのハンドラ
    const handleModelClick = (skill: Skill) => setSelectedSkill(skill);

    return (
        <>
            {/* スキルがロードされていない間はローディング画面を表示 */}
            {!areSkillsLoaded && <Loading />}

            {/* メインコンテンツ（ロード完了後に表示） */}
            <main
                style={{
                    opacity: areSkillsLoaded ? 1 : 0, // ロード状態で透明度を制御
                    pointerEvents: areSkillsLoaded ? 'auto' : 'none', // ロード状態で操作可否を制御
                    transition: 'opacity 0.5s ease-in-out',
                }}
                className="relative flex flex-col items-center px-6 mt-10 h-full w-full"
            >
                {/* 背景の葉のアニメーション */}
                <div className="absolute top-0 left-0 w-full h-full">
                    <AnimatedLeaves />
                </div>

                {/* ページタイトル */}
                <div className="text-center z-10 mb-12">
                    <h1
                        className={`${YasashisaFont.className} text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 text-transparent bg-clip-text`}
                    >
                        Skills
                    </h1>
                    <p className="mt-2 text-lg text-amber-300/80">
                        スキル一覧（※クリックで詳細を表示）
                    </p>
                </div>

                {/* スキルカルーセル */}
                <div className="z-10 w-full max-w-5xl">
                    <Carousel
                        opts={{ align: 'start', slidesToScroll: 1, loop: false }}
                        className="relative w-full overflow-visible"
                    >
                        <CarouselContent className="-ml-4">
                            {skillData.map((category) => (
                                <CarouselItem key={category.title} className="pl-4 basis-full">
                                    {/* 各カテゴリの3Dモデルビューア */}
                                    {/* key={isMobile ? 'm' : 'd'} で列数切替時に再マウントさせて再配置を確実にする */}
                                    <MultiCanvasViewer
                                        key={isMobile ? 'mobile' : 'desktop'}
                                        categories={[category]}
                                        onModelClick={handleModelClick}
                                        onAllModelsLoaded={handleCategoryLoad}
                                        gridClassName="grid-cols-1 w-full"
                                        cardClassName="w-full sm:w-[80%] max-w-[620px]"
                                        canvasClassName="w-full"
                                        columns={isMobile ? 2 : 3} // スマホ: 2列×3行 / PC: 3列×2行
                                    />
                                </CarouselItem>
                            ))}
                        </CarouselContent>

                        {/* カルーセルのナビゲーションボタン */}
                        <div className="pointer-events-none absolute inset-0 z-20 flex">
                            <div className="relative mx-auto h-full w-full sm:w-[80%] max-w-[620px]">
                                {/* 前へボタン */}
                                {/*
                                  Tailwindはモバイルファーストなので、ベース（無印）がスマホに適用される。
                                  修正前は -left-16 がベースだったため、スマホで画面外に出て見えなくなっていた。
                                  ベースを left-1（画面内）にし、画面が広くなるにつれて外側へ移動させる。
                                */}
                                <motion.div
                                    className="pointer-events-auto absolute left-1 sm:-left-4 md:-left-16 top-1/2 -translate-y-1/2"
                                    animate={{ x: [-4, 0, -4] }} // 左右に揺れるアニメーション
                                    transition={{
                                        repeat: Infinity,
                                        duration: 1.8,
                                        ease: 'easeInOut',
                                    }}
                                >
                                    <CarouselPrevious className="static cursor-pointer bg-[#2a1a0a]/80 border-amber-700/50 text-amber-300 hover:bg-[#3a2a1a]/80 disabled:opacity-30 disabled:cursor-default" />
                                </motion.div>

                                {/* 次へボタン */}
                                <motion.div
                                    className="pointer-events-auto absolute right-1 sm:-right-4 md:-right-16 top-1/2 -translate-y-1/2"
                                    animate={{ x: [4, 0, 4] }} // 左右に揺れるアニメーション
                                    transition={{
                                        repeat: Infinity,
                                        duration: 1.8,
                                        ease: 'easeInOut',
                                    }}
                                >
                                    <CarouselNext className="static cursor-pointer bg-[#2a1a0a]/80 border-amber-700/50 text-amber-300 hover:bg-[#3a2a1a]/80 disabled:opacity-30 disabled:cursor-default" />
                                </motion.div>
                            </div>
                        </div>
                    </Carousel>
                </div>

                {/* スキル詳細モーダル */}
                <CustomModal isOpen={!!selectedSkill} onClose={() => setSelectedSkill(null)}>
                    {selectedSkill && (
                        <div>
                            {/* pr-12: absolute配置の×ボタンとタイトルが重ならないように右側に余白を確保 */}
                            <h2 className="text-amber-300 text-2xl font-bold pr-12">
                                {selectedSkill.name}
                            </h2>
                            <p className="text-amber-300/90 pt-4">{selectedSkill.description}</p>
                        </div>
                    )}
                </CustomModal>
            </main>
        </>
    );
};

export default SkillsPage;
