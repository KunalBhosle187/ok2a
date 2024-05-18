"use client";
import Suggestion from "@/components/suggestion";
import TablePg from "@/components/table";

import {
  AreaChart,
  BarChart,
  BarList,
  Card,
  DonutChart,
  Legend,
  List,
  ListItem,
} from "@tremor/react";

export function Chart(props) {
  let { timeField = "date" } = props;
  try {
    let { queryResult, chartType, suggestion, description } = props;
    const objKeys = Object.keys(queryResult[0]);

    // Convert Number strng  into integer
    queryResult.forEach((obj) => {
      // Loop through the object properties
      for (const key in obj) {
        if (Object.hasOwnProperty.call(obj, key)) {
          // Check if the property value is a string that can be converted to an integer
          const value = obj[key];
          if (
            !isNaN(value) &&
            typeof value === "string" &&
            value.trim() !== ""
          ) {
            // Convert the value to an integer
            obj[key] = parseInt(value);
          }
        }
      }
    });

    const cat = objKeys.filter((item, index) => index != 0);
    console.log("*****", {
      props,
      queryResult,
      objKeys,
    });
    const dataFormatter = (number) => parseInt(number);
    // const keys = Object.keys(queryResult[0]);

    if (chartType === "area") {
      return (
        <>
          <span className="text-lg font-medium dark:text-dark-tremor-content-strong">
            {props.title}
          </span>
          <AreaChart
            categories={cat}
            index={objKeys[0]}
            data={queryResult}
            valueFormatter={dataFormatter}
            yAxisWidth={30}
            showAnimation
          />
          {suggestion && (
            <Suggestion suggestion={suggestion} description={description} />
          )}
        </>
      );
    }

    if (chartType === "pie") {
      return (
        <>
          <span className="text-lg font-medium dark:text-dark-tremor-content-strong">
            {props.title}
          </span>
          <div className="flex items-center justify-center space-6 pt-5">
            <DonutChart
              data={queryResult}
              category={objKeys[1]}
              index={objKeys[0]}
              colors={["blue", "cyan", "indigo", "violet", "fuchsia"]}
              className="w-40"
              showAnimation
            />
            <Legend
              categories={queryResult.map((item) => item[objKeys[0]])}
              colors={["blue", "cyan", "indigo", "violet", "fuchsia"]}
              className="max-w-xs"
            />
          </div>
          {suggestion && (
            <Suggestion suggestion={suggestion} description={description} />
          )}
        </>
      );
    }

    if (chartType === "bar") {
      const dataFormatter = (number) =>
        Intl.NumberFormat("us").format(number).toString();
      return (
        <>
          <span className="text-lg font-medium dark:text-dark-tremor-content-strong">
            {props.title}
          </span>
          <div className="flex items-center justify-center space-6 pt-5">
            <BarChart
              data={queryResult}
              categories={cat}
              index={objKeys[0]}
              valueFormatter={dataFormatter}
              colors={["blue", "teal", "amber", "rose", "indigo", "emerald"]}
              yAxisWidth={48}
              showAnimation
            />
          </div>
          {suggestion && (
            <Suggestion suggestion={suggestion} description={description} />
          )}
        </>
      );
    }

    // if (chartType === "barlist") {
    //   let formatted = [];

    //   formatted = queryResult.results.map((row) => {
    //     const obj = {};
    //     queryResult.columns.forEach((col, i) => {
    //       obj[col] = row[i];
    //     });
    //     return obj;
    //   });

    //   console.log({ formatted });
    //   return (
    //     <>
    //       <span className="text-lg font-medium dark:text-dark-tremor-content-strong">
    //         {props.title}
    //       </span>
    //       <div className="flex items-center justify-center space-6 pt-5">
    //         <BarList
    //           data={[
    //             {
    //               username: "superadmin",
    //               count: 17,
    //             },
    //             {
    //               username: "Atul",
    //               count: 12,
    //             },
    //             {
    //               username: "Arpit",
    //               count: 4,
    //             },
    //           ]}
    //           sortOrder="ascending"
    //           className="mx-auto max-w-sm"
    //         />
    //       </div>
    //       {suggestion && (
    //         <Suggestion suggestion={suggestion} description={description} />
    //       )}
    //     </>
    //   );
    // }

    // if (chartType === "list") {
    //   let formatted = [];

    //   formatted = queryResult.results.map((row) => {
    //     const obj = {};
    //     queryResult.columns.forEach((col, i) => {
    //       obj[col] = row[i];
    //     });
    //     return obj;
    //   });

    //   console.log({ formatted });
    //   return (
    //     <>
    //       <Card className="mx-auto max-w-md">
    //         <h3 className="text-tremor-content-strong dark:text-dark-tremor-content-strong font-medium">
    //           {props.title}
    //         </h3>
    //         <List className="mt-2">
    //           <ListItem className="border-b-2">
    //             <span>{queryResult.columns[0]}</span>
    //             <span>{queryResult.columns[1]}</span>
    //           </ListItem>
    //           {formatted.map((item) => (
    //             <ListItem key={item[queryResult.columns[0]]}>
    //               <span>{item[queryResult.columns[0]]}</span>
    //               <span>{item[queryResult.columns[1]]}</span>
    //             </ListItem>
    //           ))}
    //         </List>
    //       </Card>
    //       {suggestion && (
    //         <Suggestion suggestion={suggestion} description={description} />
    //       )}
    //     </>
    //   );
    // }

    if (chartType === "number") {
      const stat = queryResult[0][objKeys[0]];
      return (
        <div>
          <p className="text-tremor-default font-medium text-tremor-content dark:text-dark-tremor-content">
            {props.title}
          </p>
          <div className="mt-2 flex items-baseline space-x-2.5">
            <p className="text-tremor-metric font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
              {stat}
            </p>
          </div>
          {suggestion && (
            <Suggestion suggestion={suggestion} description={description} />
          )}
        </div>
      );
    }

    if (chartType === "table") {
      return <TablePg data={props} />;
    }
  } catch (error) {
    console.log(error, props);
    return (
      <div className="flex items-center justify-center">
        <Card>
          <p className="text-tremor-default font-medium text-tremor-content dark:text-dark-tremor-content">
            Error rendering chart
          </p>
        </Card>
      </div>
    );
  }
}
