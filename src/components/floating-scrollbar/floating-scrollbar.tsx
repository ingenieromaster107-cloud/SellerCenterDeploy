'use client';

import { useRef, useState, useEffect } from 'react';

import Box from '@mui/material/Box';

// ----------------------------------------------------------------------

type FloatingScrollbarProps = {
  readonly children: React.ReactNode;
  readonly scrollerSelector?: string;
  readonly refreshKey?: unknown;
};

export function FloatingScrollbar({
  children,
  scrollerSelector = '.MuiDataGrid-virtualScroller',
  refreshKey,
}: FloatingScrollbarProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const lastRef = useRef({ visible: false, left: 0, width: 0 });
  const [floatBar, setFloatBar] = useState({ visible: false, left: 0, width: 0 });

  useEffect(() => {
    const root = wrapperRef.current;
    const bar = barRef.current;
    const inner = innerRef.current;
    if (!root || !bar || !inner) return undefined;
    const scroller = root.querySelector<HTMLDivElement>(scrollerSelector);
    if (!scroller) return undefined;

    let syncing = false;

    const recompute = () => {
      const hasOverflow = scroller.scrollWidth - scroller.clientWidth > 1;
      const scRect = scroller.getBoundingClientRect();
      const nativeVisible = scRect.bottom <= window.innerHeight + 4;
      const visible = hasOverflow && !nativeVisible;

      inner.style.width = `${scroller.scrollWidth}px`;

      const next = { visible, left: scRect.left, width: scroller.clientWidth };
      const prev = lastRef.current;
      if (prev.visible !== next.visible || prev.left !== next.left || prev.width !== next.width) {
        lastRef.current = next;
        setFloatBar(next);
      }
    };

    const onBarScroll = () => {
      if (syncing) {
        syncing = false;
        return;
      }
      syncing = true;
      scroller.scrollLeft = bar.scrollLeft;
    };

    const onScrollerScroll = () => {
      if (syncing) {
        syncing = false;
        return;
      }
      syncing = true;
      bar.scrollLeft = scroller.scrollLeft;
    };

    recompute();
    bar.addEventListener('scroll', onBarScroll, { passive: true });
    scroller.addEventListener('scroll', onScrollerScroll, { passive: true });
    window.addEventListener('scroll', recompute, { passive: true });
    window.addEventListener('resize', recompute);
    const observer = new ResizeObserver(recompute);
    observer.observe(scroller);

    return () => {
      bar.removeEventListener('scroll', onBarScroll);
      scroller.removeEventListener('scroll', onScrollerScroll);
      window.removeEventListener('scroll', recompute);
      window.removeEventListener('resize', recompute);
      observer.disconnect();
    };
  }, [scrollerSelector, refreshKey]);

  return (
    <Box ref={wrapperRef} sx={{ width: '100%', position: 'relative' }}>
      {children}

      <Box
        ref={barRef}
        sx={{
          position: 'fixed',
          bottom: 0,
          left: floatBar.left,
          width: floatBar.width,
          height: 14,
          display: floatBar.visible ? 'block' : 'none',
          overflowX: 'auto',
          overflowY: 'hidden',
          zIndex: (theme) => theme.zIndex.appBar,
          bgcolor: 'background.paper',
          borderTop: '1px solid',
          borderColor: 'divider',
          boxShadow: (theme) => theme.customShadows?.z8 ?? theme.shadows[8],
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': { height: 10 },
          '&::-webkit-scrollbar-thumb': {
            borderRadius: 5,
            backgroundColor: (theme) => theme.palette.text.disabled,
          },
        }}
      >
        <Box ref={innerRef} sx={{ height: 1 }} />
      </Box>
    </Box>
  );
}
