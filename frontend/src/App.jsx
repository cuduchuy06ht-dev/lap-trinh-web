import React, { useState } from "react";

// Components dùng chung
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

// Pages của Thành viên 1
import HomePage from "./pages/Home/HomePage";
import CategoryPage from "./pages/Category/CategoryPage";
import BookmarkPage from "./pages/Bookmark/BookmarkPage";
import HistoryPage from "./pages/History/HistoryPage";

// Pages của BẠN (Thành viên 2)
import VideoDetailPage from "./pages/VideoDetail/VideoDetailPage";
import DashboardPage from "./pages/AdminDashboard/DashboardPage";

function App() {
    // Quản lý trang hiện tại ("home", "category", "saved", "history", "video-detail", "admin")
    const [activePage, setActivePage] = useState("home");
    const [selectedVideo, setSelectedVideo] = useState(null);

    // Thông tin người dùng mẫu
    const user = {
        name: "Nguyễn Văn A",
        role: "Quản trị viên", // hoặc "Sinh viên"
        avatar: null
    };

    // Chuyển trang từ Sidebar
    const handleNavigate = (page) => {
        setActivePage(page);
    };

    // Tìm kiếm từ Header
    const handleSearch = (keyword) => {
        console.log("Từ khóa tìm kiếm:", keyword);
    };

    // Khi người dùng click vào một bài giảng bất kỳ -> Chuyển sang Video Detail của bạn
    const handleVideoClick = (video) => {
        setSelectedVideo(video);
        setActivePage("video-detail");
    };

    // Hiển thị nội dung trang tương ứng
    const renderPage = () => {
        switch (activePage) {
            case "home":
                return <HomePage onVideoClick={handleVideoClick} />;

            case "category":
                return <CategoryPage onVideoClick={handleVideoClick} />;

            case "saved":
                return <BookmarkPage onVideoClick={handleVideoClick} />;

            case "history":
                return <HistoryPage onVideoClick={handleVideoClick} />;

            case "video-detail":
                return (
                    <VideoDetailPage
                        lecture={selectedVideo}
                        onBack={() => setActivePage("home")}
                    />
                );

            case "admin":
                return <DashboardPage />;

            default:
                return <HomePage onVideoClick={handleVideoClick} />;
        }
    };

    return (
        <div className="app-container">
            {/* Header */}
            <Header
                user={user}
                onSearch={handleSearch}
            />

            {/* Sidebar */}
            <aside className="app-sidebar">
                <Sidebar
                    activeItem={activePage}
                    onNavigate={handleNavigate}
                />
                {/* Nút truy cập nhanh Dashboard Admin cho Thành viên 2 demo */}
                <div style={{ padding: "12px 16px" }}>
                    <button
                        onClick={() => setActivePage(activePage === "admin" ? "home" : "admin")}
                        style={{
                            width: "100%",
                            padding: "8px 12px",
                            backgroundColor: activePage === "admin" ? "#003366" : "#e2e8f0",
                            color: activePage === "admin" ? "#ffffff" : "#1e293b",
                            border: "none",
                            borderRadius: "6px",
                            fontWeight: "600",
                            cursor: "pointer",
                            fontSize: "12px"
                        }}
                    >
                        {activePage === "admin" ? "← Xem Giao Diện SV" : "⚙ Trang Quản Trị"}
                    </button>
                </div>
            </aside>

            {/* Vùng nội dung chính */}
            <main className="app-content">
                {renderPage()}
            </main>
        </div>
    );
}

export default App;
