import { useState } from 'react';
import toast from 'react-hot-toast';

export default function PaymentModal({
  isOpen,
  virtualRek,
  totalPrice,
  paymentDeadline,
  onCheckPayment,
  onPayLater,
  onClose,
}) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(virtualRek || '');
    setCopied(true);
    toast.success('Account number copied to clipboard!', {
      id: 'clipboard-copy',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="mx-4 w-full max-w-md rounded-xl bg-white p-8 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="mb-8 text-center text-xl font-bold text-gray-900">
          Payment Info
        </h3>

        <div className="mb-6 flex flex-col gap-4">
          <div className="flex items-center text-sm">
            <span className="w-36 text-gray-500">Virtual Account No.</span>
            <span className="mr-4 text-gray-500">:</span>
            <span className="flex-1 font-bold text-gray-900">{virtualRek}</span>
            <button
              type="button"
              onClick={handleCopy}
              className="rounded border border-blue-600 px-4 py-1.5 text-xs font-semibold text-blue-600 transition-colors hover:bg-blue-50"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>

          <div className="flex items-center text-sm">
            <span className="w-36 text-gray-500">Total Payment</span>
            <span className="mr-4 text-gray-500">:</span>
            <span className="flex-1 font-bold text-blue-600">
              {new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
              }).format(totalPrice)}
            </span>
          </div>
        </div>

        <p className="mb-8 text-sm leading-relaxed text-gray-500">
          Pay this payment bill before it is due,{' '}
          <span className="text-red-500">on {paymentDeadline}</span>. If the
          bill has not been paid by the specified time, it will be forfeited
        </p>

        <button
          onClick={onCheckPayment}
          className="mb-3 w-full rounded-md bg-blue-700 py-3 font-semibold text-white transition-colors hover:bg-blue-800"
        >
          Check Payment
        </button>

        <button
          type="button"
          onClick={onPayLater}
          className="w-full py-3 text-center text-sm font-semibold text-blue-700 hover:underline"
        >
          Pay Later
        </button>
      </div>
    </div>
  );
}
