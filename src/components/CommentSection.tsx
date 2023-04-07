import { Favorite, FavoriteBorder } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  Pagination,
  Rating,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import type { Comment } from "@prisma/client";
import { ChangeEvent, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { trpc } from "~/utils/trpc";
type Props = {
  selectedId: string;
};
const pageSize = 5;
type FormProps = {
  name: string;
  comment: string;
  rating: number;
};
function TypingCommentSection({ selectedId }: Props) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormProps>();
  const utils = trpc.useContext();
  const createCommentMutation = trpc.comment.create.useMutation({
    onSuccess() {
      utils.comment.list.invalidate();
      toast("Comment added!");
    },
  });
  function onSubmit(data: FormProps) {
    const reqBody = {
      pokemonPlushId: selectedId,
      name: data.name,
      comment: data.comment,
      // @ts-ignore - rating is typed as string for some reason
      star: Number.parseInt(data.rating),
    };
    createCommentMutation.mutate(reqBody);
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2}>
        <Controller
          name="rating"
          control={control}
          defaultValue={0}
          render={({ field: { onChange, value } }) => (
            <Rating
              name="rating"
              icon={<Favorite fontSize="inherit" />}
              emptyIcon={<FavoriteBorder fontSize="inherit" />}
              onChange={onChange}
              value={Number(value)}
            />
          )}
        />
        <TextField
          label="Name"
          fullWidth
          {...register("name", { required: true })}
          error={!!errors.name}
          helperText={errors.name ? "Name is required" : ""}
        />
        <TextField
          label="Comment"
          fullWidth
          multiline
          minRows={3}
          {...register("comment", { required: true })}
          error={!!errors.comment}
          helperText={errors.comment ? "Comment is required" : ""}
        />
        <Button variant="contained" type="submit">
          Submit
        </Button>
      </Stack>
    </form>
  );
}
function ListComments({ comments }: { comments: Comment[] }) {
  const [slice, setSlice] = useState(0);
  function showNextPageComment(
    event: ChangeEvent<unknown>,
    page: number
  ): void {
    setSlice((page - 1) * pageSize);
  }
  const slicedComments = comments.slice(slice, slice + pageSize);
  const counts = Math.ceil(comments.length / pageSize);
  return (
    <Stack>
      <Typography variant="h6">Comments</Typography>
      <List>
        {slicedComments.map((comment) => (
          <ListItem alignItems="flex-start" key={comment.id}>
            <ListItemAvatar>
              <Avatar src="/avatar.png" alt="avatar" />
            </ListItemAvatar>
            <ListItemText primary={comment.name} secondary={comment.comment} />
            <ListItemIcon>
              <Rating
                value={comment.star}
                readOnly
                icon={<Favorite fontSize="inherit" />}
                emptyIcon={<FavoriteBorder fontSize="inherit" />}
              />
            </ListItemIcon>
          </ListItem>
        ))}
      </List>
      <Pagination
        count={counts}
        onChange={showNextPageComment}
        sx={{
          display: "flex",
          justifyContent: "center",
          visibility: counts > 1 ? "visible" : "hidden",
        }}
      />
    </Stack>
  );
}
export default function CommentSection({ selectedId }: Props) {
  const commentQuery = trpc.comment.list.useQuery({
    pokemonPlushId: selectedId,
  });
  const comments = commentQuery.data ?? [];
  return (
    <Box>
      <TypingCommentSection selectedId={selectedId} />
      <ListComments comments={comments} />
    </Box>
  );
}