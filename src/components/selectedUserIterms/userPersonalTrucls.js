import React, { useEffect, useState } from 'react';

import { useParams , useNavigate } from 'react-router-dom';
import VerifiedIcon from '@mui/icons-material/Verified';

import { WhatsApp  } from '@mui/icons-material';
import CallIcon from '@mui/icons-material/Call';
import ChatIcon from '@mui/icons-material/Chat';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import defaultImage from '../images/TRANSIX.jpg'

import { View , Text , Image , ScrollView,StyleSheet,TouchableOpacity,Linking,TextInput,ActivityIndicator } from 'react-native';
import { auth ,db} from "../config/fireBase";

import { collection,  query , where,onSnapshot ,deleteDoc,doc,limit,startAfter,orderBy,updateDoc  } from 'firebase/firestore';
import inputstyles from '../styles/inputElement';
import DeleteIcon from '@mui/icons-material/Delete';

function SelectedUserTrucks ({blockVerifiedU  , blackLWarning,isVerified } ){ 

  const {navigate} = useNavigate()
  const {userId , loadIsVerifiedG ,CompanyNameG,itemKey }= useParams()
  let loadIsVerified = loadIsVerifiedG ==="true" ? true : false

  const [allTrucks, setAllTrucks] = useState([]);

  const [dspLoadMoreBtn , setLoadMoreBtn]=React.useState(true)
  const [LoadMoreData , setLoadMoreData]=React.useState(false)
  function fetchData (loadMore){
    try {
      if(loadMore){
        
        setLoadMoreData(true) 
      }
      const orderByF = "fromLocation";
      const pagination = loadMore && allTrucks.length > 0 ? [startAfter(allTrucks[allTrucks.length - 1][orderByF])] : [];
      let dataQuery

       if(loadIsVerified  ){
        dataQuery = query(collection(db, "Trucks"),where("userId" ,"==", userId) ,where("withDetails" ,"==", true) ,  orderBy(orderByF)  , ...pagination, limit(15) );
        
      }else{
            dataQuery = query(collection(db, "Trucks"),where("userId" ,"==", userId) ,  orderBy(orderByF)  , ...pagination, limit(12) );
            
          }

        const unsubscribe = onSnapshot(dataQuery, (snapshot) => {
          const loadedData = [];
          snapshot.docChanges().forEach((change) => {
            if (change.type === 'added' || change.type === 'modified') {
              const dataWithId = { id: change.doc.id, ...change.doc.data() };
              loadedData.push(dataWithId);
            }
          });
             if (loadedData.length === 0) {
                setLoadMoreBtn(false);
            }
          setAllTrucks(loadedData);
          
            if(loadMore){

              setLoadMoreData(false) 
            }
        });
        
        // Clean up function to unsubscribe from the listener when the component unmounts
        return () => unsubscribe();
    } catch (err) {
      console.error(err);
    }
    }

  const [getOneTruck, setgetOneTruck] = useState([]);

    function getOneItemF(){

        const dataQuery = query(collection(db, "Trucks"), where("deletionTime", "==", parseInt(itemKey)) , where("userId", "==", userId) );

        const unsubscribe = onSnapshot(dataQuery, (snapshot) => {
          let loadedData = [];
          snapshot.docChanges().forEach((change) => {
            if (change.type === 'added' || change.type === 'modified') {
              const dataWithId = { id: change.doc.id, ...change.doc.data() };
              loadedData.push(dataWithId);
            }
          });

          setgetOneTruck(loadedData);
        });
        
        // Clean up function to unsubscribe from the listener when the component unmounts
        return () => unsubscribe();


    }


    useEffect(() => {
      fetchData()
      if(itemKey){
          getOneItemF()
      }
    }, []); 
  
  const [dspMoreInfo , setDspMoreInfo] = React.useState(false)

  
  function toggleDspMoreInfo(){
    setDspMoreInfo(prev=>!prev)
  }

    const [contactDisplay, setContactDisplay] = React.useState({ ['']: false });
    const toggleContact = (itemId) => {
      setContactDisplay((prevState) => ({
        ...prevState,
        [itemId]: !prevState[itemId],
      }));
    };

  const [ truckDetails , setTruckDDsp]=React.useState(false)

  function togglrTruckDe(){
    setTruckDDsp(prev=>!prev) 
    setTruckBuzDDsp(false)
    setDriverDDsp(false)
  }



  const [ truckBuzDe , setTruckBuzDDsp]=React.useState(false)

  function togglrTruckBuzDe(){
    setTruckBuzDDsp(prev=>!prev)
    setDriverDDsp(false)
    setTruckDDsp(false)
  }

  const [driverDetails , setDriverDDsp]=React.useState(false)

  function togglrDriverDe(){
     setTruckBuzDDsp(false)
    setTruckDDsp(false)
    setDriverDDsp(prev=>!prev)
  }


    
   const [spinnerItem, setSpinnerItem] = React.useState(false);
  const [ changeRouteDsp , setChnageRouteDsp]= React.useState({ ['']: false })
  function changeRuteDsp(itemId){
           setChnageRouteDsp((prevState) => ({
        ...prevState,
        [itemId]: !prevState[itemId],
      }));
  }
  const [newFromLocation , setNewFromLoc]= React.useState("")
  const [newToLocation , setNewToLoc]= React.useState("")

       async function handleUpdateRoutes(id){
        setSpinnerItem(true)
          const docRef = doc(db, 'Trucks', id);
          await updateDoc(docRef, { fromLocation : newFromLocation ,toLocation:newToLocation  });
          setChnageRouteDsp(false)
        setSpinnerItem(false)
          alert("New Route Updated")
        }

    const toggleTruckAvailability = async ( id ,decision ) => {
      try {
        if (decision === "avaialble") {
          const docRef = doc(db, 'Trucks', id);
          await updateDoc(docRef, { tAvailability : true ,  });
          alert("Truck now looking for load");
        }else{
          const docRef = doc(db, `Trucks`, id);
          await updateDoc(docRef, { tAvailability : false ,  });
          alert("Truck No longer available");
        }
      } catch (err) {
        console.error(err);
      }
  }


    const deleteItem = async (id , imageUrl) => {

        setSpinnerItem(true)
    try {
        const response = await fetch(imageUrl, {
            method: 'DELETE',
        });

        if (response.ok) {
            const loadsDocRef = doc(db, 'Trucks', id);
            deleteDoc(loadsDocRef);
            console.log('Document deleted successfully');
        } else {
            console.log('Error deleting image:', response.status);
            const loadsDocRef = doc(db, 'Trucks', id);
            deleteDoc(loadsDocRef);
        }
    } catch (error) {
        console.log('Error deleting image:', error);
    } finally {
            const loadsDocRef = doc(db, 'Trucks', id);
            deleteDoc(loadsDocRef);
        console.log("Delleeeeeeeee")
    }
        setSpinnerItem(false)
    }

     const checkAndDeleteExpiredItems = () => {
       allTrucks.forEach((item) => {
        
  if (item.withDetails && !item.isVerified ) {
  if (item.deletionTime === undefined) {
    deleteItem(item.id, item.imageUrl);
  } else {
    const deletionTime = item.deletionTime;
    const timeRemaining = deletionTime - Date.now();
    
    if (timeRemaining <= 0) {
      deleteItem(item.id, item.imageUrl);
    } else {
      setTimeout(() => {
        deleteItem(item.id);
      }, timeRemaining); 
    }
  }
}

  });
};
setTimeout(() => {
  checkAndDeleteExpiredItems();
}, 1000);


let mapThis = [...getOneTruck , ...allTrucks]
  const rendereIterms = mapThis.map((item)=>{

      const message =  `${item.companyName}
        Is this truck available
        ${item.truckType} from ${item.fromLocation} to ${item.toLocation}
        Trailer config ${item.trailerType}
        ${item.withDetails ? "It have detais":"It does not have details"}

        From:  https://transix.net/selectedUserLoads/${item.userId}/${item.companyName}/${item.deletionTime}/whatsApp `  // Set your desired message here
  
    let contactMe = ( <View style={{ paddingLeft: 30 }}>

           {auth.currentUser&& <TouchableOpacity   style={{height : 30 ,  flexDirection:'row', alignItems :'center',color : "#008080" , borderWidth:1 , borderColor :'#008080', justifyContent:'center', marginBottom : 5 , marginTop:6}} >
            <Text style={{color:"#008080"}} >Message now</Text>
            <ChatIcon/>

          </TouchableOpacity>}

            <TouchableOpacity onPress={() => Linking.openURL(`whatsapp://send?phone=${item.contact}&text=${encodeURIComponent(message)}`)} style={{height : 30 ,  flexDirection:'row', alignItems :'center',color : "#25D366" , borderWidth:1 , borderColor :'#25D366', justifyContent:'center', marginBottom:6}} >
            <Text style={{color : "#25D366"}} >WhatsApp </Text> 
              <WhatsApp/>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => Linking.openURL(`tel:${item.contact}`)} style={{height : 30 ,  flexDirection:'row', alignItems :'center',color : "#0074D9" , borderWidth:1 , borderColor :'#0074D9', justifyContent:'center', marginBottom:4}} >
            <Text style={{color:'#0074D9'}} >Phone call</Text>
                <CallIcon/>
          </TouchableOpacity>

          </View>)
    return(
         <View style={{padding :7, borderWidth : 2 , borderColor:'black', borderRadius:8 ,  shadowColor: '#6a0c0c',
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.7,
        shadowRadius: 5,backgroundColor:'rgba(235, 142, 81, 0.07)' , marginBottom : 15}} >

      { item.isVerified&& <View style={{position : 'absolute' , top : 0 , right : 0 , backgroundColor : 'white' , zIndex : 66}} >
            <VerifiedIcon style={{color : 'green'}} />
      </View>}

         {item.imageUrl&& <Image source={{uri: item.imageUrl }} style={{ height : 250 , borderRadius: 10}} />}
          {!item.imageUrl && <Image source={defaultImage} style={{ height: 280, borderRadius: 10 , }} />}
         
      <Text style={{marginLeft : 60 , fontWeight : 'bold', fontSize : 20}} >{item.CompanyName} </Text>
      { item.fromLocation && <View style={{flexDirection :'row',width:245}} >
        <Text style={{width :100}} >Route</Text>
        <Text style={{textOverflow:'ellipsis' }} >:  from  {item.fromLocation}  to  {item.toLocation} </Text>
      </View>}
     { <View>


       {!contactDisplay[item.id] && <View>

     {!blockVerifiedU &&!blackLWarning &&<View style={{flexDirection :'row'}} >
        <Text style={{width :100}} >Contact</Text>
        <Text>:  {item.contact}</Text>
      </View>}

          {item.truckTonnage && <View style={{flexDirection :'row'}} >
              <Text style={{width :100}} >Truck Ton</Text>
              <Text>:  {item.truckTonnage}</Text>
            </View>}
          { item.truckType && <View style={{flexDirection :'row'}} >
              <Text style={{width :100}} >Trailer Type</Text>
              <Text>:  {item.truckType}</Text>
            </View>}


          {item.trailerType && <View style={{flexDirection :'row'}} >
              <Text style={{width :100}} >Trailer Config</Text>
              <Text>:  {item.trailerType}</Text>
            </View>}
    { dspMoreInfo && item.additionalInfo &&  <View style={{flexDirection :'row',width:245}} >
        <Text style={{width :100}} > Additional Info</Text>
        <Text style={{textOverflow:'ellipsis' }} >:  {item.additionalInfo}</Text>
      </View>}
        </View>}

        {contactDisplay[item.id] && contactMe}


         <TouchableOpacity onPress={()=>toggleDspMoreInfo(item.id) } >
          <Text style={{color :'green'}} >{  dspMoreInfo[item.id]  ?"See Less": "See More"} </Text>
        </TouchableOpacity>


         {loadIsVerified && <TouchableOpacity onPress={togglrTruckDe} style={styles.buttonSelectStyle} >
            <Text style={{color:'white'}} >Truck Details </Text>
          </TouchableOpacity>}
          {truckDetails &&<View> 

          <View style={{flexDirection :'row'}} >
              <Text style={{width :60}} >Horse Reg </Text>
              <Text>:  {item.horseReg}</Text>

            </View>


          <View style={{flexDirection :'row'}} >
              <Text style={{width :60}} >Trailer Reg 1</Text>
              <Text>:  {item.trailerReg}</Text>
            </View>

          <View style={{flexDirection :'row'}} >
              <Text style={{width :60}} >Trailer Reg 2</Text>
              <Text>:  {item.scndTrailerReg}</Text>
            </View>
            </View>}

           {loadIsVerified && <TouchableOpacity onPress={togglrDriverDe} style={styles.buttonStyle} >
              <Text>Driver Details</Text>
            </TouchableOpacity>}
          {driverDetails &&<View>


     <View style={{flexDirection :'row'}} >
        <Text style={{width :60}} >Driver Name</Text>
        <Text>:  {item.driverName}</Text>
      </View>

     <View style={{flexDirection :'row'}} >
        <Text style={{width :60}} >Driver License</Text>
        <Text>:  {item.driverLicense} </Text>
      </View>


     <View style={{flexDirection :'row'}} >
        <Text style={{width :60}} >Driver pasport</Text>
        <Text>: {item.driverPassport}</Text>
      </View>
     <View style={{flexDirection :'row'}} >
        <Text style={{width :60}} >Driver Phone</Text>
        <Text>:  {item.driverPhone}</Text>
      </View>
        </View>}

           {loadIsVerified && <TouchableOpacity onPress={togglrTruckBuzDe} style ={styles.buttonSelectStyle} >
              <Text style={{color:'white',fontSize :17}} >business Details</Text>
            </TouchableOpacity>}
           {truckBuzDe && <View>
              
     <View style={{flexDirection :'row'}} >
        <Text style={{width :60}} >Owner Phone Number</Text>
        <Text>:  {item.truckOwnerPhone}</Text>
      </View>
     <View style={{flexDirection :'row'}} >
        <Text style={{width :60}} >Owner WhatsApp</Text>
        <Text>:  {item.truckOwnerWhatsApp}</Text>
      </View>
     <View style={{flexDirection :'row'}} >
        <Text style={{width :60}} >Business Location</Text>
        <Text>:  {item.businessLoction}</Text>
      </View>
         </View>}
         
      </View>}

      
{auth.currentUser && auth.currentUser.uid === userId &&<View>


            {changeRouteDsp[item.id] &&<View style={{alignSelf:'center', marginTop:7,marginBottom:7}}>

                  <Text>New From Location  </Text>

               <TextInput
                     placeholder="From Location"
                     type="text"
                     value={newFromLocation}
                     onChangeText={(text) => setNewFromLoc(text)}
                     style={inputstyles.inputElem}            
                  />
              {spinnerItem &&<ActivityIndicator size="small" />}
                  <Text>New To Location</Text>
               <TextInput
                     placeholder="To Location"
                     type="text"
                     value={newToLocation}
                     onChangeText={(text) => setNewToLoc(text)}
                     style={inputstyles.inputElem}            
                  />

        <View style={{flexDirection : 'row', paddingTop : 10 , justifyContent : 'space-evenly'}}>
          <TouchableOpacity style={styles.cancelBtn}onPress={()=>(false)} >
            <Text>cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={()=> handleUpdateRoutes(item.id) } style={styles.saveBtn}>
            <Text style={{color : 'white'}}>Save</Text>
          </TouchableOpacity>
            
        </View>
               </View>}




 {!changeRouteDsp[item.id] &&<View style={{justifyContent:'space-between' , flexDirection :'row',padding:6,paddingLeft:15}} >

          {spinnerItem&&<Text> Deleting Truck  </Text>}
          {!item.tAvailability&& <TouchableOpacity onPress={()=>toggleTruckAvailability(item.id , "avaialble") } style={{backgroundColor:'#3CB371', flexDirection :'row' , height : 30 , borderRadius:10, width : 155 ,justifyContent:'space-around',alignItems:'center'}}>
            <Text style={{color:"white"}} >Truck Available</Text>
          </TouchableOpacity>}
         {item.tAvailability&&  <TouchableOpacity onPress={()=>toggleTruckAvailability(item.id , "nAvailable") } style={{backgroundColor:'#DC143C', flexDirection :'row' , height : 30 , borderRadius:10, width : 155 ,justifyContent:'space-around',alignItems:'center'}}>
            <Text style={{color:'white'}} >Not Available</Text>
          </TouchableOpacity>}

        {!spinnerItem&& <TouchableOpacity onPress={()=>deleteItem(item.id , item.imageUrl)}  style={{backgroundColor:'#CE2029' , flexDirection :'row' , height : 30 , borderRadius:10, width : 86 ,justifyContent:'space-around',alignItems:'center'}} >
            <Text style={{color:'white',fontSize:17}} >Delete</Text>
            <DeleteIcon size={24} color="red" />
          </TouchableOpacity>}
        </View>}

</View>}



  {<TouchableOpacity onPress={()=>changeRuteDsp(item.id)} style={{  width : 150 ,alignSelf:'center',  height : 30 , alignItems :"center" , justifyContent :'center', backgroundColor:'#6a0c0c' ,  borderRadius: 8, margin:5 }}>
    <Text style={{color:'white'}} >Change truck route</Text>
  </TouchableOpacity>}

{auth.currentUser&& auth.currentUser.uid !== userId ? !blockVerifiedU &&!blackLWarning &&<TouchableOpacity  onPress={()=>toggleContact(item.id) } style={{  width : 150 , height : 30 , alignItems :"center" , justifyContent :'center', backgroundColor:'#228B22' ,  borderRadius: 8, alignSelf:'center', margin:5 }} >
   <Text style={{color:"white"}} > Get In Touch Now</Text>
 </TouchableOpacity>:null}


        </View>       )
      })
      
return(
  <View>
          
        <View  style={{flexDirection : 'row' , height : 84  ,  paddingLeft : 6 , paddingRight: 15 , paddingTop:10 ,backgroundColor : '#6a0c0c' ,paddingTop : 15 , alignItems : 'center'}} >
        <TouchableOpacity style={{marginRight: 10}} onPress={() => navigate(-1)}>
            <ArrowBackIcon  size={28} color="white"style={{ marginLeft: 10 }}  />
        </TouchableOpacity>
      <Text style={{fontSize: 20 , color : 'white'}} > {CompanyNameG}  </Text>
       </View> 
        {!dspLoadMoreBtn &&allTrucks.length <= 0 && <Text style={{fontSize:19 ,fontWeight:'bold'}} >NO Trucks Available </Text> }
        <ScrollView>

           <div className="Main-grid">

                 {allTrucks.length > 0 ? rendereIterms   : <Text>Trucks Loading...</Text>}
           </div>


         {allTrucks.length>=12 && dspLoadMoreBtn&& <TouchableOpacity onPress={()=> fetchData(true) } style={{ height :45 , backgroundColor :'#228B22', margin :25 , justifyContent:'center',borderRadius:25}} >
            {LoadMoreData && allTrucks.length>0 && <Text style={{alignSelf:'center'}} >Loading More Loads....... </Text> } 
        <Text style={{color :'white', fontSize :21 , textAlign :'center'}} >Load More......</Text>
      </TouchableOpacity>}

         <View style={{height : 1000}} >
           </View>
        </ScrollView> 
        </View>
)
}
export default React.memo(SelectedUserTrucks) 

const styles = StyleSheet.create({
    buttonStyle : {
        height : 35,
        justifyContent : 'center' , 
        alignItems : 'center' ,
        width : 150 ,
        marginTop: 10 ,
        borderWidth: 2 ,
        borderColor:"#6a0c0c" ,
        borderRadius: 10
    } ,
    buttonSelectStyle :{
        backgroundColor :"#6a0c0c",
        height : 35,
        justifyContent : 'center' , 
        alignItems : 'center' ,
        width : 150 ,
        marginTop: 10 ,
        borderRadius: 10

    },
   saveBtn : {
   backgroundColor : '#6a0c0c' , 
   width : 70 ,
   height : 35 ,
   borderRadius: 5 , 
   alignItems : 'center' ,
   justifyContent : 'center'
  } ,
  cancelBtn : { 
   width : 70 ,
   height : 35 ,
   borderRadius: 5 , 
   alignItems : 'center' ,
   justifyContent : 'center',
   borderWidth : 1 ,
   borderColor : '#6a0c0c'
  }
});


