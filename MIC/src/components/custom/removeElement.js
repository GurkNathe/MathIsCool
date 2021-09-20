export default function removeElement(array, index){
  let first = array.splice(0,index-1);
  let second = array.splice(1,array.length);
  array = first.concat(second);
  return array;
}