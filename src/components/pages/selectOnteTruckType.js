import React from "react";
import { View , Text , TouchableOpacity , StyleSheet,ImageBackground} from "react-native";
// import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

import bulkTImage from "../images/Trucks/download (1).jpeg"
import lowbedTImage from "../images/Trucks/H805f1f51529345648d1da9e5fcd6807e2.jpg"
import flatdeckTIm from "../images/Trucks/images (2).jpeg"
import taultTIm from "../images/Trucks/download (3).jpeg"
import sideTipperTMAGE from "../images/Trucks/images (5).jpeg"
import tankerTIma from "../images/Trucks/images (7).jpeg"
import rigidTImage from "../images/Trucks/download (4).jpeg"

import {useNavigate} from 'react-router-dom';

function SelectOneTruckType({}){

const navigate = useNavigate()
    return(
        <View style={{alignItems : 'center' , paddingTop : 20}} >

       <TouchableOpacity onPress={()=> navigate('/dspOneTrckType/flatDecks')   }  style={styles.selectTruck}>

                <Text style={{position:'absolute',alignSelf:'center',fontWeight:'bold',fontSize:16,zIndex:14,backgroundColor:'white'}} >Flat deck</Text>
                <ImageBackground source={flatdeckTIm} style={{width:135,height:60}} />
                </TouchableOpacity>

            <View  style={{flexDirection : 'row'}}>
            <TouchableOpacity onPress={()=> navigate('/dspOneTrckType/BulkTrailers')   } style={styles.selectTruck}>

           <Text style={{position:'absolute',alignSelf:'center',fontWeight:'bold',fontSize:16,zIndex:14,backgroundColor:'white'}} >BulkTrailer</Text>
                <ImageBackground source={bulkTImage} style={{width:135,height:60}} />

            </TouchableOpacity>
            
                <TouchableOpacity onPress={()=> navigate('/dspOneTrckType/LowBeds') } style={styles.selectTruck}>
                  <Text style={{position:'absolute',alignSelf:'center',fontWeight:'bold',fontSize:16,zIndex:14,backgroundColor:'white'}} >LowBed</Text>
                <ImageBackground source={lowbedTImage} style={{width:135,height:60}} />
                </TouchableOpacity>
            </View>

            <View  style={{flexDirection : 'row'}}>
                <TouchableOpacity onPress={()=> navigate( '/dspOneTrckType/sideTippers') } style={styles.selectTruck}>
             <Text style={{position:'absolute',alignSelf:'center',fontWeight:'bold',fontSize:16,zIndex:14,backgroundColor:'white'}} >Side Tipper</Text>
                <ImageBackground source={sideTipperTMAGE} style={{width:135,height:60}} />
                </TouchableOpacity>

              <TouchableOpacity onPress={()=> navigate('/dspOneTrckType/tauntliner' ) }style={styles.selectTruck} >
               <Text style={{position:'absolute',alignSelf:'center',fontWeight:'bold',fontSize:16,zIndex:14,backgroundColor:'white'}} >Tautliner</Text>
                <ImageBackground source={taultTIm} style={{width:135,height:60}} />
                </TouchableOpacity>
            </View>

            <View style={{flexDirection : 'row'}} >

                <TouchableOpacity onPress={()=> navigate('/dspOneTrckType/tanker') } style={styles.selectTruck}>
               <Text style={{position:'absolute',alignSelf:'center',fontWeight:'bold',fontSize:16,zIndex:14,backgroundColor:'white'}} >Tanker</Text>
                <ImageBackground source={tankerTIma} style={{width:135,height:60}} />
                </TouchableOpacity>

                <TouchableOpacity onPress={()=> navigate('/dspOneTrckType/Rigid' ) }style={styles.selectTruck} >
               <Text style={{position:'absolute',alignSelf:'center',fontWeight:'bold',fontSize:16,zIndex:14,backgroundColor:'white'}} >Rigid</Text>
                <ImageBackground source={rigidTImage} style={{width:135,height:60}} />
                </TouchableOpacity>

            </View>

        </View>
    )
}
export default React.memo(SelectOneTruckType)


const styles = StyleSheet.create({
    selectTruck : {
        justifyContent : 'center' , 
        alignItems : 'center' ,
        height : 60 ,
        width : 135 , 
        borderWidth : 1 , 
        borderColor : 'black',
        padding : 5 ,
        margin : 10,
        backgroundColor:'red'
        
    }
});