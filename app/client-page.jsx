"use client";

import { useEffect, useRef, useState } from "react";

import { useUIState, useActions, useAIState } from "ai/rsc";
// import { p } from "@/components/llm-stocks/message";

import { ChatScrollAnchor } from "@/lib/hooks/chat-scroll-anchor";
import { FooterText } from "@/components/footer";
import Textarea from "react-textarea-autosize";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { IconArrowElbow, IconPlus, IconSparkles } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { ChatList } from "@/components/chat-list";
import { EmptyScreen } from "@/components/empty-screen";
import { toast } from "@/components/ui/use-toast";
import { useEnterSubmit } from "@/lib/hooks/user-enter-submit";
import SpeechToText from "@/components/speech-to-text";
import { Card } from "@tremor/react";
import { UserMessage } from "@/components/message";

export function ClientPage(props) {
  const [messages, setMessages] = useUIState();
  const { submitUserMessage } = useActions();
  const [inputValue, setInputValue] = useState("");
  const { formRef, onKeyDown } = useEnterSubmit();
  const inputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "/") {
        if (e.target && ["INPUT", "TEXTAREA"].includes(e.target.nodeName)) {
          return;
        }
        e.preventDefault();
        e.stopPropagation();
        if (inputRef?.current) {
          inputRef.current.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [inputRef]);

  const exampleMessages = [
    {
      message: `Give me top 5 assets with there owner names`,
    },
    {
      message: "How many assets belong to each asset group?",
    },
    {
      message: `What are the risk ratings of unique asset issues?`,
    },
    {
      message: `What are the most common types of issues across all assets?`,
    },
  ];

  return (
    <div>
      <div className="pb-[200px] pt-4 md:pt-10">
        {messages.length ? (
          <>
            <ChatList messages={messages} />
          </>
        ) : (
          <>
            <EmptyScreen
              submitMessage={async (message) => {
                // Add user message UI
                setMessages((currentMessages) => [
                  ...currentMessages,
                  {
                    id: Date.now(),
                    display: <UserMessage>{message}</UserMessage>,
                  },
                ]);

                // Submit and get response message
                const responseMessage = await submitUserMessage(message);
                setMessages((currentMessages) => [
                  ...currentMessages,
                  responseMessage,
                ]);
              }}
            />
            <div className="mx-auto sm:max-w-2xl sm:px-4">
              <Card>
                <h5 className="mb-2 font-semibold text-md">
                  <IconSparkles className="inline mr-0 w-4 sm:w-5 mb-0.5" />
                  Suggestions
                </h5>
                <div className="mb-4 grid grid-cols-2 gap-2 px-4 sm:px-0">
                  {messages.length === 0 &&
                    exampleMessages.map((example, index) => (
                      <Button
                        key={example.message}
                        className="cursor-pointer rounded-lg justify-start text-left h-full items-start whitespace-normal text-sm"
                        onClick={async () => {
                          setMessages((currentMessages) => [
                            ...currentMessages,
                            {
                              id: Date.now(),
                              display: (
                                <UserMessage>{example.message}</UserMessage>
                              ),
                            },
                          ]);

                          const responseMessage = await submitUserMessage(
                            example.message
                          );

                          setMessages((currentMessages) => [
                            ...currentMessages,
                            responseMessage,
                          ]);
                        }}
                      >
                        {example.message}
                      </Button>
                    ))}
                </div>
              </Card>
            </div>
          </>
        )}
        <ChatScrollAnchor trackVisibility={true} />
      </div>
      <div className="fixed inset-x-0 bottom-0 w-full bg-gradient-to-b from-muted/30 from-0% to-muted/30 to-50% duration-300 ease-in-out animate-in dark:from-background/10 dark:from-10% dark:to-background/80 peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[300px]">
        <div className="mx-auto sm:max-w-2xl sm:px-4">
          {messages.length == 0 ? (
            <>
              <div className="hidden md:grid grid-cols-2  gap-4 py-4">
                {props.zeroState?.map((button, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    className="px-4 py-10 text-left"
                    onClick={async () => {
                      const responseMessage = await submitUserMessage(button);
                      setMessages((currentMessages) => [
                        {
                          id: Date.now(),
                          display: <UserMessage>{button}</UserMessage>,
                        },
                        ...currentMessages,
                        responseMessage,
                      ]);
                    }}
                  >
                    {button}
                  </Button>
                ))}
              </div>
            </>
          ) : null}
          <div className="space-y-4 border-t bg-background px-4 py-2 shadow-lg sm:rounded-t-xl sm:border md:py-4">
            <form
              ref={formRef}
              onSubmit={async (e) => {
                e.preventDefault();

                // Blur focus on mobile
                if (window.innerWidth < 600) {
                  e.target["message"]?.blur();
                }

                const value = inputValue.trim();
                setInputValue("");
                if (!value) return;

                // Add user message UI
                setMessages((currentMessages) => [
                  ...currentMessages,
                  {
                    id: Date.now(),
                    display: <UserMessage>{value}</UserMessage>,
                  },
                ]);

                try {
                  // Submit and get response message
                  const responseMessage = await submitUserMessage(value);
                  setMessages((currentMessages) => [
                    ...currentMessages,
                    responseMessage,
                  ]);
                } catch (error) {
                  console.log({ error });
                  toast({
                    title: "Something went wrong",
                    description: "Please try again later",
                    duration: 5000,
                  });
                }
              }}
            >
              <div className="flex">
                <div className="relative flex max-h-60 w-full grow flex-col overflow-hidden bg-background px-8 sm:rounded-md sm:border sm:px-12">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute left-0 top-4 h-8 w-8 rounded-full bg-background p-0 sm:left-4"
                        onClick={(e) => {
                          e.preventDefault();
                          window.location.reload();
                        }}
                      >
                        <IconPlus />
                        <span className="sr-only">New Chat</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>New Chat</TooltipContent>
                  </Tooltip>
                  <Textarea
                    ref={inputRef}
                    tabIndex={0}
                    onKeyDown={onKeyDown}
                    placeholder="Send a message."
                    className="min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none border-black sm:text-sm select-none"
                    autoFocus
                    spellCheck={false}
                    autoComplete="off"
                    autoCorrect="off"
                    name="message"
                    rows={1}
                    value={inputValue}
                    onChange={(e) => {
                      console.log(e.target.value);
                      setInputValue(e.target.value);
                    }}
                  />
                  <div className="absolute right-2 top-2.5">
                    <div className="flex gap-2 ">
                      <Tooltip>
                        {/* <TooltipTrigger asChild>
                          <SpeechToText setInputValue={setInputValue} />
                        </TooltipTrigger> */}
                        <TooltipTrigger asChild>
                          <Button
                            type="submit"
                            size="icon"
                            disabled={inputValue === ""}
                          >
                            <IconArrowElbow />
                            <span className="sr-only">Send message</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Send message</TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </div>
            </form>
            <FooterText className="hidden sm:block" />
          </div>
        </div>
      </div>
    </div>
  );
}
