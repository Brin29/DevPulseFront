import { useEditor, EditorContent, generateHTML } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Mention from "@tiptap/extension-mention";
import { Box } from "@mui/material";
import type { JSONContent } from "@tiptap/react";
import { useEffect } from "react";

interface CommentPreviewProps {
  /**
   * Accepts either a raw HTML string (from editor.getHTML())
   * or a TipTap JSON document (from editor.getJSON()).
   */
  content: string | JSONContent;
}

// Shared extension list – must match the editor's extensions so the schema is identical.
const previewExtensions = [
  StarterKit,
  Underline,
  Link.configure({ openOnClick: true }),
  Mention.configure({ HTMLAttributes: { class: "mention" } }),
];

export function CommentPreview({ content }: CommentPreviewProps) {
  // If we received JSON, convert it to HTML so we can use a single rendering path.
  const html =
    typeof content === "string"
      ? content
      : generateHTML(content, previewExtensions);

  // A readonly (non-editable) TipTap editor is the safest way to render rich
  // text because it applies the same sanitisation & schema as the editor itself.
  const editor = useEditor({
    extensions: previewExtensions,
    content: html,
    editable: false,
  });

  useEffect(() => {
    if (editor && html !== editor.getHTML()) {
      editor.commands.setContent(html);
    }
  }, [editor, html]);

  return (
    <Box
      sx={{
        "& .tiptap": {
          outline: "none",
          fontSize: "0.875rem",
          lineHeight: 1.65,
          color: "text.primary",

          // Prose rhythm
          "& p": { m: 0, mb: 0.5 },
          "& p:last-child": { mb: 0 },
          "& ul, & ol": { pl: 2.5, my: 0.5 },
          "& li": { mb: 0.25 },
          "& blockquote": {
            borderLeft: "3px solid",
            borderColor: "primary.main",
            pl: 1.5,
            ml: 0,
            color: "text.secondary",
            fontStyle: "italic",
          },
          "& code": {
            fontFamily: "monospace",
            fontSize: "0.8rem",
            bgcolor: "action.hover",
            borderRadius: 0.5,
            px: 0.5,
          },

          // Mention chip – mirrors the editor styling
          "& .mention": {
            bgcolor: "primary.50",
            color: "primary.main",
            borderRadius: 1,
            px: 0.5,
            fontWeight: 600,
          },

          // Links
          "& a": {
            color: "primary.main",
            textDecoration: "underline",
            "&:hover": { color: "primary.dark" },
          },
        },
      }}
    >
      <EditorContent editor={editor} />
    </Box>
  );
}