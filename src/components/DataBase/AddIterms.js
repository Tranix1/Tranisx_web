import React from "react"
import {View , TouchableOpacity , Text ,StyleSheet }from "react-native"

import {useNavigate , useParams} from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function AddIterms(){
    const navigate = useNavigate()
    const {addTrucks , fromLocation ,toLocation,verifiedLoad } = useParams()

    const [truckType , setTruckType] =React.useState(false)
    const [truckTonnageDsp , setTruckTonnageDap] =React.useState(false)
    function addTruckType(truckTypeF){
        setTruckType(truckTypeF)
        setTruckTonnageDap(true)
    }
 
    return(
        <View style={{alignItems : 'center' , paddingTop : 80}} >

        <View  style={{position:'absolute' , top : 0 , left: 0 , right : 0 , flexDirection : 'row' , height : 74  ,  paddingLeft : 6 , paddingRight: 15 , paddingTop:10 ,backgroundColor : '#6a0c0c' ,paddingTop : 15 , alignItems : 'center' , }} >
         <TouchableOpacity style={{marginRight: 10}} onPress={() => navigate(-1)}>
                    <ArrowBackIcon style={{color : 'white'}} />
        </TouchableOpacity> 
        
        <Text style={{fontSize: 20 , color : 'white'}} > Add Items  </Text>
       </View> 
          {!addTrucks&& <View>
            <TouchableOpacity  onPress={()=> navigate('/AddIterms/addLoadsDB') } style={styles.buttonSelectStyle} >
                <Text style={{color:"white"}}>Add Loads </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>navigate(verifiedLoad?`/AddIterms/addTrucks/${fromLocation}/${toLocation}/${verifiedLoad}` : '/AddIterms/addTrucks') } style={styles.buttonSelectStyle}>
                <Text style={{color:"white"}}>Add Trucks</Text>
            </TouchableOpacity>
            </View>}

           { addTrucks &&<View>

            {!truckTonnageDsp&& <View>
                   <TouchableOpacity   style={styles.buttonStyle} onPress={()=>addTruckType("BulkTrailers")} >

                    <Text style={{color:"#6a0c0c"}}>BulkTrailers </Text>
                </TouchableOpacity>

                <TouchableOpacity  onPress={()=>addTruckType("flatDecks")}  style={styles.buttonStyle}>
                    <Text style={{color:"#6a0c0c"}}>flatDecks </Text>
                </TouchableOpacity>
                <TouchableOpacity  onPress={()=>addTruckType("sideTippers")}  style={styles.buttonStyle}>
                    <Text style={{color:"#6a0c0c"}}>SideTippers </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={()=>addTruckType("LowBeds")} style={styles.buttonStyle}>
                    <Text style={{color:"#6a0c0c"}}> Lowbeds </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={()=>addTruckType("tauntliner")}  style={styles.buttonStyle}>
                    <Text style={{color:"#6a0c0c"}}> Tautliners </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={()=>addTruckType("tanker")}  style={styles.buttonStyle} >
                    <Text style={{color:"#6a0c0c"}}>Tankers </Text>
                </TouchableOpacity>
               <TouchableOpacity onPress={()=>addTruckType("Rigid")}  style={styles.buttonStyle} >
                    <Text style={{color:"#6a0c0c"}}>Rigids </Text>
                </TouchableOpacity>

               <TouchableOpacity onPress={()=>addTruckType("other")}   style={styles.buttonStyle} >
                    <Text style={{color:"#6a0c0c"}}>Other</Text>
                </TouchableOpacity>
                 </View>}

                    {truckTonnageDsp && <View>
                <Text style={{alignSelf:'center', fontSize:18 , fontWeight:'bold'}} >Truck Tonnage</Text>
                <TouchableOpacity style={styles.buttonStyle} onPress={()=> navigate(`/addTrucksDB/${truckType}/${fromLocation}/${toLocation}/${verifiedLoad}/1-3 T`) }   >
                    <Text>1-3 T</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.buttonStyle}  onPress={()=> navigate(`/addTrucksDB/${truckType}/${fromLocation}/${toLocation}/${verifiedLoad}/4 - 7 T`) }  >
                    <Text>4 - 7 T</Text>
                </TouchableOpacity>

                    <TouchableOpacity style={styles.buttonStyle}  onPress={()=> navigate(`/addTrucksDB/${truckType}/${fromLocation}/${toLocation}/${verifiedLoad}/8 - 14 T`) } >
                        <Text>8 - 14 T</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.buttonStyle} onPress={()=> navigate(`/addTrucksDB/${truckType}/${fromLocation}/${toLocation}/${verifiedLoad}/15 - 25 T`) }  >
                        <Text>15 - 25 T</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.buttonStyle}   onPress={()=> navigate(`/addTrucksDB/${truckType}/${fromLocation}/${toLocation}/${verifiedLoad}/26 T +++`) } >
                        <Text>26 T +++ </Text>
                    </TouchableOpacity>
                   


                </View> }
            </View>}
        </View>
    )
}
export default React.memo(AddIterms)


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
