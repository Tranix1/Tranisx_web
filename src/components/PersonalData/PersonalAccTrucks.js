import React,{useEffect} from "react";
import { View ,Text,Image , ScrollView , TouchableOpacity} from "react-native";
import { auth, db } from '../config/fireBase'; 
import { collection, onSnapshot,where ,query , doc , deleteDoc} from 'firebase/firestore';
 
function PersonalAccTrucks(){

//     const deleteLoad = async (id) => {
//     const loadsDocRef = doc(db, 'Loads' , id);
//     await deleteDoc(loadsDocRef);
//     } 
//     const imageUrl = 'https://firebasestorage.googleapis.com/v0/b/{YOUR_STORAGE_BUCKET}/o/{IMAGE_PATH}';

// fetch(imageUrl, {
//   method: 'DELETE',
// })
//   .then(response => {
//     if (response.ok) {
//       console.log('Image deleted successfully');
//     } else {
//       console.error('Error deleting image:', response.status);
//     }
//   })
//   .catch(error => {
//     console.error('Error deleting image:', error);
//   });

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

      const rendereIterms = loadIterms.map((item)=>{
    return(
    <View style={{padding: 8}} >
    <Image source={{uri: `${item.imageUrl}`}} style={{flex : 1, height: 230}} />
    <Text className="truck-name">{item.CompanyName} </Text>
      <Text className="location"> From {item.fromLocation} to {item.toLocation} </Text>
      <Text>contact {item.contact}</Text>

      {/* <TouchableOpacity onPress={()=>deleteLoad(item.id)} >


          {/* <AntDesign name="delete" size={24} color="black" /> */}



        {/* </TouchableOpacity> */} 
    </View>
    )
  })
  return(
    <ScrollView>
        {rendereIterms}
    </ScrollView>
  )
}
export default PersonalAccTrucks