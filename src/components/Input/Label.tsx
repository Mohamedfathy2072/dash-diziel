import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const Label = ({ label, optional, type, name }: { label?: string; optional?: boolean; type?: string; question?: boolean; name: string }) => {
    const { t } = useTranslation("components/input");

    return label ? (
        <Box component={"label"} htmlFor={name} className={`flex justify-start items-center gap-1`} {...{ [`data-test-${name}`]: true }}>
            <Typography
                id={`label-${name}`}
                variant="subtitle1"
                className="!font-[400]"
            >
                {type === "search"
                    ? t("searchLabel", {
                        label: t(label ?? "", { defaultValue: label ?? "" }),
                    })
                    : t(label ?? "", { defaultValue: label ?? "" })}
            </Typography>
            {!optional && <span className={`text-red-500`}>*</span>}
        </Box>
    ) : (<></>)
}

export default Label
