import axios from "axios";
const api = axios.create({
  baseURL: process.env.API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
export type PokemonObject = {
  id: string;
  name: string;
  plushName: string;
  url: string;
};
export async function getPokemonPlush(
  name: string | undefined
): Promise<Array<PokemonObject>> {
  const { data } = await api.get("/plush", {
    params: {
      name,
    },
  });
  return data;
}
