import React from 'react';
import './WindowCard.css';

// Extend window interface for global helper functions
declare global {
  interface Window {
    setWindowIcon?: (windowTitle: string, icon: string) => void;
    clearWindowIcons?: () => void;
    listWindowMappings?: () => Record<string, string>;
  }
}

export interface WindowCardProps {
  title: string;
  isActive: boolean;
  isBrowser: boolean;
  windowType: 'application' | 'browser';
  browserName?: string;
  tabTitle?: string;
  className?: string;
  appName?: string; // Add app name identification
  processName?: string; // Add process name for better identification
}

const WindowCard: React.FC<WindowCardProps> = ({
  title,
  isActive,
  isBrowser,
  windowType: _windowType, // Acknowledge but don't use
  browserName,
  tabTitle,
  className = '',
  appName,
  processName
}) => {
  // Function to generate unique background color based on title
  const generateCardColors = (title: string) => {
    // Simple hash function to generate consistent colors for same titles
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
      const char = title.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    // Convert hash to positive number and use it to select colors
    const colorIndex = Math.abs(hash) % 8;
    
    const colorSchemes = [
      // Deep Rose Gold - 高级玫瑰金
      {
        background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(251, 113, 133, 0.12) 50%, rgba(254, 215, 170, 0.1) 100%)',
        border: 'linear-gradient(135deg, rgba(236, 72, 153, 0.4), rgba(251, 113, 133, 0.3), rgba(254, 215, 170, 0.4))',
        shadow: 'rgba(236, 72, 153, 0.2)',
        accent: 'rgba(236, 72, 153, 0.1)'
      },
      // Ocean Depth - 深海蓝调
      {
        background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(8, 145, 178, 0.12) 50%, rgba(30, 64, 175, 0.1) 100%)',
        border: 'linear-gradient(135deg, rgba(6, 182, 212, 0.4), rgba(8, 145, 178, 0.3), rgba(30, 64, 175, 0.4))',
        shadow: 'rgba(6, 182, 212, 0.2)',
        accent: 'rgba(6, 182, 212, 0.1)'
      },
      // Emerald Forest - 翡翠绿
      {
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.12) 50%, rgba(6, 78, 59, 0.1) 100%)',
        border: 'linear-gradient(135deg, rgba(16, 185, 129, 0.4), rgba(5, 150, 105, 0.3), rgba(6, 78, 59, 0.4))',
        shadow: 'rgba(16, 185, 129, 0.2)',
        accent: 'rgba(16, 185, 129, 0.1)'
      },
      // Royal Purple - 皇家紫
      {
        background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.15) 0%, rgba(126, 34, 206, 0.12) 50%, rgba(88, 28, 135, 0.1) 100%)',
        border: 'linear-gradient(135deg, rgba(147, 51, 234, 0.4), rgba(126, 34, 206, 0.3), rgba(88, 28, 135, 0.4))',
        shadow: 'rgba(147, 51, 234, 0.2)',
        accent: 'rgba(147, 51, 234, 0.1)'
      },
      // Sunset Amber - 夕阳琥珀
      {
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(217, 119, 6, 0.12) 50%, rgba(180, 83, 9, 0.1) 100%)',
        border: 'linear-gradient(135deg, rgba(245, 158, 11, 0.4), rgba(217, 119, 6, 0.3), rgba(180, 83, 9, 0.4))',
        shadow: 'rgba(245, 158, 11, 0.2)',
        accent: 'rgba(245, 158, 11, 0.1)'
      },
      // Steel Gray - 钢铁灰
      {
        background: 'linear-gradient(135deg, rgba(71, 85, 105, 0.15) 0%, rgba(51, 65, 85, 0.12) 50%, rgba(30, 41, 59, 0.1) 100%)',
        border: 'linear-gradient(135deg, rgba(71, 85, 105, 0.4), rgba(51, 65, 85, 0.3), rgba(30, 41, 59, 0.4))',
        shadow: 'rgba(71, 85, 105, 0.2)',
        accent: 'rgba(71, 85, 105, 0.1)'
      },
      // Crimson Fire - 深红火焰
      {
        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(185, 28, 28, 0.12) 50%, rgba(127, 29, 29, 0.1) 100%)',
        border: 'linear-gradient(135deg, rgba(239, 68, 68, 0.4), rgba(185, 28, 28, 0.3), rgba(127, 29, 29, 0.4))',
        shadow: 'rgba(239, 68, 68, 0.2)',
        accent: 'rgba(239, 68, 68, 0.1)'
      },
      // Midnight Blue - 午夜蓝
      {
        background: 'linear-gradient(135deg, rgba(67, 56, 202, 0.15) 0%, rgba(55, 48, 163, 0.12) 50%, rgba(49, 46, 129, 0.1) 100%)',
        border: 'linear-gradient(135deg, rgba(67, 56, 202, 0.4), rgba(55, 48, 163, 0.3), rgba(49, 46, 129, 0.4))',
        shadow: 'rgba(67, 56, 202, 0.2)',
        accent: 'rgba(67, 56, 202, 0.1)'
      }
    ];
    
    return colorSchemes[colorIndex];
  };

  // Function to get app icon based on app name, process name, or title
  const getAppIcon = (): string => {
    const appIdentifier = (appName || processName || title || '').toLowerCase();
    
    // User-configurable app mappings stored in localStorage
    const customMappings = JSON.parse(localStorage.getItem('windowAppMappings') || '{}');
    if (customMappings[title]) {
      return customMappings[title];
    }
    
    // Browser applications
    if (isBrowser) {
      if (browserName?.toLowerCase().includes('chrome') || appIdentifier.includes('chrome')) return '🌐';
      if (browserName?.toLowerCase().includes('edge') || appIdentifier.includes('edge')) return '🌍';
      if (browserName?.toLowerCase().includes('firefox') || appIdentifier.includes('firefox')) return '🦊';
      if (browserName?.toLowerCase().includes('safari') || appIdentifier.includes('safari')) return '🧭';
      return '🌐'; // Default browser icon
    }
    
    // Popular applications - updated with more specific icons (order matters!)
    // Check process name first (most reliable), then check specific apps
    if (processName) {
      const processLower = processName.toLowerCase();
      if (processLower.includes('notion')) return '🗂️';
      if (processLower.includes('clickup')) return '🎯';
      if (processLower.includes('code')) return '💻';
      if (processLower.includes('chrome')) return '🌐';
      if (processLower.includes('edge')) return '🌍';
      if (processLower.includes('firefox')) return '🦊';
      if (processLower.includes('discord')) return '💬';
      if (processLower.includes('slack')) return '💼';
      if (processLower.includes('figma')) return '🎨';
      if (processLower.includes('spotify')) return '🎵';
      if (processLower.includes('zoom')) return '📹';
    }
    
    // Fallback to title-based detection
    if (appIdentifier.includes('clickup') || appIdentifier.includes('planner') || appIdentifier.includes('clair workspace')) return '🎯';
    
    // Notion detection - specific patterns only
    if (appIdentifier.includes('notion') || 
        appIdentifier.includes('breakthrough method') || 
        appIdentifier.includes('bmad')) return '🗂️';
    if (appIdentifier.includes('claude code')) return '🔧';
    if (appIdentifier.includes('claude')) return '🤖';
    if (appIdentifier.includes('chatgpt') || appIdentifier.includes('chat gpt') || appIdentifier.includes('openai')) return '🧠';
    
    // Video services - check with more specific conditions  
    if ((appIdentifier.includes('youtube.com') || (isBrowser && tabTitle?.toLowerCase().includes('youtube'))) && 
        !appIdentifier.includes('planner') && !appIdentifier.includes('clair workspace') && 
        !appIdentifier.includes('breakthrough method') && !appIdentifier.includes('bmad')) return '📺';
    if (appIdentifier.includes('netflix') || (isBrowser && appIdentifier.includes('netflix.com'))) return '🎬';
    if (appIdentifier.includes('twitch') || (isBrowser && appIdentifier.includes('twitch.tv'))) return '🎮';
    if (appIdentifier.includes('vscode') || appIdentifier.includes('visual studio code')) return '💻';
    if (appIdentifier.includes('discord')) return '💬';
    if (appIdentifier.includes('slack')) return '💼';
    if (appIdentifier.includes('figma')) return '🎨';
    if (appIdentifier.includes('photoshop')) return '🖼️';
    if (appIdentifier.includes('spotify')) return '🎵';
    if (appIdentifier.includes('zoom')) return '📹';
    if (appIdentifier.includes('teams')) return '👥';
    if (appIdentifier.includes('telegram')) return '📱';
    if (appIdentifier.includes('whatsapp')) return '💚';
    if (appIdentifier.includes('linear')) return '📐';
    if (appIdentifier.includes('github') || (isBrowser && appIdentifier.includes('github.com'))) return '🐙';
    if (appIdentifier.includes('twitter') || appIdentifier.includes('x.com') || (isBrowser && (appIdentifier.includes('twitter.com') || appIdentifier.includes('x.com')))) return '🐦';
    if (appIdentifier.includes('instagram') || (isBrowser && appIdentifier.includes('instagram.com'))) return '📷';
    if (appIdentifier.includes('linkedin') || (isBrowser && appIdentifier.includes('linkedin.com'))) return '💼';
    if (appIdentifier.includes('reddit') || (isBrowser && appIdentifier.includes('reddit.com'))) return '🔴';
    if (appIdentifier.includes('terminal') || appIdentifier.includes('cmd') || appIdentifier.includes('powershell')) return '⚡';
    if (appIdentifier.includes('finder') || appIdentifier.includes('explorer')) return '📁';
    if (appIdentifier.includes('calculator')) return '🧮';
    if (appIdentifier.includes('mail') || appIdentifier.includes('outlook')) return '📧';
    if (appIdentifier.includes('calendar')) return '📅';
    if (appIdentifier.includes('notes')) return '📄';
    if (appIdentifier.includes('excel')) return '📊';
    if (appIdentifier.includes('word')) return '📝';
    if (appIdentifier.includes('powerpoint')) return '📽️';
    if (appIdentifier.includes('docker')) return '🐳';
    if (appIdentifier.includes('git')) return '🌿';
    
    // Default icons based on status
    if (isActive) return '▶️';
    return '📋';
  };
  
  // Add global helper function for manual icon mapping (can be used in browser console)
  React.useEffect(() => {
    if (!window.setWindowIcon) {
      window.setWindowIcon = (windowTitle: string, icon: string) => {
        const mappings = JSON.parse(localStorage.getItem('windowAppMappings') || '{}');
        mappings[windowTitle] = icon;
        localStorage.setItem('windowAppMappings', JSON.stringify(mappings));
        console.log(`Icon "${icon}" set for window: "${windowTitle}"`);
      };
      
      window.clearWindowIcons = () => {
        localStorage.removeItem('windowAppMappings');
        console.log('All custom window icon mappings cleared');
      };
      
      window.listWindowMappings = () => {
        const mappings = JSON.parse(localStorage.getItem('windowAppMappings') || '{}');
        console.log('Current window icon mappings:', mappings);
        return mappings;
      };
    }
  }, []);

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

  // Get unique colors for this card
  const cardColors = generateCardColors(title);

  return (
    <div 
      className={cardClasses}
      style={{
        background: cardColors.background,
        borderImage: cardColors.border + ' 1',
        boxShadow: `
          0 16px 50px ${cardColors.shadow},
          0 12px 35px ${cardColors.shadow}aa,
          0 8px 25px ${cardColors.shadow}88,
          0 4px 15px ${cardColors.shadow}66,
          inset 0 1px 0 rgba(255, 255, 255, 0.4),
          inset 0 -1px 0 ${cardColors.accent}
        `,
        position: 'relative'
      }}
    >
      {/* Enhanced glass overlay with accent color */}
      <div 
        className="window-card__glass-overlay"
        style={{
          background: `linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.2) 0%,
            ${cardColors.accent} 30%,
            rgba(255, 255, 255, 0.1) 70%,
            ${cardColors.accent} 100%
          )`
        }}
      />
      
      {/* Subtle shine effect for premium feel */}
      <div 
        className="window-card__shine-overlay"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '40%',
          background: `linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.15) 0%,
            rgba(255, 255, 255, 0.05) 50%,
            transparent 100%
          )`,
          borderRadius: '16px 16px 0 0',
          pointerEvents: 'none',
          zIndex: 1
        }}
      />
      
      {/* Content layer */}
      <div className="window-card__content">
        {/* Icon indicator with dynamic theming */}
        <div 
          className="window-card__icon"
          style={{
            background: `linear-gradient(135deg, ${cardColors.accent} 0%, rgba(255, 255, 255, 0.1) 100%)`,
            border: `1px solid ${cardColors.shadow}66`,
            color: '#fff',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
          }}
        >
          {getAppIcon()}
        </div>
        
        {/* Title section */}
        <div className="window-card__title-section">
          <h3 className="window-card__title" title={displayTitle}>
            {truncatedTitle}
          </h3>
          
          {/* App/Browser badge */}
          {isBrowser && browserName && (
            <span className="window-card__browser-badge">
              {browserName}
            </span>
          )}
          {!isBrowser && appName && (
            <span 
              className="window-card__app-badge"
              style={{
                background: `linear-gradient(135deg, ${cardColors.shadow} 0%, ${cardColors.accent} 100%)`,
                color: '#fff',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                border: `1px solid ${cardColors.shadow}aa`
              }}
            >
              {appName}
            </span>
          )}
        </div>
        
        {/* Active indicator with dynamic theming */}
        {isActive && (
          <div 
            className="window-card__active-indicator"
            style={{
              background: cardColors.shadow,
              boxShadow: `
                0 0 0 2px rgba(255, 255, 255, 0.4),
                0 0 20px ${cardColors.shadow},
                0 0 40px ${cardColors.accent}
              `
            }}
          />
        )}
      </div>
      
      {/* Border glow effect */}
      <div className="window-card__border-glow" />
    </div>
  );
};

export default WindowCard;