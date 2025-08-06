import React from 'react'

const Label = ({ children }) => {
  return (
    <label className="block mb-1 text-sm font-semibold text-gray-700">
      {children}
    </label>
  )
}

export default Label
