import React from 'react';
import './DeleteModal.css';
import { BsExclamationTriangle } from 'react-icons/bs';

const DeleteModal = ({ onConfirm, onCancel }) => {
  return (
    <div className="delete-modal-overlay" onClick={onCancel}>
      <div className="delete-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="delete-modal-header">
          <BsExclamationTriangle className="delete-modal-icon" />
        </div>
        <h2>질문을 삭제하시겠습니까?</h2>
        <div className="delete-modal-buttons">
          <button onClick={onConfirm}>확인</button>
          <button onClick={onCancel}>취소</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
