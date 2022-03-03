import React from 'react'
import ShowMoreButton from '../ShowMoreButton'

function LoadMore({ onLoadMoreEvt = () => {  }, }) {
  return (
    <ShowMoreButton onClick={() => onLoadMoreEvt()}>
        Hiển thị thêm
    </ShowMoreButton>
  )
}

export default LoadMore