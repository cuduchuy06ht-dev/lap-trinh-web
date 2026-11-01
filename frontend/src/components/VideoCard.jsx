import React from "react";
import { assetUrl } from "../services/api";

function VideoCard({
    video,
    variant = "featured",
    onBookmark
}) {
    const handleBookmark = (event) => {
        event.stopPropagation();
        onBookmark?.(video.id, !video.isBookmarked);
    };

    return (
        <div className={`video-card video-card-${variant}`}>

            <div className="video-thumbnail">
                <img
                    src={assetUrl(video.thumbnail || video.thumbnailUrl)}
                    alt={video.title}
                    onError={(event) => { event.currentTarget.src = "/images/logo.png"; }}
                />

                <span className="video-duration">
                    {video.duration}
                </span>
            </div>

            <div className="video-info">
                <h3 className="video-title">
                    {video.title}
                </h3>

                <div className="video-lecturer">
                    <img
                        src={assetUrl(video.avatar) || "/images/logo.png"}
                        alt={video.lecturer}
                    />

                    <span>{video.lecturer}</span>
                </div>

                <div className="video-card-footer">
                    <div className="video-views">
                        <span>{video.views} lượt xem</span>
                    </div>

                    <button
                        className={`video-bookmark ${
                            video.isBookmarked ? "bookmarked" : ""
                        }`}
                        onClick={handleBookmark}
                        aria-label="Lưu bài giảng"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill={video.isBookmarked ? "currentColor" : "none"}
                            stroke="currentColor"
                            strokeWidth="1.8"
                        >
                            <path d="M6 3h12a2 2 0 0 1 2 2v16l-8-5-8 5V5a2 2 0 0 1 2-2z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default VideoCard;
