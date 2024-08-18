import React from "react";
import { View , Text  , TouchableOpacity , StyleSheet} from "react-native";
// shop Home 
// Add to shop 
//  iterms like trucks , trailer , spares , 

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from "react-router-dom";
function ShopHome(){
    const navigate = useNavigate()

return(
    <View style={{alignItems :'center', paddingTop : 80}}>

 <View  style={{position:'absolute' , top : 0 , left: 0 , right : 0 , flexDirection : 'row' , height : 74  ,  paddingLeft : 6 , paddingRight: 15 , paddingTop:10 ,backgroundColor : '#6a0c0c' ,paddingTop : 15 , alignItems : 'center' , }} >
         <TouchableOpacity style={{marginRight: 10}}  onPress={()=>navigate(-1)}>
            {/* <Ionicons name="arrow-back" size={28} color="white"style={{ marginLeft: 10 }}  /> */}
                    <ArrowBackIcon style={{color : 'white'}} />

        </TouchableOpacity> 
        
        <Text style={{fontSize: 20 , color : 'white'}} > Welcome To Store  </Text>
       </View>
        <TouchableOpacity onPress={()=> navigate('/DspShop/Zimbabwe/vehicles') } style={styles.buttonStyle} >
            <Text style={{color:'#6a0c0c'}}> Zimbabwe</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={()=> navigate('/DspShop/SouthAfrica/vehicles') } style={styles.buttonStyle}>
            <Text style={{color:'#6a0c0c'}}>  South Africa</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={()=> navigate('/DspShop/Namibia/vehicles') } style={styles.buttonStyle}>
            <Text style={{color:'#6a0c0c'}}>Namibia </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={()=> navigate('/DspShop/Tanzania/vehicles') } style={styles.buttonStyle}>
            <Text style={{color:'#6a0c0c'}}> Tanzania</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={()=> navigate('/DspShop/Mozambique/vehicles') } style={styles.buttonStyle}>
            <Text style={{color:'#6a0c0c'}}>Mozambique </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={()=> navigate('/DspShop/Zambia/vehicles') } style={styles.buttonStyle}>
            <Text style={{color:'#6a0c0c'}}> Zambia</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={()=> navigate('/DspShop/Botswana/vehicles') } style={styles.buttonStyle} >
            <Text style={{color:'#6a0c0c'}}>Botswana </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={()=> navigate('/DspShop/Malawi/vehicles') }style={styles.buttonStyle} >
            <Text style={{color:'#6a0c0c'}}>Malawi </Text>
        </TouchableOpacity>

    </View>
)
}
export default React.memo(ShopHome)


const styles = StyleSheet.create({
    buttonStyle : {
        height : 40,
        justifyContent : 'center' , 
        alignItems : 'center' ,
        width : 150 ,
        marginBottom: 15 ,
        borderWidth: 2 ,
        borderColor:"#6a0c0c" ,
        borderRadius: 3
    } ,
  
});
