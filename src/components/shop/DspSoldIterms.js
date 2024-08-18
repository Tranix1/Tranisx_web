import React, { useEffect, useState } from 'react';
import { db , auth} from '../config/fireBase';
import { View , Text , Image , ScrollView , TouchableOpacity , Linking} from 'react-native';
import {onSnapshot ,  query ,collection,where } from "firebase/firestore"

import {useNavigate,useParams} from 'react-router-dom';
import VerifiedIcon from '@mui/icons-material/Verified';

function DspSoldIterms(){
    const navigate = useNavigate()

  const {location, specproduct ,truckType } = useParams()

  const [allSoldIterms, setAllSoldIterms] = useState([]);


  useEffect(() => {
    try {

        const  dataQuery = query(collection(db, "Shop"), where("specproduct" ,"==",   specproduct) , where("location" ,"==", location) );
        
        const unsubscribe = onSnapshot(dataQuery, (snapshot) => {
          const loadedData = [];
          snapshot.docChanges().forEach((change) => {
            if (change.type === 'added' || change.type === 'modified') {
              const dataWithId = { id: change.doc.id, ...change.doc.data() };
              loadedData.push(dataWithId);
            }
          });

          setAllSoldIterms(loadedData);
        });
        
        // Clean up function to unsubscribe from the listener when the component unmounts
        return () => unsubscribe();
    } catch (err) {
      console.error(err);
    }
  }, [specproduct]); 


    
    const [contactDisplay, setContactDisplay] = React.useState({ ['']: false });
    const toggleContact = (itemId) => {
      setContactDisplay((prevState) => ({
        ...prevState,
        [itemId]: !prevState[itemId],
      }));
    };

  const rendereIterms = allSoldIterms.map((item)=>{

    let contactMe = ( <View style={{ paddingLeft: 30 }}>

          <TouchableOpacity  onPress={()=>navigate(`/message/${item.userId}/${item.CompanyName} `)}  >
            <Text>Message now</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => Linking.openURL(`tel:${item.contact}`)}>
            <Text>Phone call</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => Linking.openURL(`whatsapp://send?phone=${item.contact}`)}>
            <Text>WhatsApp</Text>
          </TouchableOpacity>

          </View>)
    return(
      <TouchableOpacity  key={item.id}  onPress={()=>navigate(`/OneFirmsShop/${item.userId}`)} style={{padding :7}}>

      { item.isVerified&& <View style={{position : 'absolute' , top : 0 , right : 0 , backgroundColor : 'white' , zIndex : 66}} >
            <VerifiedIcon style={{color : 'green'}} />
      </View>}
      
          {item.imageUrl &&<img src={item.imageUrl} style={{height : 200 , borderRadius : 10}}/>}
      <Text style={{marginLeft : 60 , fontWeight : 'bold', fontSize : 20 , color:"#6a0c0c" , textAlign:'center'}} >{item.CompanyName} </Text>
        {item.productName &&<Text>Product {item.productName} </Text> }
        {item.price &&<Text>Price :  {item.currency?"USD" : "Rand" }  {item.price} </Text> }
        {item.shopLocation &&<Text> Location : {item.shopLocation} </Text> }


       {!contactDisplay[item.id] && <View>
      { item.contact && ( <Text>contact {item.contact}</Text> )}
      {item.additionalInfo && (<Text> additional Info {item.additionalInfo} </Text>)}
        </View>}

        {contactDisplay[item.id] && contactMe}

        <TouchableOpacity  onPress={()=>toggleContact(item.id) } style={{marginTop : 7 , marginBottom :10}} >
          <Text style={{textDecorationLine:'underline'}} > get In Touch now</Text>
        </TouchableOpacity>


    </TouchableOpacity>
        )
      })


    return(
        <ScrollView >


      <div className="Main-grid">
        { allSoldIterms.length>0? rendereIterms: <Text>Loading.....</Text> }
        <View style={{height : 200}} ></View>
        </div>
        </ScrollView>
    )
}
export default React.memo(DspSoldIterms)