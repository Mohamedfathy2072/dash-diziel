import type { FormikProps } from "formik";
import { getIn } from "formik";
import { useState, type MouseEvent } from "react";
import type { AllFormsTypes } from "../types/forms";

export const useInput = <T extends AllFormsTypes>(name: string, formik?: FormikProps<T>) => {
    const [showPassword, setShowPassword] = useState(false);

    const error =
        formik && getIn(formik.touched, name) && Boolean(getIn(formik.errors, name));
    const helperText = error
        ? (getIn(formik.errors, name) as string)
        : undefined;

    const togglePassword = () => setShowPassword((s) => !s);

    const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    return { error, helperText, showPassword, togglePassword, handleMouseDownPassword };
};
