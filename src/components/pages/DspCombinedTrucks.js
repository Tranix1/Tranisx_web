import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, } from 'firebase/firestore';
import { db , auth} from '../config/fireBase';
import { View , Text , Image , ScrollView , TouchableOpacity , Linking} from 'react-native';
import defaultImage from '../images/logo.png'

import VerifiedIcon from '@mui/icons-material/Verified';
// import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {useNavigate,useParams} from 'react-router-dom';
function DspAllTrucks(){      
const navigate = useNavigate()
  const trucksDB = collection(db , "Trucks")
  const [allTrucks, setAllTrucks] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(trucksDB, (querySnapshot) => {
      const filteredData = [];

      querySnapshot.forEach((doc) => {
        filteredData.push({
          id: doc.id,
          ...doc.data()
        });
      });
      const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
      };
      const shuffledData = shuffleArray(filteredData);

      setAllTrucks(shuffledData);
    });

    return () => {
      unsubscribe(); // Unsubscribe the listener when the component unmounts
    };
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

  const rendereIterms = allTrucks.map((item)=>{

    let contactMe = ( <View style={{ paddingLeft: 30 }}>

        {auth.currentUser &&   <TouchableOpacity  onPress={()=>navigate(`/message/${item.userId}/${item.CompanyName} `)}  >
            <Text>Message now</Text>
          </TouchableOpacity>}

          <TouchableOpacity onPress={() => Linking.openURL(`tel:${item.contact}`)}>
            <Text>Phone call</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => Linking.openURL(`whatsapp://send?phone=${item.contact}`)}>
            <Text>WhatsApp</Text>
          </TouchableOpacity>

          </View>)
    return(
      <View  key={item.id}>

      { item.isVerified&& <View style={{position : 'absolute' , top : 0 , right : 0 , backgroundColor : 'white' , zIndex : 66}} >
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

    { dspMoreInfo && item.additionalInfo &&  <View style={{flexDirection :'row'}} >
        <Text style={{width :100}} > Additional Info</Text>
        <Text>:  {item.additionalInfo}</Text>
      </View>}
        </View>}

        {contactDisplay[item.id] && contactMe}
        <TouchableOpacity onPress={toggleDspMoreInfo} >
          <Text style={{color:'green'}} >See more </Text>
        </TouchableOpacity>
        <TouchableOpacity  onPress={()=>toggleContact(item.id) } style={{marginTop : 7 , marginBottom :10}} >
          <Text style={{textDecorationLine:'underline'}} > get In Touch now</Text>
        </TouchableOpacity>


    </View>
        )
      })
  
 
return(
        <ScrollView style={{padding : 10 }}>
          <div className='Main-grid'>
         {allTrucks.length > 0 ? rendereIterms   : <Text>All Trucks Loading......</Text>}
         <View style={{height : 550}} >
           </View>
            </div>
        </ScrollView>
)
}
export default DspAllTrucks 
