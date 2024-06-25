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
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import MuiDrawer from '@mui/material/Drawer';
import FormControl from '@mui/material/FormControl';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import { mainListItems, secondaryListItems } from './listItems';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios'; // Цей рядок повинен бути правильним імпортом ES6

import theme from './theme';

const Input = styled('input')({
  display: 'none',
});

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

const mdTheme = createTheme();

export default function EyeMl() {
  const [selectedEyeSample, setSelectedEyeSample] = useState();
  const [isEyeSamplePicked, setIsEyeSamplePicked] = useState('Finish');
  const [eye, setEye] = useState('https://images.pexels.com/photos/801867/pexels-photo-801867.jpeg');
  const [disease, setDisease] = useState("");
  const [confidence, setConfidence] = useState("");
  const [open, setOpen] = useState(true);
  const [model, setModel] = useState('DenseNet121');

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const changeEyeSample = (event) => {
    setSelectedEyeSample(event.target.files[0]);
    setIsEyeSamplePicked('Ready');
  };

  const handleModelChange = (event) => {
    setModel(event.target.value);
  };

  const handlePrediction = () => {
    if (!selectedEyeSample) {
      alert("Будь ласка, завантажте зразок ока спочатку.");
      return;
    }

    var reader = new FileReader();
    reader.readAsDataURL(selectedEyeSample);
    reader.onloadend = () => {
      console.log('Image data URL:', reader.result); // Логування зображення в base64

      axios.post('http://127.0.0.1:5000/predict', {
        image: reader.result,
        model: model
      })
      .then(response => {
        console.log('Server response:', response.data); // Логування відповіді сервера

        const prediction = response.data.prediction;
        const confidence = response.data.confidence;
        setDisease(`Прогноз: ${prediction}`);
        setConfidence(`Точність: ${(confidence * 100).toFixed(2)}%`);
      })
      .catch(error => {
        console.error("Сталася помилка під час передбачення!", error);
      });
    };
  };

  let navigate = useNavigate();

  useEffect(() => {
    let authToken = sessionStorage.getItem('Auth Token');

    if (isEyeSamplePicked === 'Ready') {
      var reader = new FileReader();
      reader.readAsDataURL(selectedEyeSample);
      reader.onloadend = () => {
        setEye(URL.createObjectURL(selectedEyeSample));
      };
    }

    if (authToken) {
      navigate('/eye-ml');
    } else {
      navigate('/register');
    }
  }, [isEyeSamplePicked]);

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar sx={{ pr: '24px' }}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{ marginRight: '36px', ...(open && { display: 'none' }) }}
            >
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
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) => theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', height: "100%" }}>
                  <Card sx={{ maxWidth: 400, mb: 2 }}>
                    <div>
                      <CardMedia component="img" alt="eye_sample" height="300" image={eye} />
                    </div>
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        Завантажити зразок ока
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ justifyContent: "center" }}>
                      <label htmlFor="contained-button-file-1">
                        <Input accept="image/*" id="contained-button-file-1" multiple type="file" onChange={changeEyeSample} />
                        <Button variant="contained" component="span" type="button">
                          Завантажити
                        </Button>
                      </label>
                    </CardActions>
                  </Card>
                  <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel id="model-select-label">Виберіть модель</InputLabel>
                    <Select
                      labelId="model-select-label"
                      id="model-select"
                      value={model}
                      label="Виберіть модель"
                      onChange={handleModelChange}
                    >
                      <MenuItem value={'VGG19'}>VGG19</MenuItem>
                      <MenuItem value={'EfficientNet'}>EfficientNet</MenuItem>
                      <MenuItem value={'VGG16'}>VGG16</MenuItem>
                    </Select>
                  </FormControl>
                  <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handlePrediction}>
                    Отримати прогноз
                  </Button>
                  <Typography gutterBottom variant="h4" component="div" sx={{ mt: 2 }}>
                    {disease}
                  </Typography>
                  <Typography gutterBottom variant="h6" component="div" sx={{ mt: 1 }}>
                    {confidence}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
