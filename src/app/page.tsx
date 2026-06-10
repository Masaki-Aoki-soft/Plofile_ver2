/* ダッシュボードページ */

'use client';

import React from 'react';
import { NextPage } from 'next';
import { AnimatedLeaves } from './components/leafAnimation';
import Image from 'next/image';
import { TextAnimate } from '@/components/magicui/text-animate';
import { AprilFonts } from '@/../public/fonts/AprilFonts';
import { YasashisaFont } from '@/../public/fonts/YasashisaFonts';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { motion } from 'framer-motion';
import profileData from './data/profileData.json';

/**
 * @returns {JSX.Element}
 */

const DashBoardPage: NextPage = () => {
    // 各ページへのリンク情報を定義
    const pages = [
        { title: 'About', desc: '自己紹介や経歴を掲載しています。', href: '/about' },
        { title: 'Skills', desc: 'プログラミングや技術スキルの一覧。', href: '/skills' },
        { title: 'Works', desc: '制作した作品やプロジェクトの紹介。', href: '/works' },
        { title: 'Contact', desc: 'お問い合わせはこちらから。', href: '/contact' },
    ];

    return (
        <main className="flex flex-col items-center px-6 pt-28 pb-12">
            {/* 背景の葉のアニメーション */}
            <AnimatedLeaves />

            {/* プロフィールセクション */}
            <section className="flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-12 w-full max-w-5xl">
                {/* プロフィール画像 */}
                <div className="flex w-full justify-center lg:justify-start lg:basis-1/4 lg:shrink-0">
                    <div className="relative w-40 h-40 sm:w-44 sm:h-44 md:w-52 md:h-52 lg:w-56 lg:h-56 aspect-square">
                        <Image
                            src="/sub-icon.png"
                            alt="Sub Icon"
                            fill
                            className="rounded-full border-2 border-amber-700 bg-[#8b4513] shadow-lg object-cover" // object-coverで比率を維持して切り抜き
                            priority
                        />
                    </div>
                </div>

                {/* プロフィール情報 */}
                <div className="flex flex-col gap-4 text-center lg:text-left lg:basis-3/4 lg:flex-1">
                    {/* 名前（英語と日本語） */}
                    <div className="text-amber-200 text-4xl md:text-5xl flex flex-wrap justify-center lg:justify-start items-baseline gap-2">
                        <span className={AprilFonts.className}>
                            {/* テキストアニメーション（ブラーインアップ） */}
                            <TextAnimate animation="blurInUp" by="character" once>
                                {`${profileData.nameEn} /`}
                            </TextAnimate>
                        </span>
                        <span className={`${YasashisaFont.className}`}>
                            <TextAnimate animation="blurInUp" by="character" once>
                                {profileData.nameJa}
                            </TextAnimate>
                        </span>
                    </div>

                    {/* 所属大学 */}
                    <div
                        className={`text-amber-200 text-xl md:text-2xl ${YasashisaFont.className}`}
                    >
                        <TextAnimate animation="blurInUp" by="character" once>
                            {profileData.affiliation}
                        </TextAnimate>
                    </div>

                    {/* 専攻と研究室 */}
                    <div
                        className={`text-amber-200 text-lg md:text-2xl ${YasashisaFont.className}`}
                    >
                        <TextAnimate animation="blurInUp" by="character" once>
                            {profileData.majorAndLab}
                        </TextAnimate>
                    </div>
                </div>
            </section>

            {/* ナビゲーションカードセクション */}
            <section className="mt-12 w-full max-w-5xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pages.map((page, idx) => (
                        <Link key={idx} href={page.href} className="group block">
                            {/* ホバー時に浮き上がるアニメーション */}
                            <motion.div
                                whileHover={{ y: -6 }}
                                whileTap={{ y: -2 }}
                                transition={{
                                    type: 'spring',
                                    stiffness: 320,
                                    damping: 22,
                                    mass: 0.35,
                                }}
                                className="h-full will-change-transform"
                            >
                                <Card className="bg-[#2a1a0a] text-amber-200 border-none shadow-md hover:bg-[#3a2612] transition">
                                    <CardHeader>
                                        <CardTitle className="text-lg md:text-xl font-bold">
                                            {page.title}
                                        </CardTitle>
                                        <CardDescription className="text-amber-100 text-sm md:text-base">
                                            {page.desc}
                                        </CardDescription>
                                    </CardHeader>
                                </Card>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </section>
        </main>
    );
};

export default DashBoardPage;
