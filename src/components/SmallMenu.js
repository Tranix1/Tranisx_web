import React from "react";
import {View , TouchableOpacity , Text , StyleSheet} from "react-native"

import {useNavigate} from 'react-router-dom';

function SmallMenu(){

const navigate = useNavigate()

return(
<View style={{position : 'absolute' , right : 3 ,top: 60, height : 205 , borderBlockColor:"#6a0c0c",borderWidth:3 , backgroundColor :'white' , zIndex : 3111 , width : 140}} >

    <TouchableOpacity  onPress={()=> navigate('/selectPeronalAcc/') } style={styles.buttonStyle}>
        <Text>Personal Acc</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.buttonStyle}>
        <Text>Updates</Text>
    </TouchableOpacity>

    <TouchableOpacity onPress={()=>navigate('/selectChat/') } style={styles.buttonStyle}>
        <Text> Chats</Text>
    </TouchableOpacity>
    
    <TouchableOpacity   onPress={()=>navigate('/bookingsandBiddings/') }  style={styles.buttonStyle}>
        <Text>B & B</Text>
    </TouchableOpacity>
    
    
    <TouchableOpacity   onPress={()=>navigate('/shopLocation/') }  style={styles.buttonStyle}>
        <Text>Shop</Text>
    </TouchableOpacity>
   
</View>
)
}
export default React.memo(SmallMenu)

const styles = StyleSheet.create({
    buttonStyle : {
        height : 40,
        justifyContent : 'center' , 
        alignItems : 'center',  
        // backgroundColor:'red'       
    }
});