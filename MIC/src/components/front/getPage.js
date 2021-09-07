export default function getPage(title, value){
  if(localStorage.getItem(title))
      if(title === "news" || title === "faq")
        return(JSON.parse(localStorage.getItem(title))[value]);
      else //just a patch if others are changed, or reverted.
        return(JSON.parse(localStorage.getItem(title))[title][value]);
  else
    return "";
}