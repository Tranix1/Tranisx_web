import React from "react";
import SearchIcon from '@mui/icons-material/Search';
import {View , TouchableOpacity , Text , StyleSheet , ScrollView} from "react-native"
import { useNavigate , useParams} from "react-router-dom";

function ShopHeader(){
    const navigate = useNavigate()
  const {location} = useParams()

    return(
        <View>

             <View style={{flexDirection : 'row' , height : 54 ,justifyContent : 'space-between' ,  paddingLeft : 15 , paddingRight: 15 , paddingTop:10 ,backgroundColor : '#6a0c0c' ,paddingTop : 15 , }} >
                <Text style={{color : 'white' , fontSize : 19 , zIndex : 50}} >Truckerz Store</Text>
                <View style={{flexDirection: 'row'}} > 
                    <TouchableOpacity onPress={()=> navigate('searchElement') }>

                          <SearchIcon style={{color : 'white'}}/>

                    </TouchableOpacity>

                </View>

            </View>

        <View style={{flexDirection:'row' , justifyContent : 'space-evenly' , paddingLeft : 20 , paddingRight: 20 , height : 40 , alignItems : 'center' , backgroundColor : '#6a0c0c' , paddingTop : 10 }}>

            <TouchableOpacity onPress={()=> navigate(`/DspShop/${location}/vehicles`) }> 
                <Text> Vehicle showroom</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={()=> navigate(`/DspShop/${location}/trailers`) } >
                <Text> Trailer</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={()=> navigate(`/DspShop/${location}/spares`) }>
                <Text> Spares</Text>
            </TouchableOpacity>

        </View>
        </View>
    )
}
export default React.memo(ShopHeader)