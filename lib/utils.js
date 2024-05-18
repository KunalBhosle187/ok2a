import { OpenAIStream } from "ai";
import zodToJsonSchema from "zod-to-json-schema";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const consumeStream = async (stream) => {
  const reader = stream.getReader();
  while (true) {
    const { done } = await reader.read();
    if (done) break;
  }
};

export function runOpenAICompletion(openai, params) {
  let text = "";
  let hasFunction = false;

  let onTextContent = () => {};

  let onFunctionCall = {};

  const { functions, ...rest } = params;

  (async () => {
    consumeStream(
      OpenAIStream(
        await openai.chat.completions.create({
          ...rest,
          stream: true,
          functions: functions.map((fn) => ({
            name: fn.name,
            description: fn.description,
            parameters: zodToJsonSchema(fn.parameters),
          })),
        }),
        {
          async experimental_onFunctionCall(functionCallPayload) {
            hasFunction = true;
            onFunctionCall[functionCallPayload.name]?.(
              functionCallPayload.arguments
            );
          },
          onToken(token) {
            text += token;
            if (text.startsWith("{")) return;
            onTextContent(text, false);
          },
          onFinal() {
            if (hasFunction) return;
            onTextContent(text, true);
          },
        }
      )
    );
  })();

  return {
    onTextContent: (callback) => {
      onTextContent = callback;
    },
    onFunctionCall: (name, callback) => {
      onFunctionCall[name] = callback;
    },
  };
}

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const formatNumber = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);

export const runAsyncFnWithoutBlocking = (fn) => {
  fn();
};

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Fake data
export function getStockPrice(name) {
  let total = 0;
  for (let i = 0; i < name.length; i++) {
    total = (total + name.charCodeAt(i) * 9999121) % 9999;
  }
  return total / 100;
}
