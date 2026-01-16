import type { Toast } from "react-hot-toast";
import toast from "react-hot-toast";
import type { AlertFunTypes } from "../types/app";

export const handleToaster = ({
  msg,
  status,
  pos,
  icon,
  dur,
}: AlertFunTypes) => {
  const options: Partial<
    Pick<
      Toast,
      | "icon"
      | "id"
      | "duration"
      | "ariaProps"
      | "className"
      | "style"
      | "position"
      | "iconTheme"
    >
  > = {
    duration: dur,
    position: pos,
  };
  options.style = { fontSize: "16px" };
  if (icon) {
    options.icon = icon;
  }
  if (status === "success") {
    toast.success(msg, options);
  } else if (status === "error") {
    toast.error(msg, options);
  } else {
    toast(msg, options);
  }
};
