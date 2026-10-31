import React from "react";

function ProgressBar({
    progress = 0,
    showLabel = false,
    size = "medium"
}) {
    // Giới hạn giá trị trong khoảng 0 - 100
    const percentage = Math.min(100, Math.max(0, progress));

    return (
        <div className={`progress-container progress-${size}`}>

            <div className="progress-track">
                <div
                    className="progress-fill"
                    style={{ width: `${percentage}%` }}
                />
            </div>

            {showLabel && (
                <span className="progress-label">
                    {percentage}%
                </span>
            )}

        </div>
    );
}

export default ProgressBar;