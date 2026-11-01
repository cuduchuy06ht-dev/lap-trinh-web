import React, { useEffect, useState } from "react";
import ProgressBar from "../../components/ProgressBar";
import { assetUrl } from "../../services/api";
import api from "../../services/api";
import "./HistoryPage.css";

export default function HistoryPage({ onVideoClick }) {
  const [history, setHistory] = useState([]), [filter, setFilter] = useState("all"), [error, setError] = useState("");
  const load = async () => { try { setHistory((await api.get("/history")).data); } catch { setError("Không thể tải lịch sử xem."); } };
  useEffect(() => { load(); }, []);
  const remove = async (id) => { try { await api.delete(`/history/${id}`); setHistory((old) => old.filter((x) => x.id !== id)); } catch { setError("Không thể xóa lịch sử."); } };
  const shown = history.filter((x) => filter === "all" || (filter === "completed" ? x.isCompleted : !x.isCompleted));
  return <div className="history-page"><div className="history-header"><h1>Lịch sử xem</h1><p>Theo dõi tiến độ học tập của bạn</p></div><div className="history-filter-tabs"><button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>Tất cả</button><button className={filter === "watching" ? "active" : ""} onClick={() => setFilter("watching")}>Đang xem</button><button className={filter === "completed" ? "active" : ""} onClick={() => setFilter("completed")}>Đã hoàn thành</button></div>{error && <p className="empty-state">{error}</p>}<div className="history-list">{shown.map((video) => <div className="history-card" key={video.id}><div className="history-thumbnail" onClick={() => onVideoClick?.(video)}><img src={assetUrl(video.thumbnail)} alt={video.title} onError={(e) => { e.currentTarget.src="/images/logo.png"; }} /><span>{video.duration}</span></div><div className="history-video-info"><h3 onClick={() => onVideoClick?.(video)}>{video.title}</h3><p>{video.lecturer}</p><ProgressBar progress={video.progress} showLabel /><div className="history-meta"><span>Đã xem: {video.watchedSeconds}s</span><span>{video.isCompleted ? "Đã hoàn thành" : "Đang xem"}</span><button onClick={() => remove(video.id)}>Xóa</button></div></div></div>)}</div>{!shown.length && !error && <p className="empty-state">Chưa có lịch sử xem phù hợp.</p>}</div>;
}
