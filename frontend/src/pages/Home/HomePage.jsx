
import React, { useRef } from "react";
import VideoCard from "../../components/VideoCard";
import "./HomePage.css";

// Dữ liệu danh mục
const mockCategories = [
    { id: 1, name: "Kinh tế học", count: 320, icon: "▥", color: "cyan" },
    { id: 2, name: "Kế toán", count: 280, icon: "▦", color: "red" },
    { id: 3, name: "Kinh doanh", count: 412, icon: "↗", color: "green" },
    { id: 4, name: "Quản trị kinh doanh", count: 365, icon: "♙", color: "purple" },
    { id: 5, name: "Tài chính - Ngân hàng", count: 298, icon: "▤", color: "orange" },
    { id: 6, name: "Công nghệ thông tin", count: 210, icon: "▣", color: "blue" },
    { id: 7, name: "Ngoại ngữ", count: 180, icon: "◎", color: "blue" },
    { id: 8, name: "Khác", count: 120, icon: "•••", color: "gray" }
];

// Dữ liệu video mẫu
const mockVideos = [
    {
        id: 1,
        title: "Kinh tế vĩ mô - Chương 1: Những vấn đề cơ bản",
        thumbnail: "/images/video1.jpg",
        duration: "45:20",
        lecturer: "TS. Nguyễn Văn Minh",
        avatar: "/images/avatar1.jpg",
        views: "12.4K",
        isBookmarked: false
    },
    {
        id: 2,
        title: "Nguyên lý kế toán - Bài 1: Tổng quan về kế toán",
        thumbnail: "/images/video2.jpg",
        duration: "52:10",
        lecturer: "TS. Trần Thị Lan",
        avatar: "/images/avatar2.jpg",
        views: "8.7K",
        isBookmarked: false
    },
    {
        id: 3,
        title: "Quản trị kinh doanh - Chương 2: Hoạch định chiến lược",
        thumbnail: "/images/video3.jpg",
        duration: "48:35",
        lecturer: "PGS.TS. Lê Anh Tuấn",
        avatar: "/images/avatar3.jpg",
        views: "15.2K",
        isBookmarked: true
    },
    {
        id: 4,
        title: "Marketing căn bản - Bài 3: Nghiên cứu thị trường",
        thumbnail: "/images/video4.jpg",
        duration: "37:18",
        lecturer: "TS. Phạm Thu Hương",
        avatar: "/images/avatar4.jpg",
        views: "9.1K",
        isBookmarked: false
    },
    {
        id: 5,
        title: "Tài chính doanh nghiệp - Bài 4: Chi phí sử dụng vốn",
        thumbnail: "/images/video5.jpg",
        duration: "50:05",
        lecturer: "PGS.TS. Đỗ Quang Hùng",
        avatar: "/images/avatar5.jpg",
        views: "11.3K",
        isBookmarked: false
    }
];

// Dữ liệu video mới nhất
const mockLatestVideos = [
    {
        ...mockVideos[0],
        id: 6,
        title: "Lập trình Python cơ bản - Bài 1",
        thumbnail: "/images/video6.jpg",
        duration: "36:12",
        lecturer: "ThS. Vũ Minh Quân",
        views: "2.1K",
        uploadTime: "2 ngày trước"
    },
    {
        ...mockVideos[1],
        id: 7,
        title: "Phân tích dữ liệu trong kinh tế",
        thumbnail: "/images/video7.jpg",
        duration: "41:08",
        lecturer: "TS. Nguyễn Thị Mai",
        views: "1.8K",
        uploadTime: "3 ngày trước"
    },
    {
        ...mockVideos[2],
        id: 8,
        title: "Kinh tế lượng - Bài 2",
        thumbnail: "/images/video8.jpg",
        duration: "55:20",
        lecturer: "TS. Trần Văn Nam",
        views: "3.4K",
        uploadTime: "4 ngày trước"
    }
];

function HomePage({
    categories = mockCategories,
    featuredVideos = mockVideos,
    latestVideos = mockLatestVideos,
    onCategoryClick,
    onBookmark,
    onVideoClick
}) {
    const latestRef = useRef(null);

    const scrollLatest = (direction) => {
        latestRef.current?.scrollBy({
            left: direction * 350,
            behavior: "smooth"
        });
    };

    return (
        <div className="homepage">

            {/* ================= BANNER ================= */}
            <section className="home-banner">
                <div className="banner-content">
                    <span className="banner-welcome">
                        Chào mừng bạn đến với
                    </span>

                    <h1>
                        Thư viện video bài giảng
                        <span> NEU</span>
                    </h1>

                    <p>
                        Nền tảng chia sẻ, lưu trữ và khám phá video bài giảng
                        dành cho sinh viên, giảng viên và cộng đồng NEU.
                    </p>

                    <button
                        className="banner-button"
                        onClick={() =>
                            document.getElementById("featured-section")
                                ?.scrollIntoView({ behavior: "smooth" })
                        }
                    >
                        Khám phá bài giảng →
                    </button>
                </div>

                <div className="banner-decoration">
                    <div className="banner-circle banner-circle-one"></div>
                    <div className="banner-circle banner-circle-two"></div>
                </div>

                <div className="banner-dots">
                    {Array.from({ length: 12 }).map((_, index) => (
                        <span key={index}></span>
                    ))}
                </div>
            </section>
            {/* ================= FEATURED VIDEOS ================= */}
            <section className="home-section" id="featured-section">

                <div className="home-section-header">
                    <h2>
                        <span className="section-icon featured-icon">★</span>
                        Bài giảng nổi bật
                    </h2>
                </div>

                <div className="featured-video-grid">
                    {featuredVideos.map(video => (
                        <div
                            key={video.id}
                            onClick={() => onVideoClick?.(video)}
                        >
                            <VideoCard
                                video={video}
                                variant="featured"
                                onBookmark={onBookmark}
                            />
                        </div>
                    ))}
                </div>

            </section>


            {/* ================= LATEST VIDEOS ================= */}
            <section className="home-section">

                <div className="home-section-header">
                    <h2>
                        <span className="section-icon latest-icon">◷</span>
                        Bài giảng mới nhất
                    </h2>

                </div>

                <div className="latest-video-grid" ref={latestRef}>
                    {latestVideos.map(video => (
                        <div
                            className="latest-video-item"
                            key={video.id}
                            onClick={() => onVideoClick?.(video)}
                        >
                            <VideoCard
                                video={video}
                                variant="latest"
                                onBookmark={onBookmark}
                            />
                            <span className="latest-upload-time">
                                {video.uploadTime}
                            </span>
                        </div>
                    ))}
                </div>

            </section>

        </div>
    );
}

export default HomePage;

