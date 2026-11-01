import api from "./api";

export const getBookmarks = async () => (await api.get("/bookmarks")).data;
export const addBookmark = async (lectureId) => (await api.post(`/bookmarks/${lectureId}`)).data;
export const removeBookmark = async (lectureId) => api.delete(`/bookmarks/${lectureId}`);
