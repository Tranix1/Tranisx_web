import React, { useEffect, useState} from 'react';
import { collection, onSnapshot ,query } from 'firebase/firestore';
import { View , Text , ScrollView , TouchableOpacity} from 'react-native';
import { db } from '../config/fireBase';

import {  useNavigate} from 'react-router-dom';
// import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import VerifiedIcon from '@mui/icons-material/Verified';

const MiniLoad = () => {

  const navigate = useNavigate();

  const mainLoadsCollection = collection(db, 'Loads');
  const [mainLoadsList, setMainLoadsList] = useState([]);

   useEffect(() => {
    const unsubscribe = onSnapshot(mainLoadsCollection, (querySnapshot) => {
      const userIds = new Set(); // To keep track of unique user IDs
      let filteredData = [];

      querySnapshot.forEach((doc) => {
        const userId = doc.data().userId;

        if (!userIds.has(userId)) {
          const item = {
            id: doc.id,
            ...doc.data()
          };

          filteredData.push(item);
          userIds.add(userId);
        }
      });
      filteredData = filteredData.sort((a, b) => b.timeStamp - a.timeStamp);
      setMainLoadsList(filteredData);
    });

    return () => {
      unsubscribe(); // Unsubscribe the listener when the component unmounts
    };
  }, []); // Empty dependency array to run this effect only once on mount

const rendereIterms = mainLoadsList.map((item)=>{
  return( <TouchableOpacity style={{borderWidth : 2 , borderColor : "rgb(129,201,149)" , width : 230 , marginRight :16}} 
  onPress={()=> navigate(`/selectedUserLoads/${item.userId}`) } >

      { item.isVerified&& <View style={{position : 'absolute' , top : 0 , right : 0 , backgroundColor : 'white' , zIndex : 66}} >
            <VerifiedIcon style={{color : 'green'}} />
      </View>}

      <View className='miniloadH3Div' key={item.id} style={{backgroundColor : 'rgb(129,201,149)' ,  }} >
         <Text style={{color : 'white' , textAlign : 'center' , fontSize : 16}} > {item.companyName} </Text>
      </View  >

      <View style={{padding : 8}} >
          <Text>
          Commodity: {item.typeofLoad}
          </Text>

        <Text>
        Route From : {item.fromLocation} to : {item.toLocation}
        </Text>
      <Text>
      Rate : {item.ratePerTonne}
      </Text>
    </View>
    </TouchableOpacity>

  )
})
 
  return (
    <ScrollView style={{margin:10 , height : 110}} horizontal  showsHorizontalScrollIndicator={false}>
      {mainLoadsList.length > 0 ? rendereIterms   : <Text>Loading...</Text>}

    </ScrollView>
  );
};

export default MiniLoad;