Calendar scheduler
====================

With this package you can create schedule for different events.

Daily event
---------------------

For calculate next date for daily event you can use:

```js
const {calcDay} = require('calendar-scheduler');

let options = {
    date: 1483264800000 //GMT: Sunday, January 1, 2017 10:00:00 AM
}

let nextDate = calcDay(options); // nextDate = 1483351200000 //GMT: Monday, January 2, 2017 10:00:00 AM
```

Also you can use it with different parameters 'everynday' or 'daysofweek':
```js
const {calcDay} = require('calendar-scheduler');

let options1 = {
    date: 1483264800000,//GMT: Sunday, January 1, 2017 10:00:00 AM
    everynday: 3
}

let options2 = {
    date: 1483264800000,//GMT: Sunday, January 1, 2017 10:00:00 AM
    daysofweek: '2;4;7'// next date will be calculated at one of the enable days "1-Monday, 2-Tuesday,...,7-Sunday"
}

let nextDate = calcDay(options1); // nextDate = 1483524000000 //GMT: Wednesday, January 4, 2017 10:00:00 AM
nextDate = calcDay(options2);// nextDate = 1483437600000 //GMT: Tuesday, January 3, 2017 10:00:00 AM
```

Weekly event
---------------------

For calculate next date for weekly event you can use:

```js
const {calcWeek} = require('calendar-scheduler');

let options = {
    date: 1483264800000 //GMT: Sunday, January 1, 2017 10:00:00 AM
}

let nextDate = calcWeek(options); // nextDate = 1483869600000//GMT: Sunday, January 8, 2017 10:00:00 AM
```

Also you can use it with different parameters 'everynweek' or 'daysofweek':

```js
const {calcWeek} = require('calendar-scheduler');

let options1 = {
    date: 1483264800000, //GMT: Sunday, January 1, 2017 10:00:00 AM
    everynweek: 3
}

let options2 = {
    date: 1483264800000, //GMT: Sunday, January 1, 2017 10:00:00 AM
    daysofweek: '5'
}

let nextDate = calcWeek(options1); // nextDate = 1485079200000 //GMT: Sunday, January 22, 2017 10:00:00 AM
nextDate = calcWeek(options2); // nextDate = 1484301600000 // Friday, January 13, 2017 10:00:00 AM
```

Monthly event
---------------------

For calculate next date for monthly event you can use:
```js
const {calcMonth} = require('calendar-scheduler');

let options = {
    date: 1483264800000 //GMT: Sunday, January 1, 2017 10:00:00 AM
}

let nextDate = calcMonth(options); // nextDate = 1485943200000 //GMT: Wednesday, February 1, 2017 10:00:00 AM
```

Also you can use it with different parameters 'day', 'weekofmonth', 'daysofweek', 'months':

```js
const {calcMonth} = require('calendar-scheduler');

let options1 = {
    date: 1483264800000, //GMT: Sunday, January 1, 2017 10:00:00 AM
    day: 5
};

let options2 = {
    date: 1483264800000, //GMT: Sunday, January 1, 2017 10:00:00 AM
    day: 31 //if in month less days it will take last date
};

let nextDate = calcMonth(options1); // nextDate = 1486288800000 //GMT: Sunday, February 5, 2017 10:00:00 AM
nextDate = calcMonth(options2);//nextDate = 1488276000000 //GMT: Tuesday, February 28, 2017 10:00:00 AM
```
You can choose week of month 1,2,3,4:

```js
const {calcMonth} = require('calendar-scheduler');

let options = {
    date: 1483264800000, //GMT: Sunday, January 1, 2017 10:00:00 AM
    weekofmonth: 2
}

let nextDate = calcMonth(options); // nextDate = 1487152800000 //GMT: Wednesday, February 15, 2017 10:00:00 AM
```

You can choose last week day(s) in month:

```js
const {calcMonth} = require('calendar-scheduler');

let options = {
    date: 1483264800000, //GMT: Sunday, January 1, 2017 10:00:00 AM
    weekofmonth: 5,
    daysofweek: '3;4'
}

let nextDate = calcMonth(options); // nextDate = 1487844000000 //GMT: Thursday, February 23, 2017 10:00:00 AM
```

With all monthly options above you can use 'months' option:

```js
const {calcMonth} = require('calendar-scheduler');

let options = {
    date: 1483264800000, //GMT: Sunday, January 1, 2017 10:00:00 AM
    weekofmonth: 2,
    daysofweek: '1',
    monthes: '4'
}

let nextDate = calcMonth(options); // nextDate = 1492419600000 //GMT: Monday, April 17, 2017 9:00:00 AM
```

First date
---------------------
All of the events calculate next date but if you need calculate first event date you can use:
```js
const {firstDate} = require('calendar-scheduler');

let options1 = {
    date: 1483264800000 //GMT: Sunday, January 1, 2017 10:00:00 AM
}

let options2 = {
    date: 1483264800000, //GMT: Sunday, January 1, 2017 10:00:00 AM
    daysofweek: '5'
}

let firstDate = firstDate(options1); // nextDate = 1483264800000 //GMT: Sunday, January 1, 2017 10:00:00 AM
firstDate = firstDate(options2); // nextDate = 1483696800000 //GMT: Friday, January 6, 2017 10:00:00 AM
```
