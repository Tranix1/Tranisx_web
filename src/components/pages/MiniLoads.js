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
  return( <TouchableOpacity style={{borderWidth : 2  , width : 280 , marginRight :16}} 
  onPress={()=> navigate(`/selectedUserLoads/${item.userId}/${item.companyName}`) } >

      { item.isVerified&& <View style={{position : 'absolute' , top : 0 , right : 0 , backgroundColor : 'white' , zIndex : 66}} >
            <VerifiedIcon style={{color : 'green'}} />
      </View>}
          <View className='miniloadH3Div' key={item.id} style={{backgroundColor : '#228B22' ,  }} >
         <Text style={{color : 'white' , textAlign : 'center' , fontSize : 18}} > {item.companyName} </Text>
      </View  >

              {<View style={{ flexDirection:'row',margin:4}} >

         {item.returnLoad &&  <View style={{backgroundColor :'#6a0c0c',paddingLeft :4 , paddingRight:4 , marginLeft :7}} >
          <Text style={{color :'white'}} >Return Load</Text>
          </View>}

         {item.roundTrip &&  <View style={{backgroundColor :'#6a0c0c',paddingLeft :4 , paddingRight:4 , marginLeft :7}} >
          <Text style={{color :'white'}} >Round Trip</Text>
          </View>}

         {item.fuelAvai &&  <View style={{backgroundColor :'#6a0c0c',paddingLeft :4 , paddingRight:4 , marginLeft :7}} >
          <Text style={{color :'white'}} >Fuel</Text>
          </View>}

      </View>}

      <View style={{padding : 8, paddingTop:0}} >
          <View style={{flexDirection :'row',color:"#6a0c0c"}} >
        <Text style={{width :75,color:'#6a0c0c'}} >Commodity</Text>
        <Text style={{color:'#6a0c0c'}} >:  {item.typeofLoad} </Text>
      </View>

      <View style={{flexDirection :'row'}} >
        <Text style={{width :75}} >From Route</Text>
        <Text>: {item.fromLocation} </Text>
      </View>

      <View style={{flexDirection :'row'}} >
        <Text style={{width :75}} >To Route</Text>
        <Text>:  {item.toLocation} </Text>
      </View>
     {item.ratePerTonne&& !item.links&& !item.triaxle&& <View style={{flexDirection :'row'}} >
        <Text style={{width :50,color:'green',fontWeight:'bold',fontSize:16}} >Rate</Text>
        <Text style={{color:'green',fontWeight:'bold',fontSize:16}} >:  {item.currency ? "USD" : "RAND"} {item.ratePerTonne} {item.perTonne ? "Per tonne" :null} </Text>
      </View>}
  <View  >

        {item.links&&  <View style={{flexDirection :'row'}} >
        <Text style={{width :50,color:'green',fontWeight:'bold',fontSize:14}} >Links</Text>
        <Text style={{color:'green',fontWeight:'bold',fontSize:14}} >:  {item.currency ? "USD" : "RAND"} {item.links} {item.perTonne ? "Per tonne" :null} </Text>
      </View>}

       {item.triaxle&& <View style={{flexDirection :'row'}} >
        <Text style={{width :50,color:'green',fontWeight:'bold',fontSize:14}} >Triaxle</Text>
        <Text style={{color:'green',fontWeight:'bold',fontSize:14}} >:  {item.currency ? "USD" : "RAND"} {item.triaxle} {item.perTonne ? "Per tonne" :null} </Text>
      </View>}

  </View>
    </View>
    </TouchableOpacity>

  )
})
 
  return (
    <ScrollView style={{margin:10 , height : 150}} horizontal  showsHorizontalScrollIndicator={false} >
      {mainLoadsList.length > 0 ? rendereIterms   : <Text>Mini Loads Loading......</Text>}

    </ScrollView>
  );
};

export default MiniLoad;