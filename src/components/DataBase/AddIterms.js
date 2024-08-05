import React from "react"
import {View , TouchableOpacity , Text ,StyleSheet }from "react-native"


import {useNavigate} from 'react-router-dom';
function AddIterms(){
    const [truckType , setTruckType] =React.useState(false)
    const navigate = useNavigate()

    function toggleSelecTruck(){
        setTruckType(prev =>!prev)
    }
    return(
        <View style={{alignItems : 'center' , paddingTop : 60}} >

          {!truckType&& <View>
            <TouchableOpacity  onPress={()=> navigate('addLoadsDB') } style={styles.buttonSelectStyle} >
                <Text style={{color:"white"}}>Add Loads </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleSelecTruck} style={styles.buttonSelectStyle}>
                <Text style={{color:"white"}}>Add Trucks</Text>
            </TouchableOpacity>
            </View>}

           { truckType &&<View>
                <TouchableOpacity  onPress={()=> navigate('addTrucksDB', {truckType:'BulkTrailers'}) }  style={styles.buttonStyle}>
                    <Text style={{color:"#6a0c0c"}}>BulkTrailers </Text>
                </TouchableOpacity>

                <TouchableOpacity  onPress={()=> navigate( 'addTrucksDB', {truckType:'sideTippers'}) }  style={styles.buttonStyle}>
                    <Text style={{color:"#6a0c0c"}}>SideTipper </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={()=> navigate('addTrucksDB', {truckType:'LowBeds'}) }  style={styles.buttonStyle}>
                    <Text style={{color:"#6a0c0c"}}> Lowbeds </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={()=> navigate('addTrucksDB', {truckType:'tauntliner'}) } style={styles.buttonStyle}>
                    <Text style={{color:"#6a0c0c"}}> Tautliner </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={()=> navigate('addTrucksDB', {truckType:'tanker'}) } style={styles.buttonStyle} >
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
