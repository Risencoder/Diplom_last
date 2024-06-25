import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import MenuIcon from '@material-ui/icons/Menu';
import { useTheme } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import { mainListItems, SecondaryListItems } from './adminListItems';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import blood_test from '../images/blood-test.png'
import eye from '../images/left_eye.png'
import health_report from '../images/health-report.png';
import { keyframes } from '@mui/system';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import theme from './theme';
import { app, storage, database } from '../firebase-config';
import { ref, child, get, push, update } from "firebase/database";
import { getStorage, uploadBytes, ref as sref, getDownloadURL } from "firebase/storage";
import { SettingsApplicationsTwoTone } from '@material-ui/icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const drawerWidth = 240;

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));
const spin = keyframes`
from {
  transform: rotate(0deg);
}
to {
  transform: rotate(360deg);
}
`;

const Input = styled('input')({
  display: 'none',
});
const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);
const mdTheme = createTheme();

export default function EditAdminProfile() {
  const [date, setDate] = React.useState(new Date());
  const [bloodGroup, setBloodGroup] = React.useState('');
  const [gender, setGender] = React.useState('');
  const [open, setOpen] = React.useState(true);
  const [firstname, setFirstName] = React.useState('');
  const [lastname, setLastName] = React.useState('');
  const [mob, setMob] = React.useState('');
  const [address1, setAddress1] = React.useState('');
  const [address2, setAddress2] = React.useState('');
  const [city, setCity] = React.useState('');
  const [state, setState] = React.useState('');
  const [country, setCountry] = React.useState('');
  const [imgsrc, setImgSrc] = React.useState('https://i.imgur.com/Rbp9NSp.jpg');
  const [selectedProfilePic, setSelectedProfilePic] = useState();
  const [isProfilePicPicked, setIsProfilePicPicked] = useState('Finish');
  const changeProfilePic = (event) => {
    console.log("Entered profilepic")
    setSelectedProfilePic(event.target.files[0]);
    setIsProfilePicPicked('Ready');
  };
  const handleChangeFirstName = (event) => {
    setFirstName(event.target.value);
  };
  const handleChangeLastName = (event) => {
    setLastName(event.target.value);
  };
  const handleChangeMob = (event) => {
    setMob(event.target.value);
  };

  const handleChangeAddress1 = (event) => {
    setAddress1(event.target.value);
  };
  const handleChangeAddress2 = (event) => {
    setAddress2(event.target.value);
  };
  const handleChangeCity = (event) => {
    setCity(event.target.value);
  };
  const handleChangeState = (event) => {
    setState(event.target.value);
  };
  const handleChangeCountry = (event) => {
    setCountry(event.target.value);
  };

  const handleSubmitData = (event) => {
    let dbRef = ref(database);
    get(child(dbRef, `users`)).then((snapshot) => {
        let snapshot_val = snapshot.val();
        let uid = sessionStorage.getItem('UID')
        const email = snapshot_val[uid]['email'];
        const role = snapshot_val[uid]['role'];
        const postData = {
          name: firstname + ' ' + lastname,
          role: role,
          email: email,
          gender: gender,
          mob: mob,
          bloodgroup: bloodGroup,
          dob: date,
          address1: address1,
          address2: address2,
          city: city,
          state: state,
          country: country
        };
        console.log(postData)
        const updates = {};
        updates['/users/' + uid] = postData;
        update(dbRef, updates);
      });
      toast.success('Your profile data is updated.', { autoClose: 2000 });
  }

  const handleProfilePic = (e) => {
    if (isProfilePicPicked) {
      console.log(selectedProfilePic)
      let uid = sessionStorage.getItem('UID');
      const storageRef = sref(storage, uid + '/profile_pic');
      uploadBytes(storageRef, selectedProfilePic).then((snapshot) => {
        console.log(snapshot)
        console.log('Uploaded profile pic!');
      });
    }
  };

  const toggleDrawer = () => {
    setOpen(!open);
  };
  const handleChangeBloodGroup = (event) => {
    setBloodGroup(event.target.value);
  };

  const handleChangegender = (event) => {
    setGender(event.target.value);
  };

  let navigate = useNavigate();

  useEffect(() => {
    let authToken = sessionStorage.getItem('Auth Token')
    let uid = sessionStorage.getItem('UID')
    console.log(uid)
    console.log(authToken)
    if (authToken) {
      navigate('/edit-admin-profile')
    }

    if (!authToken) {
      navigate('/register')
    }

    let dbRef = ref(database);
    get(child(dbRef, `users`)).then((snapshot) => {
      let snapshot_val = snapshot.val();
      let uid = sessionStorage.getItem('UID')
      if ('name' in snapshot_val[uid]) {
        let name = snapshot_val[uid]['name'];
        setFirstName(name.split(" ")[0]);
        setLastName(name.split(" ")[1]);
      }
      if ('gender' in snapshot_val[uid]) {
        setGender(snapshot_val[uid]['gender']);
      }
      if ('mob' in snapshot_val[uid]) {
        setMob(snapshot_val[uid]['mob']);
      }
      if ('bloodgroup' in snapshot_val[uid]) {
        setBloodGroup(snapshot_val[uid]['bloodgroup']);
      }
      if ('dob' in snapshot_val[uid]) {
        setDate(snapshot_val[uid]['dob']);
      }
      if ('address1' in snapshot_val[uid]) {
        setAddress1(snapshot_val[uid]['address1']);
      }
      if ('address2' in snapshot_val[uid]) {
        setAddress2(snapshot_val[uid]['address2']);
      }
      if ('city' in snapshot_val[uid]) {
        setCity(snapshot_val[uid]['city']);
      }
      if ('state' in snapshot_val[uid]) {
        setState(snapshot_val[uid]['state']);
      }
      if ('country' in snapshot_val[uid]) {
        setCountry(snapshot_val[uid]['country']);
      }
    });

    if (isProfilePicPicked == 'Ready') {
      console.log(selectedProfilePic)
      let uid = sessionStorage.getItem('UID');
      const storageRef = sref(storage, uid + '/profile_pic');
      uploadBytes(storageRef, selectedProfilePic).then((snapshot) => {
        console.log(snapshot)
        console.log('Uploaded profile pic!');
        setIsProfilePicPicked('Finish');
        toast.success('Your profile data is updated.', { autoClose: 2000 });
      });

      getDownloadURL(sref(storage, uid + '/profile_pic'))
        .then((url) => {
          setImgSrc(url);
        });
    }

    getDownloadURL(sref(storage, uid + '/profile_pic'))
      .then((url) => {
        setImgSrc(url);
      });

  }, [isProfilePicPicked])

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: '24px', // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: '36px',
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              Tele-Medicine
            </Typography>
            <RemoveRedEyeIcon
              sx={{ border: 3, width: 40, height: 30, borderRadius: 2 }}
            />
            -
            <RemoveRedEyeIcon
              sx={{ border: 3, width: 40, height: 30, borderRadius: 2 }}
            />
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List>{mainListItems}</List>
          <Divider />
          <List><SecondaryListItems /></List> {/* Виклик функції SecondaryListItems */}
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            backgroundImage: `url(https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg)`,
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              {/* Chart */}
              <Grid item xs={12} md={8} lg={9}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: "100%",
                  }}
                >
                  <Grid container spacing={3}>
                    <Grid item xs={4}>
                      <TextField id="first_name" label="First Name" variant="outlined" sx={{ m: 2 }} value={firstname} onChange={handleChangeFirstName} />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField id="last_name" label="Last Name" variant="outlined" sx={{ m: 2 }} value={lastname} onChange={handleChangeLastName} />
                    </Grid>
                    <Grid item xs={4}>
                      <FormControl sx={{ m: 2, minWidth: 120 }}>
                        <InputLabel id="demo-simple-select-autowidth-label">Gender</InputLabel>
                        <Select
                          labelId="demo-simple-select-autowidth-label"
                          id="demo-simple-select-autowidth"
                          value={gender}
                          onChange={handleChangegender}
                          autoWidth
                          label="Gender"
                        >
                          <MenuItem value={'male'}>Male</MenuItem>
                          <MenuItem value={'female'}>Female</MenuItem>
                          <MenuItem value={'other'}>Other</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                      <TextField id="mob" label="Mobile Number" variant="outlined" sx={{ m: 2 }} value={mob} onChange={handleChangeMob} />
                    </Grid>
                    <Grid item xs={4}>
                      <FormControl sx={{ m: 2, minWidth: 120 }}>
                        <InputLabel id="demo-simple-select-autowidth-label">Blood Group</InputLabel>
                        <Select
                          labelId="demo-simple-select-autowidth-label"
                          id="demo-simple-select-autowidth"
                          value={bloodGroup}
                          onChange={handleChangeBloodGroup}
                          autoWidth
                          label="Blood Group"
                        >
                          <MenuItem value={'a-'}>A-</MenuItem>
                          <MenuItem value={'a+'}>A+</MenuItem>
                          <MenuItem value={'b-'}>B-</MenuItem>
                          <MenuItem value={'b+'}>B+</MenuItem>
                          <MenuItem value={'ab+'}>AB+</MenuItem>
                          <MenuItem value={'ab-'}>AB-</MenuItem>
                          <MenuItem value={'o+'}>O+</MenuItem>
                          <MenuItem value={'o-'}>O-</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                      <Box sx={{ m: 2 }}>
                        <LocalizationProvider dateAdapter={AdapterDateFns} >
                          <DatePicker
                            renderInput={(props) => <TextField {...props} />}
                            label="Date of Birth"
                            value={date}
                            onChange={(newValue) => {
                              setDate(newValue);
                            }}
                            maxDate={new Date()}
                          />
                        </LocalizationProvider>
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <TextField id="address1" label="Address Line 1" variant="outlined" sx={{ m: 2 }} value={address1} onChange={handleChangeAddress1} />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField id="address2" label="Address Line 2" variant="outlined" sx={{ m: 2 }} value={address2} onChange={handleChangeAddress2} />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField id="city" label="City" variant="outlined" sx={{ m: 2 }} value={city} onChange={handleChangeCity} />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField id="state" label="State" variant="outlined" sx={{ m: 2 }} value={state} onChange={handleChangeState} />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField id="country" label="Country" variant="outlined" sx={{ m: 2 }} value={country} onChange={handleChangeCountry} />
                    </Grid>
                  </Grid>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    onClick={handleSubmitData}
                  >
                    Update Profile Data
                  </Button>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4} lg={3}>
                <Paper
                  sx={{
                    p: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 480,
                  }}
                >
                  <Avatar alignItems="center"
                    justifyContent="center"
                    sx={{ width: 200, height: 200 }}
                    alt="Remy Sharp" src={imgsrc}> </Avatar>
                  <label htmlFor="profile-pic">
                    <Input accept="image/*" id="profile-pic" multiple type="file" onChange={changeProfilePic} />
                    <Button
                      type="button"
                      component="span"
                      fullWidth
                      variant="contained"
                      sx={{ mt: 3, mb: 2 }}
                    >
                      Change Profile picture
                    </Button>
                  </label>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  )
}
