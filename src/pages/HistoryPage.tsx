import Navbar from '@/components/Navbar';
import axiosInstance from '@/utils/axiosInstance';
import { SMALL_IMAGE_BASE_URL } from '@/utils/constant';
import { formatDate } from '@/utils/dateFunction';
import { Trash } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const HistoryPage = () => {
  const [searchHistory, setSearchHistory] = useState([]);

  useEffect(() => {
    const getSearchHistory = async () => {
      try {
        const response = await axiosInstance.get(`/api/v1/search/history`);
        setSearchHistory(response.data.history);
      } catch (error: any) {
        setSearchHistory([]);
      }
    };

    getSearchHistory();
  }, []);

  const handleDelete = async (entry: any) => {
    try {
      await axiosInstance.delete(`/api/v1/search/remove/${entry.id}`);
      setSearchHistory(
        searchHistory.filter((item: any) => item.id !== entry.id)
      );
    } catch (error: any) {
      toast.error('Failed to delete search item');
    }
  };

  const handleClearHistory = async () => {
    try {
      await axiosInstance.delete(`/api/v1/search/clear`);
      setSearchHistory([]);
    } catch (error: any) {
      toast.error('Failed to delete search item');
    }
  };

  if (searchHistory.length === 0) {
    return (
      <div className="bg-black min-h-screen text-white">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Search History</h1>
          <div className="flex justify-center items-center h-96">
            <p className="text-xl">No search history found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between">
          <h1 className="text-3xl font-bold mb-8">Search History</h1>
          <button
            className="hover:underline"
            onClick={() => handleClearHistory()}
          >
            Clear All
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {searchHistory.map((entry: any) => (
            <div
              key={entry.id}
              className="bg-gray-800 p-4 rounded flex items-start"
            >
              <img
                src={SMALL_IMAGE_BASE_URL + entry.image}
                alt="History image"
                className="size-16 rounded-full object-cover mr-4"
              />
              <div className="flex flex-col">
                <span className="text-white text-lg">{entry.title}</span>
                <span className="text-gray-400 text-sm">
                  {formatDate(entry.createdAt)}
                </span>
              </div>

              <span
                className={`py-1 px-3 min-w-10 text-center rounded-full text-sm ml-auto ${
                  entry.searchType === 'movie'
                    ? 'bg-red-600'
                    : entry.searchType === 'tv'
                    ? 'bg-blue-600'
                    : 'bg-green-600'
                }`}
              >
                {entry.searchType[0].toUpperCase() + entry.searchType.slice(1)}
              </span>
              <Trash
                className="size-5 ml-4 cursor-pointer hover:fill-red-600 hover:text-red-600"
                onClick={() => handleDelete(entry)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
