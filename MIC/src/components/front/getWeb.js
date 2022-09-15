import { doc, getDoc } from "@firebase/firestore";
import { db } from "../fire";

/**
 * Used to get pre-login web page html/data
 *
 * @param {string} title : title of the page requested
 * @returns {object} : data from the web page or undefined if page isn't found
 */
export default async function getWeb(title) {
	// Checks if not in session storage, meaning database can be pulled
	if (!sessionStorage.getItem(title)) {
		// Getting the subcollection form 'web' collection from firestore
		try {
			const ref = doc(db, "web", title);
			const page = await getDoc(ref);

			// Checking to make sure it actually got data
			if (page.empty) {
				return;
			}

			//adding web page html/data to local storage
			sessionStorage.setItem(title, JSON.stringify(page.data()));
			return page.data();
		} catch (err) {
			console.error(err);
		}
	}
}
