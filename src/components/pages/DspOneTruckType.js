import React, { useEffect, useState } from 'react';
import { db , auth} from '../config/fireBase';
import { View , Text , Image , ScrollView , TouchableOpacity , Linking} from 'react-native';
import {onSnapshot ,  query ,collection,where } from "firebase/firestore"

// import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import defaultImage from '../images/logo.jpg'
import { useParams , useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VerifiedIcon from '@mui/icons-material/Verified';

import { WhatsApp  } from '@mui/icons-material';
import CallIcon from '@mui/icons-material/Call';
import ChatIcon from '@mui/icons-material/Chat';
function DspOneTruckType ({} ){ 

const navigate = useNavigate()
    const {truckType} = useParams()
  const [allTrucks, setAllTrucks] = useState([]);


  useEffect(() => {
    try {
        const dataQuery = query(collection(db, "Trucks"), where("truckType" ,"==", truckType));

        const unsubscribe = onSnapshot(dataQuery, (snapshot) => {
          const loadedData = [];
          snapshot.docChanges().forEach((change) => {
            if (change.type === 'added' || change.type === 'modified') {
              const dataWithId = { id: change.doc.id, ...change.doc.data() };
              loadedData.push(dataWithId);
            }
          });

                const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
      };
      const shuffledData = shuffleArray(loadedData);

      setAllTrucks(shuffledData);
        });
        
        // Clean up function to unsubscribe from the listener when the component unmounts
        return () => unsubscribe();
    } catch (err) {
      console.error(err);
    }
  }, []); 

  const [dspMoreInfo , setDspMoreInfo] = React.useState({ ['']: false })
  function toggleDspMoreInfo(itemId){
          setDspMoreInfo((prevState) => ({
        ...prevState,
        [itemId]: !prevState[itemId],
      }));
  }


    const [contactDisplay, setContactDisplay] = React.useState({ ['']: false });
    const toggleContact = (itemId) => {
      setContactDisplay((prevState) => ({
        ...prevState,
        [itemId]: !prevState[itemId],
      }));
    };
  const rendereIterms = allTrucks.map((item)=>{
        const message =  `${item.CompanyName} is this truck still available ${item.trailerType} from ${item.fromLocation} to ${item.toLocation} ` ; // Set your desired message here
    let contactMe = ( <View style={{ paddingLeft: 30 }}>
   <TouchableOpacity  onPress={()=>navigate(`/message/${item.userId}/${item.CompanyName} `)} style={{height : 30 ,  flexDirection:'row', alignItems :'center',color : "#008080" , borderWidth:1 , borderColor :'#008080', justifyContent:'center', marginBottom : 5 , marginTop:6}} >
            <Text style={{color:"#008080"}} >Message now</Text>
            <ChatIcon/>

          </TouchableOpacity>

            <TouchableOpacity onPress={() => Linking.openURL(`whatsapp://send?phone=${item.contact}&text=${encodeURIComponent(message)}`)} style={{height : 30 ,  flexDirection:'row', alignItems :'center',color : "#25D366" , borderWidth:1 , borderColor :'#25D366', justifyContent:'center', marginBottom:6}} >
            <Text style={{color : "#25D366"}} >WhatsApp </Text> 
            <WhatsApp  />  
          </TouchableOpacity>

          <TouchableOpacity onPress={() => Linking.openURL(`tel:${item.contact}`)} style={{height : 30 ,  flexDirection:'row', alignItems :'center',color : "#0074D9" , borderWidth:1 , borderColor :'#0074D9', justifyContent:'center', marginBottom:4}} >
            <Text style={{color:'#0074D9'}} >Phone call</Text>
            <CallIcon/>
          </TouchableOpacity>
      

          </View>)
    return(
      <View  key={item.id} style={{padding :7, borderWidth : 2 , borderColor:'black', borderRadius:8 ,  shadowColor: '#6a0c0c',
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.7,
        shadowRadius: 5,backgroundColor:'rgba(235, 142, 81, 0.07)' }} >

      { item.isVerified&& <View style={{position : 'absolute' , top : 0 , right : 0 , backgroundColor : 'white',zIndex : 66}} >

            <VerifiedIcon style={{color : 'green'}} />

      </View>}

          {item.imageUrl &&<img src={item.imageUrl} style={{height : 250 , borderRadius : 10}}/>}
          {!item.imageUrl && <img src={defaultImage}  style={{height : 250 , borderRadius : 10}}/>}
        
      <Text style={{marginLeft : 60 , fontWeight : 'bold', fontSize : 20}} >{item.CompanyName} </Text>
         { item.fromLocation && <View style={{flexDirection :'row'}} >
        <Text style={{width :100}} >Route</Text>
        <Text>:  from  {item.fromLocation}  to  {item.toLocation} </Text>
      </View>}


       {!contactDisplay[item.id] && <View>

     <View style={{flexDirection :'row'}} >
        <Text style={{width :100}} >Contact</Text>
        <Text>:  {item.contact}</Text>
      </View>

    {item.trailerType &&  <View style={{flexDirection :'row'}} >
        <Text style={{width :100}} >Trailer Type </Text>
        <Text>:  {item.trailerType}</Text>
      </View>}

    { dspMoreInfo[item.id]  && item.additionalInfo &&  <View style={{flexDirection :'row'}} >
        <Text style={{width :100}} > Additional Info</Text>
        <Text>:  {item.additionalInfo}</Text>
      </View>}
        </View>}

        {contactDisplay[item.id] && contactMe}
        {!contactDisplay[item.id] &&<TouchableOpacity onPress={()=>toggleDspMoreInfo(item.id) } >
          <Text style={{color:'green'}} > See more </Text>
        </TouchableOpacity>}
        <TouchableOpacity  onPress={()=>toggleContact(item.id) } style={{ width : 150 , height : 30 , alignItems :"center" , justifyContent :'center', backgroundColor:'#228B22' ,  borderRadius: 8, alignSelf:'center', margin:5 }} >
          <Text style={{ color:'white'}} > Get In Touch Now</Text>
        </TouchableOpacity>
    </View>
        )
      })
  
 
return(
  <View style={{paddingTop:80}} >
      <View style={{position:'absolute' , top : 0 , left: 0 , right : 0 , flexDirection : 'row' , height : 74  ,  paddingLeft : 6 , paddingRight: 15 , paddingTop:10 ,backgroundColor : '#6a0c0c' ,paddingTop : 15 , alignItems : 'center' , }} >
         <TouchableOpacity style={{marginRight: 10}} onPress={() => navigate(-1)}>
        
                    <ArrowBackIcon style={{color : 'white'}} />
        </TouchableOpacity> 
        <Text style={{fontSize: 20 , color : 'white'}} > {truckType} </Text>
       </View>
        <ScrollView>
      <div className="Main-grid">
         {allTrucks.length > 0 ? rendereIterms   : <Text>{truckType} Loading...</Text>}
         <View style={{height : 550}} >
           </View>
           </div>
        </ScrollView> 
        
        </View>
)
}
export default React.memo(DspOneTruckType) 

