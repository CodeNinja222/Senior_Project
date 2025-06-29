import React, { useState, useEffect } from 'react';
import {Dialog, AppBar,Toolbar,IconButton,Typography,ToggleButtonGroup,ToggleButton,Box,Paper,Table,TableBody,TableCell,TableContainer,TableHead,
TableRow,
  Chip,
  Card,
  CardContent,
  Avatar,
  List,
  ListItem,
 ListItemText,
Divider,
  Slide,
  Stack
} from '@mui/material';
import {
  Close,
  People,
  Handyman,
  Assessment,
  Dashboard,
  Star,
 
} from '@mui/icons-material';
import axios from 'axios';

const SlideFromRight = (props, ref) => (
  <Slide direction="left" ref={ref} {...props} timeout={2000}  />
);

const Services = ({ open, onClose,company }) => {
    const [mainState,setmainState]=useState({services:[],employees:[],requested:[]})
     
  const [viewMode, setViewMode] = useState('overview');
 

  const handleViewModeChange = (_, newViewMode) => {
    if (newViewMode) {
      setViewMode(newViewMode);
    }
  };
useEffect(()=>{
  const fetchAll=async()=>{
   const [services,employees,requested]=await Promise.all([
   await axios.post("http://127.0.0.1:5000/service/get",{id:company.companyID}),
   await axios.post("http://127.0.0.1:5000/staff/employee/getAll",{company_id:company.companyID}),
   await axios.post("http://127.0.0.1:5000/customer/getAllServiceRequest"),
   
   ])
   const serviceRequestInCompany=requested.data.filter((re)=>re.company_id===company.companyID)
   setmainState({services:services.data,employees:employees.data,requested:serviceRequestInCompany})
   
  }
  fetchAll()

 },[company.companyID])
  

  return (
    <Dialog
      open={open}
      onClose={() => onClose(false)}
      TransitionComponent={SlideFromRight}
      keepMounted
      fullScreen
      PaperProps={{
        sx: {
          m: 0,
          height: '100%',
          transform: 'translateX(0)',
          overflow: 'hidden',
          borderRadius: 0
        }
      }}
    >
      <AppBar position="static" sx={{ bgcolor: 'primary.main' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, color: 'white' }}>
             {company.name} Details
          </Typography>
          <IconButton color="inherit" onClick={() => onClose(false)}>
            <Close />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 3, backgroundColor: 'white', height: '100%', overflowY: 'auto' }}>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={handleViewModeChange}
          sx={{ mb: 3, '& .MuiToggleButton-root': { color: 'primary.main' } }}
        >
          <ToggleButton value="overview"><Dashboard sx={{ mr: 1 }} />Overview</ToggleButton>
           <ToggleButton value="employees"><People sx={{ mr: 1 }} />Employees</ToggleButton>
          <ToggleButton value="services"><Handyman sx={{ mr: 1 }} />Services</ToggleButton>
          <ToggleButton value="request"><Assessment sx={{ mr: 1 }} />Requested Services</ToggleButton>
        </ToggleButtonGroup>

        {/* Overview */}
        {viewMode === 'overview' && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h5">Company Overview</Typography>
              
            </Box>
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mb: 3 ,mt:10}}>
                        {[
                          { label: 'Total Number of Services', value:mainState.services.length },
                          { label: 'Total Number of employees',value:mainState.employees.length},
                          { label: 'Total Requests', value: mainState.requested.length },
                          
                        ].map((item, idx) => (
                          <Card key={idx} sx={{ flexGrow: 1, minWidth: 200, borderLeft: '4px solid', borderColor: 'primary.main',minHeight:200 }}>
                            <CardContent style={{padding:80}}>
                              <Typography color="text.secondary" style={{fontSize:"20px"}}>{item.label}</Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center',fontSize:"25px" }}>
                                <Typography variant="h4" color="primary.main">{item.value}</Typography>
                                {item.icon}
                              </Box>
                            </CardContent>
                          </Card>
                        ))}
                      </Box>
           
          </Box>
        )}

        {/* Orders */}
        {viewMode === 'request' && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h5" color="primary">All Request Services</Typography>
              
            </Box>
            <TableContainer component={Paper} sx={{ borderLeft: '4px solid', borderColor: 'primary.main' }}>
              <Table>
                <TableHead sx={{ backgroundColor: 'primary.light' }}>
                  <TableRow>
                    <TableCell sx={{ color: 'white' }}>Request ID</TableCell>
                    <TableCell sx={{ color: 'white' }}>Service name</TableCell>
                    <TableCell sx={{ color: 'white' }}>Customer Name</TableCell>
                    <TableCell sx={{ color: 'white' }}>Scheduled Date</TableCell>
                    <TableCell sx={{ color: 'white' }}>Scheduled Time</TableCell>
                    <TableCell sx={{ color: 'white' }}>Employee Name</TableCell>
                    <TableCell sx={{ color: 'white' }}>Status</TableCell>
                    <TableCell sx={{ color: 'white' }}>Customer problem</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mainState.requested.length>0?mainState.requested.map(req => (
                    <TableRow key={req.id} hover sx={{ cursor: 'pointer' }}>
                      <TableCell>#SER-{req.id}</TableCell>
                      <TableCell>{req.servicename}</TableCell>
                      <TableCell>{req.customername}</TableCell>
                       <TableCell>{req.scheduledDate}</TableCell>
                       <TableCell>{req.scheduledTime}</TableCell>
                       <TableCell>{req.employeename}</TableCell>
                      <TableCell>
                     
                        <Chip
                          label={req.status}
                          color={req.status=="completed"?"success":req.status=="canceled"?"error":
                            req.status=="scheduled"?"warning":"default"
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{req.description}</TableCell>
                    
                    </TableRow>
                  )):<Typography>No requested found in this company</Typography>}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* Employees */}
        {viewMode === 'employees' && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h5" color="primary">Employees</Typography>
              
            </Box>
            <Box sx={{ display: 'flex',flexDirection:'column', gap: 3,alignItems:"left" }}>
              {mainState.employees.length>0?mainState.employees.map(employee => (
                <Card
                  key={employee.id}
                  elevation={3}
                style={{minWidth:"700px"}}
                >
                  <CardContent sx={{ display: 'flex', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>{employee.name[0]+employee.name[1]}</Avatar>
                    <Box>
                      <Typography variant="h6">{employee.name}</Typography>
                      <Typography variant="body2" color="text.secondary">{employee.role}</Typography>
                      <Box sx={{ display: 'flex', mt: 1, gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="body2">Age:</Typography>
                          <Typography variant="body2" sx={{ ml: 0.5 }}>{employee.age}</Typography>
                        </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="body2">Phone:</Typography>
                          <Typography variant="body2" sx={{ ml: 0.5 }}>{employee.phone}</Typography>
                        </Box>
                           <Box sx={{ display: 'flex', alignItems: 'center' }}>
                         
                          <Typography variant="body2" sx={{ ml: 0.5 }}>{employee.Description}</Typography>
                        </Box>
                        
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              )):<Typography>No employees added to this Company</Typography>}
            </Box>
          </Box>
        )}

        {/* Services */}
        {viewMode === 'services' && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h5" color="primary">Services</Typography>
             
            </Box>
            <Paper sx={{ borderLeft: '4px solid', borderColor: 'primary.main' }}>
              <List>
                {mainState.services.length>0?mainState.services.map(service => (
                  <React.Fragment key={service.serviceID}>
                    <ListItem>
                     <Avatar src={service.url} alt={service.serviceID} style={{marginRight:"30px",transform:"scale(1.4)"}}/>
                     <Stack spacing={1}>
                         <ListItemText
                        primary={<Typography color="primary">{service.name}</Typography>}
                        secondary={service.description}
                      />
                       <ListItemText
                       
                        secondary={`Price pre hour: $${service.price}`}
                        
                      />
                     </Stack>
                     
                    
                    </ListItem>
                    <Divider component="li" />
                  </React.Fragment>
                )):<Typography>No services added currently to this company</Typography>}
              </List>
            </Paper>
          </Box>
        )}

    
      </Box>
    </Dialog>
  );
};

export default Services;
