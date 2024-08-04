import React,{useEffect} from "react";
import { View ,Text,Image, TouchableOpacity,ScrollView } from "react-native";
import { auth, db } from '../config/fireBase'; 
import { collection, onSnapshot,where ,query , doc , deleteDoc} from 'firebase/firestore';
// import AntDesign from '@expo/vector-icons/AntDesign';


function PersonalAccLoads(){

    const deleteLoad = async (id) => {
    const loadsDocRef = doc(db, 'Loads' , id);
    await deleteDoc(loadsDocRef);
  };

 const [loadIterms , setLoadedIterms ]= React.useState([])
  useEffect(() => {
    try {
      if (auth.currentUser) {
        const userId = auth.currentUser.uid;
        const dataQuery = query(collection(db, "Trucks"), where("userId", "==", userId));

        const unsubscribe = onSnapshot(dataQuery, (snapshot) => {
          const loadedData = [];
          snapshot.docChanges().forEach((change) => {
            if (change.type === 'added' || change.type === 'modified') {
              const dataWithId = { id: change.doc.id, ...change.doc.data() };
              loadedData.push(dataWithId);
            }
          });

          setLoadedIterms(loadedData);
        });
        
        // Clean up function to unsubscribe from the listener when the component unmounts
        return () => unsubscribe();
      }
    } catch (err) {
      console.error(err);
    }
  }, []); 


   const rendereIterms =  loadIterms.map((item)=>{ 
  return(
    <View  >
        <Text>Company {item.companyName} </Text>
        <Text>Contact : {item.contact}</Text>
        <Text>type of load {item.typeofLoad} </Text>
        <Text>from {item.fromLocation} to {item.toLocation} </Text>
        <Text>Rate {item.ratePerTonne} </Text>
        <Text> payment terms {item.paymentTerms} </Text>
        <Text>Requirements {item.requirements} </Text>
        <Text>additional info {item.additionalInfo} </Text>        

            <TouchableOpacity onPress={()=>deleteLoad(item.id)} >
              {/* <AntDesign name="delete" size={24} color="red" />    */}
            </TouchableOpacity>
      </View>     
  )})

  return(
    <ScrollView>
        {rendereIterms}
    </ScrollView>
  )
}
export default React.memo(PersonalAccLoads)