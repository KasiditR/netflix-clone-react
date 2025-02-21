import { useContentStore } from '@/store/content';
import axiosInstance from '@/utils/axiosInstance';
import { SMALL_IMAGE_BASE_URL } from '@/utils/constant';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';

type MovieSliderProps = {
  category: string;
};

const MovieSlider = ({ category }: MovieSliderProps) => {
  const { contentType } = useContentStore();
  const [contentStore, setContentStore] = useState([]);

  const sliderRef = useRef<HTMLDivElement | null>(null);

  const formattedContentName =
    category.replace('_', ' ')[0].toUpperCase() +
    category.replace('_', ' ').slice(1);
  const formattedContentType = contentType === 'movie' ? 'Movies' : 'TV Shows';

  useEffect(() => {
    const getContent = async () => {
      const response = await axiosInstance.get(
        `/api/v1/content/category?contentType=${contentType}&category=${category}`
      );
      setContentStore(response.data.contents);
    };

    getContent();
  }, [contentType, category]);

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: -sliderRef.current.offsetWidth,
        behavior: 'smooth',
      });
    }
  };
  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: sliderRef.current.offsetWidth,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="bg-black text-white relative px-5 md:px-20">
      <h2 className="mb-4 text-2xl font-bold">
        {formattedContentName} {formattedContentType}
      </h2>

      <div
        className="flex space-x-4 overflow-x-scroll scrollbar-hide"
        ref={sliderRef}
      >
        {contentStore.map((item: any) => (
          <Link
            to={`/watch/${item.id}`}
            key={item.id}
            className="min-w-[250px] relative group"
          >
            <div className="rounded-lg overflow-hidden">
              <img
                src={SMALL_IMAGE_BASE_URL + item.backdrop_path}
                alt="Movie image"
                className="transition-transform duration-300 ease-in-out group-hover:scale-125"
              />
            </div>
            <p className="mt-2 text-center">{item?.title || item?.name}</p>
          </Link>
        ))}
      </div>
      <button
        className="absolute top-1/2 -translate-y-1/2 left-5 md:left-24 flex items-center justify-center size-12 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 text-white z-10"
        onClick={scrollLeft}
      >
        <ChevronLeft size={24} />
      </button>
      <button
        className="absolute top-1/2 -translate-y-1/2 right-5 md:right-24 flex items-center justify-center size-12 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 text-white z-10"
        onClick={scrollRight}
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
};

export default MovieSlider;
