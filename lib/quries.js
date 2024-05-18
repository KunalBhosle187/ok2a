import prisma from "@/db";

export const getUser = async () => {
  const users = await prisma.user.findMany();
  return users;
};

export const getEmbedding = async () => {
  const embedding = await prisma.embeddings.findMany();
  return embedding;
};

export const storeEmbedding = async (vectorData) => {
  const embedding = await prisma.user.create({
    data: {
      vector: vectorData,
    },
  });
  return "Embedding store successfully";
};

export const getUserByEmail = async (email) => {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  return user;
};

export const grantAccessToUser = async (id) => {
  try {
    const updateUser = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        verified: true,
      },
    });
    return "Access granted";
  } catch (error) {
    console.log({ error });
    return "Error";
  }
};

export const revokeAccessToUser = async (id) => {
  try {
    const updateUser = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        verified: false,
      },
    });
    return "Access revoked";
  } catch (error) {
    console.log({ error });
    return "Error";
  }
};
