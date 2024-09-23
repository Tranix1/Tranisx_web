
import React from "react";
import {View , TouchableOpacity , Text , Linking , Share} from "react-native"

import {useNavigate} from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
function MobileAppSD(){

    const navigate = useNavigate()

     const handleShareLink = async () => {
    try {
      const url = `https://www.truckerz.net/`; // Replace this with the URL you want to share
      const message = `Increase your logistics efficiency with Truckerz! Join me by clicking this link to access a wide range of services tailored to your needs. : Website ${url}`;

      const result = await Share.share({
        message: message,
      });

      if (result) {
        if (result.action === Share.sharedAction) {
          if (result.activityType) {
            // Shared with activity type of result.activityType
          } else {
            // Shared
          }
        } else if (result.action === Share.dismissedAction) {
          // Dismissed
        }
      } else {
        // Handle the case where result is undefined or null
      }
    } catch (error) {
      alert(error.message);
    }
  };
    return(
        <View style={{paddingTop: 75}} >
             <View  style={{position:'absolute' , top : 0 , left: 0 , right : 0 , flexDirection : 'row' , height : 74  ,  paddingLeft : 6 , paddingRight: 15 , paddingTop:10 ,backgroundColor : '#6a0c0c' ,paddingTop : 15 , alignItems : 'center' , }} >
         <TouchableOpacity style={{marginRight: 10}}  onPress={()=>navigate(-1)}>
            {/* <Ionicons name="arrow-back" size={28} color="white"style={{ marginLeft: 10 }}  /> */}
                    <ArrowBackIcon style={{color : 'white'}} />

        </TouchableOpacity> 
        
        <Text style={{fontSize: 20 , color : 'white'}} >  Mobile app  </Text>
       </View>

            <TouchableOpacity style={{marginLeft : 20 , height : 45 ,  justifyContent : 'center'}} onPress={() => Linking.openURL(`tel:0787884434`)} >
                <Text>Download Android App </Text>
                <Text style={{fontSize:12 , color:"gray"}} >Not yet on playStore its still apk but working perferctly </Text>
            </TouchableOpacity>

            <TouchableOpacity style={{marginLeft : 20 , height : 45 , justifyContent : 'center'}} onPress={handleShareLink} >
                <Text>Invite a friend </Text>
            </TouchableOpacity>

        </View>
    )
}
export default React.memo(MobileAppSD)