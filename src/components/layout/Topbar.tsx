import {
  AppBar,
  Box,
  Button,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";
import { userAuthContext } from "../../utils/context/UserContext";

type TopbarProps = {
  title?: string;
};

export const Topbar = ({ title = "Team Management" }: TopbarProps) => {
  const navigation = useNavigate();
  const { currentUser, handleLogout } = userAuthContext();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const teamManagementClick = () => {
    navigation("/");
  };

  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar>
        <Typography
          onClick={teamManagementClick}
          variant="h6"
          noWrap
          component="div"
          sx={{ flexGrow: 1 }}
        >
          {title}
        </Typography>

        {currentUser ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography>{currentUser.first_name}</Typography>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </Box>
        ) : (
          <Button
            color="inherit"
            variant="outlined"
            sx={{ borderColor: "#fff", color: "#ffff" }}
            onClick={() => navigation("/login")}
          >
            Login
          </Button>
        )}
      </Toolbar>

      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => navigation("/profile")}>Profile</MenuItem>
        <MenuItem onClick={handleLogout}>Log out</MenuItem>
      </Menu>
    </AppBar>
  );
};

export default Topbar;
