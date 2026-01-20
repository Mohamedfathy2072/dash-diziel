import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import type { ProfileManagerCardTypes } from "../../types/components";

const ProfileManagerCard = ({
  name,
  title,
  email,
  phone,
}: ProfileManagerCardTypes) => {
  return (
    <Paper className={`paper p-0`}>
      <Box className={`grid justify-start items-center gap-2 pb-2 px-4 md:p-3 xs:p-2 pt-8 md:pt-6 xs:pt-4`}>
        <Typography variant="h6" className={`!font-[700]`}>{name}</Typography>
        <Typography variant="subtitle1" className={`text-Diziel_gray !font-[600]`}>
          {title}
        </Typography>
      </Box>

      <Box className={`grid justify-start items-center text-start gap-3 bg-[#FAFAFA] py-2 px-4 md:p-3 xs:p-2 rounded-md`}>
        <Typography variant="h6">{email}</Typography>
        <Typography variant="h6" className={`ltr w-fit`}>
          {phone}
        </Typography>
      </Box>
    </Paper>
  );
};

export default ProfileManagerCard;
