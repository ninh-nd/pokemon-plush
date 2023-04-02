const path = require("path");
const fs = require("fs").promises;
const PrismaClient = require("@prisma/client").PrismaClient;
type ParsedJson = {
  origin: Array<string>;
  plush: Array<string>;
};

async function parseJSON() {
  const jsonDirectory = path.join(process.cwd(), "json");
  const fileContents = await fs.readFile(jsonDirectory + "/data.json", "utf8");
  const parsed: ParsedJson = JSON.parse(fileContents);
  const regex = /\s*「(.+?)」\s*(.+?)\s*\{img\s+(.+?)\s*\}/;
  const list = parsed.plush.map((item) => {
    const match = item.match(regex);
    if (!match) {
      throw new Error(`Could not parse: ${item}`);
    }
    const [, name, plushName, url] = match;
    const result = { name, plushName, url };
    return result;
  });
  return list;
}

const prisma = new PrismaClient();
async function main() {
  const plushes = await prisma.pokemonPlush.createMany({
    data: await parseJSON(),
  });
  console.log(plushes);
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
export {};
