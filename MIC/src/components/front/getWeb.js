import fire from "../fire";

//Used to get pre-login web page html/data
export default async function getWeb(title){
  //checks if not in local storage, meaning database can be pulled
  if(!sessionStorage.getItem(title)){
    //getting the subcollection form 'web' collection from firestore
    try{
      const doc = await fire.firestore().collection('web').doc(title).get();
      
      //checking to make sure it actually got data
      if(doc.empty){
        return;
      }

      //adding web page html/data to local storage
      sessionStorage.setItem(title, JSON.stringify(doc.data()));
      return doc.data();
      
    } catch (err) {
      console.error(err);
    }
  }
}