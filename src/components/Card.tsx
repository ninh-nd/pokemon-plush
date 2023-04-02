import {
  Autocomplete,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { debounce } from "@mui/material/utils";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { SyntheticEvent, useState } from "react";
import { getPokemonPlush, PokemonObject } from "~/api";
type Props = {
  list: PokemonObject[];
};
export default function PokemonCard({ list }: Props) {
  const [selected, setSelected] = useState(list[0]);
  const [inputText, setInputText] = useState("");
  const { data, isLoading } = useQuery(
    ["pokemon", inputText],
    () => getPokemonPlush(inputText),
    {
      enabled: Boolean(inputText),
    }
  );
  const options = data ?? [];
  const debouncedSetInputText = debounce(setInputText, 1000);
  function handleInputChange(
    event: SyntheticEvent<Element, Event>,
    value: string
  ) {
    debouncedSetInputText(value);
  }
  const extendedOptions = options.map((option) => {
    const firstLetter = option.name[0].toUpperCase();
    return {
      firstLetter: /[0-9]/.test(firstLetter) ? "0-9" : firstLetter,
      ...option,
    };
  });
  function handleChange(
    event: SyntheticEvent<Element, Event>,
    value: PokemonObject | null
  ) {
    if (!value) return;
    const index = options.findIndex((option) => option.id === value.id);
    if (index === -1) return;
    setSelected(options[index]);
  }
  return (
    <Stack
      spacing={2}
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Image
        loader={() => selected.url}
        src={selected.url}
        alt=""
        width={200}
        height={200}
      />
      <Typography variant="h4">{selected.name}</Typography>
      <Typography variant="h6">{selected.plushName}</Typography>
      <Autocomplete
        fullWidth
        options={extendedOptions.sort(
          (a, b) => -b.firstLetter.localeCompare(a.firstLetter)
        )}
        onChange={handleChange}
        onInputChange={handleInputChange}
        groupBy={(option) => option.name}
        getOptionLabel={(option) => option.plushName}
        filterOptions={(x) => x}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Type in a Pokemon's name or a plush name to start searching"
            variant="outlined"
            fullWidth
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {isLoading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />
    </Stack>
  );
}
