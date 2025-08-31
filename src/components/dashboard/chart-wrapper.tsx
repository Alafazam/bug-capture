'use client';

import { useEffect, useState } from 'react';

interface ChartWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ChartWrapper({ children, fallback }: ChartWrapperProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return fallback || <div className="h-32 bg-muted animate-pulse rounded" />;
  }

  return <>{children}</>;
}
