
import React, { useState } from "react";

// Components
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

// Pages
import HomePage from "./pages/Home/HomePage";
import CategoryPage from "./pages/Category/CategoryPage";
import BookmarkPage from "./pages/Bookmark/BookmarkPage";
import HistoryPage from "./pages/History/HistoryPage";

function App() {
    // Quản lý trang hiện tại
    const [activePage, setActivePage] = useState("home");

    // Thông tin sinh viên
    const user = {
        name: "Nguyễn Văn A",
        role: "Sinh viên",
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

    // Xử lý khi chọn một bài giảng
    const handleVideoClick = (video) => {
        console.log("Bài giảng được chọn:", video);

        // TODO: Điều hướng sang trang Video Detail
    };

    // Hiển thị nội dung theo trang
    const renderPage = () => {
        switch (activePage) {
            case "home":
                return (
                    <HomePage
                        onVideoClick={handleVideoClick}
                    />
                );

            case "category":
                return (
                    <CategoryPage
                        onVideoClick={handleVideoClick}
                    />
                );

            case "saved":
                return (
                    <BookmarkPage
                        onVideoClick={handleVideoClick}
                    />
                );

            case "history":
                return (
                    <HistoryPage
                        onVideoClick={handleVideoClick}
                    />
                );

            default:
                return <HomePage />;
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
            </aside>

            {/* Main Content */}
            <main className="app-content">
                {renderPage()}
            </main>

        </div>
    );
}

export default App;

