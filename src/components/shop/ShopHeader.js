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
                <View style={{flexDirection: 'row'}} > 
                    <TouchableOpacity onPress={()=> navigate('/shosearchElement/') }>

                          <SearchIcon style={{color : 'white'}}/>

                    </TouchableOpacity>


                    <TouchableOpacity style={{marginLeft : 6}} onPress={checkAuth} >
                    <MoreVertIcon style={{color : 'white'}}/>
                    </TouchableOpacity>


                </View>

            </View>

        <View style={{flexDirection:'row' , justifyContent : 'space-evenly' , paddingLeft : 20 , paddingRight: 20 , height : 40 , alignItems : 'center' , backgroundColor : '#6a0c0c' , paddingTop : 10 }}>

            <TouchableOpacity onPress={()=> navigate(`/DspShop/${location}/vehicles`) }> 
                {  specproduct === "vehicles" ?
                 <Text style={{color:'white' , textDecorationLine:'underline' , fontWeight:'600' , fontSize : 18  }} > Showroom</Text> :
                 <Text style={{color:'white', }} > Showroom</Text>
                }
            </TouchableOpacity>

            <TouchableOpacity onPress={()=> navigate(`/DspShop/${location}/trailers`) } >
                {specproduct === "trailers" ?
                 <Text style={{color:'white' , textDecorationLine :'underline',fontWeight:'600' , fontSize : 18}} > Trailer</Text> :
                 <Text style={{color:'white'}} > Trailer</Text>}
            </TouchableOpacity>

            <TouchableOpacity onPress={()=> navigate(`/DspShop/${location}/spares`) }>
               {specproduct === "spares" ?
               <Text style={{color:'white' , textDecorationLine :'underline' ,fontWeight:'600' , fontSize : 18 }} > Spares</Text> :
               <Text style={{color:'white'}} > Spares</Text>}
            </TouchableOpacity>

            <TouchableOpacity onPress={()=> navigate(`/DspShop/${location}/Sprovider`) }>
               {specproduct === "Sprovider" ?
               <Text style={{color:'white' , textDecorationLine :'underline' ,fontWeight:'600' , fontSize : 18 }} > Service Provider</Text> :
               <Text style={{color:'white'}} > SProvider </Text>}

            </TouchableOpacity>
        </View>
                   {smallMenu && <View style={{position : 'absolute' ,top : 40 , right : 0  , borderBlockColor:"#6a0c0c",borderWidth:3 , backgroundColor :'white'  , width : 165 , }} >
                        <TouchableOpacity  style={{height : 27  }} onPress={()=> navigate(`/manageStock/`) } >
                        <Text  > Manage Stock</Text>
                        </TouchableOpacity>
                    </View>}
        </View>
    )
}
export default React.memo(ShopHeader)