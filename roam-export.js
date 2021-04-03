{
	"translatorID": "dda092d2-a257-46af-b9a3-2f04a55cb04f",
	"translatorType":2,
	"label":"Roam Metadata Export",
	"creator":"",
	"target":"md",
	"minVersion":"2.0",
	"maxVersion":"",
	"priority":200,
	"configOptions": {
		"getCollections": "true",
		"dataMode": "rdf/xml"
	},
	"inRepository":false,
	"lastUpdated":"2020-11-24 - 07:30"
	}

function doExport() {
	let item;
	while ((item = Zotero.nextItem())) {
		let creatorsString = item.creators[0].lastName;
		if (item.creators.length > 2) {
			creatorsString += " et al.";
		} else if (item.creators.length == 2) {
			creatorsString += " & " + item.creators[1].lastName;
		}

		let citationKey = item.citationKey
			? item.citationKey
			: "(bib citkey missing)";
		Zotero.write("[[" + item.citationKey + "]]\n");

		Zotero.write("  author:: ");

		for (author in item.creators) {
			if (item.creators[author].firstName !== undefined) {
				Zotero.write(
					"[[" +
						item.creators[author].firstName +
						" " +
						item.creators[author].lastName +
						"]] "
				);
			} else {
				Zotero.write("[[" + item.creators[author].lastName + "]] ");
			}
		}

		Zotero.write("\n");

		let titleS = item.title ? item.title : "(no title)";

		Zotero.write("  title:: ");
		Zotero.write("[[" + titleS + "]]\n");

		let date = Zotero.Utilities.strToDate(item.date);
		let dateS = date.year ? date.year : item.date;

		Zotero.write("  year:: ");
		Zotero.write("[[" + dateS + "]]\n");

		if (item.url !== undefined) {
			Zotero.write("  url:: [");
			Zotero.write(creatorsString);
			Zotero.write(" (" + dateS + "). ");
			Zotero.write(titleS + ".");
			if (item.publicationTitle !== undefined) {
				Zotero.write(" " + item.publicationTitle);
			}
			Zotero.write("](" + item.url + ")\n");
		}

		let library_id = item.libraryID ? item.libraryID : 0;
		let itemLink = "zotero://select/items/" + library_id + "_" + item.key;

		Zotero.write("  Zotero link:: ");
		Zotero.write("[Zotero Link](" + itemLink + ")\n");
	}
}
