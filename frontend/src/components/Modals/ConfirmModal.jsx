import { FiAlertCircle } from 'react-icons/fi';

const ConfirmModal = ({ open, title, message, onConfirm, onCancel, confirmLabel = 'Confirm', cancelLabel = 'Cancel', danger = false }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />
      <div
        className="relative w-full max-w-md rounded-2xl p-8 text-center z-10"
        style={{ background: 'rgba(12,12,12,0.98)', border: '1px solid rgba(212,175,55,0.2)' }}
      >
        <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5 ${danger ? 'bg-red-500/10 border border-red-500/30' : 'bg-[#d4af37]/10 border border-[#d4af37]/30'}`}>
          <FiAlertCircle className={`text-2xl ${danger ? 'text-red-400' : 'text-[#d4af37]'}`} />
        </div>
        <h3 className="text-lg font-display text-white mb-2">{title}</h3>
        <p className="text-sm text-white/50 mb-8">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 text-xs font-bold uppercase tracking-wider border border-white/10 text-white/60 rounded hover:bg-white/5 transition"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider rounded transition ${
              danger
                ? 'bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30'
                : 'text-black hover:opacity-90'
            }`}
            style={danger ? {} : { background: 'linear-gradient(135deg,#f5d76e,#d4af37,#b8912a)' }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
