
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface PageTransitionProps {
  children: React.ReactNode;
  show: boolean;
  className?: string;
}

const PageTransition: React.FC<PageTransitionProps> = ({ 
  children, 
  show, 
  className 
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (show) {
      setMounted(true);
    } else {
      const timer = setTimeout(() => {
        setMounted(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!mounted) return null;

  return (
    <div
      className={cn(
        "transition-all duration-300 ease-in-out",
        show ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-4",
        className
      )}
    >
      {children}
    </div>
  );
};

export default PageTransition;
