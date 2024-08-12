import React,{useContext,useEffect,useState} from 'react'
import { Link, useNavigate,useLocation } from 'react-router-dom';
import { UserContext } from '../context/userContext';
import axios from 'axios';
import Loader from '../components/Loader';
export default function DeletePost({postId:id}) {
  const navigate= useNavigate();
  const location = useLocation();
  const {currentUser}= useContext(UserContext);
  const token = currentUser?.token;
  const [isLoading,setIsLoading] = useState(false)
  //redirect to login page for any user who is not logged in

  useEffect(()=>{
    if(!token){
    navigate('/login')
    }
  },[])

  const removePost = async ()=>{
    setIsLoading(true)
    try {
      const response =await axios.delete(`http://localhost:5000/api/posts/${id}`,{withCredentials:true,headers:{Authorization:`Bearer ${token}`}});
      console.log(response.data)
      if(response.status == 200){
        if(location.pathname ==`/myposts/${currentUser.id}`){
          navigate(0);//refresh the page
        }
        else{
          navigate('/')
        }
      }
setIsLoading(false)
    } catch (error) {
      console.log(error)
    }
  }

  if(isLoading){
    return <Loader/>
  }
  return (
    <Link className='btn sm danger' onClick={removePost}>Delete</Link>
  )
}
