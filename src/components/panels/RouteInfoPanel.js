// src/components/panels/RouteInfoPanel.js
import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import './RouteInfoPanel.css';

const RouteInfoPanel = ({ 
  routeInfo,
  routeType,
  formatDistance,
  formatTime
}) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const panelRef = useRef(null);
  const panelClassName = `route-info-panel ${routeType === 'safe' ? 'safe-mode' : ''}`;

  // 패널 클릭 시 토글
  const handlePanelClick = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  // 터치 이벤트 처리
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    const startY = touch.clientY;

    const handleTouchMove = (e) => {
      const currentY = e.touches[0].clientY;
      const deltaY = startY - currentY;

      if (deltaY > 50) { // 위로 스와이프
        setIsPanelOpen(true);
      } else if (deltaY < -50) { // 아래로 스와이프
        setIsPanelOpen(false);
      }
    };

    const handleTouchEnd = () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  };

  return (
    <div className="route-info-panel">
      <div className="widget-scroll">
        {routeInfo && !routeInfo.error && (
          <>
            <div className="route-info-widget">
              <span className="widget-label">총 거리</span>
              <span className="widget-value">{formatDistance(routeInfo.distance)}</span>
            </div>
            
            <div className="route-info-widget">
              <span className="widget-label">예상 시간</span>
              <span className="widget-value">{formatTime(routeInfo.time)}</span>
            </div>
            
            {/* 안전 경로일 때만 표시되는 추가 위젯들 */}
            {routeType === 'safe' && routeInfo?.safety && (
              <>
                <div className="route-info-widget">
                  <span className="widget-label">경로 안전도</span>
                  <span className="widget-value">{routeInfo.safety.grade}</span>
                </div>
                
                <div className="route-info-widget">
                  <span className="widget-label">CCTV 수</span>
                  <span className="widget-value">{routeInfo.cctvCount}개</span>
                </div>
                
                <div className="route-info-widget">
                  <span className="widget-label">편의점 수</span>
                  <span className="widget-value">{routeInfo.storeCount}개</span>
                </div>
              </>
            )}
          </>
        )}
        
        {routeInfo?.error && (
          <div className="route-info-widget" style={{ backgroundColor: '#fff3f3', color: '#ff0000' }}>
            <span className="widget-value">{routeInfo.error}</span>
          </div>
        )}
      </div>
      <button className="follow-button">따라가기</button>
    </div>
  );
};

RouteInfoPanel.propTypes = {
  routeInfo: PropTypes.object,
  routeType: PropTypes.string,
  formatDistance: PropTypes.func,
  formatTime: PropTypes.func
};

export default RouteInfoPanel;