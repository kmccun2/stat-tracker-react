// Styles
import './Toast.scss';

// React
import React, { useEffect } from 'react';

// Redux
import { useSelector } from 'react-redux';
import { RootState } from '../../../utils/store';
import { dismissToastItem, ToastItemType } from '../../../slices/globalSlice';
import { useAppDispatch } from '../../../hooks/redux';

const TOAST_DURATION = 5000; // 5 seconds

interface ToastItemProps {
  item: ToastItemType;
}

const ToastItem: React.FC<ToastItemProps> = ({ item }: ToastItemProps) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(dismissToastItem(item.id));
    }, TOAST_DURATION);

    return () => clearTimeout(timer);
  }, [item.id]);

  return (
    <div className={`toast-item ${item.type}`} role="alert" aria-live="assertive">
      <div className="toast-content">
        <div className="toast-header">
          <strong className="toast-title">{item.title}</strong>
          <button
            type="button"
            className="toast-close"
            onClick={() => dispatch(dismissToastItem(item.id))}
            aria-label="Dismiss notification"
          >
            ×
          </button>
        </div>
        <div className="toast-message">{item.message}</div>
      </div>
    </div>
  );
};

const Toast = () => {
  const toastItems = useSelector((state: RootState) => state.global.toastItems);

  if (toastItems.length === 0) {
    return null;
  }

  return (
    <div className="toast-container">
      {toastItems.map(item => (
        <ToastItem key={item.id} item={item} />
      ))}
    </div>
  );
};

export default Toast;
