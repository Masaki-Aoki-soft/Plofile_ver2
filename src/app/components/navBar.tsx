/* ナビゲーションバーコンポーネント */

'use client';

import React, { useEffect, useState } from 'react';
import {
    Home,
    Laptop,
    ContactRound,
    BookText,
    Phone,
    Menu,
    X,
    Github,
    Instagram,
} from 'lucide-react';
import { NabvarIcon } from './Icons/NavbarIcon';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, Variants } from 'framer-motion';

interface NavItemProps {
    Link: string;
    Display: string;
    Icon: React.ReactNode;
    Title: string;
}

type SocialItem = {
    href: string;
    label: string;
    Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

export const Navbar = () => {
    const pathname: string = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    // 背景フェード
    const overlayVariants: Variants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { duration: 0.15 } },
        exit: { opacity: 0, transition: { duration: 0.15 } },
    };
    // シート（中身）ドロップ
    const sheetVariants: Variants = {
        hidden: { y: -8, opacity: 0 },
        show: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.22,
                ease: [0.22, 1, 0.36, 1],
                when: 'beforeChildren',
                staggerChildren: 0.04,
            },
        },
        exit: { y: -8, opacity: 0, transition: { duration: 0.18, ease: [0.4, 0, 0.2, 1] } },
    };
    // 項目のふわっと出現
    const itemVariants: Variants = {
        hidden: { y: -6, opacity: 0 },
        show: { y: 0, opacity: 1, transition: { duration: 0.18 } },
        exit: { y: -6, opacity: 0, transition: { duration: 0.12 } },
    };

    const ManuItems: NavItemProps[] = [
        { Link: '/', Display: 'Home', Icon: <Home className="w-4 h-4" />, Title: 'Home　　' },
        {
            Link: '/about',
            Display: 'About',
            Icon: <ContactRound className="w-4 h-4" />,
            Title: 'About',
        },
        {
            Link: '/skills',
            Display: 'Skills',
            Icon: <Laptop className="w-4 h-4" />,
            Title: 'Skills　',
        },
        {
            Link: '/works',
            Display: 'works',
            Icon: <BookText className="w-4 h-4" />,
            Title: 'Works　　',
        },
        {
            Link: '/contact',
            Display: 'contact',
            Icon: <Phone className="w-4 h-4" />,
            Title: 'Contact',
        },
    ];

    const SocialItems: SocialItem[] = [
        { href: 'https://github.com/Masaki-Aoki-soft', label: 'GitHub', Icon: Github },
        {
            href: 'https://www.instagram.com/ma_sa.0218/?next=%2F',
            label: 'Instagram',
            Icon: Instagram,
        },
    ];

    const isActive = (link: string) => pathname === link;
    const getCurrentPageTitle = () => ManuItems.find((i) => i.Link === pathname)?.Title ?? '';

    // ルート遷移で閉じる
    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

    const iconBtn =
        'p-2 rounded-lg text-amber-200 hover:text-amber-100/90 hover:bg-[#8b4513]/50 transition-colors';

    return (
        <>
            {/* ナビ本体（常に z-50 で最前面） */}
            <nav className="bg-[#1A0F00]/50 backdrop-blur-md shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* 左：ロゴ＋現在ページ名 */}
                        <div className="flex items-center space-x-3">
                            <div className="flex items-center justify-center w-10 h-10 rounded-lg">
                                <NabvarIcon />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 text-transparent bg-clip-text">
                                {getCurrentPageTitle()}
                            </span>
                        </div>

                        {/* 中央：PC用ナビ */}
                        <div className="hidden md:flex items-center space-x-1">
                            {ManuItems.map((item) => (
                                <a
                                    key={item.Link}
                                    href={item.Link}
                                    className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                        isActive(item.Link)
                                            ? 'bg-[#8b4513] text-amber-200'
                                            : 'text-amber-200 hover:text-amber-200 hover:bg-[#8b4513]/50'
                                    }`}
                                >
                                    {item.Icon}
                                    <span className="ml-2">{item.Display}</span>
                                </a>
                            ))}
                        </div>

                        {/* 右：PC 外部リンク */}
                        <div className="hidden md:flex items-center gap-2">
                            {SocialItems.map(({ href, label, Icon }) => (
                                <a
                                    key={href}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={label}
                                    className={iconBtn}
                                    title={label}
                                >
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>

                        {/* 右：モバイル（ハンバーガー） */}
                        <div className="md:hidden flex items-center">
                            <motion.button
                                aria-label="Open menu"
                                aria-expanded={mobileOpen}
                                aria-controls="mobile-menu"
                                onClick={() => setMobileOpen((v) => !v)}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center justify-center w-10 h-10 text-amber-200 hover:text-amber-100/80 hover:bg-amber-50/10 rounded-lg transition-all duration-200"
                            >
                                <AnimatePresence mode="wait" initial={false}>
                                    {mobileOpen ? (
                                        <motion.span
                                            key="x"
                                            initial={{ rotate: -90, opacity: 0 }}
                                            animate={{ rotate: 0, opacity: 1 }}
                                            exit={{ rotate: 90, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <X className="w-5 h-5" />
                                        </motion.span>
                                    ) : (
                                        <motion.span
                                            key="menu"
                                            initial={{ rotate: 90, opacity: 0 }}
                                            animate={{ rotate: 0, opacity: 1 }}
                                            exit={{ rotate: -90, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <Menu className="w-5 h-5" />
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </motion.button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* モバイルメニュー・オーバーレイ（navの“外”＝兄弟として描画） */}
            <AnimatePresence initial={false}>
                {mobileOpen && (
                    <motion.div
                        key="overlay"
                        variants={overlayVariants}
                        initial="hidden"
                        animate="show"
                        exit="exit"
                        className="fixed inset-x-0 top-16 bottom-0 z-40 md:hidden bg-[#1A0F00]/60 backdrop-blur-sm"
                        onClick={() => setMobileOpen(false)} // 背景クリックで閉じる
                    >
                        <motion.div
                            variants={sheetVariants}
                            className="pointer-events-auto border-t border-amber-700/40 bg-[#2a1a0a]/90 shadow-xl"
                            onClick={(e) => e.stopPropagation()} // 中身クリックは閉じない
                        >
                            <div className="px-4 py-3 space-y-2 max-h-[calc(100vh-4rem)] overflow-auto">
                                {/* ナビ項目 */}
                                <div className="flex flex-col gap-1">
                                    {ManuItems.map((item) => (
                                        <motion.a
                                            key={item.Link}
                                            href={item.Link}
                                            onClick={() => setMobileOpen(false)}
                                            variants={itemVariants}
                                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                isActive(item.Link)
                                                    ? 'bg-[#8b4513] text-amber-200'
                                                    : 'text-amber-200 hover:text-amber-100 hover:bg-[#8b4513]/40'
                                            }`}
                                        >
                                            {item.Icon}
                                            <span>{item.Display}</span>
                                        </motion.a>
                                    ))}
                                </div>

                                <div className="my-2 h-px bg-amber-700/30" />

                                {/* 外部リンク */}
                                <div className="flex items-center gap-3">
                                    {SocialItems.map(({ href, label, Icon }) => (
                                        <motion.a
                                            key={href}
                                            href={href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={() => setMobileOpen(false)}
                                            variants={itemVariants}
                                            className={iconBtn}
                                            aria-label={label}
                                            title={label}
                                        >
                                            <Icon className="w-5 h-5" />
                                        </motion.a>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
