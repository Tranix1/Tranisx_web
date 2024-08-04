// export default
function SideBarData( BulkTrailer , param2){
  const weed = param2
return  [
  {
    name : " Bulk Trailers / Flat Decks ",
    id : 1,
    state : true,
    ammount : weed
},
  {
  name : "Side Tippers",
  id : 2,
  state : false,
  ammount : weed

},
{
  name : "Low beds",
  id : 3,
  state : false,
  ammount : param2
},
{
  name : "Tankers",
  id : 4,
  state : false,
  ammount : BulkTrailer

},
{
  name : " tautliner",
  id : 5,
  state : false,
  ammount : BulkTrailer

},
]

}
export default SideBarData