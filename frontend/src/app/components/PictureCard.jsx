import React from 'react';

function PictureCard({ url, alt = 'Photo' }) {
    return (
        <div
            className="relative aspect-[3/4] w-full max-w-xs mx-auto
                rounded-2xl overflow-hidden shadow-lg
                bg-blue-300 dark:bg-zinc-950 opacity-75
                border-2 border-zinc-50 dark:border-zinc-950
                shadow-md hover:shadow-2xl transition-shadow duration-150
                hover:scale-105 transform transition-transform
                flex items-center justify-center"
        >
            {url ? (
                <img
                    src={url}
                    alt={alt}
                    className="object-cover w-full h-full"
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-lg">
                    No Image
                </div>
            )}
        </div>
    );
}

export default PictureCard;
