export default function getPage(title, value){
  if(sessionStorage.getItem(title))
    return(JSON.parse(sessionStorage.getItem(title))[value]);
  else
    return "";
}