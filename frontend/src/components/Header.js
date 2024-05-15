import { AppBar, Toolbar, IconButton, Typography} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const Header = ({toggleDrawer}) => {
  return (
      <AppBar position="fixed" style={{ backgroundColor: '#779ECB' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Keating AI
          </Typography>
        </Toolbar>
    </AppBar>
  );
}

export default Header;