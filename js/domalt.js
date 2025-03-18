import { traverse } from "./domalt-markdown.js";

let uidCounter = 0;
let defaultTag = "p";

const savedElems = new Map();
const collections = new Map();
const templates = new Map();

// ---
// private helper methods

function newElemFromArray(arr) {
  return newElem({
    tag: arr[0],
    content: arr[1]
  })
}

function newElemFromString(str) {
  return newElem({
    tag: defaultTag,
    content: str
  })
}

// ---
// main newElem method

function newElem(options = null) {
  if (!options) return document.createElement("div");
  if (typeof options === "string") return newElemFromString(options);
  if (Array.isArray(options)) return newElemFromArray(options);

  if (!Object.hasOwn(options, "tag")) {
    options.tag = "div";
  } else if (options.tag === "text") {
    return options.content;
  }

  const elem = document.createElement(options.tag);

  if (Object.hasOwn(options, "content")) {
    if (options.allowInline) {
      const nodes = traverse(options.content);
      nodes.forEach((n) => elem.append(newElem(n)));
    } else {
      elem.textContent = options.content;
    }
  }

  for (let key in options) {
    const val = options[key];
    switch (key) {
      case "id":
        elem.id = val;
        break;

      case "class":
      case "className":
      case "classList":
        if (typeof val === "string") {
          elem.classList.add(...val.split(" "))
        } else if (Array.isArray(val)) {
          elem.classList.add(...val.filter(item => item.length))
        }
        break;

      case "attribute":
      case "attributes":
      case "attr":
        if (Array.isArray(val)) {
          for (let attr of val) {
            if (attr[0] === "data-uid") continue;
            elem.setAttribute(attr[0], attr[1]);
          }
        } else {
          for (let attr in val) {
            if (attr === "data-uid") continue;
            elem.setAttribute(attr, val[attr])
          }
        }
        break;

      case "children":
        if (!val.length) break;
        for (let node of val) {
          if (node instanceof HTMLElement) {
            elem.appendChild(node);
          } else {
            elem.appendChild(newElem(node));
          }
        }
        break;

      case "uid":
        if (val === true) {
          while (savedElems.has(uidCounter)) {
            uidCounter++;
          }
          elem.setAttribute("data-domalt-id", uidCounter++);
        }
        break;

      case "listeners":
      case "eventListeners":
        if (Array.isArray(val)) {
          for (let listener of val) {
            elem.addEventListener(listener[0], listener[1]);
          }
        } else {
          for (let listener in val) {
            elem.addEventListener(listener, val[listener])
          }
        }
        break;

      case "saveAs":
        // overwrites if it exists
        savedElems.set(val, elem);
        break;

      case "collection":
        if (typeof val === "string") {
          addToCollection(elem, val);
        }
        break;

      case "style":
      case "styles":
        if (typeof val !== "object" || Array.isArray(val)) break;
        Object.assign(elem.style, val);
        break;
    }
  }
  return elem;
}


// ---
// derivative newElem methods

function newElemList(content, options = {}) {
  // supported options: isOrdered, isNav
  let listElems = [];
  for (let item of content) {
    if (typeof item === "object" || item instanceof HTMLElement) {
      listElems.push(item);
    } else {
      listElems.push({ tag: "li", content: item });
    }
  }

  if (options.isNav) { // only accept [text, href] pairs for now
    content = content.map(
      item => newElem({
        tag: "li",
        children: [
          { tag: "a", content: item[0], attributes: {"href": item[1]} }]
      })
    )
    const elem = newElem({
      tag: "nav",
      children: [
        newElemList(content, { isOrdered: options.isOrdered })
      ]
    })
    return elem
  }

  return newElem({
    tag: options.isOrdered ? "ol" : "ul",
    children: listElems
  });
}

function newElemDl(content, options = {}) {
  // content can be: 
  // array [["dt1", "dd1"], ["dt2, dd2"]]
  // object {dt1: "dd1", dt2: "dd2"}
  // options: { wrapWith }
  const definitions = [];

  if (Array.isArray(content)) {
    for (let pair of content) {
      definitions.push(
        newElem(["dt", pair[0]]),
        newElem(["dd", pair[1]])
      )
    }
  } else {
    for (let term in content) {
      definitions.push(
        newElem([["dt"], term]),
        newElem([["dd"], content[term]])
      )
    }
  }
  
  return newElem({
    tag: "dl",
    children: definitions 
  })
}


// ---
// save/load functionality

function saveTemplate(name, obj) {
  templates.set(name, obj);
}

function fromTemplate(name, obj) {
  return newElem(collections.get(name));
}

function addToCollection(elem, collectionName) {
  const collection = collections.get(collectionName);
  if (collection && !collection.some((a) => a === elem)) {
    collection.push(elem)
  } else {
    collections.set(collectionName, [elem])
  }
}

function retrieveCollection(collectionName) {
  const collection = collections.get(collectionName);
  if (collection) return [...collections.get(collectionName)];
  return [];
}

function retrieve(elemName) {
  return savedElems.get(elemName);
}


// ---
// defaults

function setDefaultTag(tag) {
  defaultTag = tag;
}

function getDefaultTag() {
  return defaultTag;
}

export default { 
  newElem, newElemList, newElemDl,
  retrieve, retrieveCollection, saveTemplate, fromTemplate, 
  setDefaultTag, getDefaultTag
};