import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  type SxProps,
  Typography,
} from "@mui/material";
import type { ReactNode } from "react";

export type Column<T> = {
  key: string;
  label: string;
  columnStyle?: SxProps;
  renderRow?: (value: T, row: T) => ReactNode;
};

export type CommonTableProps<T> = {
  cols: Column<T>[];
  rows: T[];
};

export const CommonTable = <T extends object>(props: CommonTableProps<T>) => {
  const { cols, rows } = props;

  const headerCellStyle = {
    fontWeight: 700,
    color: "white",
    textShadow: "1px 1px 1px gray",
    fontSize: "16px",
  };

  const bodyRowStyle = {
    color: "black",
    fontSize: "15px",
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ width: 1, boxShadow: 3 }} aria-label="simple table">
        <TableHead sx={{ backgroundColor: "#48cae4" }}>
          <TableRow>
            {cols.map((col) => (
              <TableCell
                key={col.key}
                align="center"
                sx={{ ...headerCellStyle, ...col.columnStyle }}
              >
                {col.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, i) => (
            <TableRow
              key={i}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              {cols.map((col) => (
                <TableCell
                  key={col.key}
                  component="th"
                  scope="row"
                  sx={{ ...bodyRowStyle, ...col.columnStyle }}
                >
                  {col.renderRow ? (
                    <Typography>{col.renderRow(row[col.key], row)}</Typography>
                  ) : (
                    row[col.key]
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
