import prisma from "./prisma";

export async function getPokemonPlush(name: string | undefined) {
  let plushes;
  if (!name) {
    plushes = await prisma.pokemonPlush.findMany({});
  }
  plushes = await prisma.pokemonPlush.findMany({
    where: {
      OR: [
        {
          name: {
            contains: name,
            mode: "insensitive",
          },
        },
        {
          plushName: {
            contains: name,
            mode: "insensitive",
          },
        },
      ],
    },
  });
  return plushes;
}
export async function getFirstPokemonPlush() {
  const plush = await prisma.pokemonPlush.findFirst({});
  if (!plush) return [];
  return [plush];
}
