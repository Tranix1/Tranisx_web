import React from "react"; 
import { View , Text , ScrollView , TouchableOpacity , Linking} from 'react-native';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {useNavigate} from 'react-router-dom';
import defaultImage from '../images/logo.jpg'

import { Facebook, WhatsApp, Email ,LinkedIn } from '@mui/icons-material';


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
         <View  style={{position:'absolute' , top : 0 , left: 0,right :0, flexDirection : 'row' , height : 74  ,  paddingLeft : 6 , paddingRight: 15 , paddingTop:10 ,backgroundColor : '#6a0c0c' ,paddingTop : 15 , alignItems : 'center' , }} >
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

        {dspHelpcenter && <View style={{alignItems:'center',}} >
            <View style={{width : 390 , backgroundColor:'#D3D3D3', marginBottom:10 , padding:10 , }} >
            <Text style={{lineHeight:21.5 , fontWeight:'bold',fontSize:15,color:'#6a0c0c'}} > Your gateway to the future of logistics is here! Our innovative software solutions are tailor-made to fulfill your every need.</Text>
            <Text style={{lineHeight:21.5 , fontWeight:'bold',fontSize:15,color:'#6a0c0c'}} >From finding loads to securing trucks, selling products to discovering work opportunities in your area, our cutting-edge technologies are designed to streamline and enhance your logistics experience</Text>
             </View>

            <View style={{width : 390 , backgroundColor:'#D3D3D3', marginBottom:10 , padding:10 , }}>
            <Text style={{lineHeight:21.5,fontWeight:'bold',fontSize:15 ,color:'green'}}>We believe in a seamless tomorrow, where efficiency and convenience meet your demands. Contact us today to embark on a journey towards a smarter logistics world</Text>
            <Text style={{lineHeight:21.5 ,fontWeight:'bold',fontSize:15,color:'green'}} >We're here to transform the way you navigate the industry. Reach out now and let's revolutionize logistics together!</Text>
            </View>
                <Text>
                    For immediate help, please contact us via our social platforms. 
                    </Text> 

                    <View style={{flexDirection:'row' , justifyContent:'center', alignItems:'center'}} >
                    <TouchableOpacity onPress={()=>Linking.openURL('mailto:truckerz2023@gmail.com')} >
                     <Text style={{color :'#0000FF'}} >email  <Email /> </Text> 
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => Linking.openURL(`whatsapp://send?phone=+263716325160`)} >
                       <Text style={{color:"#25D366"}} >WhatsApp <WhatsApp /> </Text> 
                    </TouchableOpacity>

                    <TouchableOpacity onPress={()=>Linking.openURL('https://www.facebook.com/TruckerzWeb/') } >
                   <Text style={{color:"#1877F2"}} > facebook <Facebook />    </Text> 
                    </TouchableOpacity>

                    <TouchableOpacity onPress={()=>Linking.openURL('https://www.linkedin.com/in/truckerz-undefined-1277172a7/') } >
                      <Text style={{color:'#0A66C2'}}> linkedIn <LinkedIn /> </Text>

                    </TouchableOpacity>

                    </View>
                 We are here to assist you promptly!                 
                  
            
        </View> }

        {softInfo && <View  style={{alignItems : 'center'}}>

            <Text style={{fontWeight :'bold', fontSize:17}} > Transix</Text>
            <Text> We the future for transport and logistics </Text>
           <img src={defaultImage}  style={{height : 85 , borderRadius : 10 , width: 170, margin :6}}/>
            <Text style={{fontStyle:'italic'}} > From 2023 - 2025 </Text>
            <Text style={{fontStyle:'italic'}} > © Parent company ARMAMENT VENTURES </Text>
        </View> }

    </View> )
}
export default React.memo(HelpHome)
