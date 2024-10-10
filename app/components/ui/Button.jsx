import React from 'react';

export default function Button({ icon: Icon, onClick, className }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center px-2 py-2 rounded-full transition ${className}`}
    >
      {Icon && <Icon className="mr-2" />}
    </button>
  );
}
