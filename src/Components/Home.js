import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Link from '@mui/material/Link';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import Container from '@mui/material/Container';
import { styled } from '@mui/material/styles';
import down_arrow from '../images/down_arrow.png';
import curvy_lines from '../images/productCurvyLines.png';
import medical_checkup from '../images/medical-checkup.png';
import doctor from '../images/doctor.png';
import Button from '@mui/material/Button';
import surgery from '../images/surgery.png';
import red_line from '../images/red_line.png';
import Typography from '@mui/material/Typography';
import fb from '../images/facebook.png';
import twitter from '../images/twitter.png';
import Grid from '@mui/material/Grid';
// import Typography from '@mui/material/Typography';
// import Button from '@mui/material/Button';
// import IconButton from '@mui/material/IconButton';
// import MenuIcon from '@mui/icons-material/Menu';


  const iconStyle = {
    width: 48,
    height: 48,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'warning.main',
    mr: 1,
    '&:hover': {
      bgcolor: 'warning.dark',
    },
  };

const rightLink = {
    fontSize: 16,
    color: 'common.white',
    ml: 3,
  };

  const item = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    px: 5,
  };
  
  const number = {
    fontSize: 24,
    fontFamily: 'default',
    color: 'secondary.main',
    fontWeight: 'medium',
  };
  
  const image = {
    height: 55,
    my: 4,
  };

  const Background = styled(Box)({
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    zIndex: -2,
  });
export default function Home(){
    const sxBackground={
        backgroundImage: `url(https://images.pexels.com/photos/5752263/pexels-photo-5752263.jpeg)`,
        backgroundColor: '#7fc7d9', // Average color of the background image.
        backgroundPosition: 'center',
      };
    return (
        <div>
            <ThemeProvider theme={theme}>
            <AppBar position="fixed">
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                <Box sx={{ flex: 1 }} />
                <Link
                    variant="h6"
                    underline="none"
                    color="inherit"
                    href="/"
                    sx={{ fontSize: 24 }}
                >
                    {'Tele-Medicine'}
                </Link>
                <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                    <Link
                    color="inherit"
                    variant="h6"
                    underline="none"
                    href="/login"
                    sx={rightLink}
                    >
                    {'Sign In'}
                    </Link>
                    <Link
                    variant="h6"
                    underline="none"
                    href="/register"
                    sx={{ ...rightLink, color: 'secondary.main' }}
                    >
                    {'Sign Up'}
                    </Link>
                </Box>
                </Toolbar>
            </AppBar>
        <Toolbar />
        <Container
        sx={{
            color: theme.palette.common.white,
          mt: 3,
          mb: 14,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            backgroundColor: 'common.black',
            opacity: 0.5,
            zIndex: -1,
          }}
        />
        <Typography color="inherit" align="center" variant="h2" marked="center"
        sx={{ mb: 4, mt: { sx: 4, sm: 10 } }}>
            One-stop solution for your eyes.
        </Typography>
        <Typography
            color="inherit"
            align="center"
            variant="h5"
            sx={{ mb: 4, mt: { sx: 24, sm: 10 } }}
        >
            Get access to top ophthalmologists across the country 24x7.
        </Typography>
        <Background sx={sxBackground} />
        {/* <Box
          component="img"
          src={down_arrow}
          height="16"
          width="12"
          alt="arrow down"
          sx={{ position: 'absolute', bottom: 32 }}
        /> */}
        <Button
        color="secondary"
        variant="contained"
        size="large"
        component="a"
        href="/register"
        sx={{ minWidth: 200 }}
      >
        Register
      </Button>
      <Typography variant="body2" color="inherit" sx={{ mt: 2 }}>
        Discover the experience
      </Typography>
      </Container>
      <Box
      component="section"
      sx={{ display: 'flex', bgcolor: 'secondary.light', overflow: 'hidden' }}
    >
      <Container
        sx={{
          mt: 10,
          mb: 15,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box
          component="img"
          src={curvy_lines}
          alt="curvy lines"
          sx={{
            pointerEvents: 'none',
            position: 'absolute',
            top: -180,
            opacity: 0.7,
          }}
        />
        <Typography variant="h4" marked="center" component="h2" sx={{ mb: 14 }}>
          How it works
        </Typography>
        <div>
          <Grid container spacing={5}>
            <Grid item xs={12} md={4}>
              <Box sx={item}>
                <Box sx={number}>1.</Box>
                <Box
                  component="img"
                  src={medical_checkup}
                  alt="suitcase"
                  sx={image}
                />
                <Typography variant="h5" align="center">
                  Upload your health reports obtained from your nearby labs.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={item}>
                <Box sx={number}>2.</Box>
                <Box
                  component="img"
                  src={doctor}
                  alt="graph"
                  sx={image}
                />
                <Typography variant="h5" align="center">
                  1-1 session with our experienced doctors.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={item}>
                <Box sx={number}>3.</Box>
                <Box
                  component="img"
                  src={surgery}
                  alt="clock"
                  sx={image}
                />
                <Typography variant="h5" align="center">
                  Safe and trusted surgery facilities at our approved hospitals
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </div>
        <Button
          color="secondary"
          size="large"
          variant="contained"
          component="a"
          href="/register"
          sx={{ mt: 8 }}
        >
          Get started
        </Button>
      </Container>
    </Box>
    <Container
      component="section"
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 9 }}
    >
      <Button
        sx={{
          border: '4px solid currentColor',
          borderRadius: 0,
          height: 'auto',
          py: 2,
          px: 5,
          href:"mailto:ntnbsht97@gmail.com"
        }}
      >
        <Typography variant="h4" component="span">
          Got any questions? Need help?
        </Typography>
      </Button>
      <Typography variant="subtitle1" sx={{ my: 3 }}>
        We are here to help. Get in touch!
      </Typography>
    </Container>
    <Typography
      component="footer"
      sx={{ display: 'flex', bgcolor: 'secondary.light' }}
    >
      <Container sx={{ my: 8, display: 'flex' }}>
        <Grid container spacing={5}>
          <Grid item xs={6} sm={4} md={3}>
            <Grid
              container
              direction="column"
              justifyContent="flex-end"
              spacing={2}
              sx={{ height: 120 }}
            >
              <Grid item sx={{ display: 'flex' }}>
                <Box component="a" href="" sx={iconStyle}>
                  <img
                    src={fb}
                    alt="Facebook"
                  />
                </Box>
                <Box component="a" href="" sx={iconStyle}>
                  <img
                    src={twitter}
                    alt="Twitter"
                  />
                </Box>
              </Grid>
              <Grid item>
                
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <Typography variant="h6" marked="left" gutterBottom>
              Contact Us
            </Typography>
            <Box component="ul" sx={{ m: 0, listStyle: 'none', p: 0 }}>
              <Box component="li" sx={{ py: 0.5 }}>
                <Link href="mailto:ntnbsht97@gmail.com">Mail</Link>
              </Box>
            </Box>
          </Grid>

          <Grid item>
            <Typography variant="caption">
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
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Typography>
        </ThemeProvider>
    </div>
      );
}