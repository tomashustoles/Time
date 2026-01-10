import { useState, useEffect } from 'react';
import { useNews } from '../hooks/useNews';
import { getRelativeTime, cn } from '../lib/utils';
import type { NewsArticle } from '../types';

interface HeadlinesProps {
  className?: string;
  rotateInterval?: number; // milliseconds
}

export function Headlines({ className, rotateInterval = 8000 }: HeadlinesProps) {
  const { articles, loading, error } = useNews();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Rotate through headlines
  useEffect(() => {
    if (articles.length <= 1) return;

    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % articles.length);
        setIsAnimating(false);
      }, 300); // Match animation duration
    }, rotateInterval);

    return () => clearInterval(interval);
  }, [articles.length, rotateInterval]);

  // Loading state
  if (loading && articles.length === 0) {
    return (
      <div className={cn('flex flex-col gap-1', className)}>
        <div className="h-4 w-32 bg-muted animate-pulse rounded" />
        <div className="h-6 w-64 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  // Error or no articles
  if (error || articles.length === 0) {
    return (
      <div className={cn('flex flex-col gap-1', className)}>
        <span className="text-foreground/50 text-sm">News unavailable</span>
      </div>
    );
  }

  const currentArticle: NewsArticle = articles[currentIndex];

  return (
    <div
      className={cn(
        'flex flex-col gap-1 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg',
        className
      )}
    >
      {/* Source and time */}
      <div className="flex items-center gap-2">
        {currentArticle.isBreaking && (
          <span
            className={cn(
              'text-accent font-bold uppercase tracking-wider',
              'text-[10px] sm:text-xs',
              'animate-pulse'
            )}
          >
            Breaking
          </span>
        )}
        <span className="text-foreground/50 text-xs sm:text-sm">
          {currentArticle.source}
        </span>
        <span className="text-foreground/30 text-xs">
          {getRelativeTime(currentArticle.publishedAt)}
        </span>
      </div>

      {/* Headline */}
      <a
        href={currentArticle.url}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          'font-sans font-medium text-foreground',
          'text-sm sm:text-base md:text-lg',
          'leading-snug',
          'hover:text-accent transition-colors duration-fast',
          'line-clamp-2',
          isAnimating
            ? 'opacity-0 translate-y-2'
            : 'opacity-100 translate-y-0',
          'transition-all duration-300 ease-out'
        )}
      >
        {currentArticle.title}
      </a>

      {/* Progress dots */}
      {articles.length > 1 && (
        <div className="flex gap-1 mt-2">
          {articles.slice(0, Math.min(articles.length, 5)).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                'w-1.5 h-1.5 rounded-full transition-all duration-normal',
                index === currentIndex
                  ? 'bg-foreground w-4'
                  : 'bg-foreground/30 hover:bg-foreground/50'
              )}
              aria-label={`Go to headline ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

