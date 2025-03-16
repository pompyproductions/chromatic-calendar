# Chromatic Calendar | Readme

Chromatic Calendar is a barebones, continuous weekly calendar built with minimal technology, intended as a simple tool to count & visualise dates.

You can access it through the following GitHub Pages link:
[Chromatic Calendar](pompyproductions.github.io/chromatic-calendar)

Or better even, fork it & modify it to your heart's content, it's a few lines of simple JavaScript displayed on a barebones HTML + CSS page.

## Why?

The gregorian calendar we all know and love is an essential tool for work. A weekly calendar displays the difference between weekdays & weekends neatly. The days leading to the first week of a month, and the ones after the last week are also often displayed to have a continuous flow of days.

It is an easy tool to get an idea of where today is, how far from today a given date is, and what month/season/day of the week it is on a given date.

However, the majority of these calendars divide the display into months, resulting in duplicate weeks (e.g. last week of January + first week of February) and distracting gaps. **Having a continuous flow of weeks instead helps us estimate quantities at a glance.** The distance between two days is always (in pseudocode):

```
distance = (weekB - weekA) * 7 + (dayB - dayA)
```

Chromatic Calendar is born out of this simple necessity, intended as a tool to be used, as one would a calculator or an abacus. As such, it fills a useful gap amid the plethora of "planner" apps by being:
- Digital (not print),
- Continuous (without interruptions between months),
- Lightweight (just some lines of JS),
- Easily accessible (online, free, no account needed),
- Easy on the eyes.


## Setup (for development)

Sass is the only dependency.  
If you don't have it, install it: 

- For Windows, open up a terminal, run `choco install sass`.
- For Mac, open up a terminal, run `brew install sass/sass/sass`.

Once you have Sass installed, run `sass src\sass\style.scss style.css --watch` & spin up a live server.

Alternatively you can install node & set up scripts and such.