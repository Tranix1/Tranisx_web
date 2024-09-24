import React from "react";
import {View , TouchableOpacity , Text , Linking} from "react-native"

import {useNavigate} from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VerifiedIcon from '@mui/icons-material/Verified';
function VerifyInfo(){
    const navigate = useNavigate()
    return(
        <View style={{paddingTop : 79 , alignItems :'center'}} >
         <View  style={{position:'absolute' , top : 0 , left: 0 , right : 0 , flexDirection : 'row' , height : 74  ,  paddingLeft : 6 , paddingRight: 15 , paddingTop:10 ,backgroundColor : '#6a0c0c' ,paddingTop : 15 , alignItems : 'center' , }} >
         <TouchableOpacity style={{marginRight: 10}}  onPress={()=>navigate(-1)}>
                    <ArrowBackIcon style={{color : 'white'}} />
        </TouchableOpacity> 
        
        <Text style={{fontSize: 20 , color : 'white'}} >  Verification Info  </Text>
       </View>
            <Text style={{lineHeight:21.5 , color:'#9c2828' , fontWeight:'bold',fontSize:19}} >At Truckerz, verification occurs across multiple stages. </Text>

            <View style={{marginTop:10  , backgroundColor:'#D3D3D3' , width:375 , padding: 10}} >

                <Text style={{lineHeight:21.5 , color:'red' , fontWeight:'bold',fontSize:16 , marginBottom: 8  }} > Hurry to secure your spot as a verified participant on Truckerz Now!  </Text>
                <Text style={{lineHeight:21.5 ,fontWeight:'bold',fontSize:14.5 , marginBottom: 8 }} >This limited-time offer is available until our quota is filled. To uphold platform integrity, we now need five references from verified users. </Text>
            </View>

            <TouchableOpacity onPress={() => Linking.openURL(`whatsapp://send?phone=+263786936437  &text=${encodeURIComponent(" I aspire to become verified at the first level on Truckerz Now! How do I make this happen without any delays or uncertainties? ")} `)} style={{marginTop:10  , backgroundColor:'#D3D3D3' , width:375 , padding: 10}} >

                <Text  style={{lineHeight:21.5 , color:'#32CD32' , fontWeight:'bold',fontSize:16 , marginBottom: 8  }} > Get first stage verification Now  </Text>

      {  <View style={{position : 'absolute' , top : 0 , right : 0 , backgroundColor : 'white' , zIndex : 66}} >
            <VerifiedIcon style={{color : 'green'}} />
      </View>}

                <Text style={{lineHeight:21.5 ,fontWeight:'bold',fontSize:13 , marginBottom: 8 }} >Unlock Growth with Heart: Provide your location, company details, and join us with a 
                <Text style={{color:'green'}} > $5 monthly subscription.</Text> Let's journey together towards success. </Text>

                <Text style={{lineHeight:21.5 ,fontWeight:'bold', fontSize:13 , marginBottom: 8 }} > If the $5 subscription isn't for you, 
                <Text style={{color:'green'}} > refer three businesses  </Text> for verification and watch your company thrive alongside them for two free months</Text>

                <Text style={{lineHeight:21.5 ,fontWeight:'bold',marginTop:6}} > Benefits: </Text>
                <Text>Safeguard businesses by reducing unauthorized firms</Text> 
                <Text>Boost job opportunities</Text>
                <Text>Less time wasters</Text>
                <Text>improve overral services</Text>
                <Text>Have a community of verified users</Text>
                <Text>You'll be contacted by those whose bookings or bids you accept.</Text>
                <Text>Ensure swift emergency response with clear identification.</Text>
                   
            </TouchableOpacity>

        </View>
    )
}
export default React.memo(VerifyInfo)