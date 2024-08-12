import React, { useEffect } from 'react'
import { useState } from 'react'
import Loader from './Loader'
import PostItem from './PostItem'
import axios from 'axios'
// import { DUMMY_POSTS } from '../data'


export default function Posts() {
    const [posts,setPosts] = useState([])
    const [isLoading,setIsLoading] = useState(false)

useEffect(()=>{
  const fetchPosts =async ()=>{
    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/posts`);
      setPosts(response?.data);
      console.log(response.data)
    } catch (error) {
      console.log(error)
    }
    setIsLoading(false)
  }
  fetchPosts();
},[])

if(isLoading){
return <Loader/>
}
  return (
    <section className="posts">
      {posts.length >0 ? <div className="container posts__container">
       {posts.map(({_id:id,thumbnail,category,title,description,creator,createdAt})=><PostItem key={id} postID={id}  thumbnail={thumbnail} category={category} title={title} description={description} authorID={creator} createdAt={createdAt}/>)}
       </div> : <h2 className='center'>No Posts found</h2>}
    </section>
  )
}
