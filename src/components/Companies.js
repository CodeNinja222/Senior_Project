import { Accordion,AccordionDetails,AccordionSummary,Button,Box,Typography} from '@mui/material'
import React, { useEffect, useState } from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';


function Company({data}){
const {companyID,companyType,name}=data
const [openDialog,setOpenDialog]=useState(false)
const handleClose=()=>{
    setOpenDialog(false)
}
const handleOpenDialog=()=>{

    setOpenDialog(true)
    
}
    return (
<Accordion sx={{width:"100%",height:"100px",paddingTop:"20px",padding:"auto",textAlign:"center",fontSize:"32px",marginBottom:"50px",marginLeft:"500px"}} defaultExpanded>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          
         
        >
          
            <Typography component="span">{name}</Typography>
            <Typography component="span">{companyType+" Company"}</Typography>
            
          
        </AccordionSummary>
        <AccordionDetails>
         <Button>hello</Button>
        </AccordionDetails>
        {/* <AllEmployee status={openDialog} setClose={handleClose} companyType={companyType} companyId={companyID} companyName={name}/> */}
      </Accordion>


    )
}
function Companies() {
    const [allCompanies,setAllCompanies]=useState([])
    useEffect(()=>{
     const fetchCompanies=async()=>{
      const result=await axios.post("http://127.0.0.1:5000/company/get")
      setAllCompanies(result.data)
     }
     fetchCompanies()
    },[])
  return (
    <>
    {allCompanies.map((company,index)=>{
        return(
            <Company key={index} data={company}/>
        )
    })

    }
    
      
    </>
  )
}

export default Companies