
import { UserContext } from '../context/userContext';
import axios from 'axios';
import React, { useState,createRef, useContext,useEffect} from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { useNavigate,useParams } from 'react-router-dom';

export default function EditPost() {


  const [title,setTitle] = useState('');
  const [category,setCategory] = useState('Uncategorized');
  const [description,setDescription] = useState('');
  const [thumbnail,setThumbnail] = useState('');
  const [error,setError] = useState('')
  const quillRef = createRef(null);

  const navigate= useNavigate();
  const {currentUser}= useContext(UserContext);
  const token = currentUser?.token;

  const {id} = useParams();
  //redirect to login page for any user who is not logged in

  useEffect(()=>{
    if(!token){
    navigate('/login')
    }
  },[])

  const modules ={
    toolbar: [
      [{header:[1,2,3,4,5,6,false]}],
      ['bold','italic','underline','strike','blockquote'],
      [{'list':'ordered'},{'list':'bullet'},{'indent':'-1'},{'indent':'+1'}],
      ['link','image'],
      ['clean']
    ]
  };

  const formats=[
    'header',
    'bold','italic','underline','strike','blockquote',
    'list','bullet','indent',
    'link','image'
  ]
  const POST_CATEGORIES = ["Agriculture","Business","Education","Entertainment","Art","Investment","Weather","Uncategorized"];

  useEffect(()=>{
    const getPost = async()=>{
      try {
        const response = await axios.get(`http://localhost:5000/api/posts/${id}`)
        setTitle(response.data.title);
        setDescription(response.data.description)
      } catch (error) {
        console.log(error)
        setError(error);
      }
    }
    getPost();
  },[])

  const editPost = async(e)=>{
  e.preventDefault();
  const postData = new FormData();
  postData.set('title',title);
  postData.set('category',category);
  postData.set('description',description);
  postData.set('thumbnail',thumbnail);    


  try {
    const response = await axios.patch(`http://localhost:5000/api/posts/${id}`,postData,{withCredentials:true,headers:{Authorization:`Bearer ${token}`}});
    if(response.status ==200){
      return navigate('/');
    }
  } catch (error) {
    console.log(error)
    setError(error.response.data.message);
  }
  }
  return (
    <section className="create-post">
      <div className="container">
        <h2>Edit Post</h2>
      {error &&   <p className="form__error-message">
          This is an error message
        </p>}
        <form action="" className="form create-post__form" onSubmit={editPost}>

          <input type="text" placeholder='Title' value={title} onChange={e=>setTitle(e.target.value)} autoFocus/>
          <select name="category" value={category} onChange={e=>setCategory(e.target.value)}>
            {
              POST_CATEGORIES.map(c=><option key={c}>{c}</option>)
            }
            
          </select>
          <input type="file" onChange={e=>setThumbnail(e.target.files[0])} accept='png, jpg, jpeg' />
          <textarea value={description} onChange={e=>setDescription(e.target.value)}></textarea>
          {/* <ReactQuill ref={quillRef} modules={modules} formats={formats} value={description} onChange={setDescription}   theme="snow"/> */}
         
          <button type="submit" className='btn primary'>Update</button>
        </form>
      </div>
    </section>
  )
}
