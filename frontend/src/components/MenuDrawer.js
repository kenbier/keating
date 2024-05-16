import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import {Drawer, List, ListItem, ListItemIcon, ListItemText, CssBaseline } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import InfoIcon from '@mui/icons-material/Info';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Header from './Header'
import styled from 'styled-components'
import { Link } from 'react-router-dom';

const LoginPage = () => {
  const { loginWithRedirect } = useAuth0();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const drawerItems = [
    { text: 'Grade Essay', icon: <DescriptionIcon/>, path: '/' },
    { text: 'About', icon: <InfoIcon /> , path: "/about" },
    { text: 'Logout', icon: <ExitToAppIcon />, action: loginWithRedirect }
  ];

  const StyledListItemText = styled(ListItemText)(({ theme }) => ({
    fontSize: '18px',
    fontWeight: 'bold',
  }));
  return (
    <div style={{
      textAlign: 'center',
      // marginTop: '20px',
      // minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      // padding: '20px'
    }}>
      <CssBaseline />
      <Header toggleDrawer={toggleDrawer}></Header>
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        PaperProps={{
          style: {
            width: '240px',
            background: 'linear-gradient(to right, #f2e8df, #f9f4e8)',
          }
        }}
      >
        <List>
          {drawerItems.map((item, index) => (
            <ListItem button key={index} component={item.path ? Link : 'button'} to={item.path} onClick={item.action || toggleDrawer(false)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <StyledListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </div>
  );
};

export default LoginPage;
