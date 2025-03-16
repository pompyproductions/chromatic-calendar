const MARKDOWN_CHARS = ["[", "*", "_"];

function checkTags(text) {
  const current = {
    tag: "text",
    closingTag: "",
  };
  if (text[0] === text[text.length - 1] && MARKDOWN_CHARS.includes(text[0])) {
    current.closingTag = text[0] === "[" ? "]" : text[0];
    current.children = [];
    switch (current.closingTag) {
      case "]":
        current.tag = "a";
        break;
      case "_":
        current.tag = "em";
        break;
      case "*":
        current.tag = "strong";
        break;
    }
  }
  return current;
}

function checkEscape(text, i) {
  if (text[i] === "\\") {
    return [text.slice(0, i) + text.slice(i + 1, text.length), i]
  }
  return [text, i];
}

function traverse(text) {
  const arr = [];
  let currentNode = checkTags(text);
  if (currentNode.tag !== "text") {
    text = text.slice(1, -1)
  }
  let startIndex = 0;

  for (let i = 0; i < text.length; i++) {
    if (MARKDOWN_CHARS.includes(text[i])) {
      let closingTag = text[i] === "[" ? "]" : text[i];
      for (let j = i + 1; j < text.length; j++) {
        if (text[j] === closingTag) {
          if (currentNode.children) {
            currentNode.children.push(...traverse(text.slice(i, j + 1)));
            arr.push({ content: text.slice(startIndex, i), ...currentNode });
          } else {
            arr.push({ content: text.slice(startIndex, i), ...currentNode });
            arr.push(...traverse(text.slice(i, j + 1)));
          }
          startIndex = j + 1;
          i = j;
          [text, j] = checkEscape(text, j);
          break;
        }
      }
    } 
    [text, i] = checkEscape(text, i);
  }
  if (startIndex < text.length) {
    currentNode.children = []; // tacky but hey
    arr.push({ content: text.slice(startIndex, text.length), ...currentNode });
  }
  return arr;
}

export { traverse };