const Post= require('../models/postModel');
const User = require('../models/userModel');
const path = require('path');
const fs = require('fs');
const {v4:uuid}=require('uuid');
const HttpError = require('../models/errorModel')

//Create Post 
// POST: api/posts
//Protected
const createPost = async(req,res,next)=>{
   try {
    let {title,category,description}= req.body;
    if( !title || !category || !description || !req.files){
        return next(new HttpError("Fill in all fields and choose thumbnail.",422))
    }
    const {thumbnail} = req.files;
    // check the file size;
    if(thumbnail.size>2000000){
        return next(new HttpError("This thumbnail is too big",422))
    }

    let fileName=thumbnail.name;
    let splittedFilename = fileName.split('.');
    let newFilename=splittedFilename[0]+uuid()+'.'+splittedFilename[splittedFilename.length-1];
    thumbnail.mv(path.join(__dirname,'..','/uploads',newFilename),
    async (err)=>{
        if(err)
            return next(new HttpError(err))


        const newPost = await Post.create({title,category,description,thumbnail:newFilename,creator:req.user.id});

        if(!newPost){
            return next(new HttpError("Post could not be created",422))
        }

        //find user and increase post count by 1

        const currentUser = await User.findById(req.user.id);
        const userPostCount = currentUser.posts+1;

        await User.findByIdAndUpdate(req.user.id,{posts:userPostCount})
    

        res.status(201).json(newPost);
     })

   } catch (error) {
    return next(new HttpError(error))
   }
}


//get Post 
// POST: api/posts
//UnProtected
const getPosts = async(req,res,next)=>{
    try {
        const posts = await Post.find().sort({updatedAt: -1});
        res.status(200).json(posts);
    } catch (error) {
        return next(new HttpError(error))
    }
}

//get single Post 
// get: api/posts/:id
//UnProtected
const getPost = async(req,res,next)=>{
    try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if(!post){
        return next(new HttpError("Post not found",404));
    }
    res.status(200).json(post);

    } catch (error) {
        return next(new HttpError(error))
    }}

//get post of specific category 
// get: api/posts/:category
//UnProtected
const getCatPosts = async(req,res,next)=>{
    try {
        const {category} = req.params;
        const catPosts = await Post.find({category}).sort({createdAt: -1})

        res.status(200).json(catPosts);
    } catch (error) {
        return next(new HttpError(error))
    }
}

//get author post
// get: api/posts/users/:id
//UnProtected
const getUserPosts = async(req,res,next)=>{
    try {
        const {id} = req.params;
       const userPosts = await Post.find({creator:id}).sort({createdAt:-1});

       if(!userPosts){
        return next(new HttpError("No posts found"),422)
       }
       res.status(200).json(userPosts);
    } catch (error) {
        return next(new HttpError(error))
    }
}


//edit post
// get: api/posts/:id
//Protected
const editPost = async(req,res,next)=>{
    try {
       let fileName;
       let newFilename;
       let updatedPost;
       let postId = req.params.id;

       let {title,category,description} = req.body;
       //ReactQuill has a paragraph opening and closing tag with a break tag in between so there are li characters in there already
       if( !title || !category || description.length <  12 ){
        return next(new HttpError("Fill in all fields"))
       }
       const oldPost = await Post.findById(postId);
       if(req.user.id==oldPost.creator){

       if(!req.files){
        updatedPost = await Post.findByIdAndUpdate(postId,{title,category,description},{new: true});

       }
       else {
        // get old post from db
        fs.unlink(path.join(__dirname,'..','uploads',oldPost.thumbnail),async (err)=>{
            if(err){
                return next(new HttpError(err))
            }
            })
              //upload new thumbnail

              const {thumbnail}= req.files;
              // check the file size;
             if(thumbnail.size>2000000){
                 return next(new HttpError("This thumbnail is too big",422))
             }
            fileName=thumbnail.name;
             let splittedFilename = fileName.split('.');
              newFilename=splittedFilename[0]+uuid()+'.'+splittedFilename[splittedFilename.length-1];
              thumbnail.mv(path.join(__dirname,'..','uploads',newFilename),async(err)=>{
                 if(err)
                     return next(new HttpError(err))
              } )
 
              updatedPost = await Post.findByIdAndUpdate(postId,{title,category,description,thumbnail:newFilename},{new: true})
              res.json(`Post ${postId} edited successfully` )
       }

       if(!updatedPost){
        return next(new HttpError("Could not update post.",400))
       }}
       else{
        return next(new HttpError("Post can not be edited",403))
       }
       res.status(200).json(updatedPost);

    } catch (error) {
        return next(new HttpError(error))
    }
}

//delete post
// get: api/posts/:id
//Protected
const deletePost = async(req,res,next)=>{
  try {
     const {id}= req.params;
     if(!id){
        return next(new HttpError("Post unavailable",400))
     }
     const post = await Post.findById(id);
     const fileName = post?.thumbnail;

     if(req.user.id==post.creator){

     //delete thumbnail from uploads folder
     fs.unlink(path.join(__dirname,'..','uploads',fileName),async (err)=>{
        if(err){
            return next(new HttpError(err))
        }
        else{
            await Post.findByIdAndDelete(id);
        //find user and reduce his post count by 1
        const currentUser = await User.findById(req.user.id);
        userPostCount = currentUser?.posts -1;
        await User.findByIdAndUpdate(req.user.id,{posts:userPostCount},{new:true});
        res.json(`Post ${id} deleted successfully` )
        }
        
        })

     if(!post){
        return next(new HttpError("Post deletion unsuccessful"))
     }}
     else {
        return next(new HttpError("Post can not be deleted",403))
     }
    //  res.status(200).json(post);
  } catch (error) {
    return next(new HttpError(error))
  }
}

module.exports = {createPost,getPosts,getPost,getCatPosts,getUserPosts,editPost,deletePost} 