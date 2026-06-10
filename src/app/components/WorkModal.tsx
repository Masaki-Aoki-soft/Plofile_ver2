/* Worksページ専用モーダル */

'use client';

import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface WorkModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export const WorkModal: React.FC<WorkModalProps> = ({ isOpen, onClose, children }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    // ESCキーでモーダルを閉じる
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, [onClose]);

    if (typeof document === 'undefined') {
        return null;
    }

    return ReactDOM.createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
                    <motion.div
                        className="absolute inset-0 bg-black/70"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    />

                    <motion.div
                        ref={modalRef}
                        className="relative w-full max-w-lg p-6 mx-4 bg-[#2a1a0a]/80 backdrop-blur-md text-amber-200 border border-amber-700/50 rounded-lg shadow-lg"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* ×ボタン：absolute配置（通常フロー外） */}
                        <button
                            onClick={onClose}
                            className="cursor-pointer absolute top-4 right-4 z-10 p-2 bg-amber-600/20 hover:bg-amber-600/40 rounded-full transition-colors duration-200 group"
                            aria-label="閉じる"
                        >
                            <X className="w-5 h-5 text-amber-300 group-hover:text-amber-100" />
                        </button>

                        {/*
                          CustomModalと違い、ここではchildrenに右paddingを付けない。
                          画像や説明文をモーダルのフル幅で中央揃えにするため。
                          ×ボタンとの重なり回避はページ側でタイトル(h2)にのみpr-12を付けて対応する。
                        */}
                        {children}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
};
