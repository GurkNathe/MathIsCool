export default function getPage(title, value){
  if(localStorage.getItem(title))
      return(JSON.parse(localStorage.getItem(title))[title][value]);
  else
    return "";
}