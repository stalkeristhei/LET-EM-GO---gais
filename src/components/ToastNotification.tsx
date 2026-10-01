import React from 'react';

interface ToastNotificationProps {
  message: string;
  icon?: string;
  visible: boolean;
  onClose: () => void;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({
  message,
  icon = 'verified',
  visible,
  onClose,
}) => {
  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="toast-notification fixed bottom-24 left-4 right-4 max-w-md mx-auto z-[110] p-3.5 rounded-xl bg-[#263143] text-white flex items-center justify-between shadow-2xl border border-[#93ccff]/40 transition-all duration-300 animate-slideUp"
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <span className="material-symbols-outlined text-[#85f8c4] text-[22px] shrink-0">
          {icon}
        </span>
        <span className="font-bold text-[13px] leading-snug">
          {message}
        </span>
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Dismiss alert"
        className="min-h-[44px] min-w-[44px] flex items-center justify-center text-white/80 hover:text-white rounded-lg hover:bg-white/10 shrink-0 ml-1"
      >
        <span className="material-symbols-outlined text-[18px]">close</span>
      </button>
    </div>
  );
};
