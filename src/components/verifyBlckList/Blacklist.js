import React,{useEffect} from "react";
import { View , Text , ScrollView , TouchableOpacity} from 'react-native';

import { auth, db,  } from "../config/fireBase";
import {onSnapshot , collection,  } from "firebase/firestore"

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {useNavigate} from 'react-router-dom';
function Blacklist(){

const navigate = useNavigate()


  const updatesDB= collection(db, "blacklist");

  const [updates , setUpdates]=React.useState([])

  useEffect(() => {
    const unsubscribe = onSnapshot(updatesDB, (querySnapshot) => {
      let filteredData = [];

      querySnapshot.forEach((doc) => {
        filteredData.push({
          id: doc.id,
          ...doc.data()
        });
      });
     
          filteredData = filteredData.sort((a, b) => b.timeStamp - a.timeStamp);

      setUpdates(filteredData);
    });

    return () => {
      unsubscribe(); // Unsubscribe the listener when the component unmounts
    };
  }, []); 

const rendereIterms = updates.map((item)=>{ 
return (

        <View>

            <View>
                <Text> {item.companyName}</Text>
                <Text> {item.teamNames}</Text>
                <Text> {item.location}</Text>
                <Text style={{fontSize:12 , fontStyle:'italic' , color:'green'}} >Date {item.currentDateTime} @ {item.currentTime}  </Text>
            </View>
        </View>
)
})

    return(
      <View style={{paddingTop:70}} > 
             <View  style={{position:'absolute' , top : 0 , left: 0 , right : 0 , flexDirection : 'row' , height : 74  ,  paddingLeft : 6 , paddingRight: 15 , paddingTop:10 ,backgroundColor : '#6a0c0c' ,paddingTop : 15 , alignItems : 'center' , }} >
         <TouchableOpacity style={{marginRight: 10}}  onPress={()=>navigate('/')}>
            {/* <Ionicons name="arrow-back" size={28} color="white"style={{ marginLeft: 10 }}  /> */}
                    <ArrowBackIcon style={{color : 'white'}} />

        </TouchableOpacity> 
        
        <Text style={{fontSize: 20 , color : 'white'}} > Latest Updates  </Text>
       </View>

           <ScrollView style={{padding : 10 }}>
          <div className='Main-grid'>
         {updates.length > 0 ? rendereIterms   : <Text>updates Loading.........</Text>}
         <View style={{height : 550}} >
           </View>
            </div>
        </ScrollView>
         </View>
    )

}
export default React.memo(Blacklist)