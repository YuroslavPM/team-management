import { Button, type ButtonPropsSizeOverrides, type ButtonPropsVariantOverrides, type SxProps, type Theme } from "@mui/material";
import type { OverridableStringUnion } from "@mui/types";

type CommonButtonPayload = {
  text: string;
  style: SxProps<Theme>;
  size?: OverridableStringUnion<
    "small" | "medium" | "large",
    ButtonPropsSizeOverrides
  >;
  variant?: OverridableStringUnion<
    "text" | "outlined" | "contained",
    ButtonPropsVariantOverrides
  >;
  type?: "submit" | "reset" | "button" | undefined;
  icon?: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
};

export const CommonButton = (props: CommonButtonPayload) => {
  const { text, style, size, icon,disabled, onClick } = props;

  return (
    <Button sx={style} size={size} startIcon={icon} onClick={onClick} disabled={disabled}>
      {text}
    </Button>
  );
};
