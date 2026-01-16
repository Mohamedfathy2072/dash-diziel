import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import dashboardCircles from "../../assets/images/dashboard_label_circles.webp";
import ImageBox from "../../components/ImageBox/ImageBox";

const HeroBannerSection = () => {
  return (
    <Box
      className={`relative grid justify-stretch items-center gap-4 bg-gradient_primary rounded-[12px] h-[200px] p-8 overflow-hidden`}
    >
      <Box className={`text-white grid justify-stretch items-center gap-3`}>
        <Typography variant="h4" className={`!font-[700]`}>
          مرحبا بك ,
        </Typography>
        <Typography variant="h4" className={`!font-[700]`}>
          مدير الحساب
        </Typography>
      </Box>
      <Typography variant="h5" className={`text-gray-300`}>
        هنا تلقى كل التفاصيل اللي تهمك
      </Typography>
      <ImageBox
        src={dashboardCircles}
        lazy
        className="!absolute left-0 bottom-0"
      />
    </Box>
  );
};

export default HeroBannerSection;
