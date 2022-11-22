import React from 'react'

const Filter = ({query, handleQuery}) => {
  return (
    <div>
      Filter shown with <input value={query} onChange={handleQuery} />
    </div>
  )
}

export default Filter