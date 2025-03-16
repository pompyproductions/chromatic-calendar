# Chromatic Calendar | Project Roadmap

## General

- [ ] Add info (header with website title, developed by, contact, help...)


## Calculation logic

- [ ] Test [bitwise operations](#notes) for week counting.
- [ ] Count weeks: week of the year (since Jan 1) and week of the month.


## Theme

- [x] Install SASS.
- [ ] Refine light theme.
- [ ] Design mobile version ("info" sidebar below, "settings" as modal?).

<details>
  <summary><h3>Completed</h3></summary>
  
  - [x] (2025-03-16) _Install SASS._  
</details>


## Calendar

- [ ] Add "load x more weeks" buttons on top and bottom.
- [ ] Add week number of the year to one side, and week number of the month to the other. (e.g. right side goes March 2 3 4 5 April, and left side goes February 19 20 21 22 March)


## Info sidebar

### Next

- [ ] Add "business days": user sets which days of the week count.
- [ ] Add "working hours": user sets how many hours of work in **each business day.**
- [ ] Add "hourly rate": user sets rate & sees total price.

<details>
  <summary><h3>Completed</h3></summary>

  - [x] (2025-02-28) _Info is presented as a description list (\<dl\>)._
  - [x] (2025-02-28) _Info about both dates is displayed, as well as distance, workdays, weekends between them_
  - [x] (2025-02-27) _Click 1 on a calendar day registers the first date_
  - [x] (2025-02-27) _Info about this date is displayed on the "info" sidebar: date string, distance to today_
  - [x] (2025-02-27) _Click 2 on a calendar day registers the second date: if date is smaller than date 1, change order_
  - [x] (2025-02-26) _Create info sidebar_
</details>


## Notes

### Bitwise weeks

- Weeks are held in 7 bits: 0b0000000, where each bit represents a day of the week.
- A set bit represents a highlighted day: e.g. 0b0011100 (wednesday to friday).
- Count days in selection: 

```js
weekdays = week & 0b1111100
weekendDays = week & 0b0000011
```

- Set a custom "business days" bit mask, that the user can change, and count how many.
