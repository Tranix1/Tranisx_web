import React from "react";
import { View , TouchableOpacity , Text , StyleSheet} from "react-native";

import {useNavigate} from 'react-router-dom';
function SelectPersonalAcc(){

const navigate = useNavigate()

    return(
        <View style={{alignItems : 'center', paddingTop : 60}} >
           <TouchableOpacity onPress={()=>navigate("/personalInfomation/") } style={styles.buttonPAcc}>
            <Text style={{color : 'white'}} >Personal Information </Text>
            </TouchableOpacity> 

           <TouchableOpacity onPress={()=>navigate("/peronalAccLoads/") } style={styles.buttonStyleIterm} >
            <Text>Manage Loads </Text>
            </TouchableOpacity> 

           <TouchableOpacity onPress={()=>navigate("/peronalAccTrucks/") } style={styles.buttonStyleIterm} >
            <Text>Manage Trucks </Text>
            </TouchableOpacity>
             
        </View>
    )
}
export default React.memo(SelectPersonalAcc)


const styles = StyleSheet.create({
    buttonStyleIterm : {
        height : 41,
        width : 200 ,
        justifyContent : 'center' , 
        alignItems : 'center' , 
        borderRadius : 25,
        borderWidth : 2,
        marginBottom : 10
        } ,
        buttonPAcc :{
         height : 41,
        width : 200 ,
        justifyContent : 'center' , 
        alignItems : 'center' , 
        backgroundColor : 'black',
        borderRadius : 25,
        marginBottom : 10
        }
});