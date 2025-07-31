import React from 'react';
import './WindowCard.css';

export interface WindowCardProps {
  title: string;
  isActive: boolean;
  isBrowser: boolean;
  windowType: 'application' | 'browser';
  browserName?: string;
  tabTitle?: string;
  className?: string;
}

const WindowCard: React.FC<WindowCardProps> = ({
  title,
  isActive,
  isBrowser,
  windowType: _windowType, // Acknowledge but don't use
  browserName,
  tabTitle,
  className = ''
}) => {
  // Determine display title - prefer tab title for browsers
  const displayTitle = isBrowser && tabTitle ? tabTitle : title;
  
  // Truncate long titles for better UI
  const truncatedTitle = displayTitle.length > 60 
    ? `${displayTitle.substring(0, 57)}...`
    : displayTitle;

  // Generate CSS classes
  const cardClasses = [
    'window-card',
    isActive ? 'window-card--active' : 'window-card--inactive',
    isBrowser ? 'window-card--browser' : 'window-card--application',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClasses}>
      {/* Glass overlay for frosted effect */}
      <div className="window-card__glass-overlay" />
      
      {/* Content layer */}
      <div className="window-card__content">
        {/* Icon indicator */}
        <div className="window-card__icon">
          {isActive ? '▶' : isBrowser ? '🌐' : '📋'}
        </div>
        
        {/* Title section */}
        <div className="window-card__title-section">
          <h3 className="window-card__title" title={displayTitle}>
            {truncatedTitle}
          </h3>
          
          {/* Browser badge */}
          {isBrowser && browserName && (
            <span className="window-card__browser-badge">
              {browserName}
            </span>
          )}
        </div>
        
        {/* Active indicator */}
        {isActive && (
          <div className="window-card__active-indicator" />
        )}
      </div>
      
      {/* Border glow effect */}
      <div className="window-card__border-glow" />
    </div>
  );
};

export default WindowCard;