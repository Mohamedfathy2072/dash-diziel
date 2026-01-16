import { useParams } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const Permission = () => {
  const { id } = useParams();
  
  return (
    <Box className="grid justify-stretch items-start gap-6">
      <Typography variant="h4" className="!font-[700]">
        Permission Details - {id}
      </Typography>
      <Typography variant="body1" className="!text-gray-600">
        Permission detail page will be implemented here.
      </Typography>
    </Box>
  );
};

export default Permission;

