import React , {useEffect} from "react";

import { View , Text  , TouchableOpacity , StatusBar, BackHandler,Linking,Platform,ActivityIndicator,StyleSheet ,Image } from "react-native";
import { collection, startAfter , serverTimestamp ,addDoc, query , where , getDocs ,doc,deleteDoc , updateDoc, runTransaction , setDoc,orderBy,limit,onSnapshot } from 'firebase/firestore';

// import { Ionicons } from "@expo/vector-icons";
import { db, auth } from "../config/fireBase";
function LoadsContracts({navigation}){


const [contractLoc , setContraLoc]=React.useState(null)
const [getContracts , setGetContracts]=React.useState([])

  const [dspLoadMoreBtn , setLoadMoreBtn]=React.useState(true)
  const [LoadMoreData , setLoadMoreData]=React.useState(false)

async function loadedData(loadMore) {

  try{
    if(loadMore){

      setLoadMoreData(true) 
    }

    const orderByF = "timeStamp";
    const orderByField = orderBy(orderByF, 'desc'); // Order by timestamp in descending order

    // const pagination = loadMore && loadsList.length > 0 ? [startAfter(loadsList[loadsList.length - 1][orderByF])] : [];
         let dataQuery =query(collection(db, "loadsContracts"),  );

      
    const docsSnapshot = await getDocs(dataQuery);
    
    let userItemsMap = [];
    
    docsSnapshot.forEach(doc => {
        userItemsMap.push({ id: doc.id, ...doc.data() });
    });

    const verifiedUsers = userItemsMap.filter(user => user.isVerified);
    const nonVerifiedUsers = userItemsMap.filter(user => !user.isVerified);
    
    userItemsMap = verifiedUsers.concat(nonVerifiedUsers);
    let loadedData = userItemsMap;

    if (loadedData.length === 0) {
        setLoadMoreBtn(false);
    }

    // Update state with the new data
    setGetContracts(loadMore ? [  ...getContracts , ...loadedData] : loadedData);

    if(loadMore){

       setLoadMoreData(false) 
    }
    }catch(err){
      console.error(err)
    }
}

  

useEffect(() => {
  loadedData();
  
}, []);

// commodity  , contract Id , Contract Duration , Contract Rate ,  contract Route r R  outes ,  , Reuirements , Due Date , owner number , owner Id

const rendereIterms = getContracts.map((item)=>{ 
return (
      
                    <View  style={{  marginBottom : 8,  padding :7 ,borderWidth : 2 , borderColor:'#6a0c0c', borderRadius:8 ,  shadowColor: '#6a0c0c',
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.7,
        shadowRadius: 5,   overflow: 'hidden',   }}  key={item.id} >
                    <View > 
                  <Text style={{ color:'#9c2828' , fontWeight:'bold',fontSize:21}} >9 months Contract Available</Text>
                  <Text>Commodiy : {item.commodity.frst} </Text>
                  <Text>Commodiy : {item.commodity.scnd} </Text>
                  <Text>Commodiy : {item.commodity.third} </Text>
                  <Text>Commodiy : {item.commodity.forth} </Text>
                  <Text>Rate : {item.rate.solidFrst}</Text>
                  <Text>Rate : {item.rate.solidScnd}</Text>
                  <Text>Rate : {item.rate.triaxleFrst}</Text>
                  <Text>Rate : {item.rate.triaxlesScnd}</Text>
                  <Text>Rate : {item.rate.linksFrst}</Text>
                  <Text>Rate : {item.rate.linksScnd}</Text>
                  </View>

                  <Text style={{ color:'#9c2828' , fontWeight:'bold',fontSize:19,marginTop:8}} >Routes</Text>
                  <Text> i {item.location.frst} ii {item.location.scnd}   </Text>
                  <Text> iii {item.location.thrd} iv {item.location.forth}   </Text>
                  <Text> v {item.location.fifth} vi {item.location.sixth}   </Text>

              <View>

                  <Text style={{ color:'#9c2828' , fontWeight:'bold',fontSize:19,marginTop:8}}>Requirements</Text>
                  <Text> {item.trckRequired.frst} </Text>
                  <Text> {item.trckRequired.scnd} </Text>
                  <Text> {item.trckRequired.third} </Text>
                  <Text> {item.trckRequired.forth} </Text>
                  <Text> {item.trckRequired.fifth} </Text>

              </View>

              <View>
                  <Text> {item.otherRequirements.frst} </Text>
                  <Text> {item.otherRequirements.scnd} </Text>
                  <Text> {item.otherRequirements.third} </Text>
                  <Text> {item.otherRequirements.forth} </Text>

              </View>

                  <View style={{marginTop:5}} >
                    <Text>{item.bookingClosingD}</Text>

                  <TouchableOpacity onPress={()=>navigation.navigate("BookLContract")} style={{  width : 150 , height : 30 , alignItems :"center" , justifyContent :'center', backgroundColor:'#228B22' ,  borderRadius: 8, alignSelf:'center', margin:5 }} >

                    <Text style={{color:'white'}}> {item.startingDate} </Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={()=>Linking.openURL(`whatsapp://send?phone=+263716325160  &text=${encodeURIComponent(`Good day`)} `)} style={{  width : 70 , height : 25 , alignItems :"center" , justifyContent :'center',  borderRadius: 8, alignSelf:'center', margin:5 , borderWidth:2 ,borderColor:'red'}} >
        
                    <Text style={{color:'red'}} >Help</Text>
                  </TouchableOpacity>

                  </View>


 </View>
)
})





    const [selectContractCountry, setSelectContractCountry] = React.useState(false)
    function toggleSelctCntrctCounrty(){
      setSelectContractCountry(prev=> !prev)
    }
    return(
        <View style={{paddingTop:89,padding:10}} >

          <View  style={{position:'absolute' , top : 0 , left: 0 , right : 0 , flexDirection : 'row' , height : 74  ,  paddingLeft : 6 , paddingRight: 15 , paddingTop:10 ,backgroundColor : '#6a0c0c' ,paddingTop : 15 , alignItems : 'center' , }} >
         <TouchableOpacity style={{marginRight: 10}} onPress={() => navigation.goBack()}>
            {/* <Ionicons name="arrow-back" size={28} color="white"style={{ marginLeft: 10 }}  /> */}
        </TouchableOpacity> 
        
        <Text style={{fontSize: 20 , color : 'white'}} > { contractLoc ? `Contracts in ${contractLoc} ` :"Choose contract location" } </Text>
       </View>

  <TouchableOpacity onPress={()=>navigation.navigate("addContractsDb")} style={{  width : 150 , height : 30 , alignItems :"center" , justifyContent :'center', backgroundColor:'#228B22' ,  borderRadius: 8, alignSelf:'center', margin:5 }} >

                    <Text style={{color:'white'}}> Add Contract </Text>
                  </TouchableOpacity>
{!contractLoc && <View style={{alignSelf:'center'}} > 
            <TouchableOpacity  onPress={()=>setContraLoc('Zimbabwe')}  style={styles.buttonStyle}   >
          <Text style={{color:'#6a0c0c'}}>Zimbabwe </Text>
        </TouchableOpacity>
          <TouchableOpacity onPress={()=> setContraLoc('SouthAfrica') }  style={styles.buttonStyle} >
            <Text style={{color:'#6a0c0c'}}>South Africa</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={()=> setContraLoc('Namibia') } style={styles.buttonStyle} >
            <Text style={{color:'#6a0c0c'}}>Namibia </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={()=> setContraLoc('Tanzania') } style={styles.buttonStyle} >
            <Text style={{color:'#6a0c0c'}}> Tanzania</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={()=>setContraLoc('Mozambique') }  style={styles.buttonStyle} >
            <Text style={{color:'#6a0c0c'}}>Mozambique </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={()=> setContraLoc('Zambia') } style={styles.buttonStyle}  >
            <Text style={{color:'#6a0c0c'}}> Zambia</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={()=> setContraLoc('Botswana') }  style={styles.buttonStyle} >
            <Text style={{color:'#6a0c0c'}}>Botswana </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={()=> setContraLoc('Malawi') } style={styles.buttonStyle} >
            <Text style={{color:'#6a0c0c'}}>Malawi </Text>
        </TouchableOpacity>
</View> }

{contractLoc && rendereIterms }

        </View>
    )
}
export default React.memo(LoadsContracts)


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