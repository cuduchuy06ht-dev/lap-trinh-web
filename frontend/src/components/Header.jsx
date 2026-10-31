
import React from "react";

function Header({ user = null, loading = false, onSearch }) {
    return (
        <header className="main-header">

            {/* Logo và tên website */}
            <div className="header-brand">
                <img
                    src="/images/logoNEU.png"
                    alt="NEU Logo"
                    className="header-logo"
                />

                <h1 className="header-title">
                    NEU Video Library
                </h1>
            </div>

            {/* Thanh tìm kiếm */}
            <div className="header-search">
                <svg
                    width="21"
                    height="21"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                </svg>

                <input
                    type="text"
                    placeholder="Tìm kiếm bài giảng, môn học, giảng viên..."
                    onChange={(e) => onSearch?.(e.target.value)}
                />
            </div>

            {/* Thông tin người dùng */}
            <div className="header-user">

                {loading ? (
                    <span>Đang tải...</span>
                ) : user ? (
                    <>
                        <div className="user-avatar">
                            {user.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt="Avatar"
                                />
                            ) : (
                                <span>
                                    {user.name?.charAt(0)?.toUpperCase() || "U"}
                                </span>
                            )}
                        </div>

                        <div className="user-info">
                            <span className="user-name">
                                {user.name}
                            </span>

                            <span className="user-role">
                                {user.role}
                            </span>
                        </div>
                    </>
                ) : (
                    <div className="user-info">
                        <span className="user-name">
                            Chưa đăng nhập
                        </span>
                    </div>
                )}

            </div>

        </header>
    );
}

export default Header;
