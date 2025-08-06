import React from 'react'

const PrimaryButton = ({ children, onClick, type = "button", className = "" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow ${className}`}
    >
      {children}
    </button>
  )
}

export default PrimaryButton
