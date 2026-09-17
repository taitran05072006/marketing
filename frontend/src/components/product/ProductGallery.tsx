import { useState } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

interface ProductGalleryProps {
  imageUrls: string[];
  productName: string;
}

export function ProductGallery({ imageUrls, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});

  const validImages = imageUrls.filter(Boolean);

  const handlePrev = () => setActiveIndex((i) => Math.max(0, i - 1));
  const handleNext = () => setActiveIndex((i) => Math.min(validImages.length - 1, i + 1));

  const handleImgError = (index: number) => {
    setImgErrors((prev) => ({ ...prev, [index]: true }));
  };

  const renderImage = (url: string, index: number, className: string) => {
    if (imgErrors[index] || !url) {
      return (
        <div className={`${className} flex items-center justify-center text-gray-300 bg-surface`}>
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      );
    }
    return (
      <img
        src={url}
        alt={`${productName} - Ảnh ${index + 1}`}
        className={`${className} object-cover`}
        onError={() => handleImgError(index)}
        loading="lazy"
      />
    );
  };

  if (validImages.length === 0) {
    return (
      <div className="aspect-square rounded-2xl bg-surface flex items-center justify-center text-gray-300">
        <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-surface group">
        {renderImage(validImages[activeIndex], activeIndex, 'w-full h-full')}

        {validImages.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              disabled={activeIndex === 0}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-30"
            >
              <ChevronLeft className="w-5 h-5 text-primary" />
            </button>
            <button
              onClick={handleNext}
              disabled={activeIndex === validImages.length - 1}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-30"
            >
              <ChevronRight className="w-5 h-5 text-primary" />
            </button>
          </>
        )}

        <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <ZoomIn className="w-4 h-4 text-primary" />
        </div>
      </div>

      {/* Thumbnails */}
      {validImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {validImages.map((url, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={[
                'flex-none w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors',
                activeIndex === index ? 'border-primary' : 'border-border hover:border-primary/40',
              ].join(' ')}
            >
              {renderImage(url, index, 'w-full h-full')}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
