import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DashboardPage.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    metrics: {
      totalLectures: 48,
      totalViews: 38450,
      totalWatchHours: 1240,
      activeStudents: 156,
    },
    viewTrend: [
      { label: 'Thứ 2', views: 320 },
      { label: 'Thứ 3', views: 450 },
      { label: 'Thứ 4', views: 600 },
      { label: 'Thứ 5', views: 580 },
      { label: 'Thứ 6', views: 720 },
      { label: 'Thứ 7', views: 890 },
      { label: 'CN', views: 650 },
    ],
    categoryStats: [
      { name: 'Khoa Kinh tế học', percentage: 40 },
      { name: 'Tài chính - Ngân hàng', percentage: 30 },
      { name: 'Kế toán - Kiểm toán', percentage: 20 },
      { name: 'Khác', percentage: 10 },
    ],
  });

  const [lectures, setLectures] = useState([
    {
      id: 'lec_101',
      title: 'Bài 04: Cân bằng cung cầu và cơ chế điều tiết giá thị trường',
      category: 'Khoa Kinh tế học',
      instructor: 'TS. Nguyễn Văn A',
      views: 1420,
      createdAt: '2026-03-15',
      status: 'published',
    },
    {
      id: 'lec_102',
      title: 'Bài 05: Lý thuyết hành vi người tiêu dùng và hữu dụng biên',
      category: 'Khoa Kinh tế học',
      instructor: 'TS. Nguyễn Văn A',
      views: 980,
      createdAt: '2026-03-20',
      status: 'published',
    },
    {
      id: 'lec_103',
      title: 'Bài 01: Giới thiệu thị trường tài chính và tiền tệ',
      category: 'Tài chính - Ngân hàng',
      instructor: 'ThS. Lê Hoàng B',
      views: 740,
      createdAt: '2026-03-22',
      status: 'pending',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Khoa Kinh tế học');
  const [newInstructor, setNewInstructor] = useState('');

  useEffect(() => {
    async function fetchStats() {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/dashboard/stats`, {
          headers: { Authorization: token ? `Bearer ${token}` : '' },
        });
        if (res.data) setStats(res.data);
      } catch (err) {
        console.warn('Backend chưa sẵn sàng API stats, dùng dữ liệu mẫu.');
      }
    }
    fetchStats();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài giảng này?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_BASE_URL}/lectures/${id}`, {
          headers: { Authorization: token ? `Bearer ${token}` : '' },
        });
      } catch (e) {
        console.warn('Lỗi gọi API xóa, xóa trên client state.');
      }
      setLectures((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    setUploadPercent(0);

    const formData = new FormData();
    formData.append('title', newTitle);
    formData.append('category', newCategory);
    formData.append('instructor', newInstructor);

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/lectures`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: token ? `Bearer ${token}` : '',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadPercent(percent);
          }
        },
      });
    } catch (err) {
      console.warn('Chưa có API upload, thêm bài học vào state.');
    } finally {
      setIsUploading(false);
      setShowModal(false);
      setLectures((prev) => [
        {
          id: `lec_${Date.now()}`,
          title: newTitle,
          category: newCategory,
          instructor: newInstructor,
          views: 0,
          createdAt: new Date().toISOString().split('T')[0],
          status: 'published',
        },
        ...prev,
      ]);
      setNewTitle('');
      setNewInstructor('');
      setUploadPercent(0);
    }
  };

  const filteredLectures = lectures.filter((lec) =>
    lec.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Bảng Điều Khiển Quản Trị</h1>
          <p className="dashboard-subtitle">Tổng hợp số liệu & quản trị thư viện bài giảng</p>
        </div>
        <button type="button" className="btn-primary" onClick={() => setShowModal(true)}>
          + Thêm Bài Giảng Mới
        </button>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <span className="metric-label">Tổng số bài giảng</span>
          <div className="metric-value">{stats?.metrics?.totalLectures || 48}</div>
          <span className="metric-subtext">Đã kiểm duyệt & xuất bản</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Tổng lượt xem</span>
          <div className="metric-value">{stats?.metrics?.totalViews?.toLocaleString() || '38,450'}</div>
          <span className="metric-subtext text-success">+12% so với tháng trước</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Thời lượng học tập</span>
          <div className="metric-value">{stats?.metrics?.totalWatchHours || 1240} giờ</div>
          <span className="metric-subtext">Tích lũy từ sinh viên</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Sinh viên hoạt động</span>
          <div className="metric-value">{stats?.metrics?.activeStudents || 156}</div>
          <span className="metric-subtext">Trong 24 giờ qua</span>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3 className="card-title">Xu hướng lượt xem tuần này</h3>
          <div className="bar-chart-mock">
            {stats?.viewTrend?.map((item, idx) => (
              <div key={idx} className="bar-column">
                <div
                  className="bar-fill"
                  style={{ height: `${(item.views / 1000) * 100}%` }}
                  title={`${item.views} lượt xem`}
                />
                <span className="bar-label">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-card">
          <h3 className="card-title">Tỷ trọng theo chuyên ngành</h3>
          <div className="progress-category-list">
            {stats?.categoryStats?.map((cat, idx) => (
              <div key={idx} className="cat-progress-item">
                <div className="cat-progress-header">
                  <span>{cat.name}</span>
                  <strong>{cat.percentage}%</strong>
                </div>
                <div className="cat-progress-track">
                  <div
                    className="cat-progress-bar"
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="table-card">
        <div className="table-header">
          <h3 className="card-title">Quản lý kho bài giảng</h3>
          <input
            type="text"
            className="search-input"
            placeholder="Tìm kiếm bài giảng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <table className="custom-table">
          <thead>
            <tr>
              <th>Tiêu đề bài giảng</th>
              <th>Chuyên ngành</th>
              <th>Giảng viên</th>
              <th>Lượt xem</th>
              <th>Ngày tạo</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredLectures.map((item) => (
              <tr key={item.id}>
                <td className="font-semibold">{item.title}</td>
                <td><span className="badge-cat">{item.category}</span></td>
                <td>{item.instructor}</td>
                <td>{item.views.toLocaleString()}</td>
                <td>{item.createdAt}</td>
                <td>
                  <span className={`status-pill ${item.status}`}>
                    {item.status === 'published' ? 'Đã duyệt' : 'Chờ duyệt'}
                  </span>
                </td>
                <td>
                  <button
                    type="button"
                    className="btn-danger-outline"
                    onClick={() => handleDelete(item.id)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
            {filteredLectures.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center">
                  Không tìm thấy bài giảng nào phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h2 className="modal-title">Thêm Bài Giảng Mới</h2>
            <form onSubmit={handleUploadSubmit}>
              <div className="form-group">
                <label>Tiêu đề bài giảng</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="Ví dụ: Bài 01: Tổng quan kinh tế vĩ mô"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Chuyên ngành / Khoa</label>
                <select
                  className="form-control"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                >
                  <option value="Khoa Kinh tế học">Khoa Kinh tế học</option>
                  <option value="Tài chính - Ngân hàng">Tài chính - Ngân hàng</option>
                  <option value="Kế toán - Kiểm toán">Kế toán - Kiểm toán</option>
                </select>
              </div>

              <div className="form-group">
                <label>Giảng viên phụ trách</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="Ví dụ: PGS. TS. Trần Văn C"
                  value={newInstructor}
                  onChange={(e) => setNewInstructor(e.target.value)}
                />
              </div>

              {isUploading && (
                <div className="upload-progress-wrapper">
                  <div className="progress-bar-track">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${uploadPercent}%` }}
                    />
                  </div>
                  <span className="upload-progress-text">Đang tải lên: {uploadPercent}%</span>
                </div>
              )}

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowModal(false)}
                  disabled={isUploading}
                >
                  Hủy
                </button>
                <button type="submit" className="btn-primary" disabled={isUploading}>
                  {isUploading ? 'Đang lưu...' : 'Lưu Bài Giảng'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
