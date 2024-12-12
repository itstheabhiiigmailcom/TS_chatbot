import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Logo from "./shared/Logo";
import { useAuth } from "../context/AuthContext";
import NavigationLink from "./shared/NavigationLink";

const Header = () => {
  const auth = useAuth();

  return (
    <AppBar
      sx={{ bgcolor: "transparent", position: "static", boxShadow: "none" }}
    >
      <Toolbar sx={{ display: "flex" }}>
        <Logo />
        <div>
          {auth?.isLoggedIn ? (
            <>
              <NavigationLink
                bg="#00fffc"
                to="/chat"
                text="Go To Chat"
                textColor="black"
              />
              <NavigationLink
                bg="#51538f"
                textColor="white"
                to="/"
                text="LogOut"
                onClick={auth.logout}
              />
            </>
          ) : (
            <>
            <NavigationLink
                bg="#00fffc"
                to="/login"
                text="LogIn"
                textColor="black"
              />
              <NavigationLink
                bg="#51538f"
                textColor="white"
                to="/signup"
                text="SignUp"
              />
            </>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
