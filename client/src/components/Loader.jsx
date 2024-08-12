import React from 'react'
import LoadingGif from '../assets/images/loading.gif'
export default function Loader() {
  return (
    <div className='loader'>
        <div className="loader__image">
            <img src={LoadingGif} alt="Loading Posts" />
        </div>
    </div>
  )
}
