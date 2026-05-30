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
import CodeIcon from "@mui/icons-material/Code";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import LinkIcon from "@mui/icons-material/Link";
import LinkOffIcon from "@mui/icons-material/LinkOff";
import { useCallback } from "react";

interface CommentToolbarProps {
  editor: Editor | null;
}

export function CommentToolbar({ editor }: CommentToolbarProps) {
  // Guard – while the editor is still mounting, render nothing
  if (!editor) return null;

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("URL", previousUrl ?? "https://");
    if (url === null) return; // cancelled
    if (url === "") {
      editor.chain().focus().extendMarkToNextWord().unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkToNextWord().setLink({ href: url }).run();
  }, [editor]);

  // Derive active formats so MUI ToggleButtonGroup stays in sync
  const activeFormats: string[] = [];
  if (editor.isActive("bold")) activeFormats.push("bold");
  if (editor.isActive("italic")) activeFormats.push("italic");
  if (editor.isActive("underline")) activeFormats.push("underline");
  if (editor.isActive("code")) activeFormats.push("code");

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

        <Tooltip title="Inline code">
          <ToggleButton
            value="code"
            sx={btnSx}
            onClick={() => editor.chain().focus().toggleCode().run()}
          >
            <CodeIcon sx={toolbarIconSx} />
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

      <Tooltip title="Blockquote">
        <IconButton
          size="small"
          sx={{
            ...btnSx,
            bgcolor: editor.isActive("blockquote")
              ? "action.selected"
              : "transparent",
          }}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <FormatQuoteIcon sx={toolbarIconSx} />
        </IconButton>
      </Tooltip>

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 0.25 }} />

      {/* ── Link ──────────────────────────────────────────────────────── */}
      <Tooltip title={editor.isActive("link") ? "Remove link" : "Add link"}>
        <IconButton
          size="small"
          sx={{
            ...btnSx,
            bgcolor: editor.isActive("link") ? "action.selected" : "transparent",
          }}
          onClick={editor.isActive("link")
            ? () => editor.chain().focus().unsetLink().run()
            : setLink}
        >
          {editor.isActive("link") ? (
            <LinkOffIcon sx={toolbarIconSx} />
          ) : (
            <LinkIcon sx={toolbarIconSx} />
          )}
        </IconButton>
      </Tooltip>
    </Box>
  );
}