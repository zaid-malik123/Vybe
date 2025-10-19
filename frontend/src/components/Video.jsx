import { useRef, useState } from "react";
import { FaVolumeMute, FaVolumeUp, FaPlay, FaPause } from "react-icons/fa";

const Video = ({ src }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div className="relative w-full max-h-[300px] rounded-2xl overflow-hidden shadow-lg group">
      <video
        ref={videoRef}
        src={src}
        loop
        playsInline
        muted={isMuted}
        className="w-full h-full object-contain cursor-pointer bg-black"
        onClick={togglePlay}
      ></video>

      {/* Play/Pause icon (center) */}
      <div
        onClick={togglePlay}
        className="absolute inset-0 flex justify-center items-center text-white text-4xl opacity-0 group-hover:opacity-80 transition"
      >
        {isPlaying ? <FaPause /> : <FaPlay />}
      </div>

      {/* Volume control (bottom-right) */}
      <button
        onClick={toggleMute}
        className="absolute bottom-3 right-3 bg-black/60 text-white p-2 rounded-full text-xl"
      >
        {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
      </button>
    </div>
  );
};

export default Video;
