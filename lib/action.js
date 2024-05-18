import fs from "fs";
import path from "path";
import Papa from "papaparse";
import OpenAI from "openai";
import fewShotExamples from "@/public/fewshots.json";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

import { OpenAIEmbeddings } from "@langchain/openai";
import { db } from "@/app/action";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export const getRelevantTable = async (userInput) => {
  const readCSV = async (filename) => {
    // Read the CSV file
    const tableDetails = [];
    const filePath = path.join(process.cwd(), "public", filename);

    const csvData = await fs.promises.readFile(filePath, "utf-8");

    const parsedData = Papa.parse(csvData, { header: true }); // Adjust options as needed
    parsedData.data.map(({ Table, Description }) => {
      tableDetails.push({ name: Table, description: Description });
    });

    // Iterate over the array to create the string representation
    const table_description = tableDetails
      .map((row) => {
        return `Table Name: ${row.name}\nTable Description: ${row.description}\n\n`;
      })
      .join(""); // Join the array of strings into a single string

    return table_description;
  };

  const tableDetails = await readCSV("table_info.csv");

  const tablePrompt = `Return the names of ALL the SQL tables that MIGHT be relevant to the user question. \n
  The tables are:

  ${tableDetails}

  Remember to include ALL POTENTIALLY RELEVANT tables, even if you're not sure that they're needed.
  Return JSON output in ['asset','user'] this format  with key relevant_tables. 
  `;

  const tableCompletion = await openai.chat.completions.create({
    // const tableCompletion = await ollama.chat({
    messages: [
      { role: "system", content: tablePrompt },
      { role: "user", content: userInput },
    ],
    // format: "json",
    response_format: { type: "json_object" },
    model: "gpt-3.5-turbo-0125",
    // model: "mistral",
  });
  // console.log({ tableCompletion: JSON.parse(tableCompletion.message.content) });
  console.log({
    tableCompletion: JSON.parse(tableCompletion.choices[0].message.content),
  });
  const dynamicallySelectedTables =
    JSON.parse(tableCompletion.choices[0].message.content).relevant_tables ||
    [];
  // const dynamicallySelectedTables =
  //   JSON.parse(tableCompletion.message.content).relevant_tables || [];

  // const filteredTables = jsonTable
  //   .filter((table) =>
  //     dynamicallySelectedTables.includes(Object.keys(table)[0])
  //   )
  //   .map((table) => Object.values(table)[0])
  //   .join("\n");

  const shortTableSchema = ` asset:(asset_id, asset_name, fk_asset_group_id, fk_asset_primary_owner_id, fk_asset_secondary_owner_id, fk_asset_issue_mgr_id, fk_asset_type, asset_hosted_environment, fk_asset_location_name),\nasset_group:(asset_group_id, asset_group_name, fk_asset_group_business_unit, fk_asset_group_business_sub_unit, fk_asset_group_location),\nasset_issuelog_report:(report_id, report_name, fk_main_report_id, fk_template_id),\nconfig_review_template:(cr_template_id, template_name, fk_asset_test_type, scanner_type),\ncurrent_asset_issues:(asset_issue_id, fk_asset_id, fk_master_issue_id, issue_name, fk_reporting_status, issue_status, issue_open_since, issue_counter_date, issue_status_change_date, fk_issue_manager),\nmaster_asset_criticality_values:(id, label, color),\nmaster_asset_test_type_table:(asset_test_type_id, asset_test_type, issue_table_name),\nmaster_issues:(issue_id, issue_name, fk_asset_test_type, fk_cr_template_id, issue_riskrating),\nmaster_location:(location_name),\nmaster_reporting_status:(status_id, status_name),\nmaster_request_type:(master_request_type_code, master_request_type_name),\nmaster_risk_ratings_values:(id, name, color),\nrequest:(request_id, fk_requested_by, fk_master_request_type_code, request_status),\nsecurity_test_request:(test_request_id, test_compliance, test_assigned_on, test_start_date, test_end_date, test_due_date, test_stage, fk_request_id, fk_scheduled_by),\nunique_app_issues:(fk_issue_id, app_issue_description),\nunique_asset_issues:(asset_issue_id, fk_asset_id, fk_master_issue_id, issue_name, fk_reporting_status, issue_status, issue_open_since, issue_counter_date, issue_status_change_date, fk_issue_manager),\nunique_config_issues:(fk_issue_id, config_issue_description),\nunique_pt_issues:(fk_issue_id, pt_issue_description),\nuser:(id, username, fullname, designation, email).`;

  const tables =
    dynamicallySelectedTables.length > 0
      ? db.getTableInfo(dynamicallySelectedTables)
      : shortTableSchema;

  return tables;
};

export const getRelevantExamples = async (userInput) => {
  // Create docs with a loader
  const texts = fewShotExamples.map(
    (example) => `${example.input} <**> ${example.query}`
  );
  const metadata = fewShotExamples.map((_, index) => ({ id: index + 1 }));

  const vectorStore = await MemoryVectorStore.fromTexts(
    texts,
    metadata,
    new OpenAIEmbeddings()
  );

  const queryExamplesArray = await vectorStore.similaritySearch(userInput, 2);

  // const exampleSelector = await SemanticSimilarityExampleSelector.fromExamples(
  //   fewShotExamples,
  //   new OpenAIEmbeddings(),
  //   HNSWLib,
  //   {
  //     k: 2,
  //     inputKeys: ["input"],
  //   }
  // );
  console.log({ queryExamplesArray });
  // const queryExamplesArray = await exampleSelector.selectExamples({
  //   input: userInput,
  // });

  return queryExamplesArray
    .map(
      (item) =>
        `user:${item.pageContent.split("<**>")[0]}\nAI:${
          item.pageContent.split("<**>")[1]
        }`
    )
    .join("\n\n");
};

export const textToSpeech = async (text, filename) => {
  const speechFile = path.join(process.cwd(), "public/audio/", filename);
  // const speechFile = path.resolve("./speech.mp3");

  const mp3 = await openai.audio.speech.create({
    model: "tts-1",
    voice: "shimmer",
    input: text,
  });
  const buffer = Buffer.from(await mp3.arrayBuffer());
  await fs.promises.writeFile(speechFile, buffer);
};
