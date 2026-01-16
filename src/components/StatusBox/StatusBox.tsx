import { Box, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import CheckIcon from "../../icons/CheckIcon";
import ChevronDownIcon from "../../icons/ChevronDownIcon";
import LoadingIcon from '../../icons/LoadingIcon';
import type { StatusBoxTypes } from "../../types/components";

const StatusBox = ({
  status,
  variant,
  list,
  handleSelect,
  loading,
  valueList,
  selectedValue,
  onValueSelect,
}: StatusBoxTypes) => {
  const { t } = useTranslation("components/status_box");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(
    list ? list.indexOf(status) : 0
  );
  const [selectedValueIndex, setSelectedValueIndex] = useState(
    valueList && selectedValue
      ? valueList.findIndex((item: { value: string }) => item.value === selectedValue)
      : 0
  );
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLLIElement>,
    index: number
  ) => {
    setAnchorEl(event.currentTarget);

    if (valueList) {
      setSelectedValueIndex(index);
      if (onValueSelect) {
        onValueSelect(valueList[index].value);
      }
    } else {
      setSelectedIndex(index);
      if (handleSelect && list) {
        handleSelect(list[index]);
      }
    }

    handleClose();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const classes = (() => {
    switch (status.toLowerCase()) {
      case "main":
      case "active":
      case "paid":
      case "completed":
      case "qualified":
      case "approved":
      case "updated":
      case "priced":
      case "done":
        return "bg-green-100 text-green-600";
      case "discharged":
      case "ready for payment":
        return "bg-purple-100 text-purple-600";
      case "not paid":
      case "awaiting manager decision":
      case "awaiting payment":
      case "pending":
      case "in progress":
      case "in review":
      case "inreview":
        return "bg-yellow-100 text-yellow-600";
      case "following up":
      case "ready for review":
      case "todo":
      case "interested":
      case "partially approved":
        return "bg-blue-100 text-blue-600";
      case "draft":
      case "backlog":
        return "bg-slate-300 text-slate-900";
      default:
        return "bg-red-100 text-red-600";
    }
  })();

  const localizedStatus = t(status.toLowerCase().replace(/\s+/g, "_"), {
    defaultValue: status,
  });

  return (
    <Box
      className={`px-4 ${variant === "superAdmin_status" ? "rounded-full py-1" : "rounded-md py-2 m-auto"} text-center ${classes} w-fit flex justify-center items-center gap-2 md:rounded-sm lg:px-3 md:px-2 xs:px-2 md:py-1`}
    >
      {list || valueList ? (
        <>
          <IconButton
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
            className="!p-0 !text-inherit !flex justify-center items-center gap-2 !rounded-md"
            disabled={loading}
          >
            <Typography variant="subtitle2" className={`!text-inherit`}>
              {valueList
                ? valueList[selectedValueIndex]?.label
                : list?.[selectedIndex]}
            </Typography>
            {loading ? (
              <LoadingIcon
                className={"text-inherit animate-spin"}
              />
            ) : (
              <ChevronDownIcon className={"text-inherit"} />
            )}
          </IconButton>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            slotProps={{
              list: {
                "aria-labelledby": "basic-button",
              },
            }}
          >
            {valueList
              ? valueList.map((item: { value: string; label: string }, i: number) => (
                <MenuItem
                  selected={i === selectedValueIndex}
                  onClick={(event) => handleMenuItemClick(event, i)}
                  key={item.value}
                >
                  {item.label}
                </MenuItem>
              ))
              : list?.map((l: string, i: number) => (
                <MenuItem
                  selected={i === selectedIndex}
                  onClick={(event) => handleMenuItemClick(event, i)}
                  key={`${l}-${i}`}
                >
                  {l}
                </MenuItem>
              ))}
          </Menu>
        </>
      ) : (
        <>
          <Typography variant={variant === "superAdmin_status" ? "body2" : "subtitle1"} className={`${variant === "superAdmin_status" ? "!font-[700]" : "!font-[600]"} capitalize`}>
            {localizedStatus}
          </Typography>
          {status.toLowerCase() === "main" && (
            <CheckIcon className={"text-inherit"} />
          )}
        </>
      )}
    </Box>
  );
};

export default StatusBox;
