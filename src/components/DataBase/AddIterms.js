import React from "react"
import {View , TouchableOpacity , Text ,StyleSheet }from "react-native"


import {useNavigate} from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
function AddIterms(){
    const [truckType , setTruckType] =React.useState(false)
    const navigate = useNavigate()

    function toggleSelecTruck(){
        setTruckType(prev =>!prev)
    }
    return(
        <View style={{alignItems : 'center' , paddingTop : 80}} >

        <View  style={{position:'absolute' , top : 0 , left: 0 , right : 0 , flexDirection : 'row' , height : 74  ,  paddingLeft : 6 , paddingRight: 15 , paddingTop:10 ,backgroundColor : '#6a0c0c' ,paddingTop : 15 , alignItems : 'center' , }} >
         <TouchableOpacity style={{marginRight: 10}} onPress={() => navigate(-1)}>
                    <ArrowBackIcon style={{color : 'white'}} />
        </TouchableOpacity> 
        
        <Text style={{fontSize: 20 , color : 'white'}} > Add Iterms  </Text>
       </View> 
          {!truckType&& <View>
            <TouchableOpacity  onPress={()=> navigate('/AddIterms/addLoadsDB') } style={styles.buttonSelectStyle} >
                <Text style={{color:"white"}}>Add Loads </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleSelecTruck} style={styles.buttonSelectStyle}>
                <Text style={{color:"white"}}>Add Trucks</Text>
            </TouchableOpacity>
            </View>}

           { truckType &&<View>
                <TouchableOpacity  onPress={()=> navigate('/addTrucksDB/BulkTrailers') }  style={styles.buttonStyle}>
                    <Text style={{color:"#6a0c0c"}}>BulkTrailers </Text>
                </TouchableOpacity>

                <TouchableOpacity  onPress={()=> navigate( '/addTrucksDB/sideTippers') }  style={styles.buttonStyle}>
                    <Text style={{color:"#6a0c0c"}}>SideTipper </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={()=> navigate('/addTrucksDB/LowBeds') }  style={styles.buttonStyle}>
                    <Text style={{color:"#6a0c0c"}}> Lowbeds </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={()=> navigate('/addTrucksDB/tauntliner' ) } style={styles.buttonStyle}>
                    <Text style={{color:"#6a0c0c"}}> Tautliner </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={()=> navigate('/addTrucksDB/tanker') } style={styles.buttonStyle} >
                    <Text style={{color:"#6a0c0c"}}>Takers </Text>
                </TouchableOpacity>

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
        height : 47,
        justifyContent : 'center' , 
        alignItems : 'center' ,
        width : 150 ,
        marginBottom: 15 ,
        borderRadius: 10

    }
});
