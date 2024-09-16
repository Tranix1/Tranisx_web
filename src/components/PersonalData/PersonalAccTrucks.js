import React,{useEffect} from "react";
import { View ,Text,Image , ScrollView , TouchableOpacity , ActivityIndicator} from "react-native";
import { auth, db } from '../config/fireBase'; 
import { collection, onSnapshot,where ,query , doc , deleteDoc} from 'firebase/firestore';
 
import {useNavigate} from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
function PersonalAccTrucks(){
const navigate = useNavigate()

    const [spinnerItem, setSpinnerItem] = React.useState(false);
    const deleteLoad = async (id) => {

      setSpinnerItem(true)
    const loadsDocRef = doc(db, 'Trucks' , id);
    await deleteDoc(loadsDocRef);
      setSpinnerItem(false)
  };

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
          {item.imageUrl &&<img src={item.imageUrl} style={{height : 200 , borderRadius : 10}}/>}
    <Text className="truck-name">{item.CompanyName} </Text>
      <Text className="location"> From {item.fromLocation} to {item.toLocation} </Text>
      <Text>contact {item.contact}</Text>

      { spinnerItem &&<ActivityIndicator size={36} />}
       <TouchableOpacity onPress={()=>deleteLoad(item.id)} >
              <DeleteIcon style={{color : 'red'} }/>
          {/* <AntDesign name="delete" size={24} color="black" /> */}

        </TouchableOpacity> 
    </View>
    )
  })
  return(
  <View style={{paddingTop : 80}} > 
       <View style={{position:'absolute' , top : 0 , left: 0 , right : 0 , flexDirection : 'row' , height : 74  ,  paddingLeft : 6 , paddingRight: 15 , paddingTop:10 ,backgroundColor : '#6a0c0c' ,paddingTop : 15 , alignItems : 'center' , }} >
         <TouchableOpacity style={{marginRight: 10}} onPress={() => navigate(-1)}>
           <ArrowBackIcon style={{color : 'white'}} />
        </TouchableOpacity> 
        <Text style={{fontSize: 20 , color : 'white'}} > Manage Trucks </Text>
       </View>
    <ScrollView>
      
      <div className="Main-grid">
        {loadIterms.length > 0 ? rendereIterms: <Text>Loading...... </Text> }
      </div>
    </ScrollView> 
    </View>
  )
}
export default React.memo(PersonalAccTrucks)