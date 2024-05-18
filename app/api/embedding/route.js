import { getEmbedding, storeEmbedding } from "@/lib/quries";

export async function GET(request, response) {
  try {
    const embedding = await getEmbedding();

    return Response.json(embedding);
  } catch (error) {
    return Response.json(
      {
        error: error,
      },
      { status: 500 }
    );
  }
}

export async function POST(request, response) {
  try {
    const embedding = await request.json();
    const status = await storeEmbedding(embedding);

    return Response.json(status);
  } catch (error) {
    return Response.json(
      {
        error: error,
      },
      { status: 500 }
    );
  }
}
