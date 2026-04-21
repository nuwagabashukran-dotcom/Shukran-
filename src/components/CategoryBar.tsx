import { Category } from '../types';
import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CategoryBarProps {
  categories: Category[];
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
}

export default function CategoryBar({ categories, selectedCategoryId, onSelectCategory }: CategoryBarProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftChevron, setShowLeftChevron] = useState(false);
  const [showRightChevron, setShowRightChevron] = useState(true);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftChevron(scrollLeft > 0);
      setShowRightChevron(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    handleScroll();
    window.addEventListener('resize', handleScroll);
    return () => window.removeEventListener('resize', handleScroll);
  }, [categories]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const amount = direction === 'left' ? -300 : 300;
      scrollContainerRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  return (
    <div className="sticky top-14 bg-[#0F0F0F] z-30 flex items-center border-t border-white/10 mt-[-1px]">
      {showLeftChevron && (
        <div className="absolute left-0 h-full flex items-center justify-center pointer-events-none bg-gradient-to-r from-[#0F0F0F] via-[#0F0F0F] to-transparent w-24 z-10 pl-4">
          <button 
            onClick={() => scroll('left')}
            className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center pointer-events-auto"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
        </div>
      )}

      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="px-6 py-3 flex gap-3 overflow-x-auto whitespace-nowrap scrollbar-hide flex-1"
      >
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors h-8 flex items-center
              ${selectedCategoryId === category.id 
                ? 'bg-[#F1F1F1] text-[#0F0F0F]' 
                : 'bg-[#272727] text-[#F1F1F1] hover:bg-[#3F3F3F]'
              }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {showRightChevron && (
        <div className="absolute right-0 h-full flex items-center justify-center pointer-events-none bg-gradient-to-l from-[#0F0F0F] via-[#0F0F0F] to-transparent w-24 z-10 pr-4">
          <button 
            onClick={() => scroll('right')}
            className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center pointer-events-auto"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>
      )}
    </div>
  );
}
