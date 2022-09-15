/**
 * Gets the page data for the specified title
 *
 * @param {string} title : name of the page
 * @param {string} value : field of the page
 * @returns {object/string} : page data/empty string
 */
export default function getPage(title, value) {
	if (sessionStorage.getItem(title))
		return JSON.parse(sessionStorage.getItem(title))[value];
	else return "";
}
