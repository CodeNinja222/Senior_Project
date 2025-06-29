import React, { useEffect, useState } from 'react';
import { AppBar,Toolbar,Typography,Paper,Grid,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Chip,Box,Card,CardContent,Avatar,List,ListItem,ListItemText,ListItemIcon} from '@mui/material';
import { Star} from '@mui/icons-material';
import {BarChart,Bar,XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer,Cell} from 'recharts';
import BarChartIcon from '@mui/icons-material/BarChart';
import axios from 'axios';
const Analytics = () => {
    const [managers,setmanagers]=useState([])
    const [companyEarnings,setcompanyEarnings]=useState([])
    const [payments,setpayments]=useState([])
    const calculateTotalEarned=(payments)=>{
  let total=0
  if(payments.length>0){
   for(let pay of payments){
     total+=pay.realamount
   }
   return total
  }
  return total
}
const calculateTotalAdminEarned=()=>{
  let total=0
  if(payments.length>0){
   for(let pay of payments.filter(pay=>pay.Company_name=="Admin")){
     total+=pay.realamount
   }
   return total
  }
  return total
}
const computeMaxTotalOfCompany=()=>{
   let max=0
    if(companyEarnings.length>0){
      for(let co of companyEarnings){
        if(co.earnings>max){
            max=co.earnings
        }
      }
      return companyEarnings.find((c)=>c.earnings===max)
    }else{
        return {}
    }
}
   useEffect(()=>{
      const fetchAll=async()=>{
              const [staffs,companies,payments]=await Promise.all([
       await axios.post("http://127.0.0.1:5000/staff/getALLStaffs"),
     await axios.post("http://127.0.0.1:5000/company/get"),
        await axios.post("http://127.0.0.1:5000/order/AllPaymentAndTranscations")
   ])
        if(staffs&&companies&&payments){
            const managers=[]
           for(let staff of staffs.data){
              const companyName=companies.data.find((comp)=>comp?.companyID===staff?.assignedCompanyID).name
              if(staff.role=="Manager"){
               managers.push({...staff,companyname:companyName})
              }
              
           } 
           const totals=[]
             for(let comp of companies.data){
              const companyName=payments.data.filter((pay)=>pay?.Company_name===comp?.name)
              const earnings=calculateTotalEarned(companyName)
              if(earnings!==0){
                totals.push({ name: comp?.name, earnings: earnings })
              }
           } 
           setpayments(payments.data)
           setcompanyEarnings(totals)
           setmanagers(managers)
        }
      }
  fetchAll()

   },[])
     
const formulateName=(name)=>{
        if(name.includes(" ")){
            return name.split(" ")[0].charAt(0).toUpperCase()+name.split(" ")[1].charAt(0).toUpperCase()
        }else{
            return name.split(" ")[0].charAt(0).toUpperCase()
        }
    }
        
    
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      
      <AppBar position="fixed">
        <Toolbar>
            <BarChartIcon sx={{ mr: 2 }}/>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Analytics
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ p: 3, mt: '64px', backgroundColor: '#f5f5f5', flexGrow: 1 }}>
        
        <Paper elevation={3} sx={{
          p: 3,
          mb: 3,
          background: 'linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)',
          color: 'white'
        }}>
          <Typography variant="h6">Total Earnings</Typography>
          <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
            ${calculateTotalAdminEarned().toFixed(2)}
          </Typography>
          <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
            
            Across all companies
          </Typography>
        </Paper>

        {/* Top Companies Section */}
        <Card elevation={3} sx={{ bgcolor: 'primary.main', color: 'white', mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              🏆 Top Performing Company
            </Typography>
            <List>
              
                <ListItem >
                  <ListItemIcon>
                    <Star sx={{ color: 'gold'  }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={`${computeMaxTotalOfCompany()?.name}`}
                    secondary={`$${computeMaxTotalOfCompany()?.earnings?.toFixed(2)}`}
                  />
                </ListItem>
              
            </List>
          </CardContent>
        </Card>

        
        <Grid container spacing={2}>
          
          <Grid  size={6}>
            <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Companies Managers
              </Typography>
              <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Company</TableCell>
                      <TableCell align="right">Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {managers.length>0?managers.map((manager) => (
                      <TableRow key={manager.staffID} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                              {formulateName(manager.fullName)}
                            </Avatar>
                            {manager.fullName?.charAt(0).toUpperCase()+manager.fullName?.substring(1,manager?.fullName.length)}
                          </Box>
                        </TableCell>
                        <TableCell>{manager.companyname}</TableCell>
                        <TableCell align="right">
                          <Chip
                            label={manager.isAvailable?"Online":"Offline"}
                            color={manager.isAvailable ? 'success' : 'error'}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    )):<Typography>no manager founded</Typography>}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          
          <Grid size={6}>
            <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Companies Earnings
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={companyEarnings}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Earnings']} />
                  <Bar dataKey="earnings" name="Earnings" animationDuration={1500}>
                    {companyEarnings.length>0&&companyEarnings.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index % 2 ? '#4caf50' : '#1976d2'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Analytics;
