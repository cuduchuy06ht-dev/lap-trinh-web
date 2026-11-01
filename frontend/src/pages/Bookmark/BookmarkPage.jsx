
import React, { useMemo, useState } from "react";
import "./BookmarkPage.css";

const initialBookmarks = [
    {
        id: 1,
        title: "Kinh tế vi mô - Chương 1: Những vấn đề cơ bản",
        thumbnail: "/images/video1.jpg",
        duration: "45:20",
        lecturer: "TS. Nguyễn Văn Minh",
        avatar: "/images/avatar1.jpg",
        views: "12.4K",
        category: "Kinh tế học",
        savedAt: "2026-10-28"
    },
    {
        id: 2,
        title: "Nguyên lý kế toán - Bài 1: Tổng quan về kế toán",
        thumbnail: "/images/video2.jpg",
        duration: "52:10",
        lecturer: "TS. Trần Thị Lan",
        avatar: "/images/avatar2.jpg",
        views: "8.7K",
        category: "Kế toán",
        savedAt: "2026-10-26"
    },
    {
        id: 3,
        title: "Quản trị kinh doanh - Chương 2: Hoạch định chiến lược",
        thumbnail: "/images/video3.jpg",
        duration: "48:35",
        lecturer: "PGS.TS. Lê Anh Tuấn",
        avatar: "/images/avatar3.jpg",
        views: "15.2K",
        category: "Kinh doanh",
        savedAt: "2026-10-20"
    },
    {
        id: 4,
        title: "Marketing căn bản - Bài 3: Nghiên cứu thị trường",
        thumbnail: "/images/video4.jpg",
        duration: "37:18",
        lecturer: "TS. Phạm Thu Hương",
        avatar: "/images/avatar4.jpg",
        views: "9.1K",
        category: "Kinh doanh",
        savedAt: "2026-10-20"
    },
    {
        id: 5,
        title: "Tài chính doanh nghiệp - Bài 4: Chi phí sử dụng vốn",
        thumbnail: "/images/video5.jpg",
        duration: "50:05",
        lecturer: "PGS.TS. Đỗ Quang Hùng",
        avatar: "/images/avatar1.jpg",
        views: "11.3K",
        category: "Tài chính - Ngân hàng",
        savedAt: "2026-10-15"
    },
    {
        id: 6,
        title: "Lập trình Python cơ bản - Bài 1",
        thumbnail: "/images/video6.jpg",
        duration: "55:20",
        lecturer: "ThS. Vũ Minh Quân",
        avatar: "/images/avatar2.jpg",
        views: "21.5K",
        category: "Công nghệ thông tin",
        savedAt: "2026-10-15"
    },
    {
        id: 7,
        title: "Phân tích dữ liệu trong kinh tế",
        thumbnail: "/images/video7.jpg",
        duration: "41:08",
        lecturer: "TS. Nguyễn Thị Mai",
        avatar: "/images/avatar3.jpg",
        views: "18.6K",
        category: "Kinh tế học",
        savedAt: "2026-10-10"
    },
    {
        id: 8,
        title: "Kinh tế lượng - Bài 2",
        thumbnail: "/images/video8.jpg",
        duration: "55:20",
        lecturer: "TS. Trần Văn Nam",
        avatar: "/images/avatar4.jpg",
        views: "3.4K",
        category: "Kinh tế học",
        savedAt: "2026-10-08"
    }
];

const categories = [
    "Tất cả",
    "Kinh tế học",
    "Kế toán",
    "Kinh doanh",
    "Quản trị kinh doanh",
    "Tài chính - Ngân hàng",
    "Công nghệ thông tin",
    "Khác"
];

function BookmarkPage({ onVideoClick }) {
    const [bookmarks, setBookmarks] = useState(initialBookmarks);
    const [selectedCategory, setSelectedCategory] = useState("Tất cả");
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    const [viewMode, setViewMode] = useState("grid");
    const [currentPage, setCurrentPage] = useState(1);

    const videosPerPage = 8;

    // Lọc, tìm kiếm và sắp xếp bài giảng
    const filteredVideos = useMemo(() => {
        let result = [...bookmarks];

        if (selectedCategory !== "Tất cả") {
            result = result.filter(
                video => video.category === selectedCategory
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
                (a, b) => new Date(b.savedAt) - new Date(a.savedAt)
            );
        } else if (sortBy === "oldest") {
            result.sort(
                (a, b) => new Date(a.savedAt) - new Date(b.savedAt)
            );
        } else if (sortBy === "name") {
            result.sort((a, b) => a.title.localeCompare(b.title, "vi"));
        }

        return result;
    }, [bookmarks, selectedCategory, searchTerm, sortBy]);

    // Phân trang
    const totalPages = Math.ceil(filteredVideos.length / videosPerPage);

    const currentVideos = filteredVideos.slice(
        (currentPage - 1) * videosPerPage,
        currentPage * videosPerPage
    );

    // Bỏ lưu bài giảng
    const handleRemoveBookmark = (id) => {
        setBookmarks(prev => prev.filter(video => video.id !== id));
    };

    // Đếm số bài giảng theo danh mục
    const getCategoryCount = (category) => {
        if (category === "Tất cả") return bookmarks.length;

        return bookmarks.filter(video => video.category === category).length;
    };

    // Định dạng ngày lưu
    const formatSavedDate = (date) => {
        const savedDate = new Date(date);
        const today = new Date("2026-10-31");
        const diff = Math.floor(
            (today - savedDate) / (1000 * 60 * 60 * 24)
        );

        if (diff === 0) return "Đã lưu hôm nay";
        if (diff === 1) return "Đã lưu hôm qua";
        if (diff < 7) return `Đã lưu ${diff} ngày trước`;
        if (diff < 30) return `Đã lưu ${Math.floor(diff / 7)} tuần trước`;

        return `Đã lưu ${Math.floor(diff / 30)} tháng trước`;
    };

    return (
        <div className="bookmark-page">

            {/* Tiêu đề */}
            <div className="bookmark-header">
                <h1>Bài giảng đã lưu</h1>
                <p>Danh sách các bài giảng bạn đã lưu để xem lại sau</p>
            </div>

            {/* Bộ lọc danh mục */}
            <div className="bookmark-categories">
                {categories.map(category => (
                    <button
                        key={category}
                        className={`bookmark-category ${
                            selectedCategory === category ? "active" : ""
                        }`}
                        onClick={() => {
                            setSelectedCategory(category);
                            setCurrentPage(1);
                        }}
                    >
                        {category} ({getCategoryCount(category)})
                    </button>
                ))}
            </div>

            {/* Thanh tìm kiếm và sắp xếp */}
            <div className="bookmark-toolbar">

                <div className="bookmark-search">
                    <span className="search-icon">⌕</span>
                    <input
                        type="text"
                        placeholder="Tìm kiếm trong bài giảng đã lưu..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>
                <div className="bookmark-control">
                    <label>Hiển thị</label>
                    <select
                        value={viewMode}
                        onChange={(e) => setViewMode(e.target.value)}
                    >
                        <option value="grid">Dạng lưới</option>
                        <option value="list">Dạng danh sách</option>
                    </select>
                </div>

            </div>

            {/* Danh sách bài giảng */}
            {currentVideos.length > 0 ? (
                <div className={`bookmark-video-grid ${viewMode}`}>
                    {currentVideos.map(video => (
                        <div
                            className="bookmark-video-card"
                            key={video.id}
                            onClick={() => onVideoClick?.(video)}
                        >
                            <div className="bookmark-thumbnail">
                                <img
                                    src={video.thumbnail}
                                    alt={video.title}
                                />

                                <span className="bookmark-duration">
                                    {video.duration}
                                </span>

                                <button
                                    className="bookmark-remove"
                                    title="Bỏ lưu bài giảng"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveBookmark(video.id);
                                    }}
                                >
                                    <svg viewBox="0 0 24 24">
                                        <path d="M6 3h12a2 2 0 0 1 2 2v18l-8-5-8 5V5a2 2 0 0 1 2-2z" />
                                    </svg>
                                </button>
                            </div>

                            <div className="bookmark-video-info">
                                <h3>{video.title}</h3>

                                <div className="bookmark-lecturer">
                                    <img
                                        src={video.avatar}
                                        alt={video.lecturer}
                                    />
                                    <span>{video.lecturer}</span>
                                </div>

                                <div className="bookmark-card-footer">
                                    <span>♡ {video.views} lượt xem</span>
                                    <span>
                                        ♧ {formatSavedDate(video.savedAt)}
                                    </span>
                                    <button
                                        title="Bỏ lưu"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveBookmark(video.id);
                                        }}
                                    >
                                        ⋮
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bookmark-empty">
                    <h3>Không tìm thấy bài giảng</h3>
                    <p>
                        Bạn chưa lưu bài giảng nào trong danh mục hoặc từ khóa này.
                    </p>
                </div>
            )}

            {/* Phân trang và tổng số */}
            <div className="bookmark-pagination">
                <div className="pagination-buttons">
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
                        disabled={currentPage === totalPages || totalPages === 0}
                        onClick={() => setCurrentPage(prev => prev + 1)}
                    >
                        ›
                    </button>
                </div>

                <span>
                    Hiển thị {currentVideos.length} / {filteredVideos.length} bài giảng
                </span>
            </div>

        </div>
    );
}

export default BookmarkPage;
