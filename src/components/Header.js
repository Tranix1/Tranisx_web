import React from "react";
import { View , Text , TouchableOpacity } from "react-native";
// import FontAwesome from '@expo/vector-icons/FontAwesome';
// import { Ionicons } from '@expo/vector-icons';
import SmallMenu from "./SmallMenu";
import { auth } from "./config/fireBase";
import {doc , onSnapshot} from "firebase/firestore"
import { db } from "./config/fireBase";


import { useNavigate } from "react-router-dom";
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';


 function Header ({toggleSmallMenu}){

  const navigate = useNavigate()

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

  // function checkAuth(){
  //   if(!currentUser){
  //     navigation.navigate("createUser")
  //   }else if(currentUser &&!username){
  //     navigation.navigate("addPersnoalInfo")
  //   }else {
  //     toggleSmallMenu()
  //   }
  // }

    return(
        <View>
            {/* rgb(138, 180, 248) */}
            {/* rgb(0, 102, 0) */}
            {/* '#c0bab2 */}
             {/* '#f5f5f5' */}
             {/* March 29 */}
              {/* '#bbb5ac' */}
             {/* import { BsThreeDotsVertical } from "react-icons/bs"; */}
                {/* {smallMenu && ! currentUser  } */}


             <View style={{flexDirection : 'row' , height : 54 ,justifyContent : 'space-between' ,  paddingLeft : 15 , paddingRight: 15 , paddingTop:10 ,backgroundColor : '#6a0c0c' ,paddingTop : 15 , }} >
                <Text style={{color : 'white' , fontSize : 19 , zIndex : 50}} >Truckerz</Text>
                <View style={{flexDirection: 'row'}} > 
                    <TouchableOpacity onPress={()=> navigate('searchElement') }>


                          {/* <FontAwesome name="search" size={24} color="white" /> */}
                          {/* <Text>yaya  </Text> */}
                          <SearchIcon style={{color : 'white'}}/>

                    </TouchableOpacity>

                    {/* <TouchableOpacity style={{marginLeft : 6}} onPress={currentUser? toggleSmallMenu :()=> navigation.navigate('createUser')  } > */}
                    <TouchableOpacity style={{marginLeft : 6}}  onPress={toggleSmallMenu}>
                    {/* <Ionicons name="ellipsis-vertical" size={24} color="white" /> */}
                    <MoreVertIcon style={{color : 'white'}}/>
                    </TouchableOpacity>
                </View>

             </View>

             <View>

             </View>

        </View>
    )
}
export default React.memo(Header)