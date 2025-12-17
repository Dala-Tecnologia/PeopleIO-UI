import { useEffect } from "react";
import { CheckCircleIcon, XCircleIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface NotificationProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

export const Notification = ({
  message,
  type,
  onClose,
}: NotificationProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const isSuccess = type === "success";

  return (
    <div aria-live="assertive" className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6 z-[100]">
      <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
        <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 border border-gray-700">
          <div className="p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {isSuccess ? (
                  <CheckCircleIcon className="h-6 w-6 text-green-400" aria-hidden="true" />
                ) : (
                  <XCircleIcon className="h-6 w-6 text-red-400" aria-hidden="true" />
                )}
              </div>
              <div className="ml-3 w-0 flex-1 pt-0.5">
                <p className="text-sm font-medium text-gray-100">{isSuccess ? 'Sucesso!' : 'Erro!'}</p>
                <p className="mt-1 text-sm text-gray-400">{message}</p>
              </div>
              <div className="ml-4 flex flex-shrink-0">
                <button type="button" onClick={onClose} className="inline-flex rounded-md bg-gray-800 text-gray-400 hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                  <span className="sr-only">Fechar</span>
                  <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};