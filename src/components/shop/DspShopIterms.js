import React from "react";
import {View , TouchableOpacity , Text , StyleSheet , ScrollView , TextInput  } from "react-native"
import {  doc , updateDoc} from "firebase/firestore"
import {auth , db} from "../config/fireBase"
import DspSoldIterms from "./DspSoldIterms";
import ShopHeader from "./ShopHeader";
import inputstyles from "../styles/inputElement";

import { useNavigate , useParams} from "react-router-dom";
function DspShopIterms({spechopLoc}){

  const navigate = useNavigate()
  const {location} = useParams()

  const [diplayEnterShopLoc , setEnterSHopLoc]=React.useState(false)
  function checkLoca(){
   if(!spechopLoc){
      setEnterSHopLoc(true)
   }else{
       navigate(`/selectAddShop/${location}/`) 
   }
  }

  const [ newShopAdress , setNewShopAdress ] = React.useState('')

    const handleUpdateShopAddress = async () => {
      try {
        if (auth.currentUser) {
          const userId = auth.currentUser.uid;

          const docRef = doc(db, 'personalData', userId);
          await updateDoc(docRef, { shopLocation: newShopAdress,  });
          alert("Shop Adress updated successfully!");
          setNewShopAdress("")
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

        <View style={{flexDirection : 'row', paddingTop : 10 , justifyContent : 'space-evenly'}}>
          <TouchableOpacity style={styles.cancelBtn}onPress={()=>setEnterSHopLoc(false)} >
            <Text>cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={handleUpdateShopAddress} style={styles.saveBtn}>
            <Text style={{color : 'white'}}>Save</Text>
          </TouchableOpacity>
            
        </View>
               </View>}
             <TouchableOpacity onPress={checkLoca}  style={{position :'absolute',top: 440 ,right:10 , width : 60 , height : 35 , alignItems :"center" , justifyContent :'center', backgroundColor:'rgb(129,201,149)' , zIndex :200 , borderRadius: 8}} >
                <Text style={{color : 'white'}} >Add</Text>
             </TouchableOpacity>

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