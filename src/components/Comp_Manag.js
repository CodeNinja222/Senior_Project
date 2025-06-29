import React, { useState } from 'react';
import {Box,Paper,Typography,Stepper,Step,StepLabel,StepContent,InputAdornment,Grid,TextField,MenuItem,Button,CircularProgress} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import axios from 'axios';

function CompManag() {
  const [activeStep, setActiveStep] = useState(0);
  const [company, setCompany] = useState({
    type: '',
    name: '',
    schedule_start_time: '',
    schedule_end_time: '',
    city: '',
  });
  const [manager, setmanager] = useState({
    name: '',
    password: '',
    role: 'Manager',
    assCompanyID: 0,
  });
  const [inputType, setInputType] = useState('password');
  const [error, seterror] = useState(false);
  const [loading, setloading] = useState(false);

  const handleNext = async () => {
    try {
      const request = await axios.post('http://127.0.0.1:5000/company/insert', company);
      if (request.data.message === 'added') {
        setmanager({ ...manager, assCompanyID: request.data.companyId });
        setActiveStep((prev) => prev + 1);
      }
    } catch (err) {
      if (err.response) {
        if (err.response.data.message == 'already added company') {
          seterror(true);
        } else {
          console.log(err);
        }
      }
    }
  };

  const handleAddstaff = async () => {
    try {
      setloading(true);
      const request = await axios.post('http://127.0.0.1:5000/staff/insert', manager);
      if (request.data == 'success') {
        setmanager({ name: '', password: '', role: 'Manager', assCompanyId: 0 });
        setCompany({ type: '', name: '' });
        setActiveStep((prev) => prev - 1);
      }
    } catch (err) {
      if (err.response) {
        if (err.response.data.message == 'already added staff') {
          seterror(true);
        } else {
          console.log(err);
        }
      }
    } finally {
      setloading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f3f6f9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3,
      }}
    >
      <Box>
        <Paper
          elevation={10}
          sx={{
            padding: 4,
            minWidth: 700,
            minHeight: 650,
            borderRadius: 4,
            backgroundColor: 'white',
          }}
        >
          <Typography variant="h5" fontWeight="bold" mb={3}>
            Add New Company
          </Typography>

          <Stepper orientation="vertical" activeStep={activeStep}>
            <Step>
              <StepLabel>Company Information</StepLabel>
              <StepContent>
                <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    color="primary"
                    value={company.name}
                    helperText={error && 'Please use another name'}
                    error={error}
                    onFocus={() => seterror(false)}
                    onChange={(e) => setCompany({ ...company, name: e.target.value })}
                    label="Company Name"
                    fullWidth
                  />

                  <TextField
                    select
                    focused={company.type !== '' ? true : false}
                    sx={{ '& .MuiSelect-select': { color: 'black', fontSize: '17px' } }}
                    onChange={(e) => setCompany({ ...company, type: e.target.value })}
                    label="Company Type"
                    fullWidth
                  >
                    <MenuItem value={'Delivery'} sx={{ color: 'black' }}>
                      Delivery Company
                    </MenuItem>
                    <MenuItem value={'Store'} sx={{ color: 'black' }}>
                      Store Company
                    </MenuItem>
                    <MenuItem value={'Service'} sx={{ color: 'black' }}>
                      Service Company
                    </MenuItem>
                  </TextField>

                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        focused
                        label="Start Time"
                        type="time"
                        fullWidth
                        onChange={(e) =>
                          setCompany({ ...company, schedule_start_time: e.target.value })
                        }
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        focused
                        label="End Time"
                        type="time"
                        fullWidth
                        onChange={(e) =>
                          setCompany({ ...company, schedule_end_time: e.target.value })
                        }
                      />
                    </Grid>
                  </Grid>

                  <TextField
                    color="primary"
                    value={company.city}
                    onChange={(e) => setCompany({ ...company, city: e.target.value })}
                    label="City"
                    fullWidth
                  />

                  <Button
                    color="primary"
                    disabled={
                      company.name !== '' &&
                      company.type !== '' &&
                      company.schedule_start_time !== '' &&
                      company.schedule_end_time !== '' &&
                      company.city !== ''
                        ? false
                        : true
                    }
                    variant="contained"
                    onClick={() => handleNext()}
                    sx={{ mt: 2, alignSelf: 'flex-end' }}
                  >
                    Continue
                  </Button>
                </Box>
              </StepContent>
            </Step>

            <Step>
              <StepLabel>Create a Manager Account</StepLabel>
              <StepContent>
                <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    value={manager.name}
                    fullWidth
                    color="primary"
                    label="Name"
                    onChange={(e) => setmanager({ ...manager, name: e.target.value })}
                  />

                  <TextField
                    value={manager.password}
                    error={error}
                    helperText={error && 'Please use another password'}
                    onFocus={() => seterror(false)}
                    type={inputType}
                    onChange={(e) => setmanager({ ...manager, password: e.target.value })}
                    fullWidth
                    color="primary"
                    label="Password"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="start">
                          {inputType === 'password' ? (
                            <VisibilityOffIcon
                              sx={{ cursor: 'pointer' }}
                              onClick={() => setInputType('text')}
                            />
                          ) : (
                            <VisibilityIcon
                              sx={{ cursor: 'pointer' }}
                              onClick={() => setInputType('password')}
                            />
                          )}
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Button
                      color="primary"
                      disabled={manager.name !== '' && manager.password !== '' ? false : true}
                      variant="contained"
                      onClick={handleAddstaff}
                    >
                      Finish
                    </Button>
                    {loading && <CircularProgress size={24} />}
                  </Box>
                </Box>
              </StepContent>
            </Step>
          </Stepper>
        </Paper>
      </Box>
    </Box>
  );
}

export default CompManag;
