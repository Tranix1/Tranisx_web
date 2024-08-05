import React,{useEffect} from "react";
import { View ,Text,Image, TouchableOpacity,ScrollView , StyleSheet } from "react-native";
import { auth, db } from '../config/fireBase'; 
import { collection, onSnapshot,where ,query , doc , deleteDoc} from 'firebase/firestore';
// import AntDesign from '@expo/vector-icons/AntDesign';

import {useNavigate} from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';


function PersonalAccLoads(){

const navigate = useNavigate()

    const deleteLoad = async (id) => {
    const loadsDocRef = doc(db, 'Loads' , id);
    await deleteDoc(loadsDocRef);
  };

 const [loadIterms , setLoadedIterms ]= React.useState([])
  useEffect(() => {
    try {
      if (auth.currentUser) {
        const userId = auth.currentUser.uid;
        const dataQuery = query(collection(db, "Trucks"), where("userId", "==", userId));

        const unsubscribe = onSnapshot(dataQuery, (snapshot) => {
          const loadedData = [];
          snapshot.docChanges().forEach((change) => {
            if (change.type === 'added' || change.type === 'modified') {
              const dataWithId = { id: change.doc.id, ...change.doc.data() };
              loadedData.push(dataWithId);
            }
          });

          setLoadedIterms(loadedData);
        });
        
        // Clean up function to unsubscribe from the listener when the component unmounts
        return () => unsubscribe();
      }
    } catch (err) {
      console.error(err);
    }
  }, []); 


   const rendereIterms =  loadIterms.map((item)=>{ 
  return(
    <View  style={{ backgroundColor:  "#DDDDDD", marginBottom : 8, padding :6  }} >
        <Text style={{color:'#6a0c0c' , fontSize:15,textAlign :'center' ,fontSize: 17}}> {item.companyName} </Text>
        <Text>Contact : {item.contact}</Text>
        <Text>type of load {item.typeofLoad} </Text>
        <Text>from {item.fromLocation} to {item.toLocation} </Text>
        <Text>Rate {item.ratePerTonne} </Text>
        <Text> payment terms {item.paymentTerms} </Text>
        <Text>Requirements {item.requirements} </Text>
        <Text>additional info {item.additionalInfo} </Text>        

            <TouchableOpacity onPress={()=>deleteLoad(item.id)} >
              {/* <AntDesign name="delete" size={24} color="red" />    */}
              <DeleteIcon style={{color : 'red'} }/>
            </TouchableOpacity>
      </View>     
  )})

  return(<View style={{paddingTop : 80}} > 
       <View style={{position:'absolute' , top : 0 , left: 0 , right : 0 , flexDirection : 'row' , height : 74  ,  paddingLeft : 6 , paddingRight: 15 , paddingTop:10 ,backgroundColor : '#6a0c0c' ,paddingTop : 15 , alignItems : 'center' , }} >
         <TouchableOpacity style={{marginRight: 10}} onPress={() => navigate(-1)}>
           <ArrowBackIcon style={{color : 'white'}} />
        </TouchableOpacity> 
        <Text style={{fontSize: 20 , color : 'white'}} > Manage Loads </Text>
       </View>
    <ScrollView>
      
      <div className="Main-grid">
        {loadIterms.length > 0 ? rendereIterms : <Text>Loading.....</Text> } 
      </div>
    </ScrollView> 
    </View>
  )
}
export default React.memo(PersonalAccLoads)


