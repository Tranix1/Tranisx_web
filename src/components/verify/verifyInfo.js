import React from "react";
import {View , TouchableOpacity , Text , Linking} from "react-native"

import {useNavigate} from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
function VerifyInfo(){
    const navigate = useNavigate()
    return(
        <View style={{paddingTop : 70}} >
         <View  style={{position:'absolute' , top : 0 , left: 0 , right : 0 , flexDirection : 'row' , height : 74  ,  paddingLeft : 6 , paddingRight: 15 , paddingTop:10 ,backgroundColor : '#6a0c0c' ,paddingTop : 15 , alignItems : 'center' , }} >
         <TouchableOpacity style={{marginRight: 10}}  onPress={()=>navigate(-1)}>
                    <ArrowBackIcon style={{color : 'white'}} />
        </TouchableOpacity> 
        
        <Text style={{fontSize: 20 , color : 'white'}} >  Verification Info  </Text>
       </View>
            <Text>At Truckerz there are many stages of being verified </Text>

            <TouchableOpacity onPress={() => Linking.openURL(`whatsapp://send?phone=0787884434`)}>
                <Text> Get first stage verification Now  </Text>
                <Text>The first level we reuire firms location , company details and 5USD monthly subscription </Text>
                <Text> Benefits : reduced unauthorized firms from operating , increase chances of getting a job , easy track back of the firm when emegency </Text>
            </TouchableOpacity>

        </View>
    )
}
export default React.memo(VerifyInfo)