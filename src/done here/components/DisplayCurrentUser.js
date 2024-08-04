import React from "react"
import "./styles/AddLoad.css"
import {deleteDoc , doc} from "firebase/firestore"
import { db } from './config/fireBase'
import DeleteIcon from '@mui/icons-material/Delete';


function CurrentUserLoads( props){

  const deleteLoad = async (id) => {
    const loadsDocRef = doc(db, 'Loads' , id);
    await deleteDoc(loadsDocRef);
  };
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;

  if(props.item.DueDate === formattedDate){
    deleteLoad(props.item.id)
  }
console.log((props.item.DueDate))
  return(    
    <div className="bigLoad"  >
        <h3>Company {props.item.companyName} </h3>
        <p>Contact : <span className="spaninMini">{props.item.contact}</span></p>
        <p>type of load {props.item.typeofLoad} </p>
        <p>from {props.item.fromLocation} to {props.item.toLocation} </p>
        <p>Due Date {props.item.DueDate} </p>
        <p>Rate {props.item.ratePerTonne} </p>
        <p> payment terms {props.item.paymentTerms} </p>
        <p>Requirements {props.item.requirements} </p>
        <p>additional info {props.item.additionalInfo} </p>    
        <div onClick={()=>deleteLoad(props.item.id)}><DeleteIcon/></div>    
      </div>   

  )

}
export default React.memo( CurrentUserLoads )