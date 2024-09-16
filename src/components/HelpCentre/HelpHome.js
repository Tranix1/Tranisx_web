import React from "react"; 
import { View , Text , ScrollView , TouchableOpacity} from 'react-native';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {useNavigate} from 'react-router-dom';
function HelpHome(){
const navigate = useNavigate()
    const [dspHelpcenter , setHelpCntre] = React.useState(false)
    function toggleHC(){
        setHelpCntre(prev => !prev)
        setSoftInfo(false)
    }

    const [softInfo , setSoftInfo] = React.useState(false)
    function toggleSI(){
        setSoftInfo(prev => !prev)
        setHelpCntre(false)
    }
    return(
    <View style={{paddingTop: 74}} >
         <View  style={{position:'absolute' , top : 0 , left: 0 , right : 0 , flexDirection : 'row' , height : 74  ,  paddingLeft : 6 , paddingRight: 15 , paddingTop:10 ,backgroundColor : '#6a0c0c' ,paddingTop : 15 , alignItems : 'center' , }} >
         <TouchableOpacity style={{marginRight: 10}}  onPress={()=>navigate(-1)}>
                    <ArrowBackIcon style={{color : 'white'}} />

        </TouchableOpacity> 
        
        <Text style={{fontSize: 20 , color : 'white'}} > Help  </Text>
       </View>


        <View>
        {!softInfo && <TouchableOpacity onPress={toggleHC} style={{marginLeft : 20 , height : 40 ,  justifyContent : 'center'}}>
            <Text>Help centre </Text>
            <Text style={{fontSize:12 , color:"gray"}} >Get help , contact us </Text>
        </TouchableOpacity>}

       { !dspHelpcenter && <TouchableOpacity onPress={toggleSI} style={{marginLeft : 20 , height : 40 ,  justifyContent : 'center'}} >
            <Text>Software info </Text>
        </TouchableOpacity>}
         </View>

        {dspHelpcenter && <ScrollView>
            <Text> Help centre</Text>
        </ScrollView> }

        {softInfo && <ScrollView >

            <Text> software info</Text>
        </ScrollView> }

    </View> )
}
export default React.memo(HelpHome)
