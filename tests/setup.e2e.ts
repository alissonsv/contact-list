import { prisma } from "../src/lib/prisma";

async function deleteAllData() {
  const modelNames = Object.keys(prisma).filter(
    (key) => !["_", "$"].includes(key[0]),
  );

  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let i = 0; i < modelNames.length; i++) {
    const modelName = modelNames[i];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (prisma as any)[modelName].deleteMany();
  }
}

beforeAll(async () => {
  await deleteAllData();
});

afterEach(async () => {
  await deleteAllData();
});
