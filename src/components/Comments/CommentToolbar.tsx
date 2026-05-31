import type { Editor } from "@tiptap/react";
import {
  Box,
  IconButton,
  Tooltip,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";

interface CommentToolbarProps {
  editor: Editor | null;
}

export function CommentToolbar({ editor }: CommentToolbarProps) {
  // Guard – while the editor is still mounting, render nothing
  if (!editor) return null;

  // Derive active formats so MUI ToggleButtonGroup stays in sync
  const activeFormats: string[] = [];
  if (editor.isActive("bold")) activeFormats.push("bold");
  if (editor.isActive("italic")) activeFormats.push("italic");
  if (editor.isActive("underline")) activeFormats.push("underline");
  // if (editor.isActive("code")) activeFormats.push("code");

  const toolbarIconSx = { fontSize: 16 };
  const btnSx = { width: 28, height: 28, borderRadius: 1 };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.25,
        px: 1,
        py: 0.5,
        borderBottom: "1px solid",
        borderColor: "divider",
        bgcolor: "background.default",
        flexWrap: "wrap",
      }}
    >
      {/* ── Inline marks ──────────────────────────────────────────────── */}
      <ToggleButtonGroup size="small" value={activeFormats} sx={{ gap: 0.25 }}>
        <Tooltip title="Bold (⌘B)">
          <ToggleButton
            value="bold"
            sx={btnSx}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <FormatBoldIcon sx={toolbarIconSx} />
          </ToggleButton>
        </Tooltip>

        <Tooltip title="Italic (⌘I)">
          <ToggleButton
            value="italic"
            sx={btnSx}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <FormatItalicIcon sx={toolbarIconSx} />
          </ToggleButton>
        </Tooltip>

        <Tooltip title="Underline (⌘U)">
          <ToggleButton
            value="underline"
            sx={btnSx}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            <FormatUnderlinedIcon sx={toolbarIconSx} />
          </ToggleButton>
        </Tooltip>
      </ToggleButtonGroup>

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 0.25 }} />

      {/* ── Lists ─────────────────────────────────────────────────────── */}
      <Tooltip title="Bullet list">
        <IconButton
          size="small"
          sx={{
            ...btnSx,
            bgcolor: editor.isActive("bulletList")
              ? "action.selected"
              : "transparent",
          }}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <FormatListBulletedIcon sx={toolbarIconSx} />
        </IconButton>
      </Tooltip>

      <Tooltip title="Numbered list">
        <IconButton
          size="small"
          sx={{
            ...btnSx,
            bgcolor: editor.isActive("orderedList")
              ? "action.selected"
              : "transparent",
          }}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <FormatListNumberedIcon sx={toolbarIconSx} />
        </IconButton>
      </Tooltip>
    </Box>
  );
}