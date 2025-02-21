import { useContentStore } from '@/store/content';
import axiosInstance from '@/utils/axiosInstance';
import { useEffect, useState } from 'react';

const useGetTrendingContent = () => {
  const [trendingContent, setTrendingContent] = useState<any | null>(null);
  const { contentType } = useContentStore();

  useEffect(() => {
    const getTrendingContent = async () => {
      const response = await axiosInstance.get(
        `/api/v1/content/trending?contentType=${contentType}`
      );
      setTrendingContent(response.data.content);
    };
    getTrendingContent();
  }, [contentType]);

  return { trendingContent };
};

export default useGetTrendingContent;
