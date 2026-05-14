type ToastProps = {
  message: string;
  type?: 'success' | 'error';
};

export default function Toast({ message, type = 'success' }: ToastProps) {
  return (
    <div
      className={`fixed bottom-4 left-1/2 z-50 w-[92%] max-w-sm -translate-x-1/2 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-lg ${
        type === 'success' ? 'bg-brand-700' : 'bg-amber-600'
      }`}
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  );
}
