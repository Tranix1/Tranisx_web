import React, { useEffect, useState } from 'react';
import { db , auth} from '../config/fireBase';
import { View , Text , Image , ScrollView ,TouchableOpacity,Linking} from 'react-native';
import {onSnapshot ,  query ,collection,where ,} from "firebase/firestore"

import { useParams , useNavigate } from 'react-router-dom';
// import MaterialIcons from '@expo/vector-icons/MaterialIcons';
function SelectedUserTrucks ({route , navigation } ){ 
  
    const {userId} = useParams()
  const [allTrucks, setAllTrucks] = useState([]);

const navigate = useNavigate()

  useEffect(() => {
    try {
        const dataQuery = query(collection(db, "Trucks"), where("userId" ,"==", userId));

        const unsubscribe = onSnapshot(dataQuery, (snapshot) => {
          const loadedData = [];
          snapshot.docChanges().forEach((change) => {
            if (change.type === 'added' || change.type === 'modified') {
              const dataWithId = { id: change.doc.id, ...change.doc.data() };
              loadedData.push(dataWithId);
            }
          });

          setAllTrucks(loadedData);
        });
        
        // Clean up function to unsubscribe from the listener when the component unmounts
        return () => unsubscribe();
    } catch (err) {
      console.error(err);
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
         {/* <MaterialIcons name="verified" size={26} color="green" /> */}
      </View>}
      
          {item.imageUrl &&<img src={item.imageUrl} style={{height : 250 , borderRadius : 10}}/>}
        {!item.imageUrl &&<Image source={{uri: item.imageUrl }} style={{flex : 1 , height : 250}} /> }
        
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
          <Text>See more </Text>
        </TouchableOpacity>
        {contactDisplay[item.id] && contactMe}

        <TouchableOpacity  onPress={()=>toggleContact(item.id) } style={{marginTop : 7 , marginBottom :10}} >
          <Text style={{textDecorationLine:'underline'}} > get In Touch now</Text>
        </TouchableOpacity>

    </View>
        )
      })
  
 
        let comapnyName = null;
return(
  <View>
     { allTrucks.map((item)=>{
          const companyName = item.companyName;
          const showUserName = comapnyName !== companyName;
          comapnyName = companyName;
      return(     
        showUserName&&<View  style={{flexDirection : 'row' , height : 84  ,  paddingLeft : 6 , paddingRight: 15 , paddingTop:10 ,backgroundColor : '#6a0c0c' ,paddingTop : 15 , alignItems : 'center'}} >
        <TouchableOpacity style={{marginRight: 10}} onPress={() => navigation.goBack()}>
            {/* <Ionicons name="arrow-back" size={28} color="white"style={{ marginLeft: 10 }}  /> */}
        </TouchableOpacity>
      <Text style={{fontSize: 20 , color : 'white'}} > {item.companyName} Trucks</Text>
       </View> )})
       }
        <ScrollView>
      <div className="Main-grid">
         {allTrucks.length > 0 ? rendereIterms   : <Text>Loading...</Text>}
         <View style={{height : 550}} >
           </View>
           </div>
        </ScrollView> 
        </View>
)
}
export default React.memo(SelectedUserTrucks) 

