import { useState } from "react";
import {
  Box,
  Avatar,
  Typography,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { formatDistanceToNow } from "date-fns";
import { CommentPreview } from "./CommentPreview";
import { CommentEditor } from "./CommentEditor";
import type { JSONContent } from "@tiptap/react";
import type {
  CreateTaskCommentRequest,
  UpdateTaskCommentRequest,
} from "../../models/task.model";
import { useForm } from "react-hook-form";
import { useCommentMutations } from "../../hooks/task.hook";
import { Modal } from "../Modals/Modal";

interface User {
  id: string;
  name: string;
  avatar?: string;
}

interface Comment {
  id: string;
  author: User;
  content: string | JSONContent; // HTML string or TipTap JSON
  createdAt: Date;
  editedAt?: Date;
  reactions?: { emoji: string; count: number; reacted: boolean }[];
}

interface CommentItemProps {
  taskId: string;
  teamId: string;
  commentId: string;
  comment: Comment;
  currentUserId: string;
  allUsers?: User[];
  onEdit?: (commentId: string, html: string, json: JSONContent) => void;
  onDelete?: (commentId: string) => void;
  onReply?: (commentId: string) => void;
  onReact?: (commentId: string, emoji: string) => void;
  depth?: number; // For nested/threaded comments (0 = top level)
}

export function CommentItem({
  taskId,
  teamId,
  commentId,
  comment,
  currentUserId,
  allUsers = [],
  depth = 0,
}: CommentItemProps) {
  const { edit, delete: deleteComment } = useCommentMutations();
  const [isEditing, setIsEditing] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [successDeleteModal, setSuccessDeleteModal] = useState(false);
  const [errorDeleteModal, setErrorDeleteModal] = useState(false);
  const isOwner = comment.author.id === currentUserId;
  const timeAgo = formatDistanceToNow(comment.createdAt, { addSuffix: true });
  const isEdited = !!comment.editedAt;

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

  const onSubmit = (data: UpdateTaskCommentRequest) => {
    edit.mutate(
      { teamId: teamId, taskId: taskId, commentId: commentId, payload: data },
      {
        onSuccess: () => {
          handleMenuClose();
          setIsEditing(false);
          reset();
        },
        onError: () => {
          handleMenuClose();
          reset();
        },
      },
    );
  };

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) =>
    setMenuAnchor(e.currentTarget);
  const handleMenuClose = () => setMenuAnchor(null);

  const handleDelete = () => {
    deleteComment.mutate(
      { teamId, taskId, commentId },
      {
        onSuccess: () => {
          setSuccessDeleteModal(true);
        },
        onError: () => {
          setErrorDeleteModal(true);
        },
      },
    );
  };

  const handleStartEdit = () => {
    handleMenuClose();
    setIsEditing(true);
  };

  return (
    <Box
      sx={{
        display: "flex",
        gap: 1.5,
        pl: depth > 0 ? 4 : 0, // indent nested comments
        "&:not(:last-child)": { mb: 2 },
      }}
    >
      {/* Avatar */}
      <Avatar
        src={comment.author.avatar}
        alt={comment.author.name}
        sx={{
          width: 32,
          height: 32,
          mt: 0.5,
          flexShrink: 0,
          fontSize: "0.8rem",
        }}
      >
        {comment.author.name.charAt(0).toUpperCase()}
      </Avatar>

      {/* Comment bubble */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        {/* Header row */}
        <Box
          sx={{ display: "flex", alignItems: "baseline", gap: 0.75, mb: 0.5 }}
        >
          <Typography variant="subtitle2">{comment.author.name}</Typography>
          <Typography
            variant="caption"
            color="text.disabled"
            sx={{ flexShrink: 0 }}
          >
            {timeAgo}
          </Typography>
          {isEdited && (
            <Typography
              variant="caption"
              color="text.disabled"
              sx={{ fontStyle: "italic" }}
            >
              (editado)
            </Typography>
          )}

          {/* ··· menu (only for owner) */}
          {isOwner && (
            <Box sx={{ ml: "auto" }}>
              <Tooltip title="Más opciones">
                <IconButton
                  size="small"
                  onClick={handleMenuOpen}
                  sx={{ p: 0.25 }}
                >
                  <MoreVertIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={handleMenuClose}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                // PaperProps={{ sx: { minWidth: 140 } }}
              >
                <MenuItem dense onClick={handleStartEdit}>
                  <EditOutlinedIcon sx={{ fontSize: 16, mr: 1 }} /> Editar
                </MenuItem>
                <Divider />
                <MenuItem
                  dense
                  onClick={handleDelete}
                  sx={{ color: "error.main" }}
                >
                  <DeleteOutlinedIcon sx={{ fontSize: 16, mr: 1 }} /> Eliminar
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Box>

        {/* Body: preview or inline editor */}
        {isEditing ? (
          <CommentEditor
            name="content"
            control={control}
            initialContent={
              typeof comment.content === "string" ? comment.content : ""
            }
            maxLength={500}
            users={allUsers}
            onSubmit={handleSubmit(onSubmit)}
            onCancel={() => setIsEditing(false)}
            autoFocus
          />
        ) : (
          <Box
            sx={{
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              px: 1.5,
              py: 1,
            }}
          >
            <CommentPreview content={comment.content} />
          </Box>
        )}
      </Box>

      {successDeleteModal && (
        <Modal
          title="Eliminación exitosa"
          open={successDeleteModal}
          onClose={() => setSuccessDeleteModal(false)}
        >
          <Typography>La eliminación del comentario fue exitosa</Typography>
        </Modal>
      )}

      {errorDeleteModal && (
        <Modal
          title="Ocurrio un error"
          open={errorDeleteModal}
          onClose={() => setErrorDeleteModal(false)}
        >
          <Typography>Ocurrio un error en la eliminación del comentario</Typography>
        </Modal>
      )}
    </Box>
  );
}
