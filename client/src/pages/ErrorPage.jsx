import React from 'react'
import { Link } from 'react-router-dom'
export default function ErrorPage() {
  return (
   <section className='error-page'>
      <div className="center">
        <Link to='/' className='btn primary'>Go Back to Home Page</Link>
        <h2>Page not found</h2>
      </div>
   </section>
  )
}
