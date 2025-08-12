import React from 'react';
import { FiAlertCircle, FiCheckCircle, FiInfo, FiXCircle } from 'react-icons/fi';

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertProps {
  type: AlertType;
  title?: string;
  message: string;
  onClose?: () => void;
}

const Alert = ({ type, title, message, onClose }: AlertProps) => {
  const icons = {
    success: <FiCheckCircle className="h-5 w-5 text-green-400" />,
    error: <FiXCircle className="h-5 w-5 text-red-400" />,
    warning: <FiAlertCircle className="h-5 w-5 text-yellow-400" />,
    info: <FiInfo className="h-5 w-5 text-blue-400" />,
  };

  const styles = {
    success: 'bg-green-50 dark:bg-green-900/20 border-green-400 dark:border-green-600 text-green-700 dark:text-green-300',
    error: 'bg-red-50 dark:bg-red-900/20 border-red-400 dark:border-red-600 text-red-700 dark:text-red-300',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-400 dark:border-yellow-600 text-yellow-700 dark:text-yellow-300',
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-400 dark:border-blue-600 text-blue-700 dark:text-blue-300',
  };

  return (
    <div className={`rounded-md border p-4 ${styles[type]}`}>
      <div className="flex">
        <div className="flex-shrink-0">{icons[type]}</div>
        <div className="ml-3">
          {title && <h3 className="text-sm font-medium">{title}</h3>}
          <div className="text-sm">{message}</div>
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={onClose}
                className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${type === 'success' ? 'bg-green-50 dark:bg-green-900/20 text-green-500 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-800/30 focus:ring-green-600 focus:ring-offset-green-50 dark:focus:ring-offset-green-900' : type === 'error' ? 'bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-800/30 focus:ring-red-600 focus:ring-offset-red-50 dark:focus:ring-offset-red-900' : type === 'warning' ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-500 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-800/30 focus:ring-yellow-600 focus:ring-offset-yellow-50 dark:focus:ring-offset-yellow-900' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-500 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-800/30 focus:ring-blue-600 focus:ring-offset-blue-50 dark:focus:ring-offset-blue-900'}`}
              >
                <span className="sr-only">Dismiss</span>
                <FiXCircle className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alert;