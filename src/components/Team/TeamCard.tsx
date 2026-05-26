import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from "@mui/material";
import GroupIcon from "@mui/icons-material/Groups";
import { useNavigate } from "react-router-dom";
import type { Team } from "../../models/team.model";

export const TeamCard = ({ team }: { team: Team }) => {
  const navigate = useNavigate();

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 2,
        transition: "box-shadow 0.2s, transform 0.2s",
        "&:hover": {
          boxShadow: 4,
          transform: "translateY(-2px)",
        },
      }}
    >
      <CardActionArea onClick={() => navigate(`/teams/${team.id}`)}>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: "12px",
                bgcolor: "primary.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <GroupIcon sx={{ color: "white", fontSize: 24 }} />
            </Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {team.name}
            </Typography>
          </Box>
          {team.description && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {team.description}
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
