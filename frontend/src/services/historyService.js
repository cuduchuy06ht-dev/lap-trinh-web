import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Gửi cập nhật tiến độ xem bài giảng lên backend
 * @param {Object} payload { lectureId, progressSeconds, isCompleted }
 */
export const trackWatchProgress = async ({ lectureId, progressSeconds, isCompleted = false }) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${API_BASE_URL}/history/track`,
      {
        lectureId,
        progressSeconds: Math.floor(progressSeconds),
        isCompleted,
      },
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lưu tiến độ học tập:', error);
    try {
      const localHistory = JSON.parse(localStorage.getItem('neu_watch_history') || '{}');
      localHistory[lectureId] = {
        progressSeconds: Math.floor(progressSeconds),
        isCompleted,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem('neu_watch_history', JSON.stringify(localHistory));
    } catch (e) {
      console.warn('Không thể lưu vào localStorage', e);
    }
  }
};
