import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

interface ImageGalleryProps {
    images: string[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    const openImage = (index: number) => setSelectedIndex(index);
    const closeImage = () => setSelectedIndex(null);

    const showNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedIndex((prev) => (prev !== null ? (prev + 1) % images.length : null));
    };

    const showPrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedIndex((prev) => (prev !== null ? (prev - 1 + images.length) % images.length : null));
    };

    const getImageUrl = (src: string) => {
        if (!src) return '';
        if (src.startsWith('http')) return src;

        // More robust way to get base URL without complex regex in one line
        let apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        let baseUrl = apiUrl.endsWith('/api') ? apiUrl.slice(0, -4) : apiUrl;

        const path = src.startsWith('/') ? src : `/${src}`;
        return `${baseUrl}${path}`;
    };

    return (
        <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Issue Photos</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {images.map((src, index) => (
                    <motion.div
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => openImage(index)}
                        className="aspect-square rounded-xl overflow-hidden border border-gray-200 cursor-zoom-in relative group"
                    >
                        <img
                            src={getImageUrl(src)}
                            alt={`Issue ${index + 1}`}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Maximize2 className="w-6 h-6 text-white" />
                        </div>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence>
                {selectedIndex !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-10"
                        onClick={closeImage}
                    >
                        <button
                            onClick={closeImage}
                            className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors z-[110]"
                        >
                            <X className="w-8 h-8" />
                        </button>

                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={showPrev}
                                    className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all z-[110]"
                                >
                                    <ChevronLeft className="w-8 h-8" />
                                </button>
                                <button
                                    onClick={showNext}
                                    className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all z-[110]"
                                >
                                    <ChevronRight className="w-8 h-8" />
                                </button>
                            </>
                        )}

                        <motion.img
                            key={selectedIndex}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            src={getImageUrl(images[selectedIndex])}
                            alt="Enlarged issue"
                            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        />

                        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/60 text-sm font-medium">
                            {selectedIndex + 1} / {images.length}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ImageGallery;
