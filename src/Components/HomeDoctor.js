import * as React from "react";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import Button from "@mui/material/Button";
import MuiDrawer from '@mui/material/Drawer';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Avatar from "@mui/material/Avatar";
import PersonIcon from "@mui/icons-material/Person";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import PropTypes from "prop-types";
import TableContainer from '@mui/material/TableContainer';
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import List from '@mui/material/List';
import { mainListItems, secondaryListItems } from './doctorListItems';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import {
    DataGrid,
    gridPageCountSelector,
    gridPageSelector,
    useGridApiContext,
    useGridSelector,
  } from '@mui/x-data-grid';
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
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import { Link } from "@material-ui/core";
//import 'react-toastify/dist/ReactToastify.css';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import theme from './theme';

import ToggleButton from '@mui/material/ToggleButton';
import { VideoStableOutlined } from "@mui/icons-material";



const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
    border: 0,
    color:
      theme.palette.mode === 'light' ? 'rgba(0,0,0,.85)' : 'rgba(255,255,255,0.85)',
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    WebkitFontSmoothing: 'auto',
    letterSpacing: 'normal',
    '& .MuiDataGrid-columnsContainer': {
      backgroundColor: theme.palette.mode === 'light' ? '#fafafa' : '#1d1d1d',
    },
    '& .MuiDataGrid-iconSeparator': {
      display: 'none',
    },
    '& .MuiDataGrid-columnHeader, .MuiDataGrid-cell': {
      borderRight: `1px solid ${
        theme.palette.mode === 'light' ? '#f0f0f0' : '#303030'
      }`,
    },
    '& .MuiDataGrid-columnsContainer, .MuiDataGrid-cell': {
      borderBottom: `1px solid ${
        theme.palette.mode === 'light' ? '#f0f0f0' : '#303030'
      }`,
    },
    '& .MuiDataGrid-cell': {
      align: 'center',
      color:
        theme.palette.mode === 'light' ? 'rgba(0,0,0,.85)' : 'rgba(255,255,255,0.65)',
    },
    '& .MuiPaginationItem-root': {
      borderRadius: 0,
    },
  }));
  
  function CustomPagination() {
    const apiRef = useGridApiContext();
    const page = useGridSelector(apiRef, gridPageSelector);
    const pageCount = useGridSelector(apiRef, gridPageCountSelector);
  
    return (
      <Pagination
        color="primary"
        variant="outlined"
        shape="rounded"
        page={page + 1}
        count={pageCount}
        // @ts-expect-error
        renderItem={(props2) => <PaginationItem {...props2} disableRipple />}
        onChange={(event, value) => apiRef.current.setPage(value - 1)}
      />
    );
  }



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

export default function AdminDoctors() {
    const [value, setValue] = React.useState(3);

    const handleChanges = (event, newValue) => {
        setValue(newValue);
    };
    const [open, setOpen] = React.useState(true);
    const toggleDrawer = () => {
        setOpen(!open);
      };
    const [tabledata, setTableData] = React.useState([]);
    const [hospdata, setHospData] = React.useState([]);
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
        {
            field: "name",
            headerName: "Name",
            width: 200,
            sortable: false,
            "headerAlign": 'center',
        },
        {
            field: "email",
            headerName: "Email",
            width: 200,
            "headerAlign": 'center'
        },
        {
            field: "date",
            headerName: "Date",
            width: 400,
            "headerAlign": 'center'
        },
        {
          field: "healthreporturl",
          headerName: "Health Report",
          width: 200,
          "headerAlign": 'center',
          renderCell: (cellValues) => {
            return (
              cellValues.row.healthreporturl == 'Unavailable' ?
               (<div>Patient Report Not Uploaded</div>):
                (<Link href={`${cellValues.row.healthreporturl}`}>Report Link</Link>)
            )
          }
      },
      {
        field: "bloodreporturl",
        headerName: "Blood Report",
        width: 200,
        "headerAlign": 'center',
        renderCell: (cellValues) => {
          return (
            cellValues.row.bloodreporturl == 'Unavailable' ?
             (<div>Patient Report Not Uploaded</div>):
              (<Link href={`${cellValues.row.bloodreporturl}`}>Report Link</Link>)
          )
        }
    },
    {
      field: "eyereporturl",
      headerName: "Eye Report",
      width: 200,
      "headerAlign": 'center',
      renderCell: (cellValues) => {
        return (
          cellValues.row.eyereporturl == 'Unavailable' ?
           (<div>Patient Report Not Uploaded</div>):
            (<Link href={`${cellValues.row.eyereporturl}`}>Report Link</Link>)
        )
      }
  }

    ];

    const hospColumns = [
        {
            field: "name",
            headerName: "Name",
            width: 180,
            sortable: false,
            "headerAlign": 'center',
        }
    ];
    let navigate = useNavigate();
    useEffect(() => {
        let authToken = sessionStorage.getItem('Auth Token')
        let uid = sessionStorage.getItem('UID')
        console.log(uid)
        console.log(authToken)
        if (authToken) {
            navigate('/homedoctor')
        }

        if (!authToken) {
            navigate('/register')
        }
        let dbRef = ref(database);
        console.log(dbRef)
        get(child(dbRef, `appointments`)).then((snapshot) => {
            let snapshot_val = snapshot.val()[uid];
            console.log(snapshot_val)
            var temparray = []
            for (const [key, value] of Object.entries(snapshot_val)) {
              var temp = {"id": key
                    , "name": value.patientName
                , "email": value.patientEmail
            ,"date": value.date
          , "healthreporturl": value.healthreport
          , "bloodreporturl": value.bloodreport
          , "eyereporturl": value.eyereport}
              console.log(temp)
              temparray.push(temp)
              
              
            }
            setTableData(temparray);
          }).catch((error) => {
            console.log(error)
          })

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
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: "70%",
                    margin: 4
                  }}
                >
                  <Typography variant="h5" color="text.secondary">
                Incoming Appointments
                </Typography>
                <div style={{ flexGrow: 1 }}>
                <StyledDataGrid
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                  components={{
                    Pagination: CustomPagination,
                  }}
                  rows={tabledata} columns={columns}
                />
                </div>
                </Paper>
                
               
            </Box>
        </Box >
        </ThemeProvider>
    );
}
