import { useEffect, useRef } from 'react';

export function useAccessibleDialog(isOpen: boolean, onClose: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    if (!isOpen || !ref.current) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    const background: HTMLElement[] = [];
    const collectBackground = (element: HTMLElement) => {
      if (element === ref.current) return;
      if (element.contains(ref.current)) Array.from(element.children).forEach(child => { if (child instanceof HTMLElement) collectBackground(child); });
      else background.push(element);
    };
    document.querySelectorAll<HTMLElement>('#main-content, .app-header, .app-navigation').forEach(collectBackground);
    const previousInert = background.map(element => element.inert);
    background.forEach(element => { element.inert = true; });
    document.body.style.overflow = 'hidden';
    const getFocusable = () => Array.from(ref.current?.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input, textarea, select, [tabindex="0"]') ?? []).filter(element => element.getClientRects().length > 0);
    getFocusable()[0]?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); closeRef.current(); }
      if (event.key !== 'Tab') return;
      const focusable = getFocusable();
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first) { event.preventDefault(); return; }
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = previousOverflow;
      background.forEach((element, index) => { element.inert = previousInert[index]; });
      previousFocus?.focus();
    };
  }, [isOpen]);
  return ref;
}
