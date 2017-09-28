/*
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

const moment = require('moment');

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

const getNextDate = (data) => {
    const mdays = ['7', '1', '2', '3', '4', '5', '6'];

    if (!data.lastrun) data.lastrun = 0;

    if (data.schtype === '0') //startup
    {
        return 0;
    } else if (data.schtype === '1') //once
    {
        return timeStampFromStr(data.startdate, data.starttime);
    } else if (data.schtype === '2') //daily
    {
        let result = moment(data.lastrun);

        let startdate = (data.startdate && data.starttime) ? timeStampFromStr(data.startdate, data.starttime) : 0;
        let lastdate = data.lastrun;
        let date = new Date();

        if (data.starttime)
            setTimeFromStr(date, data.starttime);

        let tmp = date.getTime();

        if (startdate > tmp)
            tmp = startdate;

        if (lastdate > tmp)
            tmp = lastdate;

        result = moment(tmp);

        if (data.hasOwnProperty('nthflag') ||
            data.hasOwnProperty('daysofweek') ||
            data.hasOwnProperty('everynday')) {
            if (data.nthflag && data.daysofweek.split(';').length === 7) {
                result.add(1, 'days');
                return result.valueOf();
            } else if (data.nthflag && data.daysofweek.split(';').length === 5) {
                result.add(1, 'days');
                while (mdays[result.day()] > 5) result.add(1, 'days');
            } else {
                if (lastdate !== 0)
                    result.add(data.everynday, 'days');
            }
        } else
            result.add(1, 'days');

        return result.valueOf();
    } else if (data.schtype === '3') //weekly
    {
        let result;
        let time = data.starttime ? data.starttime.split(':') : [];
        let startdate;

        if (data.lastrun) {
            result = moment(data.lastrun);
            let adddays = 7 * data.everynweek;
            result.add(adddays, 'days');

        } else
            result = moment();

        if (time.length) {
            result.set('hour', time[0]);
            result.set('minute', time[1]);
        }

        let daysofweek = data.daysofweek ? data.daysofweek.split(';') : [];

        let index = -1;
        do {
            let day = (mdays[result.day()]) + '';
            index = daysofweek.findIndex(d => d === day);
            if (index === -1) {
                result.add(1, 'days');
            }
        } while (index === -1)

        return result.valueOf();
    } else if (data.schtype === '4') //monthly
    {
        let result;
        let time = data.starttime ? data.starttime.split(':') : [];
        let startdate;

        if (data.lastrun) {
            result = moment(data.lastrun);
            result.add(1, 'months');
        } else
            result = moment();

        if (time.length) {
            result.set('hour', time[0]);
            result.set('minute', time[1]);
        }

        if (data.hasOwnProperty('nthflag')
            || data.hasOwnProperty('monthes')
            || data.hasOwnProperty('weekofmonth')) {
            let months = data.monthes.split(';');
            let index = -1;
            let i = 0;
            do {
                index = months.findIndex(m => m == (result.get('month') + 1));
                if (index === -1) {
                    result.add(1, 'months');
                }
            } while (index === -1)

            if (data.nthflag) {
                let maxd = moment().daysInMonth();
                let dt = parseInt(data.dayofmonth);

                if (dt > maxd)
                    dt = maxd;

                result.set('date', dt);
            } else {
                let wofm = parseInt(data.weekofmonth);
                let dofw = parseInt(data.daysofweek);

                result.set('date', moment().date());

                if (wofm === 1 || wofm === 2 || wofm === 3 || wofm === 4) {
                    do {
                        if (mdays[result.day()] == dofw) {
                            wofm--;
                        }
                        if (wofm > 0)
                            result.add(1, 'days');
                    } while (wofm > 0);
                } else {
                    result.set('date', result.daysInMonth());

                    while (mdays[result.day()] != dofw) {
                        result.add(-1, 'days');
                        if (result.date() === 1) {
                            if (mdays[result.day()] == dofw)
                                break;
                            else {
                                result.add(1, 'months');
                                result.set('date', result.daysInMonth());
                            }
                        }
                    }
                }
            }
        } else
            result.add(1, 'months');

        return result.valueOf();
    } else if (data.schtype === '5' ||
        data.schtype === '6' ||
        data.schtype === '7') {
        let result;

        if (data.lastrun === 0) {
            result = (data.startdate && data.starttime)?moment(timeStampFromStr(data.startdate, data.starttime)):moment();
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
        if (nextdate)
            results.push(nextdate)
    } while (nextdate && nextdate < lastDate.valueOf())

    return results;
}

module.exports = {
    getNextDate,
    getNextDates
}
