import { Box, Typography } from "@mui/material";

export const DetectedAccount = () => {
  return (
    <Box>
      <Typography>
        We've detected you already have an account registered with a service
        different from LinkedIn.
      </Typography>
      <Typography>
        For security reasons, we've sent a magic link to your email
        breinerstivenparracortes50@gmail.com to sign you in.
      </Typography>
    </Box>
  );
};
