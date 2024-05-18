import { getUserByEmail } from "@/lib/quries";

export async function GET(request, { params }) {
  const { email } = params;

  try {
    const res = await getUserByEmail(email);
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
