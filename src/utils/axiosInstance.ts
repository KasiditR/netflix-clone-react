import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: 'https://netflix-clone-go-gin-api.onrender.com',
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let refreshSubscribers: (() => void)[] = [];

const addRefreshSubscriber = (callback: () => void) => {
  refreshSubscribers.push(callback);
};

const onTokenRefreshed = () => {
  refreshSubscribers.forEach(callback => callback());
  refreshSubscribers = [];
};

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    const errorMessage = (error.response?.data as { message?: string })?.message;

    if (errorMessage === 'AUTH_ERROR' && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const refreshToken = localStorage.getItem('refreshToken');
          await axiosInstance.post(
            '/refresh',
            { refreshToken },
            { withCredentials: true }
          );

          onTokenRefreshed();
        } catch (refreshError) {
          console.error('Token refresh failed, logging out...');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return new Promise(resolve => {
        addRefreshSubscriber(() => {
          resolve(axiosInstance(originalRequest));
        });
      });
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
