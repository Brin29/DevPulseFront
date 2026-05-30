import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
  useRef,
} from "react";
import {
  Box,
  Paper,
  List,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Popper,
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

// TipTap passes the SuggestionProps, which include:
//   items      – filtered list from the `items` function
//   command    – call this with the chosen item to insert the mention
//   clientRect – bounding rect of the @ trigger (for positioning)
type MentionListProps = SuggestionProps<User>;

export const MentionList = forwardRef<MentionListRef, MentionListProps>(
  ({ items, command, clientRect }, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const anchorRef = useRef<HTMLDivElement>(null);

    // Reset selection whenever the filtered list changes
    useEffect(() => setSelectedIndex(0), [items]);

    // Keep a virtual anchor element positioned at the @ character
    useEffect(() => {
      if (!anchorRef.current || !clientRect) return;
      const rect = clientRect();
      if (!rect) return;
      // Position the invisible anchor div where the cursor is
      anchorRef.current.style.top = `${rect.top + window.scrollY}px`;
      anchorRef.current.style.left = `${rect.left + window.scrollX}px`;
      anchorRef.current.style.width = `${rect.width}px`;
      anchorRef.current.style.height = `${rect.height}px`;
    }, [clientRect]);

    const selectItem = (index: number) => {
      const item = items[index];
      if (item) command({ id: item.id, label: item.name });
    };

    // Expose keyboard handler so TipTap can delegate arrow / enter keys
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
      <>
        {/* Virtual anchor positioned at the @ cursor */}
        <Box
          ref={anchorRef}
          sx={{ position: "absolute", pointerEvents: "none" }}
        />

        <Popper
          open
          anchorEl={anchorRef.current}
          placement="bottom-start"
          modifiers={[{ name: "offset", options: { offset: [0, 4] } }]}
          sx={{ zIndex: 1400 }}
        >
          <Paper
            elevation={4}
            sx={{
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
                  key={user.id}
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
                  <ListItemText
                    primary={user.name}
                    // primaryTypographyProps={{ fontSize: "0.85rem", fontWeight: 500 }}
                  />
                </ListItemButton>
              ))}
            </List>
          </Paper>
        </Popper>
      </>
    );
  }
);

MentionList.displayName = "MentionList";