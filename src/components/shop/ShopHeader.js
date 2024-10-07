import React from "react";
import SearchIcon from '@mui/icons-material/Search';
import {View , TouchableOpacity , Text , StyleSheet , ScrollView} from "react-native"
import { useNavigate , useParams} from "react-router-dom";

import MoreVertIcon from '@mui/icons-material/MoreVert';


import { auth } from "../config/fireBase";
import {doc , onSnapshot} from "firebase/firestore"
import { db } from "../config/fireBase";
function ShopHeader(){
    const navigate = useNavigate()
  const {location , specproduct } = useParams()

const [sellOBuy , setSellOBuy] = React.useState('forSell')

    function toggleSellOBuy(value){
        setSellOBuy(value)
        navigate(`/DspShop/${location}/vehicles/${value}/`) 
    }


    const [smallMenu , setSmallMenu] = React.useState(false)
    function toggleSmallMenu(){
        setSmallMenu(prev => !prev)
    }

  const [currentUser, setCurrentUser] = React.useState(null);

  React.useEffect(() => {
    // Check if user is already signed in
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    // Cleanup function
    return () => unsubscribe();
  }, []);


   const [ username , setUsername] = React.useState("");

  React.useEffect(() => {
  let unsubscribe;

  try {
    if (auth.currentUser) {
      const userId = auth.currentUser.uid;
      const docRef = doc(db, 'personalData', userId);

      unsubscribe = onSnapshot(docRef, (doc) => {
        if (doc.exists()) {
          setUsername(doc.data().username);
        }
      });
    }
  } catch (err) {
    console.error(err);
  }

  return () => {
    if (unsubscribe) {
      unsubscribe();
    }
  };
}, [currentUser]);

  function checkAuth(){
    if(!currentUser){
      navigate("/createUser/")
    }else if(currentUser &&!username){
        navigate("/addPersnoalInfo/")
    }else {
        toggleSmallMenu()
    }
  }
    return(
        <View>

             <View style={{flexDirection : 'row' , height : 54 ,justifyContent : 'space-between' ,  paddingLeft : 15 , paddingRight: 15 , paddingTop:10 ,backgroundColor : '#6a0c0c' ,paddingTop : 15 , }} >
                <Text style={{color : 'white' , fontSize : 19 , zIndex : 50}} >{location} Store  </Text>
                
            <View style={{justifyContent:'space-evenly' , backgroundColor:'#6a0c0c'}} >
       {sellOBuy !== "toBuy" || sellOBuy !=="forSell" ?<View style={{flexDirection :'row',backgroundColor:'#6a0c0c' }} >

            <TouchableOpacity onPress={()=>toggleSellOBuy("forSell")}
             style={sellOBuy === "forSell" ? styles.bttonIsTrue : styles.buttonIsFalse} >
               <Text style={sellOBuy === "forSell" ? {color:'black'} : {color:'white'}} >BUY</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>toggleSellOBuy("toBuy")} style={sellOBuy === "toBuy" ? styles.bttonIsTrue : styles.buttonIsFalse} >
                <Text style={sellOBuy === "toBuy" ? {color:'black'} :{color:'white'} } >SELL</Text>
            </TouchableOpacity>

        </View> :null }

          <Text style={{color:'white'}} >Want to {sellOBuy === "forSell" ? "BUY" :'SELL'} </Text> 
          </View>
                <View style={{flexDirection: 'row'}} > 
                    <TouchableOpacity onPress={()=> navigate('/shosearchElement/') }>

                          <SearchIcon style={{color : 'white'}}/>

                    </TouchableOpacity>


                    <TouchableOpacity style={{marginLeft : 6}} onPress={checkAuth} >
                    <MoreVertIcon style={{color : 'white'}}/>
                    </TouchableOpacity>

                </View>

            </View>


         {sellOBuy ===  "toBuy" || sellOBuy ==="forSell" ? <View style={{flexDirection:'row' , justifyContent : 'space-evenly' , paddingLeft : 20 , paddingRight: 20 , height : 40 , alignItems : 'center' , backgroundColor : '#6a0c0c' , paddingTop : 10 }}>

            <TouchableOpacity onPress={()=> navigate(`/DspShop/${location}/vehicles/${sellOBuy}/ `) }> 
                {  specproduct === "vehicles" ?
                 <Text style={{color:'white' , textDecorationLine:'underline' , fontWeight:'600' , fontSize : 18  }} > Showroom</Text> :
                 <Text style={{color:'white', }} > Showroom</Text>
                }
            </TouchableOpacity>

            <TouchableOpacity onPress={()=> navigate(`/DspShop/${location}/trailers/${sellOBuy}/`) } >
                {specproduct === "trailers" ?
                 <Text style={{color:'white' , textDecorationLine :'underline',fontWeight:'600' , fontSize : 18}} > Trailer</Text> :
                 <Text style={{color:'white'}} > Trailer</Text>}
            </TouchableOpacity>

            <TouchableOpacity onPress={()=> navigate(`/DspShop/${location}/spares/${sellOBuy}/`) }>
               {specproduct === "spares" ?
               <Text style={{color:'white' , textDecorationLine :'underline' ,fontWeight:'600' , fontSize : 18 }} > Spares</Text> :
               <Text style={{color:'white'}} > Spares</Text>}
            </TouchableOpacity>

            <TouchableOpacity onPress={()=> navigate(`/DspShop/${location}/Sprovider/${sellOBuy}/`) }>
               {specproduct === "Sprovider" ?
               <Text style={{color:'white' , textDecorationLine :'underline' ,fontWeight:'600' , fontSize : 18 }} > Service Provider</Text> :
               <Text style={{color:'white'}} > SProvider </Text>}

            </TouchableOpacity>
        </View>:null     }

                   {smallMenu && <View style={{position : 'absolute' ,top : 40 , right : 0  , borderBlockColor:"#6a0c0c",borderWidth:3 , backgroundColor :'white'  , width : 165 , }} >
                        <TouchableOpacity  style={{height : 27  }} onPress={()=> navigate(`/manageStock/`) } >
                        <Text  > Manage Stock</Text>
                        </TouchableOpacity>
                    </View>}
        </View>
    )
}
export default React.memo(ShopHeader)

const styles = StyleSheet.create({
  
  buttonIsFalse : {
     borderWidth : 1 ,
     borderColor : '#6a0c0c' ,
     paddingLeft :4 , 
     paddingRight:4 ,
    //  marginLeft : 6
   } , 
    bttonIsTrue:{
    backgroundColor : 'white' ,
     paddingLeft :4 ,
     paddingRight:4 ,
     color :'white' 

    }
});