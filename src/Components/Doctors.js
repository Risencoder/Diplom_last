import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled, ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import MuiDrawer from '@mui/material/Drawer';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import { mainListItems, secondaryListItems } from './listItems';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import { app, storage, database } from '../firebase-config';
import { ref, child, get } from 'firebase/database';
import { getStorage, getDownloadURL, ref as storageRef } from 'firebase/storage';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import PropTypes from 'prop-types';
import Slide from '@mui/material/Slide';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import InfoIcon from '@mui/icons-material/Info';
import Drawer from '@mui/material/Drawer'; // Додано

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function SimpleDialog(props) {
  const { onClose, open, name, description } = props;

  const handleClose = () => {
    onClose('');
  };

  return (
    <Dialog TransitionComponent={Transition} onClose={handleClose} open={open}>
      <DialogTitle>{name}</DialogTitle>
      <DialogContent dividers>
        <Typography gutterBottom>
          {description}
        </Typography>
      </DialogContent>
    </Dialog>
  );
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

const drawerWidth = 240;

const mdTheme = createTheme();

export default function Doctors() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imgsrc, setImgSrc] = useState('https://i.imgur.com/Rbp9NSp.jpg');
  const [popopen, setPopOpen] = useState(false);
  const [doctorarray, setDoctorArray] = useState([]);
  const [open, setOpen] = useState(true);

  const handleClose = (value) => {
    setPopOpen(false);
  };

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const navigate = useNavigate();

  useEffect(() => {
    const uid = sessionStorage.getItem('UID');
    const authToken = sessionStorage.getItem('Auth Token');
    const dbRef = ref(database);

    const loadDoctors = async () => {
      try {
        const snapshot = await get(child(dbRef, `doctors`));
        if (snapshot.exists()) {
          const snapshotVal = snapshot.val();
          const temparray = Object.entries(snapshotVal).map(([key, value]) => ({
            img: value.image,
            title: value.name,
            uid: key,
            hospital: value.hospital,
            detail: value.detail,
          }));

          const storage = getStorage();
          for (const doctor of temparray) {
            const profilePicRef = storageRef(storage, `${doctor.uid}/profile_pic`);
            try {
              const url = await getDownloadURL(profilePicRef);
              doctor.img = url;
            } catch (error) {
              doctor.img = 'https://via.placeholder.com/150'; // URL до зображення за замовчуванням
              console.error('Error fetching profile picture:', error.message);
            }
          }

          setDoctorArray(temparray);
        } else {
          console.log('No doctors found in the database.');
        }
      } catch (error) {
        console.error('Error fetching doctors:', error.message);
      }
    };

    loadDoctors();

    if (authToken) {
      navigate('/doctors');
    } else {
      navigate('/register');
    }
  }, [navigate]);

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar sx={{ pr: '24px' }}>
            <IconButton edge="start" color="inherit" aria-label="open drawer" onClick={toggleDrawer} sx={{ marginRight: '36px', ...(open && { display: 'none' }) }}>
              <MenuIcon />
            </IconButton>
            <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
              Tele-Medicine
            </Typography>
            <RemoveRedEyeIcon sx={{ border: 3, width: 40, height: 30, borderRadius: 2 }} />
            <RemoveRedEyeIcon sx={{ border: 3, width: 40, height: 30, borderRadius: 2 }} />
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', px: [1] }}>
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List>{mainListItems}</List>
          <Divider />
          <List>{secondaryListItems}</List>
        </Drawer>
        <Box component="main" sx={{ backgroundColor: (theme) => theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900], flexGrow: 1, height: '100vh', overflow: 'auto', pt: 8 }}>
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={4}>
              {doctorarray.map((doctor) => (
                <Grid item key={doctor.uid} xs={12} sm={6} md={4}>
                  <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Avatar src={doctor.img} alt={doctor.title} sx={{ width: 180, height: 180 }} />
                    <Typography variant="h6" gutterBottom>
                      {doctor.title}
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                      {doctor.hospital}
                    </Typography>
                    <Button variant="outlined" onClick={() => { setPopOpen(true); setName(doctor.title); setDescription(doctor.detail); }}>
                      <InfoIcon /> Детальніше
                    </Button>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Container>
          <SimpleDialog open={popopen} onClose={handleClose} name={name} description={description} />
        </Box>
      </Box>
    </ThemeProvider>
  );
}
