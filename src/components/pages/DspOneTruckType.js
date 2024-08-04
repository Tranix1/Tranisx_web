import React, { useEffect, useState } from 'react';
import { db } from '../config/fireBase';
import { View , Text , Image , ScrollView } from 'react-native';
import {onSnapshot ,  query ,collection,where } from "firebase/firestore"

// import MaterialIcons from '@expo/vector-icons/MaterialIcons';

function DspOneTruckType ({route} ){ 

  const {truckType  } = route.params
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

          setAllTrucks(loadedData);
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


            {/* <MaterialIcons name="verified" size={24} color="green" /> */}



      </View>}

        {item.imageUrl&& <Image source={{uri: item.imageUrl }} style={{flex : 1 , height : 250}} />}
        {!item.imageUrl &&<Image source={{uri: item.imageUrl }} style={{flex : 1 , height : 250}} /> }
        
      <Text style={{marginLeft : 60 , fontWeight : 'bold', fontSize : 20}} >{item.CompanyName} </Text>
      {item.fromLocation && (  <Text > From {item.fromLocation} to {item.toLocation} </Text>) }

      { item.contact && ( <Text>contact {item.contact}</Text> )}

      { item.trailerType && ( <Text> trailer type {item.trailerType}  </Text> ) }

      {item.additionalInfo && (<Text> additional Info {item.additionalInfo} </Text>)}

    </View>
        )
      })
  
 
return(
  <View>
        <ScrollView>
         {allTrucks.length > 0 ? rendereIterms   : <Text>Loading...</Text>}
         <View style={{height : 550}} >
           </View>
        </ScrollView> 
        
        </View>
)
}
export default React.memo(DspOneTruckType) 

