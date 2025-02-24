const weeksContainer = document.getElementById("weeks-container")

function createRow(firstDay) {
  const rowElem = document.createElement("div");
  rowElem.classList.add("row");
  rowElem.setAttribute("data-week", 0);
  
  const weekElem = document.createElement("ol");
  weekElem.classList.add("week");
  rowElem.append(weekElem);

  for (let i = firstDay; i < firstDay + 7; i++) {
    const dayElem = document.createElement("li");
    dayElem.classList.add("even");
    if (i > firstDay + 4) {
      dayElem.classList.add("weekend");
    }
    dayElem.textContent = i.toString().padStart(2, "0");
    weekElem.append(dayElem);
  }

  return rowElem;
}


for (let i = 1; i < 4; i++) {
  weeksContainer.append(createRow(i * 7 - 6));
}