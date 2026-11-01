import React, { useRef, useState, useEffect, useCallback } from 'react';
import { trackWatchProgress } from '../../services/historyService';

export default function Player({ lecture, initialProgress = 0, onEnded }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);

  const lastSyncTimeRef = useRef(0);
  const hasResumedRef = useRef(false);
  const currentTimeRef = useRef(0);
  currentTimeRef.current = currentTime;

  useEffect(() => {
    hasResumedRef.current = false;
    setCurrentTime(0);
    setIsPlaying(false);
  }, [lecture?.id]);

  const syncProgress = useCallback(
    (seconds, isCompleted = false) => {
      if (!lecture?.id) return;
      trackWatchProgress({
        lectureId: lecture.id,
        progressSeconds: seconds,
        isCompleted,
      });
    },
    [lecture?.id]
  );

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (videoRef.current && lecture?.id) {
        syncProgress(currentTimeRef.current);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      syncProgress(currentTimeRef.current);
    };
  }, [lecture?.id, syncProgress]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;
      if (!videoRef.current) return;

      switch (e.code) {
        case 'Space':
        case 'KeyK':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          handleSkip(-10);
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleSkip(10);
          break;
        case 'KeyF':
          e.preventDefault();
          handleFullScreen();
          break;
        case 'KeyM':
          e.preventDefault();
          videoRef.current.muted = !videoRef.current.muted;
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      if (!hasResumedRef.current && initialProgress > 0 && initialProgress < videoRef.current.duration - 5) {
        videoRef.current.currentTime = initialProgress;
        setCurrentTime(initialProgress);
        hasResumedRef.current = true;
      }
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    setCurrentTime(current);

    const now = Date.now();
    if (now - lastSyncTimeRef.current > 5000) {
      lastSyncTimeRef.current = now;
      const isCompleted = duration > 0 && current / duration >= 0.9;
      syncProgress(current, isCompleted);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
      syncProgress(videoRef.current.currentTime);
    }
  };

  const handleSkip = (seconds) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.min(
      Math.max(videoRef.current.currentTime + seconds, 0),
      duration
    );
  };

  const handleSpeedChange = (e) => {
    const speed = parseFloat(e.target.value);
    setPlaybackRate(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const handleFullScreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if (videoRef.current.webkitRequestFullscreen) {
        videoRef.current.webkitRequestFullscreen();
      }
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    syncProgress(duration, true);
    if (onEnded) onEnded();
  };

  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds)) return '00:00';
    const mins = Math.floor(timeInSeconds / 60);
    const secs = Math.floor(timeInSeconds % 60);
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="custom-player-wrapper">
      <video
        ref={videoRef}
        src={lecture?.videoUrl}
        poster={lecture?.thumbnailUrl}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleVideoEnded}
        onClick={togglePlay}
        className="main-video-element"
      />

      <div className="player-controls">
        <input
          type="range"
          min={0}
          max={duration || 100}
          value={currentTime}
          onChange={(e) => {
            const newTime = parseFloat(e.target.value);
            setCurrentTime(newTime);
            if (videoRef.current) videoRef.current.currentTime = newTime;
          }}
          className="player-timeline"
        />

        <div className="controls-bar">
          <div className="controls-left">
            <button type="button" onClick={togglePlay} className="control-btn play-btn">
              {isPlaying ? '❚❚ Tạm dừng' : '▶ Phát'}
            </button>
            <button type="button" onClick={() => handleSkip(-10)} className="control-btn" title="Tua lùi 10 giây">
              ↺ -10s
            </button>
            <button type="button" onClick={() => handleSkip(10)} className="control-btn" title="Tua tiếp 10 giây">
              +10s ↻
            </button>
            <span className="time-display">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="controls-right">
            <select
              value={playbackRate}
              onChange={handleSpeedChange}
              className="speed-selector"
            >
              <option value="0.75">0.75x</option>
              <option value="1">1.0x (Chuẩn)</option>
              <option value="1.25">1.25x</option>
              <option value="1.5">1.5x</option>
              <option value="2">2.0x</option>
            </select>

            <button type="button" onClick={handleFullScreen} className="control-btn" title="Toàn màn hình">
              ⛶ Toàn màn hình
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
