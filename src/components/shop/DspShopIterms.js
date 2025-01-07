import React from "react";
import {View , TouchableOpacity , Text , StyleSheet , ScrollView , TextInput  } from "react-native"
import {  doc , updateDoc, onSnapshot} from "firebase/firestore"
import {auth , db} from "../config/fireBase"
import { signOut,sendEmailVerification} from  'firebase/auth'

import DspSoldIterms from "./DspSoldIterms";
import ShopHeader from "./ShopHeader";
import inputstyles from "../styles/inputElement";

import { useNavigate , useParams} from "react-router-dom";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

function DspShopIterms({spechopLoc ,blockVerifiedU ,blackLWarning  }){

  const navigate = useNavigate()
  
  const {location,} = useParams()
 



  const [diplayEnterShopLoc , setEnterSHopLoc]=React.useState(false)
  
  const [currentUser, setCurrentUser] = React.useState("");

  React.useEffect(() => {
    // Check if user is already signed in
      setemailVerifiedN(false)
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    // Cleanup function
    return () => unsubscribe();
  }, [currentUser]);

      const [ username , setUsername] = React.useState(false);
   const [ contact , setContact] = React.useState('');

  const [trackLoading , setTrackLoading]=React.useState(false)
  const [trackLoadingScnd , setTrackLoadingScnd]=React.useState(false)
    
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
    }else if(!auth.currentUser && trackLoading ) {
      setUsername("")
    }
      setTrackLoading(true)
      if(trackLoading){
      setTrackLoadingScnd(true)
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




  













  const logout = async ()=>{
    
    try{
      setemailVerifiedN(false)
      setCurrentUser(null)
    await signOut(auth)

    }catch (err){
      console.error(err)
    }
  }
  const newCodeEmVeri = async () => {
  try {
    const user = auth.currentUser  ;

    if (user && user.email) {
      await sendEmailVerification(user);
      alert("New code sent");
      setemailVerifiedN(false)
    } else {
      console.error("Current user or user email is null");
    }

  } catch (err) {
    console.error(err);
  }
};

const [whenemailVerifiedN , setemailVerifiedN] = React.useState(false)



  function checkAuth(){
        if(username !== false|| trackLoadingScnd){
    if(!currentUser){
      navigate("/createUser/")

    }else if(!currentUser.emailVerified ){
      setemailVerifiedN(true)
      return
    }
    else if(currentUser &&!username){
      navigate("/addPersnoalInfo/")
    }else {

   if(!spechopLoc){
      setEnterSHopLoc(true)
   }else{
       navigate(`/selectAddShop/${location}/`) 
   }
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
          alert("Shop Adress updated successfully!\nIf its slow to get the adress restart App");
          setNewShopAdress("")
          setNewDeliveryR("")
          setEnterSHopLoc(false)
            window.location.reload();
        }
      } catch (err) {
        console.error(err);
      }
    };

    
  


return(
    <View> 
        <ShopHeader/>

                {whenemailVerifiedN && <View style={{alignSelf:'center', backgroundColor :'white', zIndex:100, position:'absolute', top : 130 , width:300, padding:7, height:150, justifyContent:'center',alignItems :'center', borderRadius:7}} >
               <Text style={{fontSize:17 , fontWeight:'600'}} >Verify Your Email</Text> 
               <Text style={{fontSize:17 , fontWeight:'600',color:'green'}} >{currentUser.email}</Text> 
               <Text>To Proceed........</Text>
              <View style={{flexDirection:'row', justifyContent:"space-evenly",marginTop:7}} >

               <TouchableOpacity style={{height:27 , backgroundColor:'red', width:65,borderRadius:5, alignItems:'center',margin:7}} onPress={logout} >
                <Text style={{color:'white'}}>Sign Out</Text>
               </TouchableOpacity>

               <TouchableOpacity onPress={newCodeEmVeri} style={{borderWidth:2 , marginLeft:6 , marginRight:5 ,width:80,height:27,alignItems:'center',marginTop:7}} >
                <Text>new code</Text>
               </TouchableOpacity>

           

              </View>
             </View>}

               {diplayEnterShopLoc && <View style={{position:'absolute' , alignSelf:'center' , backgroundColor:'white' , top : 160 ,  zIndex:500,padding:12}} >

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




            {auth.currentUser ?  !blockVerifiedU && !blackLWarning &&username !== false&&   <TouchableOpacity onPress={checkAuth}  style={{position :'fixed',top: 470 ,right:10 , width : 80 , height : 35 , alignItems :"center" , justifyContent :'space-around' , backgroundColor:'#228B22' , zIndex :200 , borderRadius: 8, flexDirection :'row', }} >
                <Text style={{color : 'white', fontSize:18}} >Add</Text>
                 <AddShoppingCartIcon style={{color:'white'}} />
             </TouchableOpacity>
            :
            
               username !== false && <TouchableOpacity onPress={()=> navigate("/createUser/")} style={{position :'fixed',top: 440 ,right:10 ,  alignItems :"center" , justifyContent :'center', backgroundColor:'#6a0c0c' , zIndex :200 , borderRadius: 8 , height : 15}} >
            <Text  style={{color : 'white'}} > Sign  to add  </Text> 

          </TouchableOpacity>
            }


             
             <ScrollView style={{padding:10}}>
                <DspSoldIterms blockVerifiedU={blockVerifiedU}  blackLWarning={blackLWarning}  />
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