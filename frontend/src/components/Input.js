import React from 'react'

const Input = ({ type = "text", ...props }) => {
  return (
    <input
      type={type}
      className="w-full border px-4 py-2 rounded mb-2"
      {...props}
    />
  )
}

export default Input
