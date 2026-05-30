import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Mention from "@tiptap/extension-mention";
import { Box, Paper } from "@mui/material";
import { useRef } from "react";
import { CommentToolbar } from "./CommentToolbar";
import { MentionList } from "./MentionList";
import type { MentionListRef } from "./MentionList";
import { createRoot } from "react-dom/client";
 
interface User {
  id: string;
  name: string;
  avatar?: string;
}
 
interface CommentEditorProps {
  placeholder?: string;
  maxLength?: number;
  users?: User[];
  initialContent?: string;
  onSubmit?: (html: string, json: object) => void;
  onCancel?: () => void;
  autoFocus?: boolean;
}
 
export function CommentEditor({
  placeholder = "Escribe un comentario… usa @ para mencionar a alguien",
  maxLength = 500,
  users = [],
  initialContent = "",
  onSubmit,
  onCancel,
  autoFocus = false,
}: CommentEditorProps) {
  const mentionListRef = useRef<MentionListRef>(null);
 
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Disable heading – comments don't need h1/h2/h3
        heading: false,
        codeBlock: false,
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
      Placeholder.configure({ placeholder }),
      CharacterCount.configure({ limit: maxLength }),
      Mention.configure({
        HTMLAttributes: { class: "mention" },
        suggestion: {
          // Filter users as the user types after @
          items: ({ query }) =>
            users
              .filter((u) =>
                u.name.toLowerCase().includes(query.toLowerCase())
              )
              .slice(0, 8),
 
          // Render the floating MentionList popup
          render: () => {
            let root: ReturnType<typeof createRoot> | null = null;
            let container: HTMLDivElement | null = null;
 
            return {
              onStart(props) {
                container = document.createElement("div");
                document.body.appendChild(container);
                root = createRoot(container);
                root.render(
                  <MentionList ref={mentionListRef} {...props} />
                );
              },
              onUpdate(props) {
                root?.render(
                  <MentionList ref={mentionListRef} {...props} />
                );
              },
              onKeyDown(props) {
                if (props.event.key === "Escape") {
                  root?.unmount();
                  container?.remove();
                  return true;
                }
                return mentionListRef.current?.onKeyDown(props) ?? false;
              },
              onExit() {
                root?.unmount();
                container?.remove();
              },
            };
          },
        },
      }),
    ],
    content: initialContent,
    autofocus: autoFocus,
  });
 
  // Expose submit handler – parent can also call this via a ref
  const handleSubmit = () => {
    if (!editor || editor.isEmpty) return;
    onSubmit?.(editor.getHTML(), editor.getJSON());
    editor.commands.clearContent();
  };
 
  const characterCount = editor?.storage.characterCount.characters() ?? 0;
  const isEmpty = editor?.isEmpty ?? true;
 
  return (
    <Box sx={{ width: "100%" }}>
      <Paper
        variant="outlined"
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          "&:focus-within": {
            borderColor: "primary.main",
            boxShadow: (t) => `0 0 0 2px ${t.palette.primary.main}22`,
          },
          transition: "border-color 0.2s, box-shadow 0.2s",
        }}
      >
        {/* Formatting toolbar */}
        <CommentToolbar editor={editor} />
 
        {/* The actual editable area */}
        <Box
          sx={{
            px: 1.5,
            py: 1,
            minHeight: 80,
            "& .tiptap": {
              outline: "none",
              fontSize: "0.9rem",
              lineHeight: 1.6,
              // Placeholder styling (injected by Tiptap Placeholder extension)
              "& p.is-editor-empty:first-of-type::before": {
                content: "attr(data-placeholder)",
                color: "text.disabled",
                pointerEvents: "none",
                float: "left",
                height: 0,
              },
            },
            // Mention chip styling
            "& .mention": {
              bgcolor: "primary.50",
              color: "primary.main",
              borderRadius: 1,
              px: 0.5,
              fontWeight: 600,
              fontSize: "inherit",
            },
          }}
        >
          <EditorContent editor={editor} />
        </Box>
 
        {/* Footer: character count + actions */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 1.5,
            py: 0.75,
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box
            sx={{
              fontSize: "0.75rem",
              color: characterCount >= maxLength ? "error.main" : "text.disabled",
            }}
          >
            {characterCount}/{maxLength}
          </Box>
 
          <Box sx={{ display: "flex", gap: 1 }}>
            {onCancel && (
              <Box
                component="button"
                onClick={onCancel}
                sx={{
                  px: 2,
                  py: 0.5,
                  borderRadius: 1,
                  border: "1px solid",
                  borderColor: "divider",
                  bgcolor: "transparent",
                  color: "text.secondary",
                  fontSize: "0.8rem",
                  cursor: "pointer",
                  "&:hover": { bgcolor: "action.hover" },
                }}
              >
                Cancelar
              </Box>
            )}
            <Box
              component="button"
              onClick={handleSubmit}
              disabled={isEmpty || characterCount > maxLength}
              sx={{
                px: 2,
                py: 0.5,
                borderRadius: 1,
                border: "none",
                bgcolor: isEmpty ? "action.disabledBackground" : "primary.main",
                color: isEmpty ? "text.disabled" : "primary.contrastText",
                fontSize: "0.8rem",
                cursor: isEmpty ? "not-allowed" : "pointer",
                fontWeight: 600,
                transition: "background-color 0.2s",
                "&:hover:not(:disabled)": { bgcolor: "primary.dark" },
              }}
            >
                Publicar
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
 
