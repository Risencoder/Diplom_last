import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';



  const theme = createTheme();

  
export default function LoginForm({ title, setPassword, setEmail, handleAction }) {
    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        // eslint-disable-next-line no-console
        console.log({
          email: data.get('email'),
          password: data.get('password'),
        });
        handleAction();
      };
    
      return (
        <ThemeProvider theme={theme}>
        <Grid container component="main" sx={{ height: '100vh' }}>
          <CssBaseline />
          <Grid
            item
            xs={false}
            sm={4}
            md={7}
            sx={{
              backgroundImage: 'url(https://images.pexels.com/photos/8376152/pexels-photo-8376152.jpeg)',
              backgroundRepeat: 'no-repeat',
              backgroundColor: (t) =>
                t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
            <Box
              sx={{
                my: 8,
                mx: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Sign in
              </Typography>
              <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  onChange={(e) => setEmail(e.target.value)}
                  autoFocus
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Remember me"
                />
                <Grid item>
                    <Link href="/reset-password" variant="body2">
                      {"Forgot Password?"}
                    </Link>
                  </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  handleAction={handleAction}
                >
                  Sign In
                </Button>
                  <Grid item>
                    <Link href="/register" variant="body2">
                      {"Don't have an account? Sign Up"}
                    </Link>
                  </Grid>
               
              </Box>
            </Box>
          </Grid>
        </Grid>
      </ThemeProvider>
      );
    // return (
    //     <div>
    //         <div className="heading-container">
    //             <h3>
    //             {title} Form
    //             </h3>
    //         </div>

    //         <Box
    //             component="form"
    //             sx={{
    //                 '& > :not(style)': { m: 1, width: '25ch' },
    //             }}
    //             noValidate
    //             autoComplete="off"
    //         >

    //              <TextField
    //                 id="email"
    //                 label="Enter the Email"
    //                 variant="outlined"
    //                 onChange={(e) => setEmail(e.target.value)}
    //             />
    //             <TextField
    //                 id="password"
    //                 label="Enter the Password"
    //                 variant="outlined"
    //                 onChange={(e) => setPassword(e.target.value)}
    //             />
    //         </Box>

    //         <Button title={title} handleAction={handleAction}/>
    //     </div>
    // );
}