import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Mention from "@tiptap/extension-mention";
import { Box, Button, Paper } from "@mui/material";
import { useRef, useEffect } from "react";
import { CommentToolbar } from "./CommentToolbar";
import { MentionList } from "./MentionList";
import type { MentionListRef } from "./MentionList";
import { createRoot } from "react-dom/client";
import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";

interface User {
  id: string;
  name: string;
  avatar?: string;
}

interface CommentEditorProps<T extends FieldValues>  {
  value?: string;
  name: Path<T>;
  control: Control<T>;
  onChange?: (value: string) => void;
  onSubmit: () => void;
  onBlur?: () => void;
  placeholder?: string;
  maxLength?: number;
  users?: User[];
  initialContent?: string;
  onCancel?: () => void;
  autoFocus?: boolean;
}

export const CommentEditor = <T extends FieldValues>({
  name,
  control,
  value,
  onChange,
  onSubmit,
  onBlur,
  placeholder = "Escribe un comentario… usa @ para mencionar a alguien",
  maxLength = 500,
  users = [],
  initialContent = "",
  autoFocus = false,
}: CommentEditorProps<T>) => {
  const mentionListRef = useRef<MentionListRef>(null);
  const fieldOnChangeRef = useRef<((value: string) => void) | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
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
          items: ({ query }) =>
            users
              .filter((u) => u.name.toLowerCase().includes(query.toLowerCase()))
              .slice(0, 8),

          render: () => {
            let root: ReturnType<typeof createRoot> | null = null;
            let container: HTMLDivElement | null = null;

            return {
              onStart(props) {
                container = document.createElement("div");
                document.body.appendChild(container);
                root = createRoot(container);
                root.render(<MentionList ref={mentionListRef} {...props} />);
              },
              onUpdate(props) {
                root?.render(<MentionList ref={mentionListRef} {...props} />);
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
    content: value ?? initialContent,
    autofocus: autoFocus,
    onUpdate: ({ editor: ed }) => {
      const html = ed.getHTML();
      onChange?.(html);
      fieldOnChangeRef.current?.(html);
    },
    onBlur: () => {
      onBlur?.();
    },
  });

  useEffect(() => {
    if (editor && value !== undefined && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  const characterCount = editor?.storage.characterCount.characters() ?? 0;

  return (
    <Box component="form" onSubmit={onSubmit} sx={{ width: "100%" }}>
      <Controller
        name={name}
        control={control}
          render={({ field }) => {
            fieldOnChangeRef.current = field.onChange as (value: string) => void;
            return (
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
                      "& p.is-editor-empty:first-of-type::before": {
                        content: "attr(data-placeholder)",
                        color: "text.disabled",
                        pointerEvents: "none",
                        float: "left",
                        height: 0,
                      },
                    },
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
                  <EditorContent {...field} editor={editor} />
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
                      color:
                        characterCount >= maxLength
                          ? "error.main"
                          : "text.disabled",
                    }}
                  >
                    {characterCount}/{maxLength}
                  </Box>
                </Box>
              </Paper>
            );
          }}
        />
        <Button>Cancelar</Button>
        <Button type="submit">Enviar</Button>
      </Box>
    );
  };

