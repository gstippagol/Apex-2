import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Confirm', type = 'danger' }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onCancel}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col p-6"
                    >
                        <h3 className={`text-xl font-black mb-2 ${type === 'danger' ? 'text-rose-600' : 'text-blue-600'}`}>
                            {title}
                        </h3>
                        <p className="text-slate-600 font-medium mb-6">
                            {message}
                        </p>
                        <div className="flex items-center justify-end gap-3">
                            <button
                                onClick={onCancel}
                                className="px-5 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onConfirm}
                                className={`px-5 py-2.5 rounded-xl font-bold text-white transition-all shadow-md ${
                                    type === 'danger'
                                        ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
                                        : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20'
                                }`}
                            >
                                {confirmText}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ConfirmModal;
