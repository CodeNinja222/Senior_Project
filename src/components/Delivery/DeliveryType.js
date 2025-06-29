import React, { useState, useEffect } from 'react';
import {Dialog, AppBar,Toolbar,IconButton,Typography,ToggleButtonGroup,ToggleButton,Box,Paper,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Chip,Card,CardContent,Avatar,
Slide,
Stack
} from '@mui/material';
import { useTheme} from '@mui/material';
import {Close,LocalShipping,Dashboard} from '@mui/icons-material';
import PaymentsIcon from '@mui/icons-material/Payments';
import axios from 'axios';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
const SlideFromRight = (props, ref) => (
  <Slide direction="left" ref={ref} {...props} timeout={2000}  />
);

const Delivery = ({ open, onClose,company }) => {
   //{companyID:"", companyType:"", name:""}
     const theme = useTheme();
  const [viewMode, setViewMode] = useState('overview');
  
 const [mainState,setmainState]=useState({staffs:[],orders:[],payments:[]})
  const handleViewModeChange = (_, newViewMode) => {
    if (newViewMode) {
      setViewMode(newViewMode);
    }
  };
 useEffect(()=>{
  const fetchAll=async()=>{
   const [staffs,orders,payments]=await Promise.all([
   await axios.post("http://127.0.0.1:5000/staff/get",{companyID:company.companyID}),
   await axios.post("http://127.0.0.1:5000/order/SelectAllOrderforDrivers"),
  await axios.post("http://127.0.0.1:5000/order/AllPaymentAndTranscations")
   ])
   if(staffs&&orders&&payments){
    const staffInCompany=staffs.data.filter((staff)=>staff?.role!="Manager")
    const Orderincompany=orders.data.filter((it)=>it?.status=="OnProgress"||it?.status==="Completed"&&it?.deliveryCompanyID===company?.companyID)
   
const Paymentsincompany=[]
  
   let pay=[...payments.data]
   for(let order of Orderincompany){
    while(pay.some((re)=>(re.Company_name==="Admin"||re.Company_name===company.name)&&(re.realamount===2.700000047683716||re.realamount=== 0.30000001192092896))){
      const found=pay.find((re)=>(re.Company_name==="Admin"||re.Company_name===company.name)&&(re.realamount===2.700000047683716||re.realamount=== 0.30000001192092896))
     if(found){
       Paymentsincompany.push(found)
       const index=pay.indexOf(found)
      pay.splice(index,1)
     }
    }
    
   }
   setmainState({staffs:staffInCompany,orders:Orderincompany,payments:Paymentsincompany})
   }
   
  }
 fetchAll()
 },[company.companyID,company.name])
const computeRevenue=()=>{
  let total=0
  if(mainState.payments.length>0){
   for(let pay of mainState.payments.filter(pay=>pay.Company_name==company.name)){
     total+=pay.realamount
   }
   return total
  }
  return total
}
const formulateName=(name)=>{
        if(name.includes(" ")){
            return name.split(" ")[0].charAt(0).toUpperCase()+name.split(" ")[1].charAt(0).toUpperCase()
        }else{
            return name.split(" ")[0].charAt(0).toUpperCase()
        }
    }
const displayOrderDetails=(items)=>{
  let arr=[]
  for(let item of items){
   arr.push(item.quantity+"x"+item.name)
  }
  return arr.join(",")
}
const calculateTotalAdminEarned=()=>{
  let total=0
  if(mainState.payments.length>0){
   for(let pay of mainState.payments.filter(pay=>pay.Company_name=="Admin")){
     total+=pay.realamount
   }
   return total
  }
  return total
}

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
          <ToggleButton value="Drivers"><DeliveryDiningIcon sx={{ mr: 1 }}/>Drivers</ToggleButton>
          <ToggleButton value="Orders"><LocalShipping sx={{ mr: 1 }} />Orders Completed</ToggleButton>
          <ToggleButton value="Payments"><PaymentsIcon sx={{ mr: 1 }} />Payments</ToggleButton>
          
        </ToggleButtonGroup>

        {/* Overview */}
        {viewMode === 'overview' && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h5">Company Overview</Typography>
              
            </Box>
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mb: 3 ,mt:10}}>
              {[
                { label: 'Total Deliveries Completed', value: mainState.orders.length },
                { label: 'Total number of drivers', value: mainState.staffs.length },
                { label: 'Revenue', value: `$${computeRevenue()?.toFixed(2)}` },
                
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
        {viewMode === 'Orders' && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h5" color="primary">Recent Orders</Typography>
              
            </Box>
            <TableContainer component={Paper} sx={{ borderLeft: '4px solid', borderColor: 'primary.main' }}>
              <Table>
                <TableHead sx={{ backgroundColor: 'primary.light' }}>
                  <TableRow>
                    <TableCell sx={{ color: 'white' }}>Order ID</TableCell>
                    <TableCell sx={{ color: 'white' }}>Customer</TableCell>
                    <TableCell sx={{ color: 'white' }}>Status</TableCell>
                    <TableCell sx={{ color: 'white' }}>Total</TableCell>
                    <TableCell sx={{ color: 'white' }}>Date & Time</TableCell>
                    <TableCell sx={{ color: 'white' }}>Order from</TableCell>
                    <TableCell sx={{ color: 'white' }}>Driver name</TableCell>
                    <TableCell sx={{ color: 'white' }}>Details</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mainState.orders.length>0?mainState.orders.map(order => (
                    <TableRow key={order.orderID} hover sx={{ cursor: 'pointer' }}>
                      <TableCell>#ORD-{order.orderID}</TableCell>
                      <TableCell>{order.customername}</TableCell>
                      <TableCell>
                        
                        <Chip
                          label={order.status}
                          color={
                           order.status === 'OnProgress' ? 'warning' :"secondary"
                            
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>${order.totalAmount?.toFixed(2)}</TableCell>
                      <TableCell>{order.orderDate}</TableCell>
                      <TableCell >{order?.company?.company_name}</TableCell>
                      <TableCell >{order?.Drivername}</TableCell>
                      <TableCell>{displayOrderDetails(order?.Item)}</TableCell>
                    </TableRow>
                  )):<Typography variant='h6'> no current Orders found in this company</Typography>}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

       
        {viewMode === 'Drivers' && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h5" color="primary">Items</Typography>
              
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 3 }}>
              {mainState.staffs.length>0?mainState.staffs.map(staff => (
                <Card
                  key={staff.staffID}
                  sx={{
                    borderLeft: '4px solid',
                    borderColor: !staff.isAvailable? 'primary.main' : 'error.main',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'scale(1.02)' }
                  }}
                >
                  <CardContent sx={{ display: 'flex', gap: 2 }}>
                    <Avatar>{formulateName(staff.fullName)}</Avatar>
                    <Box>
                      <Typography variant="h6">{staff.fullName}</Typography>
                     
                      <Box sx={{ display: 'flex', mt: 1, gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <DeliveryDiningIcon color="primary" fontSize="small" />
                          <Typography variant="body2" sx={{ ml: 0.5 }}>{staff.role}</Typography>
                        </Box>
                        
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              )):<Typography variant='h6'> No current Drivers added in this company</Typography>}
            </Box>
          </Box>
        )}

       
        {viewMode === 'Payments' && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h5" color="primary">Payments</Typography>
              <Stack spacing={1}>
                 <Chip
                          label={`Your Earned:$${calculateTotalAdminEarned()?.toFixed(2)}`}
                          color={"primary"}
                          size="small"
                        />
                  <Chip
                          label={`Total ${company.name} Earned:$${computeRevenue()?.toFixed(2)}`}
                          color={"primary"}
                          size="small"
                        />
               
              </Stack>
              
            </Box>
            <TableContainer component={Paper} sx={{ borderLeft: '4px solid', borderColor: 'primary.main' }}>
              <Table>
                <TableHead sx={{ backgroundColor: 'primary.light' }}>
                  <TableRow>
                    <TableCell sx={{ color: 'white' }}>PaymentID</TableCell>
                    <TableCell sx={{ color: 'white' }}>OrderID</TableCell>
                    <TableCell sx={{ color: 'white' }}>Total with delivery fees</TableCell>
                    <TableCell sx={{ color: 'white' }}>Payment Method</TableCell>
                    <TableCell sx={{ color: 'white' }}>Real amount(10% fees)</TableCell>
                    <TableCell sx={{ color: 'white' }}>Earned By</TableCell>
                    <TableCell sx={{ color: 'white' }}>Payment Date</TableCell>
                    
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mainState.payments.length>0?mainState.payments.map((order,index) => (
                    <TableRow key={index} hover sx={{ cursor: 'pointer' }}>
                      <TableCell>#PAY-{order.paymentID}</TableCell>
                      <TableCell>#ORD-{order.orderID}</TableCell>
                      <TableCell>${order.deliveryamount?.toFixed(2)}</TableCell>
                      <TableCell>{order.paymentMethod}</TableCell>
                      <TableCell>${order.realamount?.toFixed(2)}</TableCell>
                      <TableCell>{order.Company_name==='Admin'?"You":order.Company_name}</TableCell>
                      <TableCell>{order.paymentDate}</TableCell>
                     
                    </TableRow>
                  )):<Typography variant='h6'> no current Payments found in this company</Typography>}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

       
       
      </Box>
    </Dialog>
  );
};

export default Delivery;
