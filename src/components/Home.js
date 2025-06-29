import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { SpeedDial, SpeedDialAction, SpeedDialIcon, Typography,Container, Button,Accordion,AccordionDetails,AccordionSummary,Chip,Stack,Divider} from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import '../styles/Home.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import BusinessIcon from '@mui/icons-material/Business';
import StorefrontIcon from '@mui/icons-material/Storefront';
import BuildIcon from '@mui/icons-material/Build';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import Store from './Store/Store';
import Services from './Services/ServieType';
import Delivery from './Delivery/DeliveryType';

function FloatingButton(){
    const navigate=useNavigate()
  
    return(
      <>
<SpeedDial
   ariaLabel="SpeedDial"
   sx={{ position: 'fixed', bottom: 16, right: 16 }}
   icon={<SpeedDialIcon />}
 >
    <SpeedDialAction
       onClick={()=>navigate("/registerCompany")}
       icon={<AddBusinessIcon/>}
       slotProps={{ tooltip: { title: 'Add company' } }}
     />
     <SpeedDialAction
       onClick={()=>navigate("/Analytics")}
       icon={<BarChartIcon/>}
       slotProps={{ tooltip: { title: 'Analytics' } }}
     />
   
     
 </SpeedDial>
 
 </>
    )
}

function Home() {
  const [allCompanies, setAllCompanies] = useState([]);
  const [OpenDetails,setOpenDetails]=useState(false)
  const [selectCompany,setselectedCompany]=useState({companyID:"", companyType:"", name:""})
  const arr={
    "Service":(props)=><Services {...props}/>,
    "Store":(props)=><Store {...props}/>,
    "Delivery":(props)=><Delivery {...props}/>
  }
 
  useEffect(() => {
    const fetchCompanies = async () => {
      const result = await axios.post("http://127.0.0.1:5000/company/get");
      setAllCompanies(result.data);
    };
    fetchCompanies();
  }, []);
const RenderIcons=(type)=>{
   if(type==="Store"){
    return <StorefrontIcon  fontSize="small"style={{color:"white"}} />
   }else if(type=="Service"){
     return <BuildIcon  fontSize="small"style={{color:"white"}} />
   }else{
      return <LocalShippingIcon  fontSize="small"style={{color:"white"}} />
   }
}
const OpenDialogBasedOnCompany=(companyID, companyType, name)=>{
  setselectedCompany({companyID:companyID, companyType:companyType, name:name})
  setOpenDetails(true)
}
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <FloatingButton />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <BusinessIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Admin Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 12, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ 
          fontWeight: 'bold',
          color: 'primary.main',
          mb: 4
        }}>
          Managed Companies
        </Typography>
        {/*Dialog*/ }
       {selectCompany.companyType!==""&&arr[selectCompany?.companyType]({company:selectCompany,open:OpenDetails, onClose:setOpenDetails})}




       {/*Dialog*/ }
        <Stack spacing={3}>
          {allCompanies.map(({ companyID, companyType, name }) => (
            <Accordion 
              key={companyID} 
              defaultExpanded
              sx={{
                boxShadow: 3,
                '&:before': { display: 'none' },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  backgroundColor: 'primary.light',
                }}
              >
                <Stack direction="row" alignItems="center" spacing={2} sx={{ width: '100%' }}>
                  <BusinessIcon style={{color:"white"}} />
                  <Typography variant="h6" component="div" sx={{ flexGrow: 1,color:"white" }}>
                    {name}
                  </Typography>
                  <Chip
                    label={`${companyType} Company`}
                    style={{color:"white"}}
                    variant="outlined"
                    icon={RenderIcons(companyType)}
                  />
                </Stack>
              </AccordionSummary>
              
              <AccordionDetails>
                <Divider sx={{ mb: 2 }} />
                <Button 
                  variant="contained" 
                  color="primary"
                  sx={{ 
                    textTransform: 'none',
                    px: 3,
                    py: 1
                  }}
                  onClick={()=>OpenDialogBasedOnCompany(companyID, companyType, name)}
                >
                  View Details
                </Button>
              </AccordionDetails>
            </Accordion>
          ))}
        </Stack>
      </Container>

      
    </Box>
  );
}

export default Home;