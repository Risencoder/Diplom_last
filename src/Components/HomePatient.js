import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import { useTheme } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import { mainListItems, secondaryListItems } from './listItems';
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
import blood_test from '../images/blood-test.png'
import eye from '../images/left_eye.png'
import health_report from '../images/health-report.png';
import { keyframes } from '@mui/system';
import theme from './theme';
import { app, storage, database } from '../firebase-config';
import { ref, child, get, push, update } from "firebase/database";
import { getStorage, uploadBytes, ref as sref, getDownloadURL, getMetadata } from "firebase/storage";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const drawerWidth = 240;
const Input = styled('input')({
  display: 'none',
});

const spin = keyframes`
from {
  transform: rotate(0deg);
}
to {
  transform: rotate(360deg);
}
`;

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
export default function HomePatient() {
  const [age, setAge] = React.useState('-');
  const [bloodgroup, setBloodGroup] = React.useState('-');
  const [gender, setGender] = React.useState('-');
  const [name, setName] = React.useState('-');
  const [city, setCity] = React.useState('-');
  const [open, setOpen] = React.useState(true);
  const [brDate, setbrDate] = React.useState('Not Available')
  const [erDate, seterDate] = React.useState('Not Available')
  const [hrDate, sethrDate] = React.useState('Not Available')
  const [imgsrc, setImgSrc] = React.useState('https://i.imgur.com/Rbp9NSp.jpg');
  const toggleDrawer = () => {
    setOpen(!open);
  };
  const [selectedBloodReport, setSelectedBloodReport] = useState();
	const [isBloodReportPicked, setIsBloodReportPicked] = useState('Finish');
  const changeBloodReport = (event) => {
    console.log(event.target.files[0])
			setSelectedBloodReport(event.target.files[0]);
    	setIsBloodReportPicked('Ready');	
  };
	const [selectedEyeReport, setSelectedEyeReport] = useState();
	const [isEyeReportPicked, setIsEyeReportPicked] = useState('Finish');
	const changeEyeReport = (event) => {
		setSelectedEyeReport(event.target.files[0]);
		setIsEyeReportPicked('Ready');
	};
	const [selectedHealthReport, setSelectedHealthReport] = useState();
	const [isHealthReportPicked, setIsHealthReportPicked] = useState('Finish');
	const changeHealthReport = (event) => {
		setSelectedHealthReport(event.target.files[0]);
		setIsHealthReportPicked('Ready');
	};
   
  const downloadBloodReport = (event) => {
    let uid = sessionStorage.getItem('UID');
    getDownloadURL(sref(storage, uid + '/blood_report'))
    .then((url) => {
      const xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      xhr.onload = (event) => {
        const blob = xhr.response;
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `blood_report.jpg`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      };
      xhr.open('GET', url)
      xhr.send();
      console.log("Downloaded blood report");
    });
  }

  const downloadEyeReport= (event) => {
    let uid = sessionStorage.getItem('UID');
    getDownloadURL(sref(storage, uid + '/eye_report'))
    .then((url) => {
      const xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      xhr.onload = (event) => {
        const blob = xhr.response;
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `eye_report.jpg`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      };
      xhr.open('GET', url)
      xhr.send();
      console.log("Downloaded eye report");
    });
  }

  const downloadHealthReport= (event) => {
    let uid = sessionStorage.getItem('UID');
    getDownloadURL(sref(storage, uid + '/health_report'))
    .then((url) => {
      const xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      xhr.onload = (event) => {
        const blob = xhr.response;
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `health_report.jpg`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      };
      xhr.open('GET', url)
      xhr.send();
      console.log("Downloaded health report");
    });
  }
  let navigate = useNavigate();
  useEffect(() => {
    let authToken = sessionStorage.getItem('Auth Token')
    let uid = sessionStorage.getItem('UID')
    var options = { year: 'numeric', month: 'long', day: 'numeric' };
    console.log(authToken)
    if (authToken) {
        navigate('/homepatient')
    }

    if (!authToken) {
        navigate('/register')
    }

    let dbRef = ref(database);
    get(child(dbRef, `users`)).then((snapshot) => {
      let snapshot_val = snapshot.val();
      
      let uid = sessionStorage.getItem('UID')
      if('name' in snapshot_val[uid]){
        let name = snapshot_val[uid]['name'];
        setName(name);
      }
      if('gender' in snapshot_val[uid]){
        let gender_val = snapshot_val[uid]['gender'];
        if(gender_val == 'male'){
          setGender('Male');
        }
        if(gender_val == 'female'){
          setGender('Female');
        }
        if(gender_val == 'other'){
          setGender('Other');
        }
      }
      if('bloodgroup' in snapshot_val[uid]){
        let bg_val = snapshot_val[uid]['bloodgroup'];
        if(bg_val == 'a-'){
          setBloodGroup('A-');
        }
        if(bg_val == 'a+'){
          setBloodGroup('A+');
        }
        if(bg_val == 'b-'){
          setBloodGroup('B-');
        }
        if(bg_val == 'b+'){
          setBloodGroup('B+');
        }
        if(bg_val == 'aB-'){
          setBloodGroup('AB-');
        }
        if(bg_val == 'ab+'){
          setBloodGroup('AB+');
        }
        if(bg_val == 'o-'){
          setBloodGroup('O-');
        }
        if(bg_val == 'o+'){
          setBloodGroup('O+');
        }
        
      }
      if('dob' in snapshot_val[uid]){
        setAge(Math.floor(((new Date() - new Date(snapshot_val[uid]['dob']))/3.1536e10)));
      }
      if('city' in snapshot_val[uid]){
        setCity(snapshot_val[uid]['city']);
      }})
    if(isBloodReportPicked == 'Ready'){
      console.log(selectedBloodReport)
      let uid = sessionStorage.getItem('UID');
      const storageRef = sref(storage, uid + '/blood_report');
      uploadBytes(storageRef, selectedBloodReport).then((snapshot) => {
        console.log(snapshot)
          console.log('Uploaded blood report!');
          setIsBloodReportPicked('Finish');
          toast.success('Your blood report is uploaded.',{autoClose: 2000});
      });
      getMetadata(sref(storage, uid + '/blood_report'))
      .then((metadata) => {
        const meta_date = new Date(metadata.updated)
        setbrDate(meta_date.toLocaleDateString('en-GB',options))
      })
      .catch((error) => {
        console.log(error)
        console.log('Blood report not available')
      });
    }
    if(isEyeReportPicked == 'Ready'){
      console.log(selectedEyeReport)
      let uid = sessionStorage.getItem('UID');
      const storageRef = sref(storage, uid + '/eye_report');
      uploadBytes(storageRef, selectedEyeReport).then((snapshot) => {
        console.log(snapshot)
          console.log('Uploaded eye report!');
          setIsEyeReportPicked('Finish');
          toast.success('Your eye report is uploaded.',{autoClose: 2000});
      });
      getMetadata(sref(storage, uid + '/eye_report'))
      .then((metadata) => {
        const meta_date = new Date(metadata.updated)
        seterDate(meta_date.toLocaleDateString('en-GB',options))
      })
      .catch((error) => {
        console.log('Eye report not available')
      });
    }
    if(isHealthReportPicked == 'Ready'){
      console.log(selectedHealthReport)
      let uid = sessionStorage.getItem('UID');
      const storageRef = sref(storage, uid + '/health_report');
      uploadBytes(storageRef, selectedHealthReport).then((snapshot) => {
        console.log(snapshot)
          console.log('Uploaded health report!');
          setIsHealthReportPicked('Finish');
          toast.success('Your health report is uploaded.',{autoClose: 2000});
      });
      getMetadata(sref(storage, uid + '/health_report'))
      .then((metadata) => {
        const meta_date = new Date(metadata.updated)
        sethrDate(meta_date.toLocaleDateString('en-GB',options))
      })
      .catch((error) => {
        console.log('Health report not available')
      });
    }
    getDownloadURL(sref(storage, uid + '/profile_pic'))
    .then((url) => {
      setImgSrc(url);
    })
    .catch((error) => {
      console.log(error);
      console.log("Profile picture not available.")
    });
    getMetadata(sref(storage, uid + '/blood_report'))
    .then((metadata) => {
      const meta_date = new Date(metadata.updated)
      setbrDate(meta_date.toLocaleDateString('en-GB',options))
    })
    .catch((error) => {
      console.log(error)
      console.log('Blood report not available')
    });
    getMetadata(sref(storage, uid + '/eye_report'))
    .then((metadata) => {
      const meta_date = new Date(metadata.updated)
      seterDate(meta_date.toLocaleDateString('en-GB',options))
    })
    .catch((error) => {
      console.log('Eye report not available')
    });
    getMetadata(sref(storage, uid + '/health_report'))
    .then((metadata) => {
      const meta_date = new Date(metadata.updated)
      sethrDate(meta_date.toLocaleDateString('en-GB',options))
    })
    .catch((error) => {
      console.log('Health report not available')
    });
  }, [isBloodReportPicked,isEyeReportPicked,isHealthReportPicked])
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
          <List>{secondaryListItems}</List>
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
                  <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={4}>
                    <Card sx={{ maxWidth: 275  }}>
                      <div>
                      <CardMedia
                          component="img"
                          alt="blood_test"
                          height="10%"
                          image={blood_test}
                      />
                      </div>
                      <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                          Blood Test Report
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                          Date uploaded: {brDate}
                          </Typography>
                      </CardContent>
                      <CardActions sx={{ justifyContent: "center" }}>
                      <label htmlFor="contained-button-file-1">
                        <Input accept="image/*|*.pdf" id="contained-button-file-1" multiple type="file" onChange={changeBloodReport} />
                        <Button size = "small" component="span" type="button" >
                          Upload
                        </Button>
                      </label>
                          <Button size="small" onClick = {downloadBloodReport}>Download</Button>
                      </CardActions>
                    </Card>
                  </Grid>
                  <Grid item xs={4}>
                    <Card sx={{ maxwidth: '50%' }}>
                      <div>
                      <CardMedia
                          component="img"
                          alt="right eye"
                          height="10%"
                          image={eye}
                      />
                      </div>
                      <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                          Eye Test Report
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                          Date uploaded: {erDate}
                          </Typography>
                      </CardContent>
                      <CardActions sx={{ justifyContent: "center" }}>
                          <label htmlFor="contained-button-file-2">
                            <Input accept= "image/*|*.pdf" id="contained-button-file-2" multiple type="file" onChange={changeEyeReport} />
                            <Button size = "small" component="span" type="button">
                              Upload
                            </Button>
                          </label>
                          <Button size="small" onClick = {downloadEyeReport}>Download</Button>
                      </CardActions>
                    </Card>
                  </Grid>
                  <Grid item xs={4}>
                    <Card sx={{ maxWidth: 275  }}>
                      <div>
                      <CardMedia
                          component="img"
                          alt="health report"
                          height="10%"
                          image={health_report}
                      />
                      </div>
                      <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                          Full Body Report
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                          Date uploaded: {hrDate}
                          </Typography>
                      </CardContent>
                      <CardActions sx={{ justifyContent: "center" }}>
                          <label htmlFor="contained-button-file-3">
                            <Input accept= "image/*|*.pdf" id="contained-button-file-3" multiple type="file"  onChange={changeHealthReport} />
                            <Button size = "small" component="span" type="button" >
                              Upload
                            </Button>
                          </label>
                          <Button size="small" onClick = {downloadHealthReport}>Download</Button>
                      </CardActions>
                    </Card> 
                  </Grid>
                </Grid>
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
                src= {imgsrc}
              > </Avatar>
              <Typography gutterBottom variant="h5" component="div" sx = {{m : 2}}>
                          {name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                          Age: {age} yrs
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                          Gender: {gender}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                          Blood Group: {bloodgroup}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                          City: {city}
                          </Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={12}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', borderColor: 'grey.500'}}>
                <Typography variant="body1" color="text.secondary">
                Use code WELCOME 20 to get 20% Off on your first appointment.
                </Typography>
                  

                </Paper>
              </Grid>
            </Grid>
            
            <Grid item>
            {/* <Typography variant="caption">
              {'Icons made by '}
              <Link href="https://www.freepik.com" rel="sponsored" title="Freepik">
                Freepik
              </Link>
              {' from '}
              <Link href="https://www.flaticon.com" rel="sponsored" title="Flaticon">
                www.flaticon.com
              </Link>
              {' is licensed by '}
              <Link
                href="https://creativecommons.org/licenses/by/3.0/"
                title="Creative Commons BY 3.0"
                target="_blank"
                rel="noopener noreferrer"
              >
                CC 3.0
              </Link>
            </Typography> */}
          </Grid>
          </Container>
          </Box>
        </Box>
      </ThemeProvider>
  )
}