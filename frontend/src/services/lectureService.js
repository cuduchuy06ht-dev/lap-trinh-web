import api from "./api";

export const getFeaturedLectures = async () => (await api.get("/lectures/featured")).data;
export const getLatestLectures = async () => (await api.get("/lectures/latest")).data;
export const getLecture = async (id) => (await api.get(`/lectures/${id}`)).data;
export const getLectures = async (params) => (await api.get("/lectures", { params })).data;
export const getFaculties = async () => (await api.get("/faculties")).data;
export const getSubjects = async (facultyId) => (await api.get("/subjects", { params: facultyId ? { faculty_id: facultyId } : {} })).data;
export const getMajors = async (facultyId) => (await api.get("/majors", { params: facultyId ? { faculty_id: facultyId } : {} })).data;
export const createLecture = async (payload) => (await api.post("/lectures", payload)).data;
export const deleteLecture = async (id) => api.delete(`/lectures/${id}`);
