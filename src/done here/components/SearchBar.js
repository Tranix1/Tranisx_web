import React, { useState } from "react";
import SearchIcon from '@mui/icons-material/Search';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import "./SearchBar.css"
function SearchBar( {allData} ) {
  
  const [filteredData, setFilteredData] = useState([]);
  const [wordEntered, setWordEntered] = useState("");

  const handleFilter = (event) => {
    const searchWord = event.target.value;
    setWordEntered(searchWord);
    const newFilter = allData.filter((value) => {
      console.log(allData)
      return value.name.toLowerCase().includes(searchWord.toLowerCase());
    });

    if (searchWord === "") {
      setFilteredData([]);
    } else {
      setFilteredData(newFilter);
    }
  };

  const clearInput = () => {
    setFilteredData([]);
    setWordEntered("");
  };

  return (
    <div className="search" >
      <div className="searchInputs">
        <input
          type="text"
          value={wordEntered}
          onChange={handleFilter}
        />
        <div className="searchIcon" >
          {filteredData.length === 0 ? (
             <SearchIcon />
           ) : (
             <CloseRoundedIcon id="clearBtn" onClick={clearInput} />
           )}
           </div>
      </div>
      {filteredData.length != 0 && (
        <div className="dataResult">
          {filteredData.slice(0, 15).map((value, key) => {
            return (
              <a className="dataItem" href={value.link} target="_blank">
                <p>{value.name} </p>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}

