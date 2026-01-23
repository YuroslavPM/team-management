import { AppBar, Box, Button,IconButton, Toolbar, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useContext, useState } from "react";
import { UserContext } from "../../utils/context/UserContext";

type TopbarProps = {
  title?: string;
};

export const Topbar = ({ title = "Team Management" }: TopbarProps) => {
  
    const user = useContext(UserContext);
    const navigation = useNavigate();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);

    };
    
    const handleLogout = () => {
      user.setCurrentUser(undefined);
      navigation("/");
    };

    const teamManagmentClick = () =>{
      navigation("/")
    }

  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar>
        <Typography onClick={teamManagmentClick} variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          {title}
        </Typography>

        {user.currentUser ? (
          <Box>
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
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={() => navigation("/profile")}>
                Profile
              </MenuItem>
              <MenuItem onClick={handleLogout}>Log out</MenuItem>
            </Menu>
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
    </AppBar>
  );
};

export default Topbar;
