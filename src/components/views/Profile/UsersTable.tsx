import { Box } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";

import type { User } from "../../../api/userTypes";
import { useEffect, useState } from "react";
import { CommonButton } from "../../common/CommonButton";
import { CommonText } from "../../common/CommonText";

type UsersTablePayload = {
  allUsers: User[];
  user: (value: User)=>void;
  onEditClick: () => void;
  onDelete: () => void;
};

type UserTableRows = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

export const UsersTable = (props: UsersTablePayload) => {
  const { allUsers, user, onEditClick, onDelete } = props;
  const [rows, setRows] = useState<UserTableRows[]>([]);

  const columns: GridColDef<(typeof rows)[number]>[] = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "firstName",
      headerName: "First name",
      width: 150,
      editable: true,
    },
    {
      field: "lastName",
      headerName: "Last name",
      width: 150,
      editable: true,
    },
    {
      field: "email",
      headerName: "Email",
      type: "number",
      width: 200,
      editable: true,
    },
    {
      field: "edit",
      headerName: "Edit",
      width: 100,
      sortable: false,
      align: "center",
      renderCell: () => (
        <CommonButton
          text={"Edit"}
          style={{ bgcolor: "#87CEEB", color: "white" }}
          size="small"
          onClick={onEditClick}
        />
      ),
    },
    {
      field: "delete",
      headerName: "Delete",
      width: 100,
      sortable: false,
      align: "center",
      renderCell: () => (
        <CommonButton
          text={"Delete"}
          style={{ bgcolor: "red", color: "white" }}
          size="small"
          onClick={onDelete}
        />
      ),
    },
  ];

  useEffect(() => {
    const data = allUsers.map((user) => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    }));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRows(data);
  }, [allUsers]);

  return (
    <>
      <CommonText text={"All users"} value={undefined} style={null} />
      <Box sx={{ height: 400, width: "100%", display: "flex" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 7,
              },
            },
          }}
          onRowClick={(params) => {
            const userId = params.row.id;
            const userById = allUsers?.find((user)=>user.id.includes(userId))
            user(userById!);
          }}
          pageSizeOptions={[7]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </Box>
    </>
  );
};
