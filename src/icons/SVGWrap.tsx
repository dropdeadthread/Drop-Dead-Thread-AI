import React from 'react';
import clsx from 'clsx';

interface SVGProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  children: React.ReactNode;
  type?: string;
  className?: string;
  title?: string;
  onClick?: (e: React.MouseEvent) => void;
  action?: boolean;
}

export default function SVGWrap({
  size = 18,
  children,
  type,
  className,
  title,
  onClick,
  action = false,
  ...props
}: SVGProps) {
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) onClick(e);
  };

  return (
    <i
      style={{
        width: size,
        height: size,
      }}
      title={title}
      onClick={handleClick}
      className={clsx(
        'inline-flex items-center justify-center rounded-sm p-[2px] text-slate-500 dark:text-slate-500 transition-all',
        {
          'cursor-pointer hover:bg-slate-300/50 hover:dark:bg-white/10': action,
        },
        className
      )}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%' }}
        {...props}
      >
        {children}
      </svg>
    </i>
  );
}
