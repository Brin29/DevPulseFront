import { useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { type CreateTaskCommentRequest } from "../../models/task.model";
import {
  useCommentMutations,
  useComments,
  useTaskFormParams,
} from "../../hooks/task.hook";
import { CommentEditor } from "../Comments/CommentEditor";
import { Alert, Box, CircularProgress, Typography } from "@mui/material";
import { CommentItem } from "../Comments/CommentItem";

interface CreateCommentTaskProps {
  teamId: string;
  taskId: string;
}

export const CreateCommentTask = ({
  teamId,
  taskId,
}: CreateCommentTaskProps) => {
  const { create, edit, delete: deleteComment } = useCommentMutations();
  const { data: paramForm } = useTaskFormParams(teamId);
  const authMeStr = localStorage.getItem("authMe");
  const authMe = authMeStr ? JSON.parse(authMeStr) : null;
  const currentUserId: string = authMe?.data?.user?.id || "";

  const mentionUsers = useMemo(
    () =>
      paramForm?.members?.map((m: any) => ({
        id: m.userId._id,
        name: `${m.userId.firstName} ${m.userId.lastName}`,
        avatar: m.userId.avatar,
      })) || [],
    [paramForm],
  );

  const {
    data: commentsData,
    isLoading: commentsLoading,
    isError,
    error: queryError,
  } = useComments(teamId, taskId);

  const comments = useMemo(() => {
    if (!commentsData) return [];
    const raw = Array.isArray(commentsData)
      ? commentsData
      : commentsData?.comments || commentsData?.data || [];
    return raw.map((c: any) => ({
      id: c._id,
      author: {
        id: c.author?._id || c.userId?._id || "",
        name: c.author
          ? `${c.author.firstName} ${c.author.lastName}`
          : c.userId
            ? `${c.userId.firstName} ${c.userId.lastName}`
            : "Unknown",
        avatar: c.author?.avatar || c.userId?.avatar,
      },
      content: c.content,
      createdAt: new Date(c.createdAt),
      editedAt:
        c.updatedAt !== c.createdAt
          ? new Date(c.updatedAt || c.editedAt)
          : undefined,
    }));
  }, [commentsData]);

  const handleEditComment = (commentId: string, _html: string) => {
    edit.mutate({
      teamId,
      taskId,
      commentId,
      payload: { content: _html },
    });
  };

  const handleDeleteComment = (commentId: string) => {
    deleteComment.mutate({
      teamId,
      taskId,
      commentId,
    });
  };

  const {
    control,
    handleSubmit,
    reset,
    formState: {},
  } = useForm<CreateTaskCommentRequest>({
    defaultValues: {
      content: "",
    },
  });

  const contentValue = useWatch({ control, name: "content" });

  const onSubmit = (data: CreateTaskCommentRequest) => {
    create.mutate(
      { teamId, taskId, payload: data },
      {
        onSuccess: () => {
          reset();
          // setSuccessModal(true);
        },
        onError: () => {
          reset();
          // setErrorModal(true);
        },
      },
    );
  };

  return (
    <>
      {commentsLoading && (
        <Box sx={{ textAlign: "center", py: 2 }}>
          <CircularProgress size={20} />
        </Box>
      )}

      {isError && (
        <Alert severity="error" sx={{ my: 2 }}>
          Error: {queryError?.message || "Algo salió mal"}
        </Alert>
      )}

      {comments.map((comment: any) => (
        <CommentItem
          commentId={comment.id}
          teamId={teamId}
          taskId={taskId}
          key={comment.id}
          comment={comment}
          currentUserId={currentUserId}
          allUsers={mentionUsers}
          onEdit={handleEditComment}
          onDelete={handleDeleteComment}
        />
      ))}

      <Box>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          Crear comentario
        </Typography>

        <CommentEditor
          name="content"
          control={control}
          value={contentValue}
          onSubmit={handleSubmit(onSubmit)}
          placeholder="Escribe un comentario… usa @ para mencionar a alguien"
          users={mentionUsers}
          maxLength={500}
        />
      </Box>
    </>
  );
};
