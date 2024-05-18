"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Mic2Icon, MicOff } from "lucide-react";

const SpeechToText = ({ setInputValue }) => {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);

  let recognition;

  const startListening = () => {
    setIsListening(true);
    recognition.start();
  };

  const stopListening = () => {
    setIsListening(false);
    recognition.stop();
  };

  useEffect(() => {
    setInputValue(transcript);
  }, [transcript]);

  useEffect(() => {
    recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (recognition) {
      recognition = new recognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        const last = event.results.length - 1;
        const text = event.results[last][0].transcript;
        setTranscript(text);
      };
    } else {
      console.error("Speech recognition not supported");
    }
  }, []);

  return (
    <>
      {!isListening ? (
        <Button onClick={startListening} type="button" size="icon">
          <Mic2Icon />
          <span className="sr-only">Start Speech to text</span>
        </Button>
      ) : (
        <Button onClick={stopListening} type="button" size="icon">
          <MicOff />
          <span className="sr-only">Stop Speech to text</span>
        </Button>
      )}
    </>
  );
};
export default SpeechToText;
