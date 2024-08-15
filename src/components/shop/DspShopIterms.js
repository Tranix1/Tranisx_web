import React from "react";
import {View , TouchableOpacity , Text , StyleSheet , ScrollView} from "react-native"
import DspSoldIterms from "./DspSoldIterms";
import ShopHeader from "./ShopHeader";

import { useNavigate , useParams} from "react-router-dom";
function DspShopIterms(){

  const navigate = useNavigate()
  const {location} = useParams()

return(
    <View> 
        <ShopHeader/>

             <TouchableOpacity onPress={()=> navigate(`/selectAddShop/${location}/`) }  style={{position :'absolute',top: 440 ,right:10 , width : 60 , height : 35 , alignItems :"center" , justifyContent :'center', backgroundColor:'rgb(129,201,149)' , zIndex :200 , borderRadius: 8}} >
                <Text style={{color : 'white'}} >Add</Text>
             </TouchableOpacity>

             <ScrollView>
                <DspSoldIterms  />
             </ScrollView>

    </View>

)
}
export default React.memo(DspShopIterms)