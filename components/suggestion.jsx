import { Card } from "@tremor/react";
import React from "react";
import { Button } from "./ui/button";
import { IconSparkles } from "./ui/icons";
import { useUIState, useActions, useAIState } from "ai/rsc";

const Suggestion = ({ suggestion, description }) => {
  const [messages, setMessages] = useUIState();
  const { submitUserMessage } = useActions();
  return (
    <>
      <div className="mt-4">
        <div className="my-6">
          <p className="dark:text-dark-tremor-content-strong text-sm">
            {description}
          </p>
        </div>
        <Card>
          <h5 className="mb-2 font-semibold text-md">
            <IconSparkles className="inline mr-0 w-4 sm:w-5 mb-0.5" />
            Suggestions
          </h5>
          <div className="mb-4 gap-2 px-4 sm:px-0">
            <Button
              className="cursor-pointer rounded-lg justify-start text-left h-full items-start whitespace-normal text-sm w-full"
              onClick={async () => {
                setMessages((currentMessages) => [
                  ...currentMessages,
                  {
                    id: Date.now(),
                    display: <p>{suggestion}</p>,
                  },
                ]);

                const responseMessage = await submitUserMessage(suggestion);

                setMessages((currentMessages) => [
                  ...currentMessages,
                  responseMessage,
                ]);
              }}
            >
              {suggestion}
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
};

export default Suggestion;
