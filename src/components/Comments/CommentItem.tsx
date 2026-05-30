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
  Chip,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import ReplyIcon from "@mui/icons-material/Reply";
import { formatDistanceToNow } from "date-fns";
import { CommentPreview } from "./CommentPreview";
import { CommentEditor } from "./CommentEditor";
import type { JSONContent } from "@tiptap/react";

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
  comment,
  currentUserId,
  allUsers = [],
  onEdit,
  onDelete,
  onReply,
  onReact,
  depth = 0,
}: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  const isOwner = comment.author.id === currentUserId;
  const timeAgo = formatDistanceToNow(comment.createdAt, { addSuffix: true });
  const isEdited = !!comment.editedAt;

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) =>
    setMenuAnchor(e.currentTarget);
  const handleMenuClose = () => setMenuAnchor(null);

  const handleDelete = () => {
    handleMenuClose();
    onDelete?.(comment.id);
  };

  const handleStartEdit = () => {
    handleMenuClose();
    setIsEditing(true);
  };

  const handleEditSubmit = (html: string, json: object) => {
    onEdit?.(comment.id, html, json as JSONContent);
    setIsEditing(false);
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
        sx={{ width: 32, height: 32, mt: 0.5, flexShrink: 0, fontSize: "0.8rem" }}
      >
        {comment.author.name.charAt(0).toUpperCase()}
      </Avatar>

      {/* Comment bubble */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        {/* Header row */}
        <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.75, mb: 0.5 }}>
          <Typography variant="subtitle2">
            {comment.author.name}
          </Typography>
          <Typography
            variant="caption"
            color="text.disabled"
            sx={{ flexShrink: 0 }}
          >
            {timeAgo}
          </Typography>
          {isEdited && (
            <Typography variant="caption" color="text.disabled" sx={{ fontStyle: "italic" }}>
              (editado)
            </Typography>
          )}

          {/* ··· menu (only for owner) */}
          {isOwner && (
            <Box sx={{ ml: "auto" }}>
              <Tooltip title="Más opciones">
                <IconButton size="small" onClick={handleMenuOpen} sx={{ p: 0.25 }}>
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
                <MenuItem dense onClick={handleDelete} sx={{ color: "error.main" }}>
                  <DeleteOutlinedIcon sx={{ fontSize: 16, mr: 1 }} /> Eliminar
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Box>

        {/* Body: preview or inline editor */}
        {isEditing ? (
          <CommentEditor
            initialContent={
              typeof comment.content === "string" ? comment.content : ""
            }
            users={allUsers}
            onSubmit={handleEditSubmit}
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

        {/* Action row: reactions + reply */}
        {!isEditing && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.75 }}>
            {/* Like / thumbs up */}
            <Tooltip title="Me gusta">
              <IconButton
                size="small"
                sx={{ p: 0.5 }}
                onClick={() => onReact?.(comment.id, "👍")}
              >
                {comment.reactions?.find((r) => r.emoji === "👍")?.reacted ? (
                  <ThumbUpIcon sx={{ fontSize: 14, color: "primary.main" }} />
                ) : (
                  <ThumbUpOutlinedIcon sx={{ fontSize: 14 }} />
                )}
              </IconButton>
            </Tooltip>
            {comment.reactions?.map((r) => (
              <Chip
                key={r.emoji}
                label={`${r.emoji} ${r.count}`}
                size="small"
                variant={r.reacted ? "filled" : "outlined"}
                onClick={() => onReact?.(comment.id, r.emoji)}
                sx={{ height: 22, fontSize: "0.72rem", cursor: "pointer" }}
              />
            ))}

            {onReply && (
              <Tooltip title="Responder">
                <IconButton
                  size="small"
                  sx={{ p: 0.5, ml: "auto" }}
                  onClick={() => onReply(comment.id)}
                >
                  <ReplyIcon sx={{ fontSize: 14 }} />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}