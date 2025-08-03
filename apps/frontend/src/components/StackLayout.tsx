import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import WindowCard from './WindowCard';
import './StackLayout.css';

interface WindowInfo {
  title: string;
  active: boolean;
  is_browser: boolean;
  window_type: 'application' | 'browser';
  browser_name?: string;
  tab_title?: string;
  process_name?: string;
}

interface WindowHistoryEntry {
  title: string;
  lastActiveTime: number;
  activationCount: number;
}

export interface StackLayoutProps {
  windows: WindowInfo[];
  maxVisibleWindows?: number;
}

interface PositionedWindow extends WindowInfo {
  zIndex: number;
  scale: number;
  offsetX: number;
  offsetY: number;
  opacity: number;
  animationDelay: number;
  isTransitioning: boolean;
  historyDepth: number;
  recencyScore: number;
  visualAge: number;
}

const StackLayout: React.FC<StackLayoutProps> = ({ windows, maxVisibleWindows = 7 }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [prevActiveWindow, setPrevActiveWindow] = useState<string | null>(null);
  const [windowHistory, setWindowHistory] = useState<Map<string, WindowHistoryEntry>>(new Map());
  const animationTimeoutRef = useRef<number | null>(null);
  const lastRenderTimeRef = useRef<number>(Date.now());
  
  // Track active window changes for animation coordination
  const currentActiveWindow = windows.find(w => w.active)?.title || null;
  
  // Update window history when active window changes
  useEffect(() => {
    if (currentActiveWindow && currentActiveWindow !== prevActiveWindow) {
      setWindowHistory(prev => {
        const newHistory = new Map(prev);
        const now = Date.now();
        
        // Update current active window's history
        const existing = newHistory.get(currentActiveWindow);
        newHistory.set(currentActiveWindow, {
          title: currentActiveWindow,
          lastActiveTime: now,
          activationCount: (existing?.activationCount || 0) + 1
        });
        
        // Ensure all visible windows have history entries
        windows.forEach(window => {
          if (!newHistory.has(window.title)) {
            newHistory.set(window.title, {
              title: window.title,
              lastActiveTime: now - 300000, // 5 minutes ago as default
              activationCount: 0
            });
          }
        });
        
        return newHistory;
      });
    }
  }, [currentActiveWindow, prevActiveWindow, windows]);
  
  // Calculate recency scores for history-based positioning
  const calculateRecencyScore = (historyEntry: WindowHistoryEntry, currentTime: number): number => {
    try {
      if (!historyEntry || typeof historyEntry.lastActiveTime !== 'number' || typeof historyEntry.activationCount !== 'number') {
        console.warn('Invalid history entry:', historyEntry);
        return 0;
      }
      
      const timeSinceActive = currentTime - historyEntry.lastActiveTime;
      const maxAge = 3600000; // 1 hour in milliseconds
      
      // Validate time calculations
      if (timeSinceActive < 0) {
        console.warn('Future timestamp detected in history entry:', historyEntry);
        return 1; // Treat as very recent
      }
      
      // Base recency score (0-1, higher = more recent)
      const timeScore = Math.max(0, 1 - (timeSinceActive / maxAge));
      
      // Activation frequency bonus (0-0.5, higher = more frequently used)
      const frequencyScore = Math.min(0.5, Math.max(0, historyEntry.activationCount) * 0.1);
      
      return Math.min(1, timeScore + frequencyScore);
    } catch (error) {
      console.error('Error calculating recency score:', error);
      return 0;
    }
  };
  
  useEffect(() => {
    if (currentActiveWindow !== prevActiveWindow && prevActiveWindow !== null) {
      // Active window has changed - trigger animation
      setIsAnimating(true);
      
      // Clear existing timeout
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
      
      // Reset animation state after animation completes
      animationTimeoutRef.current = window.setTimeout(() => {
        setIsAnimating(false);
      }, 450); // Slightly longer than CSS transition duration
    }
    
    setPrevActiveWindow(currentActiveWindow);
  }, [currentActiveWindow, prevActiveWindow]);
  
  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, []);

  // Memoize window processing for performance
  const processWindowsForStack = useCallback((): PositionedWindow[] => {
    try {
      if (!windows || windows.length === 0) return [];

      const currentTime = Date.now();
    
    // Find active window
    const activeWindowIndex = windows.findIndex(w => w.active);
    const activeWindow = activeWindowIndex >= 0 ? windows[activeWindowIndex] : null;
    
    // Get inactive windows (excluding active) and sort by recency
    const inactiveWindows = windows
      .filter((_, index) => index !== activeWindowIndex)
      .map(window => {
        const historyEntry = windowHistory.get(window.title);
        const recencyScore = historyEntry ? calculateRecencyScore(historyEntry, currentTime) : 0;
        return { window, recencyScore, historyEntry };
      })
      .sort((a, b) => b.recencyScore - a.recencyScore) // Most recent first
      .map(item => item.window);
    
    // Limit the number of visible windows
    const visibleInactiveWindows = inactiveWindows.slice(0, maxVisibleWindows - 1);
    
    const positionedWindows: PositionedWindow[] = [];

    // Add inactive windows (background stack) with history-based positioning
    visibleInactiveWindows.forEach((window, index) => {
      const historyEntry = windowHistory.get(window.title);
      const recencyScore = historyEntry ? calculateRecencyScore(historyEntry, currentTime) : 0;
      
      // Calculate position based on stack index and recency
      const stackPosition = index;
      const historyDepth = stackPosition;
      
      // History-enhanced scaling (more recent = larger)
      const baseScaleReduction = Math.min(stackPosition * 0.08, 0.4);
      const historyBonus = recencyScore * 0.05; // Up to 5% size bonus for recent windows
      const scale = Math.max(0.6, 1 - baseScaleReduction + historyBonus);
      
      // Enhanced vertical-focused layout for narrow, tall application scenarios
      // Prioritize vertical distribution over horizontal spread
      const rowHeight = 75; // Slightly more compact vertical spacing
      const colWidth = 120; // Reduced horizontal spacing for narrower layout
      
      // Calculate grid position optimized for vertical layout (2 cards per row max)
      const row = Math.floor(stackPosition / 2); // Only 2 cards per row for more vertical layout
      const col = stackPosition % 2;
      
      // Base grid positioning with reduced horizontal spread
      let baseOffsetX = (col - 0.5) * colWidth; // Center between two columns: -60px and +60px
      let baseOffsetY = row * rowHeight;
      
      // Add vertical-focused staggered offset
      const staggerOffsetX = (stackPosition % 2 === 0 ? -1 : 1) * (15 + stackPosition * 8); // Reduced horizontal variation
      const staggerOffsetY = (stackPosition % 3 === 0 ? -1 : 1) * (35 + stackPosition * 15); // Slightly reduced vertical variation for more density
      
      // Add additional vertical randomness for natural flow, but more compact
      const verticalRandomness = Math.sin(stackPosition * 1.4) * 35 + Math.cos(stackPosition * 0.9) * 25;
      
      // Minimal horizontal rotation offset to keep cards more centered
      const rotationOffset = Math.sin(stackPosition * 0.5) * 15; // Reduced horizontal drift
      
      // History-enhanced positioning (more recent = less scattered)
      const historyMultiplier = 0.8 + (1 - recencyScore) * 0.5;
      const offsetX = (baseOffsetX + staggerOffsetX + rotationOffset) * historyMultiplier;
      const offsetY = (baseOffsetY + staggerOffsetY + verticalRandomness) * historyMultiplier;
      
      // History-enhanced opacity (more recent = more visible)
      const baseOpacityReduction = Math.min(stackPosition * 0.15, 0.6);
      const historyOpacityBonus = recencyScore * 0.2; // Up to 20% opacity bonus
      const opacity = Math.max(0.4, 1 - baseOpacityReduction + historyOpacityBonus);
      
      // Z-index for proper layering (higher recency = higher z-index within stack)
      const baseZIndex = 100 - stackPosition;
      const historyZBonus = Math.floor(recencyScore * 10); // Up to +10 z-index
      const zIndex = baseZIndex + historyZBonus;
      
      // Animation delay for staggered effect (more recent = faster animation)
      const baseDelay = isAnimating ? stackPosition * 50 : 0;
      const historyDelayReduction = recencyScore * 20; // Up to 20ms faster
      const animationDelay = Math.max(0, baseDelay - historyDelayReduction);
      
      // Visual age calculation (0 = very recent, 1 = very old)
      const visualAge = 1 - recencyScore;

      positionedWindows.push({
        ...window,
        zIndex,
        scale,
        offsetX,
        offsetY,
        opacity,
        animationDelay,
        isTransitioning: isAnimating,
        historyDepth,
        recencyScore,
        visualAge
      });
    });

    // Add active window (always on top)
    if (activeWindow) {
      const historyEntry = windowHistory.get(activeWindow.title);
      const recencyScore = historyEntry ? calculateRecencyScore(historyEntry, currentTime) : 1;
      
      positionedWindows.push({
        ...activeWindow,
        zIndex: 1000, // Highest z-index
        scale: 1, // Full size
        offsetX: 0, // Centered
        offsetY: 0, // Centered  
        opacity: 1, // Full opacity
        animationDelay: 0, // Active window animates immediately
        isTransitioning: isAnimating,
        historyDepth: 0, // Currently active
        recencyScore,
        visualAge: 0 // Currently active = not aged
      });
    }

    return positionedWindows;
    } catch (error) {
      console.error('Error processing windows for stack:', error);
      // Return fallback empty array to prevent component crash
      return [];
    }
  }, [windows, windowHistory, isAnimating, maxVisibleWindows]);

  // Memoize positioned windows to prevent unnecessary recalculations
  const positionedWindows = useMemo(() => {
    const now = Date.now();
    const timeSinceLastRender = now - lastRenderTimeRef.current;
    
    // Throttle excessive updates (max 60fps)
    if (timeSinceLastRender < 16 && !isAnimating) {
      return processWindowsForStack();
    }
    
    lastRenderTimeRef.current = now;
    return processWindowsForStack();
  }, [processWindowsForStack, isAnimating]);

  if (positionedWindows.length === 0) {
    return (
      <div className="stack-layout stack-layout--empty">
        <div className="stack-layout__empty-message">
          <div className="stack-layout__empty-icon">📋</div>
          <p>No windows to display</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`stack-layout ${isAnimating ? 'stack-layout--animating' : ''}`}>
      <div className="stack-layout__container">
        {positionedWindows.map((window, index) => {
          // Determine visual age class based on recency score
          let ageClass = '';
          if (window.visualAge <= 0.25) {
            ageClass = 'stack-layout__window-wrapper--aged-recent';
          } else if (window.visualAge <= 0.5) {
            ageClass = 'stack-layout__window-wrapper--aged-moderate';
          } else if (window.visualAge <= 0.75) {
            ageClass = 'stack-layout__window-wrapper--aged-old';
          } else {
            ageClass = 'stack-layout__window-wrapper--aged-ancient';
          }
          
          // Determine history class for card styling
          let historyClass = '';
          if (window.recencyScore >= 0.75) {
            historyClass = 'window-card--history-recent';
          } else if (window.recencyScore >= 0.5) {
            historyClass = 'window-card--history-moderate';
          } else if (window.recencyScore >= 0.25) {
            historyClass = 'window-card--history-old';
          } else {
            historyClass = 'window-card--history-ancient';
          }
          
          return (
            <div
              key={`${window.title}-${index}`}
              className={`stack-layout__window-wrapper ${
                window.active ? 'stack-layout__window-wrapper--active' : 'stack-layout__window-wrapper--inactive'
              } ${window.isTransitioning ? 'stack-layout__window-wrapper--transitioning' : ''} ${
                !window.active ? ageClass : ''
              }`}
              style={{
                zIndex: window.zIndex,
                transform: `translate(-50%, -50%) translate(${window.offsetX}px, ${window.offsetY}px) scale(${window.scale}) rotate(${window.active ? 0 : Math.sin(index * 1.3) * 12 + Math.cos(index * 0.7) * 6}deg)`,
                opacity: window.opacity,
                position: 'absolute',
                left: '50%',
                top: '50%',
                transition: window.isTransitioning 
                  ? `all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${window.animationDelay}ms`
                  : 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                willChange: window.isTransitioning ? 'transform, opacity' : 'auto'
              }}
            >
              <WindowCard
                title={window.title}
                isActive={window.active}
                isBrowser={window.is_browser}
                windowType={window.window_type}
                browserName={window.browser_name}
                tabTitle={window.tab_title}
                processName={window.process_name}
                className={`${window.active ? 'window-card--stack-active' : 'window-card--stack-inactive'} ${
                  !window.active ? historyClass : ''
                }`}
              />
            </div>
          );
        })}
      </div>
      
      {/* Stack info overlay */}
      <div className="stack-layout__info">
        <span className="stack-layout__count">
          {positionedWindows.length} window{positionedWindows.length !== 1 ? 's' : ''}
        </span>
        {windows.length > maxVisibleWindows && (
          <span className="stack-layout__overflow">
            +{windows.length - maxVisibleWindows} more
          </span>
        )}
      </div>
    </div>
  );
};

export default StackLayout;