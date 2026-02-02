import { Box, Typography, type SxProps, type Theme, type TypographyPropsVariantOverrides, type TypographyVariant} from "@mui/material";
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
    
    return (
      <Box sx={{ display: "flex", flexDirection: "row" }}>
        <Typography variant={variant} sx={style? style : { fontWeight: "bold"}}>
          {text}
        </Typography>
        <Typography variant={variant} sx={style}>
          {value}
        </Typography>
      </Box>
    );
};