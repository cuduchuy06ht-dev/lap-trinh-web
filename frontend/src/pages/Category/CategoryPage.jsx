
import React, { useMemo, useState } from "react";
import VideoCard from "../../components/VideoCard";
import "./CategoryPage.css";

// DỮ LIỆU MẪU - Sau này thay bằng API
const mockVideos = [
    {
        id: 1,
        title: "Kinh tế vi mô - Chương 1: Tổng quan về kinh tế học",
        thumbnail: "/images/video1.jpg",
        duration: "45:20",
        lecturer: "TS. Nguyễn Văn Minh",
        avatar: "/images/avatar1.jpg",
        views: "12.4K",
        isBookmarked: false,
        facultyId: "f1",
        subjectId: "s1",
        majorId: "m1",
        uploadDate: "2026-10-20"
    },
    {
        id: 2,
        title: "Nguyên lý kế toán - Bài 1: Tổng quan về kế toán",
        thumbnail: "/images/video2.jpg",
        duration: "52:10",
        lecturer: "TS. Trần Thị Lan",
        avatar: "/images/avatar2.jpg",
        views: "8.7K",
        isBookmarked: false,
        facultyId: "f2",
        subjectId: "s2",
        majorId: "m2",
        uploadDate: "2026-10-25"
    },
    {
        id: 3,
        title: "Quản trị kinh doanh - Chương 2: Hoạch định chiến lược",
        thumbnail: "/images/video3.jpg",
        duration: "48:35",
        lecturer: "PGS.TS. Lê Anh Tuấn",
        avatar: "/images/avatar3.jpg",
        views: "15.2K",
        isBookmarked: true,
        facultyId: "f3",
        subjectId: "s3",
        majorId: "m3",
        uploadDate: "2026-10-27"
    },
    {
        id: 4,
        title: "Marketing căn bản - Bài 3: Nghiên cứu thị trường",
        thumbnail: "/images/video4.jpg",
        duration: "37:18",
        lecturer: "TS. Phạm Thu Hương",
        avatar: "/images/avatar4.jpg",
        views: "9.1K",
        isBookmarked: false,
        facultyId: "f3",
        subjectId: "s4",
        majorId: "m3",
        uploadDate: "2026-10-22"
    },
    {
        id: 5,
        title: "Tài chính doanh nghiệp - Bài 4: Chi phí sử dụng vốn",
        thumbnail: "/images/video5.jpg",
        duration: "50:05",
        lecturer: "PGS.TS. Đỗ Quang Hùng",
        avatar: "/images/avatar5.jpg",
        views: "11.3K",
        isBookmarked: false,
        facultyId: "f4",
        subjectId: "s5",
        majorId: "m4",
        uploadDate: "2026-10-28"
    },
    {
        id: 6,
        title: "Lập trình Python cơ bản - Bài 1",
        thumbnail: "/images/video6.jpg",
        duration: "36:12",
        lecturer: "ThS. Vũ Minh Quân",
        avatar: null,
        views: "2.1K",
        isBookmarked: false,
        facultyId: "f5",
        subjectId: "s6",
        majorId: "m5",
        uploadDate: "2026-10-29"
    },
    {
        id: 7,
        title: "Phân tích dữ liệu trong kinh tế",
        thumbnail: "/images/video7.jpg",
        duration: "41:08",
        lecturer: "TS. Nguyễn Thị Mai",
        avatar: null,
        views: "1.8K",
        isBookmarked: false,
        facultyId: "f1",
        subjectId: "s7",
        majorId: "m1",
        uploadDate: "2026-10-26"
    },
    {
        id: 8,
        title: "Kinh tế lượng - Bài 2",
        thumbnail: "/images/video8.jpg",
        duration: "55:20",
        lecturer: "TS. Trần Văn Nam",
        avatar: null,
        views: "3.4K",
        isBookmarked: false,
        facultyId: "f1",
        subjectId: "s8",
        majorId: "m1",
        uploadDate: "2026-10-24"
    }
];

// Dữ liệu bộ lọc mẫu
const faculties = [
    { id: "f1", name: "Khoa Kinh tế học" },
    { id: "f2", name: "Khoa Kế toán" },
    { id: "f3", name: "Khoa Quản trị kinh doanh" },
    { id: "f4", name: "Khoa Tài chính - Ngân hàng" },
    { id: "f5", name: "Khoa Công nghệ thông tin" }
];

const subjects = [
    { id: "s1", name: "Kinh tế vi mô", facultyId: "f1" },
    { id: "s2", name: "Nguyên lý kế toán", facultyId: "f2" },
    { id: "s3", name: "Quản trị học", facultyId: "f3" },
    { id: "s4", name: "Marketing căn bản", facultyId: "f3" },
    { id: "s5", name: "Tài chính doanh nghiệp", facultyId: "f4" },
    { id: "s6", name: "Lập trình Python", facultyId: "f5" },
    { id: "s7", name: "Phân tích dữ liệu", facultyId: "f1" },
    { id: "s8", name: "Kinh tế lượng", facultyId: "f1" }
];

const majors = [
    { id: "m1", name: "Kinh tế học", facultyId: "f1" },
    { id: "m2", name: "Kế toán", facultyId: "f2" },
    { id: "m3", name: "Quản trị kinh doanh", facultyId: "f3" },
    { id: "m4", name: "Tài chính doanh nghiệp", facultyId: "f4" },
    { id: "m5", name: "Công nghệ thông tin", facultyId: "f5" }
];

function CategoryPage({ onVideoClick, onBookmark }) {
    const [facultyId, setFacultyId] = useState("");
    const [subjectId, setSubjectId] = useState("");
    const [majorId, setMajorId] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    const [currentPage, setCurrentPage] = useState(1);

    const videosPerPage = 6;

    // Khi chọn khoa, chỉ hiển thị môn học và chuyên ngành thuộc khoa đó
    const filteredSubjects = subjects.filter(
        (subject) => !facultyId || subject.facultyId === facultyId
    );

    const filteredMajors = majors.filter(
        (major) => !facultyId || major.facultyId === facultyId
    );

    const handleFacultyChange = (value) => {
        setFacultyId(value);
        setSubjectId("");
        setMajorId("");
        setCurrentPage(1);
    };

    // Lọc và sắp xếp video
    const filteredVideos = useMemo(() => {
        let result = [...mockVideos];

        if (facultyId) {
            result = result.filter(
                (video) => video.facultyId === facultyId
            );
        }

        if (subjectId) {
            result = result.filter(
                (video) => video.subjectId === subjectId
            );
        }

        if (majorId) {
            result = result.filter(
                (video) => video.majorId === majorId
            );
        }

        if (searchTerm.trim()) {
            const keyword = searchTerm.trim().toLowerCase();

            result = result.filter((video) =>
                `${video.title} ${video.lecturer}`
                    .toLowerCase()
                    .includes(keyword)
            );
        }

        if (sortBy === "newest") {
            result.sort(
                (a, b) =>
                    new Date(b.uploadDate) - new Date(a.uploadDate)
            );
        } else if (sortBy === "oldest") {
            result.sort(
                (a, b) =>
                    new Date(a.uploadDate) - new Date(b.uploadDate)
            );
        } else if (sortBy === "title") {
            result.sort((a, b) =>
                a.title.localeCompare(b.title, "vi")
            );
        }

        return result;
    }, [facultyId, subjectId, majorId, searchTerm, sortBy]);

    // Phân trang
    const totalPages = Math.ceil(
        filteredVideos.length / videosPerPage
    );

    const startIndex = (currentPage - 1) * videosPerPage;

    const displayedVideos = filteredVideos.slice(
        startIndex,
        startIndex + videosPerPage
    );

    const handleSearch = (value) => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    return (
        <div className="category-page">

            {/* PAGE HEADER */}
            <div className="category-page-header">
                <div>
                    <h1>Danh mục bài giảng</h1>
                    <p>
                        Khám phá bài giảng theo khoa, môn học và chuyên ngành
                    </p>
                </div>
            </div>

            {/* FILTERS */}
            <section className="category-filter-panel">

                <div className="category-filter-field">
                    <label htmlFor="faculty-filter">Khoa</label>
                    <select
                        id="faculty-filter"
                        value={facultyId}
                        onChange={(e) =>
                            handleFacultyChange(e.target.value)
                        }
                    >
                        <option value="">Tất cả khoa</option>
                        {faculties.map((faculty) => (
                            <option key={faculty.id} value={faculty.id}>
                                {faculty.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="category-filter-field">
                    <label htmlFor="subject-filter">Môn học</label>
                    <select
                        id="subject-filter"
                        value={subjectId}
                        onChange={(e) => {
                            setSubjectId(e.target.value);
                            setCurrentPage(1);
                        }}
                    >
                        <option value="">Tất cả môn học</option>
                        {filteredSubjects.map((subject) => (
                            <option key={subject.id} value={subject.id}>
                                {subject.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="category-filter-field">
                    <label htmlFor="major-filter">Chuyên ngành</label>
                    <select
                        id="major-filter"
                        value={majorId}
                        onChange={(e) => {
                            setMajorId(e.target.value);
                            setCurrentPage(1);
                        }}
                    >
                        <option value="">Tất cả chuyên ngành</option>
                        {filteredMajors.map((major) => (
                            <option key={major.id} value={major.id}>
                                {major.name}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    className="category-reset-button"
                    onClick={() => {
                        setFacultyId("");
                        setSubjectId("");
                        setMajorId("");
                        setSearchTerm("");
                        setSortBy("newest");
                        setCurrentPage(1);
                    }}
                >
                    Xóa bộ lọc
                </button>

            </section>

            {/* SEARCH AND SORT */}
            <section className="category-toolbar">

                <div className="category-search">
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                    </svg>

                    <input
                        type="text"
                        placeholder="Tìm kiếm bài giảng hoặc giảng viên..."
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </div>

                <div className="category-sort">
                    <label htmlFor="video-sort">Sắp xếp:</label>
                    <select
                        id="video-sort"
                        value={sortBy}
                        onChange={(e) => {
                            setSortBy(e.target.value);
                            setCurrentPage(1);
                        }}
                    >
                        <option value="newest">Mới nhất</option>
                        <option value="oldest">Cũ nhất</option>
                        <option value="title">Tên bài giảng A-Z</option>
                    </select>
                </div>

            </section>

            {/* VIDEO LIST HEADER */}
            <div className="category-video-heading">
                <h2>Danh sách bài giảng</h2>
                <span>
                    {filteredVideos.length} bài giảng
                </span>
            </div>

            {/* VIDEO GRID */}
            {displayedVideos.length > 0 ? (
                <div className="category-video-grid">
                    {displayedVideos.map((video) => (
                        <div
                            key={video.id}
                            className="category-video-item"
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
            ) : (
                <div className="category-empty">
                    <h3>Không tìm thấy bài giảng</h3>
                    <p>
                        Thử thay đổi từ khóa hoặc bộ lọc để tìm kiếm lại.
                    </p>
                </div>
            )}

            {/* PAGINATION */}
            {totalPages > 1 && (
                <div className="category-pagination">
                    <button
                        disabled={currentPage === 1}
                        onClick={() =>
                            setCurrentPage((page) => page - 1)
                        }
                    >
                        ← Trước
                    </button>

                    <span>
                        Trang {currentPage} / {totalPages}
                    </span>

                    <button
                        disabled={currentPage === totalPages}
                        onClick={() =>
                            setCurrentPage((page) => page + 1)
                        }
                    >
                        Sau →
                    </button>
                </div>
            )}

        </div>
    );
}

export default CategoryPage;
