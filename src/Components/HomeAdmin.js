import * as React from "react";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import Button from "@mui/material/Button";
import MuiDrawer from '@mui/material/Drawer';
import Avatar from "@mui/material/Avatar";
import PersonIcon from "@mui/icons-material/Person";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import List from '@mui/material/List';
import { mainListItems, SecondaryListItems } from './adminListItems';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import DateAdapter from '@mui/lab/AdapterDateFns';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CssBaseline from '@mui/material/CssBaseline';

import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';

import { app, storage, database } from '../firebase-config';
import { ref, child, get, push, update } from "firebase/database";
import { getStorage, uploadBytes, ref as sref, getDownloadURL } from "firebase/storage";
import { SettingsApplicationsTwoTone } from '@material-ui/icons';
import { ToastContainer, toast } from 'react-toastify';

import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Link } from "@material-ui/core";
//import 'react-toastify/dist/ReactToastify.css';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import theme from './theme';

import ToggleButton from '@mui/material/ToggleButton';

const rows = [
    { id: 1, lastName: "Snow", firstName: "Jon", age: 35, location: "Chennai" },
    { id: 2, lastName: "Lannister", firstName: "Cersei", age: 42, location: "Bangalore" },
    { id: 3, lastName: "Lannister", firstName: "Jaime", age: 45, location: "kolkata" },
    { id: 4, lastName: "Stark", firstName: "Arya", age: 16, location: "Hyderabad" },
    { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null, location: "Delhi" },
    { id: 6, lastName: null, firstName: "Melisandre", age: 15, location: "Lucknow" },
    { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44, location: "Patna" },
    { id: 8, lastName: "Frances", firstName: "Rossini", age: 36, location: "Bihar" },
    { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65, location: "Mumbai" }
];

const drawerWidth = 240;

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

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired
};

function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
        "aria-controls": `vertical-tabpanel-${index}`
    };
}

export default function HomeAdmin() {
    const [value, setValue] = React.useState(3);

    const handleChanges = (event, newValue) => {
        setValue(newValue);
    };
    const [open, setOpen] = React.useState(true);
    const toggleDrawer = () => {
        setOpen(!open);
    };

    const [selectedFile, setSelectedFile] = useState();
    const [fileName, setFileName] = useState('');
    const [isFilePicked, setIsFilePicked] = useState(false);
    const changeHandler = (event) => {
        setSelectedFile(event.target.files[0]);
        setIsFilePicked(true);
    };
    const handleLogout = () => {
        sessionStorage.removeItem('Auth Token');
        navigate('/login')
    }
    const [values, setValues] = React.useState({
        password: '',
        showPassword: false,
    });

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const handleClickShowPassword = () => {
        setValues({
            ...values,
            showPassword: !values.showPassword,
        });
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    const [selected, setSelected] = React.useState(false);
    const [date, setDate] = React.useState(new Date());
    const [bloodGroup, setBloodGroup] = React.useState('');
    const [gender, setGender] = React.useState('');
    const [firstname, setFirstName] = React.useState('');
    const [lastname, setLastName] = React.useState('');
    const [middlename, setMiddleName] = React.useState('');
    const [mob, setMob] = React.useState('');
    const [address1, setAddress1] = React.useState('');
    const [address2, setAddress2] = React.useState('');
    const [city, setCity] = React.useState('');
    const [state, setState] = React.useState('');
    const [country, setCountry] = React.useState('');
    const [imgsrc, setImgSrc] = React.useState('https://i.imgur.com/Rbp9NSp.jpg');
    const [selectedProfilePic, setSelectedProfilePic] = useState();
    const [isProfilePicPicked, setIsProfilePicPicked] = useState(false);
    const changeProfilePic = (event) => {
        console.log("Entered profilepic")
        setSelectedProfilePic(event.target.files[0]);
        setIsProfilePicPicked(true);
    };
    const handleChangeFirstName = (event) => {
        setFirstName(event.target.value);
    };
    const handleChangeMiddleName = (event) => {
        setMiddleName(event.target.value);
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
    const handleChangeBloodGroup = (event) => {
        setBloodGroup(event.target.value);
    };

    const handleChangegender = (event) => {
        setGender(event.target.value);
    };
    const Input = styled('input')({
        display: 'none',
    });
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
    const handleProfilePic = (file) => {
        if (isProfilePicPicked) {
            console.log(file)
            let uid = sessionStorage.getItem('UID');
            const storageRef = sref(storage, uid + '/profile_pic');
            uploadBytes(storageRef, file).then((snapshot) => {
                console.log('Uploaded profile pic!');
            });
            
        }
    };
    const columns = [
        { field: "id", headerName: "ID" },
        {
            field: "fullName",
            headerName: "Full name",
            width: 300,
            sortable: false,
            valueGetter: (params) =>
                `${params.row.firstName || ""} ${params.row.lastName || ""}`
        },
        { field: "age", headerName: "Age", type: "number", width: 100 },
        {
            field: "email",
            headerName: "Email",
            width: 300,
            valueGetter: (params) =>
                `${params.row.firstName || ""}${params.row.lastName || ""}@gmail.com`
        },
        {
            field: "location",
            headerName: "Location",
        },
        {
            field: "profile",
            headerName: "Profile Details",
            width: 125,
            renderCell: (cellValues) => {
                return (
                    <Link href={`about:blank`} target="_blank">
                        Profile
                    </Link>
                );
            }
        },
        {
            field: "verification",
            headerName: "Verification Status",
            width: "30%",
            renderCell: (cellValues) => {
                return (
                    <ToggleButton
                        value="check"
                        selected={selected}
                        color="success"
                        onChange={() => {
                            setSelected(!selected);
                        }}
                    >
                        {String(selected)}
                    </ToggleButton>
                );
            }
        }
    ];

    let navigate = useNavigate();

    useEffect(() => {
        let authToken = sessionStorage.getItem('Auth Token')
        let uid = sessionStorage.getItem('UID')
        console.log(uid)
        console.log(authToken)
        if (authToken) {
            navigate('/homeadmin')
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
        getDownloadURL(sref(storage, uid + '/profile_pic'))
            .then((url) => {
                setImgSrc(url);
            });
    }, [])

    return (
        <ThemeProvider theme={theme}>
        <Box sx={{ display: "flex" }}>
        <CssBaseline />
            <AppBar position="absolute" open={open} >
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
                    <CssBaseline />
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Card sx={{ minHeight: 200, minWidth: 200, bgcolor: '#009688', m: 2, p: 2 }}>
                                <CardContent>
                                    <Typography variant="h4" component="div" color='#FFF'>
                                        Total No. Of Doctors Online:
                                    </Typography>
                                    <br />
                                    <Typography variant="h3" color='#FFF'>
                                        28/50
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={6}>
                            <Card sx={{ minHeight: 200, minWidth: 200, bgcolor: '#ffc107', m: 2, p: 2 }}>
                                <CardContent>
                                    <Typography variant="h4" component="div" color='#FFF'>
                                        Total No. Of Patients Visited:
                                    </Typography>
                                    <br />
                                    <Typography variant="h3" color='#FFF'>
                                        50
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={6}>
                            <Card sx={{ minHeight: 200, minWidth: 200, bgcolor: '#e53935', m: 2, p: 2 }}>
                                <CardContent>
                                    <Typography variant="h4" component="div" color='#FFF'>
                                        Pending Verification Of Doctors:
                                    </Typography>
                                    <br />
                                    <Typography variant="h3" color='#FFF'>
                                        5
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={6}>
                            <Card sx={{ minHeight: 200, minWidth: 200, bgcolor: 'primary.main', m: 2, p: 2 }}>
                                <CardContent>
                                    <Typography variant="h4" component="div" color='#FFF'>
                                        Pending Appointments:
                                    </Typography>
                                    <br />
                                    <Typography variant="h3" color='#FFF'>
                                        12
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                    
            </Box>
        </Box >
        </ThemeProvider>
    );
}
