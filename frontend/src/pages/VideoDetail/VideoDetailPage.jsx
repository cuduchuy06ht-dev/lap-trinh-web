import React, { useState } from 'react';
import Player from './Player';
import './VideoDetailPage.css';

export default function VideoDetailPage() {
  const [currentLecture, setCurrentLecture] = useState({
    id: 'lec_101',
    title: 'Bài 04: Cân bằng cung cầu và cơ chế điều tiết giá thị trường',
    subject: 'Kinh tế vi mô',
    category: 'Khoa Kinh tế học',
    instructor: 'TS. Nguyễn Văn A',
    viewsCount: 1420,
    duration: 2100,
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800',
    description:
      'Bài giảng đi sâu vào nguyên lý xác định giá cân bằng, thặng dư tiêu dùng, thặng dư sản xuất và các chính sách can thiệp của chính phủ như giá trần và giá sàn.',
    documents: [
      { id: 1, name: 'Slide_Bai_04_Can_bang_cung_cau.pdf', size: '2.4 MB', url: '#' },
      { id: 2, name: 'Bai_tap_tinh_huong_chuong_2.docx', size: '450 KB', url: '#' },
    ],
  });

  const [initialProgress, setInitialProgress] = useState(270);

  const [relatedLectures] = useState([
    {
      id: 'lec_100',
      title: 'Bài 03: Độ co giãn của cầu và cung theo giá',
      duration: '28:15',
      instructor: 'TS. Nguyễn Văn A',
      isCompleted: true,
      thumbnailUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=300',
    },
    {
      id: 'lec_101',
      title: 'Bài 04: Cân bằng cung cầu và cơ chế điều tiết giá thị trường',
      duration: '35:00',
      instructor: 'TS. Nguyễn Văn A',
      isCompleted: false,
      thumbnailUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=300',
    },
    {
      id: 'lec_102',
      title: 'Bài 05: Lý thuyết hành vi người tiêu dùng và hữu dụng biên',
      duration: '42:10',
      instructor: 'TS. Nguyễn Văn A',
      isCompleted: false,
      thumbnailUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=300',
    },
    {
      id: 'lec_103',
      title: 'Bài 06: Năng suất sản xuất và tối ưu hóa chi phí ngắn hạn',
      duration: '38:45',
      instructor: 'ThS. Trần Thị B',
      isCompleted: false,
      thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300',
    },
  ]);

  const [activeTab, setActiveTab] = useState('description');

  const handleSelectLecture = (lecture) => {
    setCurrentLecture((prev) => ({
      ...prev,
      id: lecture.id,
      title: lecture.title,
      instructor: lecture.instructor,
      thumbnailUrl: lecture.thumbnailUrl,
    }));
    setInitialProgress(0);
  };

  const handleAutoNext = () => {
    const currentIndex = relatedLectures.findIndex((item) => item.id === currentLecture.id);
    if (currentIndex !== -1 && currentIndex < relatedLectures.length - 1) {
      handleSelectLecture(relatedLectures[currentIndex + 1]);
    }
  };

  return (
    <div className="video-detail-container">
      <div className="main-content-column">
        <Player
          lecture={currentLecture}
          initialProgress={initialProgress}
          onEnded={handleAutoNext}
        />

        <div className="lecture-header-info">
          <span className="badge-subject">{currentLecture.subject}</span>
          <span className="badge-category">{currentLecture.category}</span>
          <h1 className="lecture-title">{currentLecture.title}</h1>
          <div className="lecture-meta">
            <span>👨‍🏫 Giảng viên: <strong>{currentLecture.instructor}</strong></span>
            <span>👁 {currentLecture.viewsCount.toLocaleString()} lượt xem</span>
          </div>
        </div>

        <div className="lecture-tabs">
          <button
            type="button"
            className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
            onClick={() => setActiveTab('description')}
          >
            Nội dung bài học
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'documents' ? 'active' : ''}`}
            onClick={() => setActiveTab('documents')}
          >
            Tài liệu đính kèm ({currentLecture.documents.length})
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'description' && (
            <div className="description-panel">
              <p>{currentLecture.description}</p>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="documents-panel">
              {currentLecture.documents.map((doc) => (
                <div key={doc.id} className="doc-item">
                  <div className="doc-info">
                    <span className="doc-icon">📄</span>
                    <div>
                      <div className="doc-name">{doc.name}</div>
                      <span className="doc-size">{doc.size}</span>
                    </div>
                  </div>
                  <a href={doc.url} download className="btn-download">
                    Tải về
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="playlist-sidebar-column">
        <div className="playlist-card">
          <div className="playlist-header">
            <h3>Danh sách bài giảng</h3>
            <span className="playlist-count">{relatedLectures.length} bài</span>
          </div>

          <div className="playlist-items-list">
            {relatedLectures.map((item, index) => {
              const isActive = item.id === currentLecture.id;
              return (
                <div
                  key={item.id}
                  className={`playlist-item ${isActive ? 'active-item' : ''}`}
                  onClick={() => handleSelectLecture(item)}
                >
                  <div className="item-thumbnail-wrap">
                    <img src={item.thumbnailUrl} alt={item.title} className="item-thumb" />
                    <span className="item-duration">{item.duration}</span>
                  </div>
                  <div className="item-meta">
                    <span className="item-number">Bài {index + 1}</span>
                    <h4 className="item-title">{item.title}</h4>
                    <span className="item-instructor">{item.instructor}</span>
                    {item.isCompleted && <span className="status-done">✓ Đã hoàn thành</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
