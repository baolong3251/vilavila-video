import React, { useState } from 'react';
import './style_AlertModal.scss';

const FormModal = ({ hideModal, toggleModal, children }) => {
  if (hideModal) return null;

  return [
    <div className="modalOverlay" onClick={() => toggleModal()} />,
    <div className="modalWrap">
      <div className="modal">
        {children}
      </div>
    </div>
  ];
}

export default FormModal;