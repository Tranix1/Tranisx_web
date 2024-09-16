import React, { useEffect, useState } from 'react';
import { db } from '../config/fireBase';
import { View , Text , Image , ScrollView , TouchableOpacity} from 'react-native';
import {onSnapshot ,  query ,collection,where } from "firebase/firestore"

// import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import defaultImage from '../images/logo.png'
import { useParams , useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VerifiedIcon from '@mui/icons-material/Verified';

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

  const rendereIterms = allTrucks.map((item)=>{
    return(
      <View  key={item.id}>

      { item.isVerified&& <View style={{position : 'absolute' , top : 0 , right : 0 , backgroundColor : 'white',zIndex : 66}} >

            <VerifiedIcon style={{color : 'green'}} />

      </View>}

          {item.imageUrl &&<img src={item.imageUrl} style={{height : 250 , borderRadius : 10}}/>}
          {!item.imageUrl && <img src={defaultImage}  style={{height : 250 , borderRadius : 10}}/>}
        
      <Text style={{marginLeft : 60 , fontWeight : 'bold', fontSize : 20}} >{item.CompanyName} </Text>
      {item.fromLocation && (  <Text > From {item.fromLocation} to {item.toLocation} </Text>) }

      { item.contact && ( <Text>contact {item.contact}</Text> )}

      { item.trailerType && ( <Text> trailer type {item.trailerType}  </Text> ) }

      {item.additionalInfo && (<Text> additional Info {item.additionalInfo} </Text>)}

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

