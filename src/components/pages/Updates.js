import React from "react";
import { View , Text , ScrollView , TouchableOpacity} from 'react-native';

import { db,  } from "../config/fireBase";
import {onSnapshot , orderBy , query , collection, } from "firebase/firestore"

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {useNavigate} from 'react-router-dom';
function Updates(){

const navigate = useNavigate()

  const mainGroupDB = collection(db, "updates");

  const [updates , setUpdates]=React.useState([])
React.useEffect(() => {
  try {
    const q = query(mainGroupDB, orderBy('timestamp'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messages = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setUpdates(messages);
    });

    return unsubscribe; // Return the unsubscribe function
  } catch (error) {
    console.error('Error fetching messages:', error);
  }


}, []);

const rendereIterms = updates.map((item)=>{ 
return (

        <View>

            <View>

                <img/>
                <Text>Date </Text>
                <Text> e developed a MOBILE APP NOW Link to download at  </Text>
                <Text> Time </Text>
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
export default React.memo(Updates)