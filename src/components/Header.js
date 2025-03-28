import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigate } from "react-router-dom";

import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
function Header({ checkAuth, dspMenu }) {

    const navigate = useNavigate()
    return (
        <View>
            <View style={{ flexDirection: 'row', height: 54, justifyContent: 'space-between', paddingLeft: 15, paddingRight: 15, paddingTop: 10, backgroundColor: '#6a0c0c', paddingTop: 15, }} >

                <Text style={{ color: 'white', fontSize: 25, zIndex: 50, fontWeight: 'Bold' }} >Transix</Text>
                <View style={{ flexDirection: 'row' }} >
                    <TouchableOpacity onPress={() => navigate('/searchElement')} >
                        <SearchIcon style={{ color: 'white' }} />
                    </TouchableOpacity>

                    {dspMenu && <TouchableOpacity style={{ marginLeft: 6 }} onPress={checkAuth}>
                        <MoreVertIcon style={{ color: 'white' }} />
                    </TouchableOpacity>}


                </View>
            </View>
        </View>
    )
}
export default React.memo(Header)