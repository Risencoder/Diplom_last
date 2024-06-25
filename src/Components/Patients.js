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
import PropTypes from "prop-types";
import Grid from '@mui/material/Grid';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import List from '@mui/material/List';
import { mainListItems, SecondaryListItems } from './adminListItems';
import {
    DataGrid,
    gridPageCountSelector,
    gridPageSelector,
    useGridApiContext,
    useGridSelector,
} from '@mui/x-data-grid';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import { ref, child, get, remove } from "firebase/database";
import { database, storage } from '../firebase-config';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import { toast } from 'react-toastify'; // Додавання імпорту toast
import 'react-toastify/dist/ReactToastify.css'; // Імпорт стилів для toast
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
import { getDownloadURL, ref as sref } from "firebase/storage";

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
        borderRight: `1px solid ${theme.palette.mode === 'light' ? '#f0f0f0' : '#303030'}`,
    },
    '& .MuiDataGrid-columnsContainer, .MuiDataGrid-cell': {
        borderBottom: `1px solid ${theme.palette.mode === 'light' ? '#f0f0f0' : '#303030'}`,
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

export default function Patients() {
    const [open, setOpen] = React.useState(true);
    const toggleDrawer = () => {
        setOpen(!open);
    };
    const [tableData, setTableData] = React.useState([]);
    let navigate = useNavigate();

    const handleDelete = (id) => {
        const dbRef = ref(database);
        remove(child(dbRef, `users/${id}`))
            .then(() => {
                setTableData(prevData => prevData.filter(item => item.id !== id));
                toast.success('User deleted successfully.', { autoClose: 2000 });
            })
            .catch(error => {
                console.error("Error removing user: ", error);
                toast.error('Failed to delete user.', { autoClose: 2000 });
            });
    };

    const columns = [
        {
            field: "photoURL",
            headerName: "Photo",
            width: 100,
            sortable: false,
            renderCell: (params) => (
                <Avatar src={params.value} alt="User photo" />
            ),
        },
        { field: "name", headerName: "Name", width: 150 },
        { field: "email", headerName: "Email", width: 200 },
        { field: "age", headerName: "Age", type: "number", width: 100 },
        { field: "hospital", headerName: "Hospital", width: 150 },
        { field: "address1", headerName: "Address 1", width: 200 },
        { field: "address2", headerName: "Address 2", width: 200 },
        { field: "city", headerName: "City", width: 150 },
        { field: "state", headerName: "State", width: 150 },
        { field: "country", headerName: "Country", width: 150 },
        { field: "bloodgroup", headerName: "Blood Group", width: 150 },
        { field: "gender", headerName: "Gender", width: 150 },
        { field: "mob", headerName: "Mobile", width: 150 },
        { field: "dob", headerName: "Date of Birth", width: 150 },
        {
            field: "actions",
            headerName: "Actions",
            width: 150,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDelete(params.row.id)}
                >
                    Delete
                </Button>
            ),
        },
    ];

    useEffect(() => {
        let authToken = sessionStorage.getItem('Auth Token');
        if (!authToken) {
            navigate('/register');
        } else {
            let dbRef = ref(database);
            get(child(dbRef, `users`)).then((snapshot) => {
                let snapshot_val = snapshot.val();
                var tempArray = [];
                const promises = [];
                for (const [key, value] of Object.entries(snapshot_val)) {
                    const temp = {
                        id: key,
                        name: value.name || "N/A",
                        email: value.email || "N/A",
                        age: value.age || "N/A",
                        hospital: value.hospital || "N/A",
                        address1: value.address1 || "N/A",
                        address2: value.address2 || "N/A",
                        city: value.city || "N/A",
                        state: value.state || "N/A",
                        country: value.country || "N/A",
                        bloodgroup: value.bloodgroup || "N/A",
                        gender: value.gender || "N/A",
                        mob: value.mob || "N/A",
                        dob: value.dob || "N/A",
                        photoURL: value.photoURL || "https://via.placeholder.com/150"
                    };

                    const promise = getDownloadURL(sref(storage, `${key}/profile_pic`))
                        .then((url) => {
                            temp.photoURL = url;
                        })
                        .catch(() => {
                            temp.photoURL = "https://via.placeholder.com/150";
                        })
                        .finally(() => {
                            tempArray.push(temp);
                        });
                    
                    promises.push(promise);
                }

                Promise.all(promises).then(() => {
                    setTableData(tempArray);
                });
            }).catch((error) => {
                console.log(error);
            });
        }
    }, [navigate]);

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ display: "flex" }}>
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
                            <ChevronLeftIcon />
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
                    <List><SecondaryListItems /></List>
                </Drawer>
                <Box
                    component="main"
                    sx={{
                        backgroundColor:
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
                            <Grid item xs={12}>
                                <Paper
                                    sx={{
                                        p: 2,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        height: 500,
                                    }}
                                >
                                    <Typography variant="h5" color="text.secondary">
                                        Registered Patients
                                    </Typography>
                                    <div style={{ flexGrow: 1 }}>
                                        <StyledDataGrid
                                            pageSize={5}
                                            rowsPerPageOptions={[5]}
                                            components={{
                                                Pagination: CustomPagination,
                                            }}
                                            rows={tableData}
                                            columns={columns}
                                        />
                                    </div>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Container>
                </Box>
            </Box >
        </ThemeProvider>
    );
}
