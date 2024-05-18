import "server-only";

import { createAI, createStreamableUI, getMutableAIState } from "ai/rsc";
import OpenAI from "openai";
import { z } from "zod";

import { Chart } from "./query-chart";
import { Code } from "bright";

import { BotCard, BotMessage, SystemMessage } from "@/components/message";
import { spinner } from "@/components/spinner";

// Langchain
import { SqlDatabase } from "langchain/sql_db";
import { QuerySqlTool } from "langchain/tools/sql";
import { DataSource } from "typeorm";

import { runOpenAICompletion } from "@/lib/utils";

import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";

import {
  getRelevantExamples,
  getRelevantTable,
  textToSpeech,
} from "@/lib/action";
import AudioPlayer from "@/components/audio-player";

export const chartTypes = ["table", "barlist", "bar", "pie", "area", "number"];

const QueryDataResponse = z.object({
  userInput: z.string().describe(`User query.`),
});

const zOpenAIQueryResponse = z.object({
  query: z.string().describe(`MYSQL Query for the given query.
  `),
  format: z
    .enum(chartTypes)
    .describe(`suggest charts from ${chartTypes} for data visulization `),
  title: z.string().describe("The title of the chart, if applicable."),
  timeField: z
    .string()
    .optional()
    .describe("The column to use as the time field if the data is timeseries."),
  suggestion: z.string().describe(`
    Provides analytical inputs based on the chart type (${chartTypes}) that could be explored using the data. 
    These questions can guide users in discovering insights and trends. For example:
    - "Compare the distribution of assets across different asset groups in area chart"
    - "Identify the top asset issues by severity in pie chart"
    - "Analyze trends in asset issues over time in area chart"
  `),
  description: z.string().describe(`The description of data`),
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

const datasource = new DataSource({
  type: "mysql",
  host: process.env.MYSQL_HOST,
  username: process.env.MYSQL_USER,
  port: "3306",
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

export const db = await SqlDatabase.fromDataSourceParams({
  appDataSource: datasource,
  sampleRowsInTableInfo: 1,
});

const executeQuery = new QuerySqlTool(db);

async function submitUserMessage(content) {
  "use server";
  const aiState = getMutableAIState();
  aiState.update([
    ...aiState.get(),
    {
      role: "user",
      content,
    },
  ]);

  const reply = createStreamableUI(
    <BotMessage className="items-center">{spinner}</BotMessage>
  );

  const prompt = `\
  You're a MYSQL data analytics bot designed to assist users with querying their data in a step-by-step manner. You and the user can discuss events and refine queries in the UI. Your current time stamp is ${new Date().toISOString()}. If the user requests to delete or attempts an impossible task, inform them you cannot fulfill that request. For data retrieval or representation, call \`query_data\`. For adding or modifying data, also call \`query_data\`. Additionally, you can engage in conversation and perform analytics as necessary.
    `;

  console.log({ prompt });

  const completion = runOpenAICompletion(openai, {
    model: "gpt-3.5-turbo-0613",
    stream: true,
    messages: [
      {
        role: "system",
        content: prompt,
      },
      ...aiState.get().map((info) => ({
        role: info.role,
        content: info.content,
        name: info.name,
      })),
    ],
    functions: [
      {
        name: "query_data",
        description: `Gets the user query for generating or refining SQL query`,
        parameters: QueryDataResponse,
      },
    ],
    temperature: 0,
  });

  completion.onTextContent(async (textcontent, isFinal) => {
    const speechFileName = content.replaceAll(" ", "_").toLowerCase() + ".mp3";
    const file = await unified()
      .use(remarkParse) // Convert into markdown AST
      .use(remarkRehype) // Transform to HTML AST
      .use(rehypeSanitize) // Sanitize HTML input
      .use(rehypeStringify) // Convert AST into serialized HTML
      .process(textcontent);

    const html = file.toString();
    reply.update(
      <BotMessage>
        <div className="py-1" dangerouslySetInnerHTML={{ __html: html }}></div>
        <AudioPlayer src={`/audio/${speechFileName}`} />
      </BotMessage>
    );
    if (isFinal) {
      await textToSpeech(textcontent, speechFileName);
      reply.done();
      aiState.done([...aiState.get(), { role: "assistant", content }]);
    }
  });

  completion.onFunctionCall("query_data", async (input) => {
    // Select Query Examples dynamically
    const queryExamples = await getRelevantExamples(content);
    console.log({ queryExamples });

    // Select Tables dynamically
    const tables = await getRelevantTable(content);
    console.log({ tables });

    const prompt1 = `\
  You are a  data analytics conversation bot for MYSQL and you can help usersquery their data, step by step.
  You and the user can discuss their events and the user can request to create new queries or refine existing ones, in the UI.

  The user has the following tables:

  ${tables}

  Below are a number of examples of questions and their corresponding SQL queries.
  ${queryExamples}

  The current time is ${new Date().toISOString()}.
  Do not share secure data.
  If the user request query to delete anything in database or impossible task, respond that you cannot do that.
  you can also chat with users and do some analytics if needed.
   `;

    const queryCompletion = runOpenAICompletion(openai, {
      model: "gpt-3.5-turbo-0613",
      stream: true,
      messages: [
        {
          role: "system",
          content: prompt1,
        },
        ...aiState.get().map((info) => ({
          role: info.role,
          content: info.content,
          name: info.name,
        })),
      ],
      functions: [
        {
          name: "show_data_on_UI",
          description: `Gets the user query for generating or refining SQL query`,
          parameters: zOpenAIQueryResponse,
        },
      ],
      temperature: 0,
    });

    queryCompletion.onFunctionCall("show_data_on_UI", async (input) => {
      const { format, title, timeField, suggestion, description, query } =
        input;

      console.log({ query, suggestion, description });

      const queryRes = await executeQuery.invoke(query);

      try {
        const data = JSON.parse(queryRes);
        reply.done(
          <BotCard>
            <SystemMessage>
              <div className="">
                <Chart
                  className="w-full"
                  chartType={format}
                  queryResult={data}
                  title={title}
                  timeField={timeField}
                  suggestion={suggestion}
                  description={description}
                />
              </div>
            </SystemMessage>
          </BotCard>
        );
      } catch (error) {
        console.log({ error });
        reply.done(
          <BotCard>
            <SystemMessage>
              <div className="py-4">
                <Code>Something went wrong</Code>
              </div>
            </SystemMessage>
          </BotCard>
        );
      }

      aiState.done([
        ...aiState.get(),
        {
          role: "function",
          name: "query_data",
          content: `[Results for query: ${query} with format: ${format} ,title: ${title}, suggestion:${suggestion} and description:${description} with data:${queryRes}]`,
        },
      ]);
    });
  });

  return {
    id: Date.now(),
    display: reply.value,
  };
}

const initialAIState = [];

const initialUIState = [];

export const AI = createAI({
  actions: {
    submitUserMessage,
  },
  initialUIState,
  initialAIState,
});
