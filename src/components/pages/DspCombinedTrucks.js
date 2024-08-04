import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, } from 'firebase/firestore';
import { db } from '../config/fireBase';
import { View , Text , Image , ScrollView } from 'react-native';

// import MaterialIcons from '@expo/vector-icons/MaterialIcons';
function DspAllTrucks(){      
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

      setAllTrucks(filteredData);
    });

    return () => {
      unsubscribe(); // Unsubscribe the listener when the component unmounts
    };
  }, []);    

  const rendereIterms = allTrucks.map((item)=>{
    return(
      <View  key={item.id}>


        { item.isVerified&& <View style={{position : 'absolute' , top : 0 , right : 0 , backgroundColor : 'white',zIndex : 66}} >


              {/* <MaterialIcons name="verified" size={24} color="green" /> */}



        </View>}
        {/* {item.imageUrl&& <Image source={{uri: item.imageUrl }} style={{flex : 1 , height : 250}} />} */}
        {/* {!item.imageUrl &&<Image source={{uri: item.imageUrl }} style={{flex : 1 , height : 250}} /> } */}
        {item.imageUrl && <Image source={{ uri: item.imageUrl }}  />}

        
      <Text style={{marginLeft : 60 , fontWeight : 'bold', fontSize : 20}} >{item.CompanyName} </Text>
      {item.fromLocation && (  <Text > From {item.fromLocation} to {item.toLocation} </Text>) }

      { item.contact && ( <Text>contact {item.contact}</Text> )}

      { item.trailerType && ( <Text> trailer type {item.trailerType}  </Text> ) }

      {item.additionalInfo && (<Text> additional Info {item.additionalInfo} </Text>)}

    </View>
        )
      })
  
 
return(
        <ScrollView>
         {allTrucks.length > 0 ? rendereIterms   : <Text>Loading...</Text>}
         <View style={{height : 550}} >
           </View>
        </ScrollView>
)
}
export default DspAllTrucks 
