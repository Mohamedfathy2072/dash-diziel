import { FormControl, FormHelperText, MenuItem } from "@mui/material";
import { useTranslation } from "react-i18next";
import LoadingIcon from "../../icons/LoadingIcon";
import { PrimarySelect } from "../../mui/selects/PrimarySelect";
import type { SelectTypes } from "../../types/components";
import type { AllFormsTypes } from "../../types/forms";

const Select = <T extends AllFormsTypes>({ formik, name, loading, label, placeholder, disabled, filter, options, values, value, error, helperText, choose, change }: SelectTypes<T>) => {
    const { t } = useTranslation("components/input");

    return (
        <FormControl>
            <PrimarySelect
                fullWidth
                id={name}
                name={name}
                displayEmpty
                IconComponent={
                    () => loading ?
                        <LoadingIcon className={`animate-spin`} />
                        : <></>
                }
                inputProps={{
                    "aria-label": t(label ?? "", { defaultValue: label ?? "" }),
                    title: t(label ?? "", { defaultValue: label ?? "" })
                }}
                value={(formik?.values[name as keyof T]?.toString() ?? "") || value || ""}
                onChange={(e) => {
                    if (change) {
                        change(e.target.value as string);
                        // Don't set field value if change handler is provided - let it handle the conversion
                    } else {
                        formik?.setFieldValue?.(name, e.target.value);
                    }
                }}
                onBlur={formik?.handleBlur}
                error={error}
                disabled={disabled}
            >
                <MenuItem
                    value={""}
                    disabled={!filter}
                    hidden={!filter}
                >
                    <span className={`text-[#999]`}> {placeholder
                        ? t(placeholder ?? "", { defaultValue: placeholder ?? "" })
                        : t(choose ? "choosePlaceholder" : "searchPlaceholder", {
                            label: t(label ?? "", { defaultValue: label ?? "" }),
                        })}</span>
                </MenuItem>
                {options ?
                    options.map((option: string, i: number) => (
                        <MenuItem value={values ? values[i] : option} key={i}>
                            {option}
                        </MenuItem>
                    )) : <></>}
            </PrimarySelect>
            <FormHelperText className="!text-red-600">{helperText}</FormHelperText>
        </FormControl>
    )
}

export default Select
