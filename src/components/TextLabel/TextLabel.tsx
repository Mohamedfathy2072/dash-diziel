import { Box, IconButton, Typography } from "@mui/material";
import { useState } from "react";
import { handleCopyText } from "../../functions/handleCopyText";
import ChevronRightIcon from "../../icons/ChevronRightIcon";
import CopyIcon from '../../icons/CopyIcon';
import EyeIcon from "../../icons/EyeIcon";
import EyeOffIcon from "../../icons/EyeOffIcon";
import type { TextLabelTypes } from "../../types/components";

const TextLabel = ({
  title,
  subTitle,
  value,
  variant,
  tel,
  password,
  className,
  rows,
  onClick
}: TextLabelTypes) => {
  const [showPassword, setShowPassword] = useState(false);

  const baseVariantClass = (() => {
    switch (variant) {
      case "employee":
      case "package":
      case "network":
      case "reject_reason":
        return "border-[1px] border-solid border-text_label_border";
      case "member":
      case "user":
      case "admin":
      case "complaint":
        return "!bg-[#F4F4F4] border-[1px] border-solid border-[#EEEEEE]";
      case "highlight":
        return "!bg-[#EFEDFD] border-[1px] border-solid border-[#D9D6F3]";
      default:
        return "";
    }
  })();

  return (
    <Box className={`grid justify-stretch items-center gap-1 ${className}`}>
      {title && (
        <Typography variant="subtitle1" className="!font-[600]">
          {title}
        </Typography>
      )}

      <Box
        className={`
          bg-white rounded-md px-4 py-[10px] flex justify-between items-center transition-all
          ${baseVariantClass}
          group
          ${onClick ? "cursor-pointer" : ""}
        `}
        onClick={() => {
          if (onClick) onClick();
        }}
      >
        <Typography
          variant="subtitle2"
          className={`
            ${tel ? "ltr" : ""}
            ${rows ? `h-[${rows * 50}px]` : ""}
            ${["employee", "package", "network", "member", "reject_reason", "user", "highlight", "admin", "complaint"].includes(variant || "")
              ? "!text-Jeeteak_gray !font-[600]"
              : "!text-neutral_700"}
            ${onClick ? "group-hover:!text-black" : ""}
          `}
        >
          {password ? (showPassword ? value || "." : "********") : value || "."}
        </Typography>

        {password ? (
          <Box className="flex justify-center items-center gap-2">
            <IconButton className="!p-0 !h-full !w-auto !text-primary" onClick={() => handleCopyText(`${value}`)}>
              <CopyIcon className={`w-[20px] h-auto`} />
            </IconButton>
            <IconButton className="!p-0 !h-full !w-auto !text-primary" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOffIcon className={`w-[20px] h-auto`} /> : <EyeIcon className={`w-[20px] h-auto`} />}
            </IconButton>
          </Box>
        ) : (
          onClick &&
          <ChevronRightIcon className="text-primary" />
        )}
      </Box>

      {subTitle && (
        <Typography variant="body1" className="text-gray-400">
          {subTitle}
        </Typography>
      )}
    </Box>
  );
};

export default TextLabel;
