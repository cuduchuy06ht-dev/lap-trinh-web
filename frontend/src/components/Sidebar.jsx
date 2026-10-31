
import React, { useState } from "react";

function Sidebar({ activeItem = "home", onNavigate }) {

    const [active, setActive] = useState(activeItem);

    const menuItems = [
        {
            id: "home",
            label: "Trang chủ",
            icon: (
                <svg viewBox="0 0 24 24">
                    <path d="m3 10 9-7 9 7" />
                    <path d="M5 9v12h14V9" />
                    <path d="M9 21v-7h6v7" />
                </svg>
            )
        },
        {
            id: "category",
            label: "Danh mục môn học",
            icon: (
                <svg viewBox="0 0 24 24">
                    <rect x="4" y="3" width="6" height="18" rx="1" />
                    <rect x="14" y="3" width="6" height="18" rx="1" />
                    <path d="M7 7h0M17 7h0" />
                </svg>
            )
        },
        {
            id: "saved",
            label: "Bài giảng đã lưu",
            icon: (
                <svg viewBox="0 0 24 24">
                    <path d="M6 3h12a2 2 0 0 1 2 2v16l-8-5-8 5V5a2 2 0 0 1 2-2z" />
                </svg>
            )
        },
        {
            id: "history",
            label: "Lịch sử xem",
            icon: (
                <svg viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 2" />
                </svg>
            )
        }
    ];

    const handleNavigate = (item) => {
        setActive(item.id);

        if (onNavigate) {
            onNavigate(item.id);
        }
    };

    return (
        <aside className="sidebar">

            {/* Danh sách menu */}
            <nav className="sidebar-menu">

                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        className={`sidebar-item ${
                            active === item.id ? "active" : ""
                        }`}
                        onClick={() => handleNavigate(item)}
                    >
                        <span className="sidebar-icon">
                            {item.icon}
                        </span>

                        <span className="sidebar-label">
                            {item.label}
                        </span>
                    </button>
                ))}

            </nav>

            {/* Đường phân cách */}
            <div className="sidebar-divider"></div>

        </aside>
    );
}

export default Sidebar;
