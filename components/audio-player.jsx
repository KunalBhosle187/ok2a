"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { PauseCircleIcon, PlayCircleIcon } from "lucide-react";

const AudioPlayer = ({ src }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = React.createRef();

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  return (
    <div className="float-right">
      <audio ref={audioRef} src={src} onEnded={handleEnded} />
      <Button onClick={togglePlay} className="" variant="outline" size="sm">
        {isPlaying ? (
          <PauseCircleIcon className="h-5 w-5" />
        ) : (
          <PlayCircleIcon className="h-5 w-5" />
        )}
      </Button>
    </div>
  );
};

export default AudioPlayer;
