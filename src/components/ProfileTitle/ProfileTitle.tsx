import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { ProfileTitleTypes } from "../../types/components";

const ProfileTitle = ({ title }: ProfileTitleTypes) => {
  return (
    <Box className={`text-primary bg-primary_100 rounded-md py-4 px-2 lg:py-3 sm:!py-2`}>
      <Typography variant="subtitle1" className={`!font-[700]`}>
        {title}
      </Typography>
    </Box>
  );
};

export default ProfileTitle;
