import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { debounce } from "@mui/material/utils";
import type { PokemonPlush } from "@prisma/client";
import Image from "next/image";
import { Dispatch, SetStateAction, SyntheticEvent, useState } from "react";
import { trpc } from "~/utils/trpc";
type Props = {
  selected: PokemonPlush;
  setSelected: Dispatch<SetStateAction<PokemonPlush>>;
};
export default function PokemonCard({ selected, setSelected }: Props) {
  const [inputText, setInputText] = useState<string | undefined>(undefined);
  const { data, isLoading } = trpc.plush.list.useQuery({ name: inputText });
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
    value: PokemonPlush | null
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
