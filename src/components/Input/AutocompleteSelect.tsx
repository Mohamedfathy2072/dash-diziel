import { FormControl, FormHelperText, Autocomplete, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import LoadingIcon from "../../icons/LoadingIcon";

interface AutocompleteSelectTypes {
  formik?: any;
  name: string;
  loading?: boolean;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  options: string[];
  values: string[];
  value?: string;
  error?: boolean;
  helperText?: string;
  change?: (value: string) => void;
}

const AutocompleteSelect = ({
  formik,
  name,
  loading,
  label,
  placeholder,
  disabled,
  options,
  values,
  value,
  error,
  helperText,
  change,
}: AutocompleteSelectTypes) => {
  const { t } = useTranslation("components/input");

  // Find the current option based on value
  const currentValue = value || (formik?.values?.[name]?.toString() ?? "");
  const selectedOption = currentValue
    ? options.find((_: string, index: number) => values[index] === currentValue) || null
    : null;

  return (
    <FormControl fullWidth error={error}>
      <Autocomplete
        fullWidth
        options={options}
        value={selectedOption}
        loading={loading}
        disabled={disabled}
        onChange={(_, newValue) => {
          if (newValue) {
            const index = options.indexOf(newValue);
            const selectedValue = values[index];
            if (change) {
              change(selectedValue);
            } else {
              formik?.setFieldValue?.(name, selectedValue);
            }
          } else {
            if (change) {
              change("");
            } else {
              formik?.setFieldValue?.(name, "");
            }
          }
        }}
        onBlur={formik?.handleBlur}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={placeholder ? t(placeholder, { defaultValue: placeholder }) : t("searchPlaceholder", { label: t(label ?? "", { defaultValue: label ?? "" }) })}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? <LoadingIcon className="animate-spin" /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
            error={error}
          />
        )}
        noOptionsText={t("noOptions", { defaultValue: "No options found" })}
        loadingText={t("loading", { defaultValue: "Loading..." })}
      />
      {helperText && (
        <FormHelperText className="!text-red-600">{helperText}</FormHelperText>
      )}
    </FormControl>
  );
};

export default AutocompleteSelect;

