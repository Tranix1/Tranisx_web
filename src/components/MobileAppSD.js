
import React from "react";
import {View , TouchableOpacity , Text , Linking , Share} from "react-native"
import {query ,collection , onSnapshot, } from "firebase/firestore"
import { db } from "./config/fireBase";

import {useNavigate} from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
function MobileAppSD(){

    const navigate = useNavigate()

        const handleShareLink = async () => {
   
              try {
                const message = `I invite you to Transix!

Transix is a tech-driven business enhancing transportation and logistics services, connecting suppliers with demand for truckloads, vehicles, trailers, and spare parts etc.

Contact us at +263716325160 with the message "Application" to swiftly receive the application download link.

Explore Application at : https://play.google.com/store/apps/details?id=com.yayapana.Transix
Explore website at : https://transix.net/

Experience the future of transportation and logistics!`;

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
      const [downloadPlayStore , setDownloadOnPlaystore]=React.useState(false)
      const [downloadApkLink , setDownloadApkLink]=React.useState(false)
      
          React.useEffect(() => {
        try {
            const loadsQuery = query(collection(db, "updateEveryone"));
            const unsubscribe = onSnapshot(loadsQuery, (querySnapshot) => {
              querySnapshot.forEach((doc) => {
                const data = doc.data();


                const newAppUpdateApkLink = data.newAppUpdateApkLink
                const newAppUpdatePlystore = data.switchToPlayStoreLink

                    
                    if(newAppUpdateApkLink){

                      setDownloadApkLink(newAppUpdateApkLink)
                    }else if(newAppUpdatePlystore){
                         setDownloadOnPlaystore(newAppUpdatePlystore)
                    }

                  
                                        
              });
            });

            return () => unsubscribe(); // Cleanup the listener when the component unmounts
        } catch (error) {
          console.error(error);
        }
      }, []);

    return(
        <View style={{paddingTop: 75}} >
             <View  style={{position:'absolute' , top : 0 , left: 0 , right : 0 , flexDirection : 'row' , height : 74  ,  paddingLeft : 6 , paddingRight: 15 , paddingTop:10 ,backgroundColor : '#6a0c0c' ,paddingTop : 15 , alignItems : 'center' , }} >
         <TouchableOpacity style={{marginRight: 10}}  onPress={()=>navigate(-1)}>
            {/* <Ionicons name="arrow-back" size={28} color="white"style={{ marginLeft: 10 }}  /> */}
                    <ArrowBackIcon style={{color : 'white'}} />

        </TouchableOpacity> 
        
        <Text style={{fontSize: 20 , color : 'white'}} >  Mobile app  </Text>
       </View>

                  <TouchableOpacity style={{marginLeft : 20 , height : 45 ,  justifyContent : 'center'}} onPress={()=>Linking.openURL(`${downloadApkLink ? downloadApkLink : downloadPlayStore }`)} >
                <Text>Download Android App </Text>
                {
                  downloadApkLink ?<Text style={{fontSize:12 , color:"gray"}} > Not yet on playStore its still apk but working perferctly </Text>:
                  
                <Text style={{fontSize:12 , color:"gray"}} >On playStore working perferctly </Text>
                }
            </TouchableOpacity>
             
            <TouchableOpacity style={{marginLeft : 20 , height : 45 , justifyContent : 'center'}} onPress={handleShareLink} >
                <Text>Invite a friend </Text>
            </TouchableOpacity>

        </View>
    )
}
export default React.memo(MobileAppSD)