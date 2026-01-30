import { Typography, type SxProps, type Theme, type TypographyPropsVariantOverrides, type TypographyVariant} from "@mui/material";
import type { OverridableStringUnion } from "@mui/types";

type CommonTextPayload = {
  text: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
  style: SxProps<Theme>;
  gutterBottom?: boolean;
  variant?: OverridableStringUnion<
    TypographyVariant | "inherit",
    TypographyPropsVariantOverrides
  >;
};

export const CommonText = (props:CommonTextPayload)=>{
    const{text,value, style, variant} = props;
    
    return <Typography variant={variant} sx={style}>{text}{value}</Typography>;
};