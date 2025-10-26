import logo from "../assets/logo.png";
import { FaRegHeart } from "react-icons/fa6";
import dp from "../assets/dp.webp";
import StoryDp from "./StoryDp";
import Nav from "./Nav";
import { useDispatch, useSelector } from "react-redux";
import Post from "./Post";
import { LuSend } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

const Feed = () => {
  const { posts } = useSelector((state) => state.postSlice);
  const { user } = useSelector((state) => state.userSlice);
  const { notificationData } = useSelector((state) => state.notificationSlice);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { storyList, currentUserStory } = useSelector(
    (state) => state.storySlice
  );
  return (
    <div className="lg:w-[50%] w-full bg-black min-h-[100vh] lg:h-[100vh] relative lg:overflow-y-auto">
      <div className="w-full h-[100px] flex items-center justify-between p-[20px] lg:hidden">
        <img className="w-[80px]" src={logo} alt="" />
        <div className="flex gap-[20px]">
          <div onClick={() => navigate("/notification")} className="relative">
            <FaRegHeart color="white" size={20} />
            {notificationData &&
              notificationData.some((noti) => noti.isRead == false) && (
                <div className="w-[10px] h-[10px] bg-blue-600 rounded-full absolute top-0 right-[-5px]"></div>
              )}
          </div>
          <LuSend
            onClick={() => navigate("/message")}
            color="white"
            size={20}
          />
        </div>
      </div>
      <div className="flex w-full overflow-auto gap-[20px] items-center p-[10px]">
        <StoryDp
          story={currentUserStory}
          userName={"Your Story"}
          profileImage={user.profileImage}
        />
        {storyList?.map((story, idx) => {
          return (
            <StoryDp
              key={idx}
              story={story}
              userName={story.author.userName}
              profileImage={story.author.profileImage || dp}
            />
          );
        })}
      </div>

      <div className="w-full min-h-[100vh] flex flex-col items-center gap-[20px] p-[10px] pt-[40px] bg-white rounded-t-[60px] relative pb-[120px]">
        <Nav />
        {posts?.map((post, idx) => (
          <Post key={idx} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Feed;
