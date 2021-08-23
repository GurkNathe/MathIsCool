import fire from "../fire";

//Used to get pre-login web page html/data
export default async function getWeb(title){
  //checks if load variable in local storage is true, meaning database can be pulled
  if(!localStorage.getItem(title)){
    //getting the 'web' collection from firestore
    try{
      const doc = await fire.firestore().collection('web').doc(title).get();

      //checking to make sure it actually got data
      if(doc.empty){
        console.log(doc);
        return;
      }

      //adding web page html/data to local storage
      localStorage.setItem(title, JSON.stringify(doc.data()));
      
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  }
}