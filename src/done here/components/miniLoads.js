import React from 'react';

const MiniLoad = ({ item, handleClickOneData , handleClickWholeDiv}) => {

  const handleClick = () => {
    handleClickOneData(item.userId);
  };
  return (

    <div className="frontloadDisplay" >
      <button onClick={handleClick} className='moreLessBTN'>more</button>
      <div onClick={handleClickWholeDiv}>
        <div className='miniloadH3Div'>

      <h3 className='miniloadH3'> {item.companyName} </h3>
        </div>
      <p>
        Type of load: <span className="spaninMini">{item.typeofLoad}</span>
      </p>
      <p>
        From : <span className="spaninMini">{item.fromLocation}</span> to : 
        <span className="spaninMini">{item.toLocation}</span>
      </p>
      <p>
        Rate : <span className="spaninMini">{item.ratePerTonne}</span>
      </p>

      </div>
    </div>
  );
};

export default MiniLoad;