import React, { useEffect, useState } from "react";
import VideoCard from "../../components/VideoCard";
import { getBookmarks, removeBookmark } from "../../services/bookmarkService";
import "./BookmarkPage.css";

export default function BookmarkPage({ onVideoClick }) {
  const [bookmarks, setBookmarks] = useState([]), [error, setError] = useState("");
  const load = async () => { try { setBookmarks(await getBookmarks()); } catch { setError("Không thể tải bài giảng đã lưu."); } };
  useEffect(() => { load(); }, []);
  const remove = async (id) => { try { await removeBookmark(id); setBookmarks((old) => old.filter((x) => x.id !== id)); } catch { setError("Không thể bỏ lưu bài giảng."); } };
  return <div className="bookmark-page"><div className="bookmark-header"><h1>Bài giảng đã lưu</h1><p>{bookmarks.length} bài giảng trong danh sách của bạn</p></div>{error && <p className="empty-state">{error}</p>}<div className="bookmark-video-grid grid">{bookmarks.map((video) => <div key={video.id} className="bookmark-video-card" onClick={() => onVideoClick?.(video)}><VideoCard video={video} variant="featured" onBookmark={(id) => remove(id)} /></div>)}</div>{!bookmarks.length && !error && <p className="empty-state">Bạn chưa lưu bài giảng nào.</p>}</div>;
}
