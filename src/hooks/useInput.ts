import type { FormikProps } from "formik";
import { useState, type MouseEvent } from "react";
import type { AllFormsTypes } from "../types/forms";

export const useInput = <T extends AllFormsTypes>(name: string, formik?: FormikProps<T>) => {
    const [showPassword, setShowPassword] = useState(false);

    const error =
        formik?.touched[name as keyof T] && Boolean(formik?.errors[name as keyof T]);
    const helperText = error
        ? (formik?.errors[name as keyof T] as string)
        : undefined;

    const togglePassword = () => setShowPassword((s) => !s);

    const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    return { error, helperText, showPassword, togglePassword, handleMouseDownPassword };
};
