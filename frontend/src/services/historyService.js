import api from "./api";

/**
 * Gửi cập nhật tiến độ xem bài giảng lên backend
 * @param {Object} payload { lectureId, progressSeconds, isCompleted }
 */
export const trackWatchProgress = async ({ lectureId, progressSeconds, isCompleted = false }) => {
  try {
    const response = await api.post("/history/track", {
        lectureId,
        progressSeconds: Math.floor(progressSeconds),
        isCompleted,
      });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lưu tiến độ học tập:', error);
    throw error;
  }
};
