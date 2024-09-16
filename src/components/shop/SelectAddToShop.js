import React from "react"
import {View , TouchableOpacity , Text ,StyleSheet }from "react-native"

import {useNavigate , useParams} from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function SelectAddToShop(){
    const navigate = useNavigate()
    const {location}= useParams()


    return(
        <View style={{alignItems : 'center' , paddingTop : 80}} >

        <View  style={{position:'absolute' , top : 0 , left: 0 , right : 0 , flexDirection : 'row' , height : 74  ,  paddingLeft : 6 , paddingRight: 15 , paddingTop:10 ,backgroundColor : '#6a0c0c' ,paddingTop : 15 , alignItems : 'center' , }} >
         <TouchableOpacity style={{marginRight: 10}} onPress={() => navigate(-1)}>
                    <ArrowBackIcon style={{color : 'white'}} />
        </TouchableOpacity> 
        
        <Text style={{fontSize: 20 , color : 'white'}} > Add TO Shop </Text>
       </View> 
           <View>

             <TouchableOpacity onPress={()=>navigate(`/AddToShop/${location}/vehicles`)} style={styles.buttonSelectStyle}>
                <Text style={{color:"white"}}>Add Vehicle</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonSelectStyle} onPress={()=>navigate(`/AddToShop/${location}/trailers`)} >
                <Text style={{color:"white"}}>Add Trailers </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonSelectStyle} onPress={()=>navigate(`/AddToShop/${location}/spares`)}>
                <Text style={{color:"white"}}>Add Spares </Text>
            </TouchableOpacity>

              <TouchableOpacity style={styles.buttonSelectStyle} onPress={()=>navigate(`/AddToShop/${location}/Sprovider`)}>
                <Text style={{color:"white"}}>Service Provider </Text>
            </TouchableOpacity>
            
            </View>    
        </View>
    )
}
export default React.memo(SelectAddToShop)


const styles = StyleSheet.create({
    buttonStyle : {
        height : 40,
        justifyContent : 'center' , 
        alignItems : 'center' ,
        width : 150 ,
        marginBottom: 15 ,
        borderWidth: 2 ,
        borderColor:"#6a0c0c" ,
        borderRadius: 10
    } ,
    buttonSelectStyle :{
        backgroundColor :"#6a0c0c",
        height : 40,
        justifyContent : 'center' , 
        alignItems : 'center' ,
        width : 150 ,
        marginBottom: 15 ,
        borderRadius: 10

    }
});

