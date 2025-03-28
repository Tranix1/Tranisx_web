import React from "react";
import { View , TouchableOpacity , Text , StyleSheet} from "react-native";

import { auth } from "../config/fireBase";
import {useNavigate} from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
function SelectPersonalAcc({isVerified}){

const navigate = useNavigate()

    return(
        <View style={{alignItems : 'center', paddingTop : 78}} >
             <View style={{position:'absolute' , top : 0 , left: 0 , right : 0 , flexDirection : 'row' , height : 74  ,  paddingLeft : 6 , paddingRight: 15 , paddingTop:10 ,backgroundColor : '#6a0c0c' ,paddingTop : 15 , alignItems : 'center' , }} >
         <TouchableOpacity style={{marginRight: 10}} onPress={() => navigate(-1)}>
            {/* <Ionicons name="arrow-back" size={28} color="white"style={{ marginLeft: 10 }}  /> */}
        
                    <ArrowBackIcon style={{color : 'white'}} />
        </TouchableOpacity> 
        <Text style={{fontSize: 20 , color : 'white'}} > Transix </Text>
       </View>

           <TouchableOpacity onPress={()=>navigate("/personalInfomation/") } style={styles.buttonPAcc}>
            <Text style={{color : 'white'}} >Personal Information </Text>
            </TouchableOpacity> 

           <TouchableOpacity onPress={()=>navigate("/peronalAccLoads/") } style={styles.buttonStyleIterm} >
            <Text>Manage Loads </Text>
            </TouchableOpacity> 

           <TouchableOpacity onPress={()=>navigate(`/selectedUserTrucks/${auth.currentUser.uid}/${isVerified}/Manage`)} style={styles.buttonStyleIterm} >
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