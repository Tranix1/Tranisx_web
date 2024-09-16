import React from "react";
import { View , Text , TouchableOpacity , StyleSheet} from "react-native";
// import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

import {useNavigate} from 'react-router-dom';

function SelectOneTruckType({}){

const navigate = useNavigate()
    return(
        <View style={{alignItems : 'center' , paddingTop : 20}} >


            <View  style={{flexDirection : 'row'}}>
            <TouchableOpacity onPress={()=> navigate('/dspOneTrckType/BulkTrailers')   } style={styles.selectTruck}>

                <Text>BulkTrailer</Text>
                <LocalShippingIcon  />

            </TouchableOpacity>
            
                <TouchableOpacity onPress={()=> navigate('/dspOneTrckType/LowBeds') } style={styles.selectTruck}>
                    <Text>LowBed</Text>
                <LocalShippingIcon  />
                </TouchableOpacity>
            </View>

            <View  style={{flexDirection : 'row'}}>
                <TouchableOpacity onPress={()=> navigate( '/dspOneTrckType/sideTippers') } style={styles.selectTruck}>
                <Text>Side Tipper</Text>
                <LocalShippingIcon  />
                </TouchableOpacity>

              <TouchableOpacity onPress={()=> navigate('/dspOneTrckType/tauntliner' ) }style={styles.selectTruck} >
                <Text> Tautliner </Text>
                <LocalShippingIcon  />
                </TouchableOpacity>
            </View>

            <View style={{flexDirection : 'row'}} >

                <TouchableOpacity onPress={()=> navigate('/dspOneTrckType/Rigid' ) }style={styles.selectTruck} >
                <Text> Rigid </Text>
                <LocalShippingIcon  />
                </TouchableOpacity>

                <TouchableOpacity onPress={()=> navigate('/dspOneTrckType/tanker') } style={styles.selectTruck}>
                <Text>Tanker</Text>
                <LocalShippingIcon  />
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
        margin : 10
        
    }
});