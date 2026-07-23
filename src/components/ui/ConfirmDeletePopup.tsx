import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import Button from './Button';

interface ConfirmDeletePopupProps {
  isOpen: boolean;
  title?: string;
  message: string;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

const ConfirmDeletePopup: React.FC<ConfirmDeletePopupProps> = ({
  isOpen,
  title = 'Confirmar exclusão',
  message,
  loading = false,
  onConfirm,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={loading ? undefined : onClose}
      />

      {/* modal */}
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-xl border border-gray-200">
        <div className="flex items-start justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-red-50 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-700 mt-1">{message}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex justify-end gap-3 p-5">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>

          <Button variant="danger" onClick={onConfirm} disabled={loading}>
            {loading ? 'Excluindo...' : 'Excluir'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeletePopup;
