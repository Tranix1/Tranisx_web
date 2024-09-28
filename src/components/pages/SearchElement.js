import React,{useState,useEffect} from "react";
import { View , Text , ScrollView , TouchableOpacity,TextInput} from "react-native";

import { collection, onSnapshot ,doc } from 'firebase/firestore';
import { db } from "../config/fireBase";
// import MaterialIcons from '@expo/vector-icons/MaterialIcons';
// import { Ionicons } from "@expo/vector-icons";

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {useNavigate,} from 'react-router-dom';
import VerifiedIcon from '@mui/icons-material/Verified';


function SearchIterms({navigation}){
const navigate = useNavigate()
     const loadsCollection = collection(db, 'Loads');  
      const [loadsList, setLoadsList] = useState([]);

    useEffect(() => {
      const unsubscribe = onSnapshot(loadsCollection, (querySnapshot) => {
        let filteredData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        
        filteredData =   filteredData.sort((a, b) => a.timestamp - b.timestamp);

        setLoadsList(filteredData);
      });
  
      return () => {
        unsubscribe(); // Unsubscribe the listener when the component unmounts
      };
    }, []);

   const trucksDB = collection(db , "Trucks")
  const [allTrucks, setAllTrucks] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(trucksDB, (querySnapshot) => {
      const filteredData = [];

      querySnapshot.forEach((doc) => {
        filteredData.push({
          id: doc.id,
          ...doc.data()
        });
      });

      setAllTrucks(filteredData);
    });

    return () => {
      unsubscribe(); // Unsubscribe the listener when the component unmounts
    };
  }, []); 

        const [filteredData, setFilteredData] = React.useState([]);
        const [filteredDataTrucks , setFilteredDataTruks] = React.useState([]);
        const [wordEntered, setWordEntered] = React.useState("");
      
        const handleFilter = (text) => {
          const searchWord = text
          const newFilter = loadsList.filter((value) => {
            return ( value.fromLocation || value.toLocation ).toLowerCase().includes(searchWord.toLowerCase());
          });
      
          const newFilterTrucks = allTrucks.filter((value) => {
            return ( value.fromLocation || value.toLocation ).toLowerCase().includes(searchWord.toLowerCase());
          });
          if (searchWord === "") {
            setFilteredData([]);
          } else {
            setFilteredData(newFilter);
            setFilteredDataTruks(newFilterTrucks)
          }
        };

        const clearInput = () => {
          setFilteredData([]); 
          setWordEntered("");
        };
        

        // const searchedTruks = 
          const displaySearchedTrucks =  filteredDataTrucks.slice(0, 15).map((value , key)=>{
            return(
              <TouchableOpacity  style={{flex : 1, marginBottom :6 , padding : 6}} key={value.id} onPress={()=> navigate(`/selectedUserTrucks/${value.userId}` ) }>

            {value.isVerified&& <View style={{position : 'absolute' , top : 0 , right : 0 , backgroundColor : 'white' , zIndex : 66 }} >
            <VerifiedIcon style={{color : 'green'}} />
            </View>}
            <Text style={{color:'#6a0c0c' , fontSize:15,textAlign :'center' ,fontSize: 17}}>{value.CompanyName} </Text>
            <Text >from {value.fromLocation } to {value.toLocation} </Text>
              </TouchableOpacity>
            )
          })
          

        const displaySearched =  filteredData.slice(0, 15).map((value , key)=>{
            return(
              <TouchableOpacity  style={{flex : 1, marginBottom :6 , padding : 6}} key={value.id} onPress={()=> navigate(`/searchedLoads/${value.userId}/${value.id}` ) }>

            {value.isVerified&& <View style={{position : 'absolute' , top : 0 , right : 0 , backgroundColor : 'white' , zIndex : 66 }} >
            <VerifiedIcon style={{color : 'green'}} />
            </View>}
            <Text style={{color:'#6a0c0c' , fontSize:15,textAlign :'center' ,fontSize: 17}}>{value.companyName} </Text>
            <Text >Commodity {value.typeofLoad}  rate {value.ratePerTonne} </Text>
            <Text >from {value.fromLocation } to {value.toLocation} </Text>
              </TouchableOpacity>
            )
          })
          
           return(
            <View>
            <View  style={{ height : 84  ,   paddingTop:10  ,paddingTop : 15 , alignItems : 'center' , paddingTop : 10  , alignItems : 'center', justifyContent:'center',borderColor:'#6a0c0c', borderWidth:2}} >

              <View  style={{flexDirection : 'row' ,height : 40 , backgroundColor :'#6a0c0c' , alignItems : 'center'}}>
                <TouchableOpacity style={{marginRight: 10}} onPress={() => navigate(-1)}>
                    <ArrowBackIcon style={{color : 'white'}} />
                </TouchableOpacity>
                <TextInput
                    placeholder="Search  Route"
                    onChangeText={(text) => handleFilter(text)}  
                    style={{height:40, flex : 1 ,fontSize : 17 , backgroundColor: '#6a0c0c' , color:'white'}}      
                    placeholderTextColor="white"    
                    /> 
                    </View>
            </View> 
            <View style={{flexDirection :'row' , justifyContent:'space-evenly'}} >
             { filteredData.length > 0 && (
              <ScrollView  >
              <Text style={{fontSize : 20 , textDecorationLine:'underline '}}> Available Loads  </Text>
              { loadsList.length ? displaySearched:"Loading loads ......" }
             </ScrollView>

              )
              } 

                <View style={{ width: 2, backgroundColor: '#6a0c0c' }} >
                  </View>

            { filteredDataTrucks.length > 0 && <ScrollView >
              <Text style={{fontSize : 20 , textDecorationLine:'underline '}}> Available Trucks  </Text>
                {allTrucks ? displaySearchedTrucks :'Loading loads ......' }
             </ScrollView>}
             </View>

          </View>
           )
}
export default React.memo(SearchIterms)