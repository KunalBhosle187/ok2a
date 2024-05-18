import { grantAccessToUser } from "@/lib/quries";

export async function POST(request, response) {
  const id = await request.json();

  try {
    const res = await grantAccessToUser(id);
    return Response.json(res);
  } catch (error) {
    return Response.json(
      {
        error: error,
      },
      { status: 500 }
    );
  }
}
