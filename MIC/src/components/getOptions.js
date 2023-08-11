import { doc, getDoc } from "@firebase/firestore";
import { db } from "./fire";

/**
 * Loads the options object
 *
 * @param {function} setOptions : Setter function for options in the component where getOptions() is called
 */
export default async function getOptions(setOptions) {
	const options = doc(db, "web", "options");
	await getDoc(options)
		.then((doc) => {
			if (doc !== undefined) {
				sessionStorage.setItem("options", JSON.stringify(doc.data()));
				if (!!setOptions) {
					setOptions(doc.data());
				}
			}
		})
		.catch((err) => console.error(err));
}
