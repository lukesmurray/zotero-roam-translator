{
	"translatorID" : "0ccb789a-2237-41cf-a594-c122c798009e",
	"translatorType" : 2,
	"label" : "Roam Metadata Export",
	"creator" : "Luke Murray",
	"target" : "md",
	"minVersion" : "2.0",
	"maxVersion" : "",
	"priority" : 200,
	"configOptions" : {
		"getCollections": "true",
		"dataMode": "rdf/xml"
	},
	"inRepository" : false,
	"lastUpdated":"2021-04-03 - 20:52"
}

const typemap = {
  artwork: "Illustration",
  audioRecording: "Recording",
  bill: "Legislation",
  blogPost: "Blog post",
  book: "Book",
  bookSection: "Chapter",
  case: "Legal case",
  computerProgram: "Data",
  conferencePaper: "Conference paper",
  document: "Document",
  email: "Letter",
  encyclopediaArticle: "Encyclopaedia article",
  film: "Film",
  forumPost: "Forum post",
  hearing: "Hearing",
  instantMessage: "Instant message",
  interview: "Interview",
  journalArticle: "Article",
  letter: "Letter",
  magazineArticle: "Magazine article",
  manuscript: "Manuscript",
  map: "Image",
  newspaperArticle: "Newspaper article",
  patent: "Patent",
  podcast: "Podcast",
  presentation: "Presentation",
  radioBroadcast: "Radio broadcast",
  report: "Report",
  statute: "Legislation",
  thesis: "Thesis",
  tvBroadcast: "TV broadcast",
  videoRecording: "Recording",
  webpage: "Webpage",
};

function getItemCiteKey(item) {
  if (item.citekey) {
    return item.citekey;
  }
  if (item.citationKey) {
    return item.citationKey;
  }
  return undefined;
}

function getItemType(item) {
  let zoteroType = item.itemType;
  if (zoteroType in typemap) {
    return typemap[zoteroType];
  }
  return zoteroType;
}

function getItemDate(item) {
  return getItemDateProperty(item, "date");
}

function getItemDateAdded(item) {
  return getItemDateProperty(item, "dateAdded");
}

function getItemDateProperty(item, property) {
  const dateValue = item[property];
  if (dateValue) {
    let date = new Date(dateValue);
    if (isValidDate(date)) {
      return date;
    }
  }
  return undefined;
}

function isValidDate(d) {
  return d instanceof Date && !isNaN(d);
}

function fromCamelToSentenceCase(val) {
  result = val.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
}

function getItemCreators(item) {
  let creators = item.creators;
  let creatorTypesObj = {};
  let creatorTypesArray = [];
  for (let creator of creators) {
    let creatorTypeString = fromCamelToSentenceCase(creator.creatorType);
    if (creatorTypesObj[creatorTypeString] === undefined)
      creatorTypesObj[creatorTypeString] = [];
    let thisCreatorString = "";
    if (creator.firstName) thisCreatorString += creator.firstName;
    if (creator.lastName) thisCreatorString += " " + creator.lastName;
    thisCreatorString = `[[${thisCreatorString.trim()}]]`;
    creatorTypesObj[creatorTypeString].push(thisCreatorString);
  }
  for (let [creatorType, thisCreatorTypeArray] of Object.entries(
    creatorTypesObj
  )) {
    creatorTypesArray.push(
      `${creatorType}:: ${thisCreatorTypeArray.join(", ")}`
    );
  }
  return creatorTypesArray;
}

function getLocalLink(item) {
  let library_id = item.libraryID ? item.libraryID : 0;
  return `[Local library](zotero://select/items/${library_id}_${item.key})`;
}

function getRemoteLink(item) {
  return `[Web Library](${item.uri})`;
}

function getItemYear(item) {
  let itemDate = getItemDate(item);
  if (itemDate) {
    return `${itemDate.getFullYear()}`.padStart("0", 4);
  }
  return undefined;
}

function formatRoamDate(date) {
  const month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let nth = function (d) {
    if (d > 3 && d < 21) return "th";
    switch (d % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };
  let roamDate = `${month[date.getMonth()]} ${date.getDate()}${nth(
    date.getDate()
  )}, ${date.getFullYear()}`;
  return roamDate;
}

function getItemMetadata(item) {
  let metadataString = `Metadata::`;

  metadataString += `\n  Title:: ${item.title}`;

  let itemCreators = getItemCreators(item);
  if (itemCreators.length > 0) {
    for (let creatorType of itemCreators) {
      metadataString += `\n  ${creatorType}`;
    }
  }

  metadataString += `\n  Type:: [[${getItemType(item)}]]`;

  if (getItemYear(item)) {
    metadataString += `\n  Date:: ${getItemYear(item)}`;
  }

  if (getItemDateAdded(item)) {
    let roamDateAdded = formatRoamDate(getItemDateAdded(item));
    metadataString += `\n  Date added:: [[${roamDateAdded}]]`;
  }

  let bbtCiteKey = getItemCiteKey(item);
  if (bbtCiteKey) {
    metadataString += `\n  Citekey:: ${bbtCiteKey}`;
  }

  let itemUrl = item.url;
  if (itemUrl) {
    metadataString += `\n  URL:: [${itemUrl}](${itemUrl})`;
  }

  metadataString += `\n  Zotero links:: ${[
    getLocalLink(item),
    getRemoteLink(item),
  ].join(", ")}`;

  // not sure what tags look like
  let itemTags = item.tags;
  itemTags.push({ tag: "ZoteroImport" });
  metadataString +=
    "\n  Tags:: " + itemTags.map((o) => `#[[${o.tag}]]`).join(", ");
  return metadataString;
}

function doExport() {
  let item;
  while ((item = Zotero.nextItem())) {
    Zotero.write(`${getItemMetadata(item)}\n`);
  }
}
