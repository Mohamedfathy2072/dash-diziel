import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { TextareaTypes } from "../../types/components";
import type { AllFormsTypes } from "../../types/forms";

const Textarea = <T extends AllFormsTypes>({ formik, disabled, max, label, name, rows, placeholder, value, error, helperText, change }: TextareaTypes<T>) => {
    const { t } = useTranslation("components/input");
    const [remain, setRemain] = useState(max)

    useEffect(() => {
        if (max) {
            if (formik) {
                const len = ((formik.values[name as keyof T] as string)?.length ?? 0)
                if (len <= max) {
                    setRemain(max - len)
                }
            } else if (value || value === "") {
                const len = value.length
                if (len <= max) {
                    setRemain(max - len)
                }
            }
        }
    }, [formik?.values?.[name as keyof T], value])

    return (
        <Box className={`grid justify-stretch items-center gap-1 w-full`}>
            <textarea
                disabled={disabled}
                title={t(label ?? "", { defaultValue: label ?? "" })}
                className={`primary_textarea w-full ${error && "!outline-red-600 focus:!border-red-600 focus:!outline-none"}`}
                id={name}
                name={name}
                rows={rows}
                onBlur={formik?.handleBlur}
                value={((formik?.values[name as keyof T] as string) ?? "") || value}
                onChange={(e) => {
                    const val = (e.target as HTMLTextAreaElement).value;
                    if (change) {
                        change(val);
                    }
                    formik?.handleChange?.(e);
                }}
                placeholder={
                    placeholder ?
                        t(placeholder ?? "", { defaultValue: placeholder ?? "" }) :
                        t(label ?? "", { defaultValue: label ?? "" })
                }
            />
            {(max || error) ?
                <Box className={`flex ${(max && error) ? "justify-between" : "justify-stretch"} items-center gap-2 flex-wrap px-3`}>
                    {max ? <Typography variant="body2" className={`text-start`}>
                        {`${remain} ${t("characters")}`}
                    </Typography> : <></>}
                    {error ? <Typography variant="body2" className={`text-end text-red-600`}>
                        {helperText}
                    </Typography> : <></>}
                </Box> :
                <></>
            }
        </Box>
    )
}

export default Textarea