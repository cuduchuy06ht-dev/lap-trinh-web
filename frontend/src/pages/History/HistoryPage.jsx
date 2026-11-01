
import React, { useMemo, useState } from "react";
import ProgressBar from "../../components/ProgressBar";
import "./HistoryPage.css";

// Dữ liệu lịch sử xem mẫu
const initialHistory = [
    {
        id: 1,
        title: "Kinh tế vi mô - Chương 1: Những vấn đề cơ bản",
        thumbnail: "/images/video1.jpg",
        duration: "45:20",
        watchedTime: "32:15",
        progress: 71,
        lecturer: "TS. Nguyễn Văn Minh",
        avatar: "/images/avatar1.jpg",
        views: "12.4K",
        lastWatched: "2026-10-31T09:30:00",
        status: "watching"
    },
    {
        id: 2,
        title: "Nguyên lý kế toán - Bài 1: Tổng quan về kế toán",
        thumbnail: "/images/video2.jpg",
        duration: "52:10",
        watchedTime: "52:10",
        progress: 100,
        lecturer: "TS. Trần Thị Lan",
        avatar: "/images/avatar2.jpg",
        views: "8.7K",
        lastWatched: "2026-10-30T15:20:00",
        status: "completed"
    },
    {
        id: 3,
        title: "Quản trị kinh doanh - Chương 2: Hoạch định chiến lược",
        thumbnail: "/images/video3.jpg",
        duration: "48:35",
        watchedTime: "18:40",
        progress: 38,
        lecturer: "PGS.TS. Lê Anh Tuấn",
        avatar: "/images/avatar3.jpg",
        views: "15.2K",
        lastWatched: "2026-10-30T10:15:00",
        status: "watching"
    },
    {
        id: 4,
        title: "Marketing căn bản - Bài 3: Nghiên cứu thị trường",
        thumbnail: "/images/video4.jpg",
        duration: "37:18",
        watchedTime: "37:18",
        progress: 100,
        lecturer: "TS. Phạm Thu Hương",
        avatar: "/images/avatar4.jpg",
        views: "9.1K",
        lastWatched: "2026-10-29T14:00:00",
        status: "completed"
    },
    {
        id: 5,
        title: "Tài chính doanh nghiệp - Bài 4: Chi phí sử dụng vốn",
        thumbnail: "/images/video5.jpg",
        duration: "50:05",
        watchedTime: "12:30",
        progress: 25,
        lecturer: "PGS.TS. Đỗ Quang Hùng",
        avatar: "/images/avatar1.jpg",
        views: "11.3K",
        lastWatched: "2026-10-28T16:30:00",
        status: "watching"
    },
    {
        id: 6,
        title: "Lập trình Python cơ bản - Bài 1",
        thumbnail: "/images/video6.jpg",
        duration: "55:20",
        watchedTime: "55:20",
        progress: 100,
        lecturer: "ThS. Vũ Minh Quân",
        avatar: "/images/avatar2.jpg",
        views: "21.5K",
        lastWatched: "2026-10-27T08:45:00",
        status: "completed"
    },
    {
        id: 7,
        title: "Phân tích dữ liệu trong kinh tế",
        thumbnail: "/images/video7.jpg",
        duration: "41:08",
        watchedTime: "20:10",
        progress: 49,
        lecturer: "TS. Nguyễn Thị Mai",
        avatar: "/images/avatar3.jpg",
        views: "18.6K",
        lastWatched: "2026-10-26T13:20:00",
        status: "watching"
    },
    {
        id: 8,
        title: "Kinh tế lượng - Bài 2",
        thumbnail: "/images/video8.jpg",
        duration: "55:20",
        watchedTime: "55:20",
        progress: 100,
        lecturer: "TS. Trần Văn Nam",
        avatar: "/images/avatar4.jpg",
        views: "3.4K",
        lastWatched: "2026-10-25T09:00:00",
        status: "completed"
    }
];

function HistoryPage({ onVideoClick }) {
    const [history, setHistory] = useState(initialHistory);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [sortBy, setSortBy] = useState("newest");
    const [currentPage, setCurrentPage] = useState(1);

    const videosPerPage = 6;

    // Lọc và sắp xếp lịch sử xem
    const filteredHistory = useMemo(() => {
        let result = [...history];

        if (filterStatus !== "all") {
            result = result.filter(
                video => video.status === filterStatus
            );
        }

        if (searchTerm.trim()) {
            const keyword = searchTerm.toLowerCase();

            result = result.filter(video =>
                video.title.toLowerCase().includes(keyword) ||
                video.lecturer.toLowerCase().includes(keyword)
            );
        }

        if (sortBy === "newest") {
            result.sort(
                (a, b) => new Date(b.lastWatched) - new Date(a.lastWatched)
            );
        } else if (sortBy === "oldest") {
            result.sort(
                (a, b) => new Date(a.lastWatched) - new Date(b.lastWatched)
            );
        } else if (sortBy === "progress") {
            result.sort((a, b) => b.progress - a.progress);
        }

        return result;
    }, [history, filterStatus, searchTerm, sortBy]);

    // Thống kê
    const totalVideos = history.length;

    const completedVideos = history.filter(
        video => video.status === "completed"
    ).length;

    const watchingVideos = history.filter(
        video => video.status === "watching"
    ).length;

    // Phân trang
    const totalPages = Math.ceil(filteredHistory.length / videosPerPage);

    const currentVideos = filteredHistory.slice(
        (currentPage - 1) * videosPerPage,
        currentPage * videosPerPage
    );

    // Xóa một bài giảng khỏi lịch sử
    const handleRemoveHistory = (id) => {
        setHistory(prev => prev.filter(video => video.id !== id));
    };

    // Xóa toàn bộ lịch sử
    const handleClearHistory = () => {
        const confirmed = window.confirm(
            "Bạn có chắc chắn muốn xóa toàn bộ lịch sử xem?"
        );

        if (confirmed) {
            setHistory([]);
            setCurrentPage(1);
        }
    };

    // Định dạng thời gian xem gần nhất
    const formatLastWatched = (date) => {
        const watchedDate = new Date(date);

        const day = String(watchedDate.getDate()).padStart(2, "0");
        const month = String(watchedDate.getMonth() + 1).padStart(2, "0");
        const year = watchedDate.getFullYear();

        const hours = String(watchedDate.getHours()).padStart(2, "0");
        const minutes = String(watchedDate.getMinutes()).padStart(2, "0");

        return `${hours}:${minutes} - ${day}/${month}/${year}`;
    };

    return (
        <div className="history-page">

            {/* Header */}
            <div className="history-header">
                <div>
                    <h1>Lịch sử xem</h1>
                    <p>
                        Theo dõi các bài giảng bạn đã xem và tiếp tục
                        hành trình học tập
                    </p>
                </div>

                <button
                    className="history-clear-button"
                    onClick={handleClearHistory}
                    disabled={history.length === 0}
                >
                    Xóa lịch sử
                </button>
            </div>

            {/* Thống kê */}
            <div className="history-statistics">

                <div className="history-stat-card">
                    <div className="history-stat-icon">▶</div>
                    <div>
                        <span>Tổng bài giảng</span>
                        <h2>{totalVideos}</h2>
                    </div>
                </div>

                <div className="history-stat-card">
                    <div className="history-stat-icon">◷</div>
                    <div>
                        <span>Đang xem</span>
                        <h2>{watchingVideos}</h2>
                    </div>
                </div>

                <div className="history-stat-card">
                    <div className="history-stat-icon">✓</div>
                    <div>
                        <span>Đã hoàn thành</span>
                        <h2>{completedVideos}</h2>
                    </div>
                </div>

            </div>

            {/* Bộ lọc trạng thái */}
            <div className="history-filter-tabs">
                <button
                    className={filterStatus === "all" ? "active" : ""}
                    onClick={() => {
                        setFilterStatus("all");
                        setCurrentPage(1);
                    }}
                >
                    Tất cả ({totalVideos})
                </button>

                <button
                    className={filterStatus === "watching" ? "active" : ""}
                    onClick={() => {
                        setFilterStatus("watching");
                        setCurrentPage(1);
                    }}
                >
                    Đang xem ({watchingVideos})
                </button>

                <button
                    className={filterStatus === "completed" ? "active" : ""}
                    onClick={() => {
                        setFilterStatus("completed");
                        setCurrentPage(1);
                    }}
                >
                    Đã hoàn thành ({completedVideos})
                </button>
            </div>

            {/* Tìm kiếm và sắp xếp */}
            <div className="history-toolbar">

                <div className="history-search">
                    <span>⌕</span>

                    <input
                        type="text"
                        placeholder="Tìm kiếm bài giảng hoặc giảng viên..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>
            </div>

            {/* Danh sách lịch sử */}
            <div className="history-list">

                {currentVideos.length > 0 ? (
                    currentVideos.map(video => (
                        <div className="history-card" key={video.id}>

                            {/* Thumbnail */}
                            <div className="history-thumbnail">
                                <img
                                    src={video.thumbnail}
                                    alt={video.title}
                                />

                                <span className="history-duration">
                                    {video.duration}
                                </span>

                                <button
                                    className="history-play-button"
                                    onClick={() => onVideoClick?.(video)}
                                    title="Tiếp tục xem"
                                >
                                    ▶
                                </button>
                            </div>

                            {/* Thông tin */}
                            <div className="history-content">

                                <div className="history-video-heading">
                                    <h3>{video.title}</h3>

                                    <button
                                        className="history-remove-button"
                                        title="Xóa khỏi lịch sử"
                                        onClick={() =>
                                            handleRemoveHistory(video.id)
                                        }
                                    >
                                        ×
                                    </button>
                                </div>

                                <div className="history-lecturer">
                                    <img
                                        src={video.avatar}
                                        alt={video.lecturer}
                                    />
                                    <span>{video.lecturer}</span>
                                </div>

                                {/* Tiến độ xem */}
                                <div className="history-progress-section">
                                    <div className="history-progress-info">
                                        <span>Tiến độ xem</span>
                                        <strong>{video.progress}%</strong>
                                    </div>

                                    <ProgressBar
                                        progress={video.progress}
                                        size="small"
                                    />

                                    <div className="history-watch-time">
                                        <span>
                                            Đã xem: {video.watchedTime}
                                        </span>
                                        <span>
                                            Thời lượng: {video.duration}
                                        </span>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="history-card-footer">

                                    <span className="history-last-watched">
                                        Lần xem gần nhất:{" "}
                                        {formatLastWatched(video.lastWatched)}
                                    </span>

                                    <span
                                        className={`history-status ${
                                            video.status === "completed"
                                                ? "completed"
                                                : "watching"
                                        }`}
                                    >
                                        {video.status === "completed"
                                            ? "Đã hoàn thành"
                                            : "Đang xem"}
                                    </span>

                                </div>

                            </div>

                        </div>
                    ))
                ) : (
                    <div className="history-empty">
                        <h3>Không tìm thấy lịch sử xem</h3>
                        <p>
                            Không có bài giảng phù hợp với tìm kiếm
                            hoặc bộ lọc hiện tại.
                        </p>
                    </div>
                )}

            </div>

            {/* Phân trang */}
            <div className="history-pagination">

                <div className="history-pagination-buttons">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => prev - 1)}
                    >
                        ‹
                    </button>

                    {Array.from(
                        { length: totalPages },
                        (_, index) => index + 1
                    ).map(page => (
                        <button
                            key={page}
                            className={currentPage === page ? "active" : ""}
                            onClick={() => setCurrentPage(page)}
                        >
                            {page}
                        </button>
                    ))}

                    <button
                        disabled={
                            currentPage === totalPages || totalPages === 0
                        }
                        onClick={() => setCurrentPage(prev => prev + 1)}
                    >
                        ›
                    </button>
                </div>

                <span>
                    Hiển thị {currentVideos.length} / {filteredHistory.length} bài giảng
                </span>

            </div>

        </div>
    );
}

export default HistoryPage;
