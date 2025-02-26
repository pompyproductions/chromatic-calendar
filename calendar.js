const weeksContainer = document.getElementById("weeks-container")
const calendarDates = []


class CalendarDate {
  constructor(date, domElem) {
    this.date = date;
    this.domElem = domElem;
  }

  toString() {
    return `${monthToStr(this.date.getMonth())} ${this.date.getDate()}, ${this.date.getFullYear()}`
  }

  valueOf() {
    return +this.date
  }
}

class Week {
  constructor(date) {
    // get weekdays
    const monday = new Date(date);
    monday.setDate(monday.getDate() - monday.getDay() + 1) // +1 because sunday is 0
    const week = [monday];
    for (let i = 1; i < 7; i++) {
      const day = new Date(monday);
      day.setDate(day.getDate() + i);
      week.push(day)
    }

    // get months
    const months = [week[0].getMonth()];
    for (let i = 0; i < 7; i++) {
      const month = week[i].getMonth()
      if (month !== months[0] && months.length === 1) {
        months.push(month)
      }
    }

    let isFirstWeek = false;
    let isLastWeek = false;
    // check if last or first week
    if (months.length === 2) {
      isFirstWeek = true;
      isLastWeek = true;
    } else {
      const nextMonday = new Date(week[6]);
      nextMonday.setDate(nextMonday.getDate() + 1);
      if (nextMonday.getMonth() != months[0]) {
        isLastWeek = true;
      } else {
        const lastFriday = new Date(week[0]);
        lastFriday.setDate(lastFriday.getDate() - 1);
        if (lastFriday.getMonth() != months[0]) {
          isFirstWeek = true;
        }
      }
    }

    this.days = week;
    this.months = months;
    this.isLastWeek = isLastWeek;
    this.isFirstWeek = isFirstWeek;
  }
}

function getWeek(date) {
  const monday = new Date(date);
  monday.setDate(monday.getDate() - monday.getDay() + 1) // +1 because sunday is 0
  const week = [monday];
  for (let i = 1; i < 7; i++) {
    const day = new Date(monday);
    day.setDate(day.getDate() + i);
    week.push(day)
  }
  return week
}

function monthToStr(monthIndex) {
  return [
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
    "December"
  ][monthIndex]
}

function createRow(week, distance) {
  // creates:
  // div.row > ol.week > li.odd|even.today.weekend|weekday*7
  //         > p.right.odd|even
  //         > p.left.odd|even

  const rowElem = document.createElement("div");
  rowElem.classList.add("row");
  rowElem.setAttribute("data-week", distance);
  
  const weekElem = document.createElement("ol");
  weekElem.classList.add("week");
  rowElem.append(weekElem);

  // for (let day of week.days) {
  for (let i = 0; i < 7; i++) {
    const dayElem = document.createElement("li");
    const day = week.days[i]
    const month = day.getMonth()
    if (month % 2) {
      dayElem.classList.add("even"); // because jan is 0
    } else {
      dayElem.classList.add("odd");
    }
    if (i > 4) {
      dayElem.classList.add("weekend");
    }
    dayElem.textContent = day.getDate().toString().padStart(2, "0");

    if (!distance) {
      if (day.toDateString() == new Date().toDateString()) {
        dayElem.classList.add("today")
      }
    }
    weekElem.append(dayElem);
  }
  if (week.isLastWeek && week.isFirstWeek) {
    const leftElem = document.createElement("p");
    leftElem.textContent = monthToStr(week.months[0])
    if (week.months[0] % 2) {
      leftElem.classList.add("even");
    } else {
      leftElem.classList.add("odd");
    }
    leftElem.classList.add("left");
    
    const rightElem = document.createElement("p");
    rightElem.textContent = monthToStr(week.months[1])
    if (week.months[1] % 2) {
      rightElem.classList.add("even");
    } else {
      rightElem.classList.add("odd");
    }
    rightElem.classList.add("right"); 
    rowElem.append(leftElem);
    rowElem.append(rightElem);
  } else if (week.isLastWeek) {
    const rightElem = document.createElement("p");
    rightElem.textContent = monthToStr(week.months[0])
    rightElem.classList.add("right")
    rightElem.classList.add(week.months[0] % 2 ? "even" : "odd");
    rowElem.append(rightElem)
  } else if (week.isFirstWeek) {
    const leftElem = document.createElement("p");
    leftElem.textContent = monthToStr(week.months[0])
    leftElem.classList.add("left")
    leftElem.classList.add(week.months[0] % 2 ? "even" : "odd");
    rowElem.append(leftElem); 
  }
  return rowElem;
}

function createCalendarDateDisplay(date) {
  const container = document.createElement("section");
  container.classList.add("picked-date", "container");

  const title = document.createElement("h2");
  title.textContent = date.toDateString();
  const closeButton = document.createElement("button");
  closeButton.classList.add("flat");
  closeButton.textContent = "[Clear]";
  closeButton.addEventListener("click", handleClearSelection);

  container.append(closeButton, title);
  return container
}

function refreshDisplays() {
  const container = document.getElementById("sidebar-right");
  // console.log([...removeChildren(container).children]);
  container.innerHTML = ""
  for (let i = 0; i < calendarDates.length; i++) {
    container.append(createCalendarDateDisplay(calendarDates[i].date));
    calendarDates[i].domElem.classList.remove("start", "end");
    if (i === 0) {
      calendarDates[i].domElem.classList.add("start")
    }
    if (i === calendarDates.length - 1) {
      calendarDates[i].domElem.classList.add("end")
    }
  }
}

function removeChildren(elem) {
  for (let child of elem.children) {
    // console.log(child);
    elem.removeChild(child)
  }
  return elem
}

// ---
// event handlers

const handleDayClick = (e) => {
  if (e.target.matches(".row li")) {
    if (calendarDates.some((value) => value.domElem === e.target)) {
      console.log("it exists!");
      return
    }

    if (calendarDates.length === 2) return;
    const day = [...e.target.closest(".week").children].indexOf(e.target);
    const weekDistance = e.target.closest(".row").getAttribute("data-week");

    const today = new Date();
    const clickedDate = new Date();
    const dayDistance = (day - today.getDay()) + (weekDistance * 7) + 1
    clickedDate.setDate(
      today.getDate() + dayDistance
    )
    calendarDates.push(new CalendarDate(clickedDate, e.target))
    if (calendarDates.length === 2) {
      calendarDates.sort(
        (dateA, dateB) => dateA.date - dateB.date
      )
    }

    e.target.classList.add("highlight", "selected")
    refreshDisplays()
    // let message = `Date clicked: ${clickedDate.toDateString()}.`
    // if (dayDistance < 0) {
    //   message += ` ${Math.abs(dayDistance)} day${dayDistance + 1 ? "s" : ""} ago.`
    // } else if (dayDistance > 0) {
    //   message += ` ${dayDistance} day${dayDistance - 1 ? "s" : ""} from now.`
    // } else {
    //   message += " It's today."
    // }
    // console.log(message)
  }
}

const handleChangeTheme = (e) => {
  document.querySelector("body").classList.toggle("dark");
}
const handleHideSidebar = (e) => {
  if (e.target.id === "button-hide-sidebar-left") {
    // alert("Hide sidebar left under development.")
    e.target.closest("aside").classList.add("hidden")
  } else if (e.target.id === "button-hide-sidebar-right") {
    alert("Hide sidebar right under development.")
  }
}
const handleShowSidebar = (e) => {
  if (e.target.id === "sidebar-left") {
    e.target.classList.remove("hidden");
  }
}
const handleClearSelection = (e) => {
  const index = [...e.target.closest("aside").children].indexOf(e.target.closest("section"));
  calendarDates.splice(index, 1)[0].domElem.classList.remove("highlight", "selected", "start", "end")
  refreshDisplays()
}

weeksContainer.addEventListener("click", handleDayClick);
document.getElementById("button-change-theme").addEventListener("click", handleChangeTheme);
document.getElementById("button-hide-sidebar-left").addEventListener("click", handleHideSidebar);
document.getElementById("sidebar-left").addEventListener("click", handleShowSidebar)


// ---
// setup

const today = new Date();
for (let i = -5; i <= 30; i++) {
  const day = new Date(today);
  day.setDate(day.getDate() + i * 7);
  const row = createRow(new Week(day), i);
  weeksContainer.append(row)
}

document.querySelector("aside").classList.add("hidden")

// for (let i = -1; i < 4; i++) {
//   const week = document.querySelector(`[data-week="${i}"]`);
// 	for (let elem of week.querySelectorAll("li")) {
// 		elem.classList.add("highlight")
// 	}
// }