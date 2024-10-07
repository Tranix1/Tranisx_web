import React from "react";
import {View , TouchableOpacity , Text , StyleSheet , ScrollView , TextInput  } from "react-native"
import {auth , db} from "../config/fireBase"
import {doc , onSnapshot, updateDoc } from "firebase/firestore"
import DspSoldIterms from "./DspSoldIterms";
import ShopHeader from "./ShopHeader";
import inputstyles from "../styles/inputElement";

import { useNavigate , useParams} from "react-router-dom";
function DspShopIterms({spechopLoc}){

  const navigate = useNavigate()
  const {location} = useParams()

  const [diplayEnterShopLoc , setEnterSHopLoc]=React.useState(false)
  
  const [currentUser, setCurrentUser] = React.useState("");

  React.useEffect(() => {
    // Check if user is already signed in
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    // Cleanup function
    return () => unsubscribe();
  }, [currentUser]);

   const [ username , setUsername] = React.useState("");
   const [ contact , setContact] = React.useState('');

       React.useEffect(() => {
  let unsubscribe;  

  try {
    if (auth.currentUser) {
      const userId = auth.currentUser.uid;
      const docRef = doc(db, 'personalData', userId);

      unsubscribe = onSnapshot(docRef, (doc) => {
        if (doc.exists()) {
          setUsername(doc.data().username);
          setContact(doc.data().contact);
        }
      });
    }
  } catch (err) {
    console.error(err);
  }

  return () => {
    if (unsubscribe) {
      unsubscribe();
    }
  };
}, [currentUser]);

  function checkAuth(){
    if(!currentUser){
      navigate("/createUser/")
    }else if(currentUser &&!username){
      navigate("/addPersnoalInfo/")
    }else {

   if(!spechopLoc){
      setEnterSHopLoc(true)
   }else{
       navigate(`/selectAddShop/${location}/`) 
   }
    }
  }


  const [ newShopAdress , setNewShopAdress ] = React.useState('')
  const [ newDeliverR , setNewDeliveryR] = React.useState('')

    const handleUpdateShopAddress = async () => {
      try {
        if (auth.currentUser) {
          const userId = auth.currentUser.uid;

          const docRef = doc(db, 'personalData', userId);
          await updateDoc(docRef, { shopLocation: newShopAdress, deliveryRange : newDeliverR });
          setNewShopAdress("")
          setNewDeliveryR("")
          setEnterSHopLoc(false)
        }
      } catch (err) {
        console.error(err);
      }
    };


return(
    <View> 
        <ShopHeader/>

               {diplayEnterShopLoc && <View style={{position:'absolute' , alignSelf:'center' , backgroundColor:'white' , top : 160 ,  zIndex:500}} >

                  <Text> Specify Adress of Shop In {location} </Text>

               <TextInput
                     placeholder="Shop Location "
                     type="text"
                     value={newShopAdress}
                     onChangeText={(text) => setNewShopAdress(text)}
                     style={inputstyles.inputElem}            
                  />

                  <Text>Do you deliver and for what range </Text>
               <TextInput
                     placeholder="Delivery Range"
                     type="text"
                     value={newDeliverR}
                     onChangeText={(text) => setNewDeliveryR(text)}
                     style={inputstyles.inputElem}            
                  />

        <View style={{flexDirection : 'row', paddingTop : 10 , justifyContent : 'space-evenly'}}>
          <TouchableOpacity style={styles.cancelBtn}onPress={()=>setEnterSHopLoc(false)} >
            <Text>cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={handleUpdateShopAddress} style={styles.saveBtn}>
            <Text style={{color : 'white'}}>Save</Text>
          </TouchableOpacity>
            
        </View>
               </View>}
            {auth.currentUser ? <TouchableOpacity onPress={checkAuth}  style={{position :'absolute',top: 440 ,right:10 , width : 60 , height : 35 , alignItems :"center" , justifyContent :'center', backgroundColor:'#6a0c0c' , zIndex :200 , borderRadius: 8}} >
                <Text style={{color : 'white'}} >Add</Text>
             </TouchableOpacity>
            :
            
          <TouchableOpacity onPress={()=> navigate("/createUser/")} style={{position :'absolute',top: 440 ,right:10 ,  alignItems :"center" , justifyContent :'center', backgroundColor:'#6a0c0c' , zIndex :200 , borderRadius: 8}} >
            <Text  style={{color : 'white'}} > Sign  to add  </Text> 

          </TouchableOpacity>
            }


             <ScrollView style={{padding:10}}>
                <DspSoldIterms  />
             </ScrollView>

    </View>

)
}
export default React.memo(DspShopIterms)

const styles = StyleSheet.create({
   selectToEdit :{
      width : 300 ,
       height : 80 , 
       borderWidth: 1 , 
       borderColor:"#6a0c0c"  ,
       alignItems : 'center' ,
       justifyContent:'center' ,
       marginBottom : 20
   },
   saveBtn : {
   backgroundColor : '#6a0c0c' , 
   width : 70 ,
   height : 35 ,
   borderRadius: 5 , 
   alignItems : 'center' ,
   justifyContent : 'center'
  } ,
  cancelBtn : { 
   width : 70 ,
   height : 35 ,
   borderRadius: 5 , 
   alignItems : 'center' ,
   justifyContent : 'center',
   borderWidth : 1 ,
   borderColor : '#6a0c0c'
  }

});