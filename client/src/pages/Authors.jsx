import React, { useState,useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../index.css'
import axios from 'axios'
import Loader from '../components/Loader'
export default function Authors() {

  const [authors,setAuthors] = useState([])
const [isLoading,setIsLoading] = useState(false);


useEffect(()=>{
  
  const getAuthors = async()=>{
    setIsLoading(true); 
    try {
      const response= await axios.get(`http://localhost:5000/api/users`);
      setAuthors(response.data);

    } catch (error) {
      console.log(error)
    }
    setIsLoading(false);
  }
 getAuthors();
},[])

if(isLoading){
  return <Loader/>
}
  return (
    <section className="authors">
     {
       authors.length> 0 ? <div className="container authors__container">
       {authors.map(({_id:id,avatar,name,posts})=>{
        return <Link key={id} to={`/posts/users/${id}`} className='author'>
         <div className="author__avatar">
         <img src={`http://localhost:5000/uploads/${avatar}`} alt={`Image of ${name}`} />
         </div>
         <div className="author__info">
          <h4>{name}</h4>
          <p>{posts}</p>
         </div>
        </Link>
       })}
     </div>: <h2 className='center'> No Users/Authors found</h2>
     }
    </section>
  )
}
