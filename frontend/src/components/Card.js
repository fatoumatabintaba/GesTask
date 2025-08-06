import React from 'react'

const Card = ({ children, className = "" }) => {
  return (
    <div className={`bg-white shadow p-4 rounded ${className}`}>
      {children}
    </div>
  )
}

export default Card
