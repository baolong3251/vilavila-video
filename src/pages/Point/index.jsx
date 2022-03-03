import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'

function Point() {
  const [items, setItems] = useState([])

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    const data = await fetch('/point')
    const itemss = await data.json()
    setItems(itemss)
  }

  console.log(items)

  return (
    <div>
      
        <div>
          {items.map(item => {
            return(
              <div>
                {item.name}
                {item.msg}
                {item.username}
              </div>
            )
          })}
          
        </div>
      
    </div>
  )
}

export default Point