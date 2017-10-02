/* user
    timestamp
        data.lastrun

    string
        data.schtype
        data.startdate
        data.starttime
        data.nthflag
        data.dayofmonth
        data.weekofmonth

    number
        data.everynday
        data.everynweek

    array
        data.daysofweek
*/

//const mdays = ['7', '1', '2', '3', '4', '5', '6'];

const moment = require('moment');

const daysInMonth= (month,year)=>{
    return new Date(year, month, 0).getDate();
};

const zeroTime = (date) => {
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
};

const setTimeFromStr = (date, timeStr) => {
    let time = timeStr.split(':');
    zeroTime(date);
    date.setHours(time[0]);
    date.setMinutes(time[1]);
};

const timeStampFromStr = (dateStr, timeStr) => {
    let date = new Date(dateStr);
    setTimeFromStr(date, timeStr);
    return date.getTime();
};

const firstDate = ({
    date,//timestamp
    daysofweek//string '1;2;3;4;5;6;7'
})=>{
    let dt = moment(date);
    if(daysofweek){
        let edays = daysofweek.split(';');
        while(edays.findIndex(d=>d==dt.weekday())===-1)
            dt.add(1, 'd');
    }
    return dt.valueOf();
};

const setDayOfWeek = (daysofweek, data)=>{
    let edays = daysofweek.split(';');
    while(edays.findIndex(d=>d==data.weekday())===-1)
        data.add(1, 'd');
};

const calcDay = ({
    date,//timestamp
    everynday,//number
    daysofweek//string '1;2;3;4;5;6;7'
}) => {
    let dt = moment(date);
    if(daysofweek){
        let edays = daysofweek.split(';');
        do{
            dt.add(1, 'd');
        }while(edays.findIndex(d=>d==dt.weekday())===-1);
    } else if(everynday){
        dt.add(everynday, 'd');
    } else
        dt.add(1, 'd');

    return dt.valueOf();
};

const calcWeek = ({
    date,
    everynweek,
    daysofweek
})=>{
    let dt = moment(date);

    if(!everynweek)
        everynweek = 1;

    dt.add(everynweek, 'w');

    if(daysofweek)
        setDayOfWeek(daysofweek, dt);

    return dt.valueOf();
};

const calcMonth = ({
    date,
    day,
    weekofmonth,
    daysofweek,
    months
})=>{
    let dt = moment(date);

    if(months){
        let emonths = months.split(';');
        while(emonths.findIndex(d=>d==dt.month()+1)===-1)
            dt.add(1, 'M');
    } else
        dt.add(1, 'M');

     if(day){

        let dInm = daysInMonth(dt.month()+1, dt.year());
        if(day > dInm)
            day = dInm;

        dt.date(day);
    } else if(weekofmonth){
        if(weekofmonth<4){
            dt.add(weekofmonth, 'w');

            if(daysofweek)
                setDayOfWeek(daysofweek, dt);
        } else {
            dt.date(daysInMonth(dt.month()+1, dt.year()));
            if(daysofweek){
                let edays = daysofweek.split(';');
                while(edays.findIndex(d=>d==dt.weekday())===-1)
                    dt.add(-1, 'd');
            }
        }
    }

    return dt.valueOf();
};



const getNextDate = (data) => {

    if (data.schtype === '0') //startup
    {
        return 0;
    } else if (data.schtype === '1') //once
    {
        return 0;
    } else
    if (data.schtype === '2') //daily
    {
        let dt;

        let startdate = (data.startdate && data.starttime) ? timeStampFromStr(data.startdate, data.starttime) : 0;
        let lastdate = data.lastrun;
        let date = new Date();

        if (data.starttime)
            setTimeFromStr(date, data.starttime);

        dt = date.getTime();

        if (startdate > dt)
            dt = startdate;

        if (lastdate > dt)
            dt = lastdate;

        return calcDay({
            date: dt,
            everynday: data.everynday,
            daysofweek: data.daysofweek
        });

    } else if (data.schtype === '3') //weekly
    {
        let dt;
        let time = data.starttime ? data.starttime.split(':') : [];

        if (data.lastrun) {
            dt = moment(data.lastrun);
        } else
            dt = moment();

        if (time.length) {
            dt.set('hour', time[0]);
            dt.set('minute', time[1]);
        }

        return calcWeek({
            date: dt,
            everynweek: data.everynweek,
            daysofweek: data.daysofweek
        });
    } else if (data.schtype === '4') //monthly
    {
        let dt;
        let time = data.starttime ? data.starttime.split(':') : [];

        if (data.lastrun)
            dt = moment(data.lastrun);
        else
            dt = moment();

        if (time.length) {
            dt.set('hour', time[0]);
            dt.set('minute', time[1]);
        }

        return calcMonth({
            date: dt,
            day: data.dayofmonth,
            weekofmonth: data.weekofmonth,
            daysofweek: data.daysofweek,
            months: data.months
        });

    } else if (data.schtype === '5' ||
        data.schtype === '6' ||
        data.schtype === '7') {
        let result;

        if (data.lastrun === 0) {
            result = (data.startdate && data.starttime) ? moment(timeStampFromStr(data.startdate, data.starttime)) : moment();
        } else {
            let months = 4;
            if (data.schtype === '6') months = 6;
            if (data.schtype === '7') months = 12;

            result = moment(data.lastrun);
            result.add(months, 'months');
        }
        return result.valueOf();
    }
    //}

    return 0;
}

const getNextDates = (data, number, type) => {
    let lastDate;
    let results = [];

    if (!data.lastrun)
        lastDate = moment();
    else
        lastDate = moment(data.lastrun);

    lastDate.add(number, type);

    let nextdate;
    do {
        nextdate = getNextDate(data);
        if (nextdate) {
            data.lastrun = nextdate;
            results.push(nextdate);
        }

    } while (nextdate && nextdate < lastDate.valueOf())

    return results;
}

module.exports = {
    getNextDate,
    getNextDates,
    calcDay,
    calcWeek,
    calcMonth,
    firstDate
}
