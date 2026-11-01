import React, { useEffect, useState } from "react";
import VideoCard from "../../components/VideoCard";
import { getFeaturedLectures, getLatestLectures } from "../../services/lectureService";
import { addBookmark, removeBookmark } from "../../services/bookmarkService";
import "./HomePage.css";

function HomePage({ onVideoClick }) {
  const [featuredVideos, setFeaturedVideos] = useState([]);
  const [latestVideos, setLatestVideos] = useState([]);
  const [error, setError] = useState("");
  const load = async () => {
    try {
      const [featured, latest] = await Promise.all([getFeaturedLectures(), getLatestLectures()]);
      setFeaturedVideos(featured); setLatestVideos(latest);
    } catch { setError("Không thể tải bài giảng. Hãy kiểm tra backend đang chạy."); }
  };
  useEffect(() => { load(); }, []);
  const toggleBookmark = async (id, saved) => {
    try {
      saved ? await addBookmark(id) : await removeBookmark(id);
      const update = (items) => items.map((item) => item.id === id ? { ...item, isBookmarked: saved } : item);
      setFeaturedVideos(update); setLatestVideos(update);
    } catch { setError("Không thể cập nhật bài giảng đã lưu."); }
  };
  return <div className="homepage">
    <section className="home-banner"><div className="banner-content"><span className="banner-welcome">Chào mừng bạn đến với</span><h1>Thư viện video bài giảng<span> NEU</span></h1><p>Nền tảng chia sẻ, lưu trữ và khám phá video bài giảng dành cho cộng đồng NEU.</p><button className="banner-button" onClick={() => document.getElementById("featured-section")?.scrollIntoView({ behavior: "smooth" })}>Khám phá bài giảng →</button></div></section>
    {error && <p className="empty-state">{error}</p>}
    <section className="home-section" id="featured-section"><div className="home-section-header"><h2><span className="section-icon featured-icon">★</span>Bài giảng nổi bật</h2></div><div className="featured-video-grid">{featuredVideos.map((video) => <div key={video.id} onClick={() => onVideoClick?.(video)}><VideoCard video={video} variant="featured" onBookmark={toggleBookmark} /></div>)}</div></section>
    <section className="home-section"><div className="home-section-header"><h2><span className="section-icon latest-icon">◷</span>Bài giảng mới nhất</h2></div><div className="latest-video-grid">{latestVideos.map((video) => <div className="latest-video-item" key={video.id} onClick={() => onVideoClick?.(video)}><VideoCard video={video} variant="latest" onBookmark={toggleBookmark} /></div>)}</div></section>
  </div>;
}
export default HomePage;
