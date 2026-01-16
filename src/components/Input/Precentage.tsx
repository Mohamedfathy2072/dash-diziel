import { Box, IconButton, InputAdornment, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import EyeIcon from '../../icons/EyeIcon';
import EyeOffIcon from '../../icons/EyeOffIcon';
import { LightTextField } from '../../mui/fields/LightTextField';
import type { PrecentageTypes } from '../../types/components';
import type { AllFormsTypes } from '../../types/forms';

const Precentage = <T extends AllFormsTypes>({ formik, name, disabled, label, change, type, value, showPassword, icon, togglePassword, handleMouseDownPassword, placeholder, ac, note, helperText, error, amount }: PrecentageTypes<T>) => {
    const { t } = useTranslation("components/input");

    return (
        <Box className={`grid justify-stretch items-center gap-1`}>
            <Box
                className={`grid grid-cols-[1fr,auto] justify-center items-center rounded-xl border-[1px] border-neutral-200 border-solid overflow-hidden ${error && "!border-red-600"}`}
            >
                <LightTextField
                    fullWidth
                    id={name}
                    disabled={disabled}
                    title={t(label ?? "", { defaultValue: label ?? "" })}
                    type={
                        type === "password"
                            ? showPassword
                                ? "text"
                                : "password"
                            : type
                    }
                    name={name}
                    slotProps={{
                        input: {
                            startAdornment: icon ? (
                                <InputAdornment position="start">{icon}</InputAdornment>
                            ) : (
                                <></>
                            ),
                            endAdornment:
                                type === "password" ? (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={togglePassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                            className={`!m-0`}
                                        >
                                            {showPassword ? (
                                                <EyeOffIcon />
                                            ) : (
                                                <EyeIcon />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                ) : (
                                    <></>
                                ),
                        },
                    }}
                    placeholder={
                        placeholder
                            ? t(placeholder ?? "", { defaultValue: placeholder ?? "" })
                            : type !== "date"
                                ? type === "search"
                                    ? t(label ?? "", { defaultValue: label ?? "" })
                                    : t(label ?? "", { defaultValue: label ?? "" })
                                : ""
                    }
                    value={(formik?.values?.[name as keyof T] ?? "") || value}
                    onChange={(e) => {
                        const val = e.target.value;
                        if (change) {
                            change(val);
                        }
                        if (type === "email") {
                            e.target.value = val.toLowerCase();
                        }
                        if (amount) {
                            const numericOnly = val.replace(/,/g, "");
                            const isNumeric = /^\d+$/.test(numericOnly);
                            if (isNumeric) {
                                const formatted = Number(numericOnly).toLocaleString();
                                e.target.value = formatted;
                            }
                        }
                        formik?.handleChange?.(e);
                    }}
                    onBlur={formik?.handleBlur}
                    error={error}
                    helperText={helperText}
                    autoComplete={ac}
                />
                <Box
                    className={`bg-transparent py-1 px-4 flex justify-center items-center h-full border-r-[1px] border-neutral-200 border-solid`}
                >
                    <Typography variant="h6">%</Typography>
                </Box>
            </Box>
            {note && (
                <Typography variant="body2" className={`text-neutral-400`}>
                    {note}
                </Typography>
            )}
        </Box>
    )
}

export default Precentage
