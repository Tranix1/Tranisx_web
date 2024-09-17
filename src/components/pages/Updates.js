import React,{useEffect} from "react";
import { View , Text , ScrollView , TouchableOpacity} from 'react-native';

import { db,  } from "../config/fireBase";
import {onSnapshot , orderBy , query , collection, } from "firebase/firestore"

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {useNavigate} from 'react-router-dom';
function Updates(){

const navigate = useNavigate()

  const updatesDB= collection(db, "updates");

  const [updates , setUpdates]=React.useState([])

  useEffect(() => {
    const unsubscribe = onSnapshot(updatesDB, (querySnapshot) => {
      const filteredData = [];

      querySnapshot.forEach((doc) => {
        filteredData.push({
          id: doc.id,
          ...doc.data()
        });
      });
      const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
      };
      const shuffledData = shuffleArray(filteredData);

      setUpdates(shuffledData);
    });

    return () => {
      unsubscribe(); // Unsubscribe the listener when the component unmounts
    };
  }, []); 

console.log(updates)
const rendereIterms = updates.map((item)=>{ 
return (

        <View>

            <View>

                <img/>
                <Text>Date </Text>
                <Text> {item.detailOfUpdate}</Text>
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