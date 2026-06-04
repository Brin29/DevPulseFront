import {
  forwardRef,
  useEffect,
  useLayoutEffect,
  useImperativeHandle,
  useState,
} from "react";
import {
  Paper,
  List,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Avatar,
} from "@mui/material";
import type { SuggestionProps, SuggestionKeyDownProps } from "@tiptap/suggestion";

interface User {
  id: string;
  name: string;
  avatar?: string;
}

export interface MentionListRef {
  onKeyDown: (props: SuggestionKeyDownProps) => boolean;
}

type MentionListProps = SuggestionProps<User>;

export const MentionList = forwardRef<MentionListRef, MentionListProps>(
  ({ items, command, clientRect }, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [position, setPosition] = useState({ top: 0, left: 0 });

    useEffect(() => setSelectedIndex(0), [items]);

    useLayoutEffect(() => {
      if (!clientRect) return;
      const rect = clientRect();
      if (!rect) return;
      setPosition({ top: rect.top + rect.height + 4, left: rect.left });
    }, [clientRect, items]);

    const selectItem = (index: number) => {
      const item = items[index];
      if (item) command({ id: item.id, label: item.name });
    };

    useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }: SuggestionKeyDownProps) => {
        if (event.key === "ArrowUp") {
          setSelectedIndex((i) => (i + items.length - 1) % items.length);
          return true;
        }
        if (event.key === "ArrowDown") {
          setSelectedIndex((i) => (i + 1) % items.length);
          return true;
        }
        if (event.key === "Enter") {
          selectItem(selectedIndex);
          return true;
        }
        return false;
      },
    }));

    if (!items.length) return null;

    return (
      <Paper
        elevation={4}
        sx={{
          position: "fixed",
          top: position.top,
          left: position.left,
          zIndex: 1400,
          borderRadius: 2,
          overflow: "hidden",
          minWidth: 220,
          maxWidth: 320,
          maxHeight: 280,
          overflowY: "auto",
        }}
      >
        <List dense disablePadding>
          {items.map((user: any, index: any) => (
            <ListItemButton
              key={user._id}
              selected={index === selectedIndex}
              onMouseEnter={() => setSelectedIndex(index)}
              onClick={() => selectItem(index)}
              sx={{
                py: 0.75,
                px: 1.5,
                "&.Mui-selected": {
                  bgcolor: "primary.50",
                  "&:hover": { bgcolor: "primary.100" },
                },
              }}
            >
              <ListItemAvatar sx={{ minWidth: 36 }}>
                <Avatar
                  src={user.avatar}
                  alt={user.name}
                  sx={{ width: 26, height: 26, fontSize: "0.7rem" }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={user.name} />
            </ListItemButton>
          ))}
        </List>
      </Paper>
    );
  }
);

MentionList.displayName = "MentionList";