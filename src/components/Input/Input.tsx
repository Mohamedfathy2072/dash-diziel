import { Box, IconButton, InputAdornment } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useInput } from "../../hooks/useInput";
import EyeIcon from "../../icons/EyeIcon";
import EyeOffIcon from "../../icons/EyeOffIcon";
import { PrimaryTextField } from "../../mui/fields/PrimaryTextField";
import type { InputTypes } from "../../types/components";
import type { AllFormsTypes } from "../../types/forms";
import Currency from "./Currency";
import Label from "./Label";
import Precentage from "./Precentage";
import Select from "./Select";
import AutocompleteSelect from "./AutocompleteSelect";
import Textarea from "./Textarea";

const Input = <T extends AllFormsTypes>({
  formik,
  name,
  label,
  placeholder,
  type,
  select,
  options,
  values,
  change,
  ac,
  textarea,
  disabled,
  icon,
  optional,
  question,
  amount,
  currency,
  loading,
  filter,
  precentage,
  note,
  rows,
  choose,
  autoFocus,
  value,
  max,
  maxLength,
  autocomplete
}: InputTypes<T>) => {
  const {
    handleMouseDownPassword,
    showPassword,
    togglePassword,
    error,
    helperText
  } = useInput(name, formik);
  const { t } = useTranslation("components/input");

  return (
    <Box className="grid justify-stretch w-full items-center gap-1" id={name}>
      <Label label={label} type={type} optional={optional} question={question} name={name} />
      {select ? (
        autocomplete ? (
          <AutocompleteSelect formik={formik} error={error} helperText={helperText} loading={loading} name={name} options={options || []} values={values || []} value={value} change={change} label={label} placeholder={placeholder} disabled={disabled} />
        ) : (
          <Select formik={formik} error={error} helperText={helperText} loading={loading} filter={filter} choose={choose} name={name} options={options} values={values} value={value} change={change} label={label} placeholder={placeholder} />
        )
      ) : textarea ? (
        <Textarea formik={formik} label={label} name={name} placeholder={placeholder} value={value} rows={rows} max={max} error={error} helperText={helperText} change={change} />
      ) : currency ? (
        <Currency formik={formik} error={error} helperText={helperText} amount={amount} ac={ac} icon={icon} name={name} change={change} placeholder={placeholder} value={value} showPassword={showPassword} togglePassword={togglePassword} handleMouseDownPassword={handleMouseDownPassword} note={note} disabled={disabled} />
      ) : precentage ? (
        <Precentage formik={formik} label={label} error={error} helperText={helperText} icon={icon} amount={amount} ac={ac} name={name} change={change} placeholder={placeholder} value={value} showPassword={showPassword} togglePassword={togglePassword} handleMouseDownPassword={handleMouseDownPassword} note={note} disabled={disabled} />
      ) : (
        <PrimaryTextField
          fullWidth
          id={name}
          disabled={disabled}
          autoComplete={ac}
          title={t(label ?? "", { defaultValue: label ?? "" })}
          type={
            type === "password" ? (showPassword ? "text" : "password") : type
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
                        <EyeOffIcon className={`w-[30px] h-auto`} />
                      ) : (
                        <EyeIcon className={`w-[30px] h-auto`} />
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
            let val = e.target.value;
            
            // Limit maxLength if specified
            if (maxLength && val.length > maxLength) {
              val = val.slice(0, maxLength);
              e.target.value = val;
            }
            
            if (change) {
              change(val);
            }
            if (type === "email") {
              e.target.value = val.toLowerCase();
            }
            if (amount) {
              e.target.value = val.toLocaleString();
            }
            formik?.handleChange?.(e);
          }}
          inputProps={{
            maxLength: maxLength,
          }}
          onBlur={formik?.handleBlur}
          error={error}
          helperText={helperText}
          autoFocus={autoFocus}
          {...{ [`data-test-${name}-error-message`]: helperText }}
        />
      )}
    </Box>
  );
};

export default Input;
