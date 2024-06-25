import * as React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@material-ui/icons/Dashboard';
import VideoCallIcon from '@material-ui/icons/VideoCall';
import LocalHospitalIcon from '@material-ui/icons/LocalHospital';
import LogoutIcon from '@mui/icons-material/Logout';
import EditIcon from '@mui/icons-material/Edit';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
export const mainListItems = (
  <div>
    <ListItemButton component="a" href="/homepatient">
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItemButton>
    
    <ListItemButton component="a" href="/doctors">
      <ListItemIcon>
        <LocalHospitalIcon />
      </ListItemIcon>
      <ListItemText primary="Doctors" />
    </ListItemButton>

    <ListItemButton component="a" href="/appointments-patient">
      <ListItemIcon>
        <VideoCallIcon />
      </ListItemIcon>
      <ListItemText primary="Appointments" />
    </ListItemButton>

    <ListItemButton component="a" href="/eye-ml">
      <ListItemIcon>
        <RemoveRedEyeIcon />
      </ListItemIcon>
      <ListItemText primary="Submit Eye Report" />
    </ListItemButton>
  </div>
);

export const secondaryListItems = (
  <div>
      <ListItemButton component="a" href="/edit-patient-profile">
      <ListItemIcon>
        <EditIcon />
      </ListItemIcon>
      <ListItemText primary="Edit Profile" />
    </ListItemButton>
    <ListItemButton component="a" href="/">
      <ListItemIcon>
        <LogoutIcon />
      </ListItemIcon>
      <ListItemText primary="Logout" />
    </ListItemButton>
  </div>
);