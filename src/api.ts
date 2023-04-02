import axios from "axios";
const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3000/api";
const api = axios.create({
  baseURL: API_BASE_URL,
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
