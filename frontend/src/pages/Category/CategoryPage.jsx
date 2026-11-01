import React, { useEffect, useState } from "react";
import VideoCard from "../../components/VideoCard";
import { getFaculties, getLectures, getMajors, getSubjects } from "../../services/lectureService";
import { addBookmark, removeBookmark } from "../../services/bookmarkService";
import "./CategoryPage.css";

function CategoryPage({ onVideoClick }) {
  const [faculties, setFaculties] = useState([]), [subjects, setSubjects] = useState([]), [majors, setMajors] = useState([]), [videos, setVideos] = useState([]);
  const [filters, setFilters] = useState({ facultyId: "", subjectId: "", majorId: "", q: "", sort: "newest" });
  const [page, setPage] = useState(1), [pages, setPages] = useState(1), [error, setError] = useState("");
  useEffect(() => { getFaculties().then(setFaculties).catch(() => setError("Không thể tải danh mục.")); }, []);
  useEffect(() => { Promise.all([getSubjects(filters.facultyId), getMajors(filters.facultyId)]).then(([s, m]) => { setSubjects(s); setMajors(m); }).catch(() => setError("Không thể tải bộ lọc.")); }, [filters.facultyId]);
  const load = async () => { try { const data = await getLectures({ faculty_id: filters.facultyId || undefined, subject_id: filters.subjectId || undefined, major_id: filters.majorId || undefined, q: filters.q || undefined, sort: filters.sort, page, page_size: 6 }); setVideos(data.items); setPages(data.pagination.totalPages || 1); } catch { setError("Không thể tải bài giảng."); } };
  useEffect(() => { const timer = setTimeout(load, 250); return () => clearTimeout(timer); }, [filters, page]);
  const set = (key, value) => { setPage(1); setFilters((old) => ({ ...old, [key]: value, ...(key === "facultyId" ? { subjectId: "", majorId: "" } : {}) })); };
  const toggle = async (id, saved) => { try { saved ? await addBookmark(id) : await removeBookmark(id); setVideos((old) => old.map((v) => v.id === id ? { ...v, isBookmarked: saved } : v)); } catch { setError("Không thể cập nhật bài giảng đã lưu."); } };
  return <div className="category-page"><div className="category-page-header"><div><h1>Danh mục bài giảng</h1><p>Khám phá bài giảng theo khoa, môn học và chuyên ngành</p></div></div>
    <section className="category-filter-panel">
      <div className="category-filter-field"><label>Khoa</label><select value={filters.facultyId} onChange={(e) => set("facultyId", e.target.value)}><option value="">Tất cả khoa</option>{faculties.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</select></div>
      <div className="category-filter-field"><label>Môn học</label><select value={filters.subjectId} onChange={(e) => set("subjectId", e.target.value)}><option value="">Tất cả môn học</option>{subjects.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</select></div>
      <div className="category-filter-field"><label>Chuyên ngành</label><select value={filters.majorId} onChange={(e) => set("majorId", e.target.value)}><option value="">Tất cả chuyên ngành</option>{majors.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</select></div>
      <button className="category-reset-button" onClick={() => { setFilters({ facultyId:"", subjectId:"", majorId:"", q:"", sort:"newest" }); setPage(1); }}>Xóa bộ lọc</button>
    </section>
    <section className="category-toolbar"><div className="category-search"><input placeholder="Tìm kiếm bài giảng hoặc giảng viên..." value={filters.q} onChange={(e) => set("q", e.target.value)} /></div><div className="category-sort"><label>Sắp xếp:</label><select value={filters.sort} onChange={(e) => set("sort", e.target.value)}><option value="newest">Mới nhất</option><option value="oldest">Cũ nhất</option><option value="title">Tên A-Z</option><option value="views">Lượt xem</option></select></div></section>
    {error && <p className="empty-state">{error}</p>}<div className="category-video-heading"><h2>Bài giảng</h2></div><div className="category-video-grid">{videos.map((video) => <div key={video.id} className="category-video-item" onClick={() => onVideoClick?.(video)}><VideoCard video={video} variant="featured" onBookmark={toggle} /></div>)}</div>
    {!videos.length && !error && <p className="empty-state">Không có bài giảng phù hợp.</p>}<div className="category-pagination"><button disabled={page <= 1} onClick={() => setPage(page - 1)}>← Trước</button><span>Trang {page} / {pages}</span><button disabled={page >= pages} onClick={() => setPage(page + 1)}>Sau →</button></div>
  </div>;
}
export default CategoryPage;
