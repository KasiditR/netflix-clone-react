import Footer from '@/components/Footer';
import HomePage from '@/pages/home/HomePage';
import LoginPage from '@/pages/LoginPage';
import SignUpPage from '@/pages/SignUpPage';
import { useAuthStore } from '@/store/authUser';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router';
import ProtectedRoute from './ProtectedRoute';
import { Loader } from 'lucide-react';
import WatchPage from '@/pages/WatchPage';
import SearchPage from '@/pages/SearchPage';
import HistoryPage from '@/pages/HistoryPage';
import NotFoundPage from './../pages/404';

const routes = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/login',
    element: <ProtectedRoute fallback={<LoginPage />} />,
  },
  {
    path: '/signup',
    element: <ProtectedRoute fallback={<SignUpPage />} />,
  },
  {
    path: '/watch/:id',
    element: (
      <ProtectedRoute
        element={<WatchPage />}
        fallback={<Navigate to={'/login'} />}
      />
    ),
  },
  {
    path: '/search',
    element: (
      <ProtectedRoute
        element={<SearchPage />}
        fallback={<Navigate to={'/login'} />}
      />
    ),
  },
  {
    path: '/history',
    element: (
      <ProtectedRoute
        element={<HistoryPage />}
        fallback={<Navigate to={'/login'} />}
      />
    ),
  },
  {
    path: '/*',
    element: <NotFoundPage />,
  },
]);
const AppRouter = () => {
  const { authCheck, isCheckingAuth } = useAuthStore();
  useEffect(() => {
    authCheck();
  }, [authCheck]);

  if (isCheckingAuth) {
    return (
      <div className="h-screen">
        <div className="flex justify-center items-center bg-black h-full">
          <Loader className="animate-spin text-red-600 size-10" />
        </div>
      </div>
    );
  }

  return (
    <>
      <RouterProvider router={routes} />
      <Footer />
      <Toaster />
    </>
  );
};

export default AppRouter;
