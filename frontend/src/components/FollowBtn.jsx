import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { serverUrl } from "../App"
import { toogleFollow } from "../redux/slice/userSlice"

const FollowBtn = ({ targetUserId, tailwind, onFollowChange }) => {
  const { following } = useSelector((state) => state.userSlice);
  const dispatch = useDispatch();
  const isFollowing = following.includes(targetUserId);

  const handleFollow = async () => {
    try {
      const res = await axios.get(
        `${serverUrl}/api/user/follow-user/${targetUserId}`,
        { withCredentials: true }
      );
      console.log(res.data)
      dispatch(toogleFollow(targetUserId));

      // optional: parent ko notify karo taaki UI refresh ho jaaye
      if (onFollowChange) onFollowChange();

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <button
      onClick={handleFollow}
      className={tailwind}
    >
      {isFollowing ? "following" : "Follow"}
    </button>
  );
};

export default FollowBtn;
