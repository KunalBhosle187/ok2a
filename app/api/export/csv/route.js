const createCsvWriter = require("csv-writer").createObjectCsvWriter;

export async function POST(request, response) {
  const data = await request.json();
  const header = await data.columns.map((item) => ({
    id: item.replaceAll(" ", "_").toLowerCase(),
    title: item.toUpperCase(),
  }));
  const csvWriter = createCsvWriter({
    header: header,
    path: `public/${data.filename}`,
  });
  const records = data.records;

  console.log({ data, header, records });

  csvWriter
    .writeRecords(records)
    .then(() => {
      return Response.json("Done");
    })
    .catch((error) => {
      console.log({ error });
      return Response.json(
        {
          error: error,
        },
        { status: 500 }
      );
    });
  return Response.json("Done");
}
