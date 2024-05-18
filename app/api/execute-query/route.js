import executeQuery from "@/database/mysql";
export async function POST(request, response) {
  const query = await request.json(); // user id
  console.log({ query });

  try {
    const rows = executeQuery(query);

    return Response.json(rows);
  } catch (error) {
    return Response.json(
      {
        error: error,
      },
      { status: 500 }
    );
  }
}
