import React from "react";
import {View , TouchableOpacity , Text , StyleSheet} from "react-native"

import {useNavigate} from 'react-router-dom';

function SmallMenu({toggleSmallMenu}){

const navigate = useNavigate()

//  We do t for booking and bidding , messages , main group , updates

//  add the number of new iterm for specific itemrs
// dispaly the number of the current new things
// set the iterms to zero when opened

// for group 
// add the num of new messgaes 
// for specific user et the iterms to 0 when opened
// must also be in the same db
     



//  function toggleSideTipper(id) {
//     setSideTipper(prevTruck => {
//       return prevTruck.map(oneTruck => {
//         if (oneTruck.id === id) {
//           const newLikeStatus = !oneTruck.like;
//           const newRating = oneTruck.like ? oneTruck.rating - 1 : oneTruck.rating + 1;
//           const docRef = doc(collection(db, "sideTippers"), id);
//           updateDoc(docRef, {
//             like: newLikeStatus,
//             rating: newRating
//           })
         
//           return {
//             ...oneTruck,
//             like: newLikeStatus,
//             rating: newRating
//           };
//         } else {
//           return oneTruck;
//         }
//       });
//     });
//   }



return(
    <TouchableOpacity  style={{position : 'absolute' , right : 0 ,top: 0, bottom : 0 , left : 0 ,zIndex : 400 , }} onPress={toggleSmallMenu} >
    <View style={{position : 'absolute' , right : 0  , borderBlockColor:"#6a0c0c",borderWidth:3 , backgroundColor :'white'  , width : 235 , borderRadius: 13}} >

    <TouchableOpacity  onPress={()=> navigate('/selectPeronalAcc/') } style={styles.buttonStyle}>
        <Text>Personal Acc</Text>
    </TouchableOpacity>
    
    <TouchableOpacity   onPress={()=>navigate('/bookingsandBiddings/') }  style={styles.buttonStyle}>
        <Text>B & B</Text>
    </TouchableOpacity>
    
    <TouchableOpacity onPress={()=>navigate('/selectChat/') } style={styles.buttonStyle}>
        <Text> Chats</Text>
    </TouchableOpacity>
    
       <TouchableOpacity   onPress={()=>navigate('/verifyInfo/') }  style={styles.buttonStyle}>
        <Text>Verification</Text>
        </TouchableOpacity>

    <TouchableOpacity   onPress={()=>navigate('/mobileAppSD/') }  style={styles.buttonStyle}>
        <Text>Mobile App </Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.buttonStyle} onPress={()=>navigate('/updates/') }  >
        <Text>Updates</Text>
    </TouchableOpacity>

    <TouchableOpacity   onPress={()=>navigate('/helpHome/') }  style={styles.buttonStyle}>
        <Text> Help </Text>
    </TouchableOpacity>

  
   
</View>

  {window.location.hostname === 'localhost' ? <View style={{ position : 'absolute' , right : 0 ,top : 360  , borderBlockColor:"#6a0c0c",borderWidth:3 , backgroundColor :'white'  , width : 235 , borderRadius: 13}} >


    <TouchableOpacity   onPress={()=>navigate('/addUpdate/')  }  style={styles.buttonStyle}>
        <Text> Add update </Text>
    </TouchableOpacity>

    <TouchableOpacity   onPress={()=>navigate('/verifyNewUser/') }  style={styles.buttonStyle}>
        <Text> Verify  </Text>
    </TouchableOpacity>

    <TouchableOpacity   onPress={()=>navigate('/helpHome/') }  style={styles.buttonStyle}>
        <Text> Block  </Text>
    </TouchableOpacity>
    </View>
    : null } 
    
 </TouchableOpacity>
)
}
export default React.memo(SmallMenu)

const styles = StyleSheet.create({
    buttonStyle : {
        height : 47,
        justifyContent : 'center' , 
        alignItems : 'center',  
        // backgroundColor:'red'       
    }
});