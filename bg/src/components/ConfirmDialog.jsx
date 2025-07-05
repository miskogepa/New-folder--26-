import React from "react";

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Potvrda",
  message = "Da li ste sigurni?",
  confirmText = "Potvrdi",
  cancelText = "Otkaži",
  type = "danger",
}) => {
  if (!isOpen) return null;

  const getStyles = () => {
    switch (type) {
      case "danger":
        return {
          button: "bg-red-600 hover:bg-red-700 text-white",
          icon: "text-red-600",
        };
      case "warning":
        return {
          button: "bg-yellow-600 hover:bg-yellow-700 text-white",
          icon: "text-yellow-600",
        };
      case "info":
        return {
          button: "bg-blue-600 hover:bg-blue-700 text-white",
          icon: "text-blue-600",
        };
      default:
        return {
          button: "bg-gray-600 hover:bg-gray-700 text-white",
          icon: "text-gray-600",
        };
    }
  };

  const getIcon = () => {
    switch (type) {
      case "danger":
        return (
          <svg
            className="w-12 h-12"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        );
      case "warning":
        return (
          <svg
            className="w-12 h-12"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        );
      case "info":
        return (
          <svg
            className="w-12 h-12"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      default:
        return (
          <svg
            className="w-12 h-12"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
    }
  };

  const styles = getStyles();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all">
        <div className="p-6">
          <div className="flex items-center justify-center mb-4">
            <div className={`${styles.icon}`}>{getIcon()}</div>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
            {title}
          </h3>

          <p className="text-gray-600 text-center mb-6">{message}</p>

          <div className="flex gap-3 justify-center">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`px-4 py-2 rounded-lg transition-colors ${styles.button}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
