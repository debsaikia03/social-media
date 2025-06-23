import React from 'react'
import Post from './Post'
import { useSelector } from 'react-redux'

export default function Posts() {
  const {posts} = useSelector(store=>store.post); //useSelector is used to access the posts from the Redux store
  // The posts are stored in the post slice of the Redux store, which is managed by the postSlice reducer.
  return (
    <div>
     {
        posts.map((post) => <Post key={post._id} post={post}/>) //map is used to iterate over an array and render a Post component for each item in the array.
        // The key prop is used to give each Post component a unique identifier, which helps React optimize rendering.
        // The post prop is passed to the Post component, which contains the data for that specific post.

     }
    </div>
  )
}
