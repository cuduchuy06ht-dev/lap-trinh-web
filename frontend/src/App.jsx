import React, { useEffect, useState } from "react";

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
import { login, logout, restoreSession } from "./services/authService";

function App() {
    // Quản lý trang hiện tại ("home", "category", "saved", "history", "video-detail", "admin")
    const [activePage, setActivePage] = useState("home");
    const [selectedVideo, setSelectedVideo] = useState(null);

    const [user, setUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);
    const [showLogin, setShowLogin] = useState(false);
    const [credentials, setCredentials] = useState({ identity: "", password: "" });
    const [loginError, setLoginError] = useState("");
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    useEffect(() => {
        restoreSession().then(setUser).finally(() => setLoadingUser(false));
    }, []);

    const handleLogin = async (event) => {
        event.preventDefault();
        setLoginError("");
        setIsLoggingIn(true);
        try {
            setUser(await login(credentials.identity, credentials.password));
            setShowLogin(false);
            setCredentials({ identity: "", password: "" });
        } catch (error) {
            setLoginError(error.response?.data?.message || "Không thể đăng nhập. Vui lòng thử lại.");
        } finally {
            setIsLoggingIn(false);
        }
    };

    const handleLogout = () => {
        logout();
        setUser(null);
        setActivePage("home");
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
                        onVideoClick={handleVideoClick}
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
                loading={loadingUser}
                onSearch={handleSearch}
                onLogin={() => setShowLogin(true)}
                onLogout={handleLogout}
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
                {loadingUser ? <p className="empty-state">Đang khởi tạo phiên làm việc...</p> : renderPage()}
            </main>
            {showLogin && (
                <div className="login-overlay" role="dialog" aria-modal="true" aria-labelledby="login-title">
                    <form className="login-modal" onSubmit={handleLogin}>
                        <button type="button" className="login-close" onClick={() => setShowLogin(false)} aria-label="Đóng">×</button>
                        <h2 id="login-title">Đăng nhập</h2>
                        <p>Đăng nhập để lưu bài giảng và theo dõi tiến độ học tập.</p>
                        <label htmlFor="login-identity">Tên đăng nhập hoặc email</label>
                        <input id="login-identity" autoFocus required value={credentials.identity} onChange={(e) => setCredentials({ ...credentials, identity: e.target.value })} />
                        <label htmlFor="login-password">Mật khẩu</label>
                        <input id="login-password" type="password" required value={credentials.password} onChange={(e) => setCredentials({ ...credentials, password: e.target.value })} />
                        {loginError && <p className="login-error">{loginError}</p>}
                        <button className="login-submit" disabled={isLoggingIn}>{isLoggingIn ? "Đang đăng nhập..." : "Đăng nhập"}</button>
                        <small>Tài khoản mẫu: admin / 123456</small>
                    </form>
                </div>
            )}
        </div>
    );
}

export default App;
