import { Card, CardContent, type SxProps } from "@mui/material";
import type { ReactNode } from "react";
import { CommonText } from "./CommonText";

export type Column<T> = {
  key: string;
  label: string;
  renderRow?: (value: T, row: T) => ReactNode;
};

export type CommonCardProps<T> = {
  cols: Column<T>[];
  rows: T;
  sx?: SxProps;
};

export const CommonCard = (props: CommonCardProps<T>) => {
  const { rows, cols, sx } = props;

  return (
    <Card
      sx={
        sx || {
          minWidth: 500,
          minHeight: 200,
          bgcolor: "#e7e9ee",
          width: "round(11px, 1px)",
        }
      }
    >
      <CardContent>
        {cols.map((col) =>
          rows[col.key] ? (
            <CommonText text={col.label} value={rows[col.key]} />
          ) : (
            col?.renderRow(rows, rows)
          ),
        )}
      </CardContent>
    </Card>
  );
};
