import axios from 'axios'
import { useParams } from 'react-router-dom'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setStory } from '../redux/slice/storySlice'
import { useEffect } from 'react'
import StoryCard from '../components/StoryCard'

const Story = () => {
  const {userName} = useParams()  
  const dispatch = useDispatch()
  const {story} = useSelector(state => state.storySlice)
  const handleStory = async ()=>{
    dispatch(setStory(null))
    try {
        const res = await axios.get(`${serverUrl}/api/story/getStoryByUsername/${userName}`,{withCredentials:true})
        dispatch(setStory(res.data))
    } catch (error) {
        console.log(error)
    }
  }
  useEffect(()=>{
   if(userName){
     handleStory()
   }
  },[userName])
  return (
    <div className='w-full h-[100vh] bg-black flex justify-center items-center'>
     <StoryCard/>
    </div>
  )
}

export default Story
