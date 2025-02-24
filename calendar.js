const weeksContainer = document.getElementById("weeks-container")

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
    if (months.length == 2) {
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

function createRow(week) {

  const rowElem = document.createElement("div");
  rowElem.classList.add("row");
  rowElem.setAttribute("data-week", 0);
  
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
    weekElem.append(dayElem)
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
  }

  return rowElem;
}

const today = new Date();
for (let i = -5; i <= 5; i++) {
  const day = new Date(today);
  day.setDate(day.getDate() + i * 7);
  const row = createRow(new Week(day));
  weeksContainer.append(row)
}
