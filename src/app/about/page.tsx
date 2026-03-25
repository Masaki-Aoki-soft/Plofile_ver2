'use client';

import { NextPage } from 'next';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { AnimatedLeaves } from '../components/leafAnimation';
import { AprilFonts } from '@/../public/fonts/AprilFonts';
import { YasashisaFont } from '@/../public/fonts/YasashisaFonts';
import aboutData from '../data/aboutData.json';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'; // 追加

const AboutPage: NextPage = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.3, delayChildren: 0.2 } },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
    };

    const data = aboutData;

    return (
        <div className="relative md:fixed md:inset-x-0 md:top-16 md:bottom-0 bg-[#1A0F00] text-amber-200 min-h-screen pt-16 md:pt-0 md:min-h-0 md:overflow-hidden">
            {/* 背景の葉のアニメーション */}
            <div className="absolute inset-0 pointer-events-none">
                <AnimatedLeaves />
            </div>

            <motion.main
                className="relative z-10 mx-auto max-w-7xl p-4 sm:p-6 md:p-8 h-full"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div
                    className="grid h-full grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-start"
                    variants={itemVariants}
                >
                    {/* 左側のプロフィールセクション */}
                    <div className="md:col-span-1 flex flex-col items-center space-y-5 md:space-y-6 md:h-full">
                        {/* プロフィール画像 */}
                        <div className="w-40 h-40 sm:w-44 sm:h-44 md:w-48 md:h-48 bg-amber-800 rounded-full flex items-center justify-center shadow-lg">
                            <Image
                                src="/main-icon.png"
                                alt="Main Icon"
                                width={220}
                                height={220}
                                className="rounded-full border-2 border-amber-700 bg-[#8b4513] shadow-lg"
                                priority
                            />
                        </div>

                        {/* 名前と肩書き */}
                        <div className="text-center px-2">
                            <h1 className="flex items-baseline justify-center gap-2 sm:gap-3 flex-wrap">
                                <span
                                    className={`${YasashisaFont.className} text-3xl sm:text-4xl font-bold`}
                                >
                                    青木 雅季
                                </span>
                                <span className="opacity-70 text-2xl sm:text-3xl">/</span>
                                <span
                                    className={`${AprilFonts.className} text-3xl sm:text-4xl font-bold`}
                                >
                                    Masaki Aoki
                                </span>
                            </h1>
                            <p
                                className={`${AprilFonts.className} text-amber-300 text-xl sm:text-2xl mt-1`}
                            >
                                Web & Hard Engineer
                            </p>
                        </div>

                        {/* 誕生日 */}
                        <div className="w-full max-w-xs">
                            <Label htmlFor="birthday" className="mt-2 mb-2 block text-amber-300">
                                Birthday
                            </Label>
                            <Input
                                id="birthday"
                                type="date"
                                value="2004-02-18"
                                readOnly
                                className="w-full bg-transparent border-amber-700/50 text-amber-200 cursor-default focus-visible:ring-0 focus-visible:ring-offset-0"
                            />
                        </div>

                        {/* 自己紹介文 */}
                        <div className="text-base sm:text-lg text-center md:text-left px-2 md:px-0">
                            <p className="leading-relaxed">
                                芝浦工業大学でCSを専攻してます。Webアプリの開発や所属している「鳥人間」という部活動ではマイコンを使った電子回路設計、Androidアプリ開発なんかも担っています。
                                趣味は幼少期から習っているピアノです。
                            </p>
                            <p className="leading-relaxed mt-2">
                                好きな動物はテーマの通り、リスとレッサーパンダです。
                            </p>
                        </div>
                    </div>

                    {/* 右側の経歴セクション (ScrollArea適用) */}
                    <div className="md:col-span-2 flex flex-col h-full overflow-hidden">
                        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 border-b-2 border-amber-500 pb-2">
                            Career
                        </h1>

                        <ScrollArea className="h-full pr-4">
                            <div className="border-l-2 border-amber-700 pl-6 space-y-8 sm:space-y-12 pb-10">
                                {data.map((d, index) => (
                                    <motion.div
                                        key={index}
                                        className="relative"
                                        variants={itemVariants}
                                    >
                                        {/* タイムラインのマーカー */}
                                        <div className="absolute -left-[33px] top-1.5 w-4 h-4 bg-amber-500 rounded-full border-2 border-[#1A0F00]" />

                                        <h3
                                            className={`${YasashisaFont.className} text-xl sm:text-2xl font-semibold`}
                                        >
                                            {d.company}
                                        </h3>
                                        <p className="text-sm sm:text-md text-amber-400 font-medium">
                                            {d.role} ({d.period})
                                        </p>
                                        <p className="mt-2 text-amber-300 leading-relaxed whitespace-pre-wrap">
                                            {d.description}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                            <ScrollBar className="bg-amber-900/30" />
                        </ScrollArea>
                    </div>
                </motion.div>
            </motion.main>
        </div>
    );
};

export default AboutPage;
