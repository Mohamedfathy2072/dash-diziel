import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { DefaultPackageTypes } from '../../types/components';
import CustomRadio from '../CustomRadio/CustomRadio';

const DefaultPackageCard = ({ value, data, title, handleChange }: DefaultPackageTypes) => {
    // const { t } = useTranslation("components/default_package");

    return (
        <Box
            className={`p-2 my-2 rounded-md flex justify-start items-center gap-4 w-full border-[1px] border-transparent cursor-pointer 
            ${value === data && "!border-primary_600 border-solid !text-primary shadow-md"}`}
            onClick={() => handleChange && handleChange(data)}
        >
            <CustomRadio
                onChange={handleChange}
                value={data}
                label={title}
                radioProps={{
                    checked: value === data,
                }}
            />
            <Box className={`!bg-primary_100 px-3 py-2 rounded-md flex justify-center items-center gap-2 !text-primary border-[1px] border-solid border-primary_500`}>
                <Typography variant='h6'>{title}</Typography>
            </Box>
        </Box>
    );
};

export default DefaultPackageCard;
