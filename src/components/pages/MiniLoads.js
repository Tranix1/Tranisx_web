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

          const verifiedUsers = filteredData.filter(user => user.isVerified);
          const nonVerifiedUsers = filteredData.filter(user => !user.isVerified);
 const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
      };
  const shuffledDataUnV = shuffleArray(nonVerifiedUsers);

          filteredData = verifiedUsers.concat(shuffledDataUnV);

      setMainLoadsList(filteredData);
    });


    return () => {
      unsubscribe(); // Unsubscribe the listener when the component unmounts
    };
  }, []); // Empty dependency array to run this effect only once on mount





const rendereIterms = mainLoadsList.map((item)=>{
  return( <TouchableOpacity style={{borderWidth : 2  , width : 230 , marginRight :16}} 
  onPress={()=> navigate(`/selectedUserLoads/${item.userId}/${item.companyName}`) } >

      { item.isVerified&& <View style={{position : 'absolute' , top : 0 , right : 0 , backgroundColor : 'white' , zIndex : 66}} >
            <VerifiedIcon style={{color : 'green'}} />
      </View>}

      <View className='miniloadH3Div' key={item.id} style={{backgroundColor : '#228B22' ,  }} >
         <Text style={{color : 'white' , textAlign : 'center' , fontSize : 18}} > {item.companyName} </Text>
      </View  >

      <View style={{padding : 8}} >
          <View style={{flexDirection :'row'}} >
        <Text style={{width :75}} >Commodity</Text>
        <Text  >:  {item.typeofLoad} </Text>
      </View>

      <View style={{flexDirection :'row'}} >
        <Text style={{width :75}} >Route</Text>
        <Text>:  from  {item.fromLocation}  to  {item.toLocation} </Text>
      </View>

      {!item.linksRate && !item.triaxleRate && <View style={{flexDirection :'row'}} >
        <Text style={{width :34}} >Rate</Text>
        <Text>:  {item.currency ? "USD" : "RAND"} {item.ratePerTonne} {item.perTonne ? "Per tonne" :null} </Text>
      </View>}

        <View style={{flexDirection:'row'}} >
       {item.linksRate&&  <View style={{flexDirection :'row'}} >
        <Text style={{width :34}} >Link</Text>
        <Text>: {item.currency ? "USD" : "RAND"} {item.linksRate} {item.perTonne ? "Per tonne" :null} </Text>
      </View>}

       {item.triaxleRate&& <View style={{flexDirection :'row'}} >
        <Text style={{width :30}} >Triax</Text>
        <Text>: {item.currency ? "USD" : "RAND"} {item.triaxleRate} {item.perTonne ? "Per tonne" :null} </Text> 
      </View>}
        </View>

    </View>
    </TouchableOpacity>

  )
})
 
  return (
    <ScrollView style={{margin:10 , height : 110}} horizontal  showsHorizontalScrollIndicator={false} >
      {mainLoadsList.length > 0 ? rendereIterms   : <Text>Mini Loads Loading......</Text>}

    </ScrollView>
  );
};

export default MiniLoad;