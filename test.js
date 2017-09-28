const scheduler = require('index.js');
const expect = require('chai').expect

describe('Scheduler tests:', function(){
    it('getNextDate once', function(){
        let data = {
            schtype: '1',
            startdate: "09.28.2017",
            starttime: "11:25"
        };
        expect(scheduler.getNextDate(data)).equal(1506587100000);
    });

    it('getNextDate daily', function(){
        let data1 = {
            schtype: '2',
            startdate: "09.28.2017",
            starttime: "11:25",
            daysofweek: "1;2;3;4;5;6;7",
            nthflag: true
        };

        let data2 = {
            schtype: '2',
            startdate: "09.30.2017",
            starttime: "11:25",
            daysofweek: "1;2;3;4;5;6;7",
            nthflag: true
        };

        let data3 = {
            schtype: '2',
            startdate: "09.01.2017",
            starttime: "11:25",
            daysofweek: "1;2;3;4;5;6;7",
            nthflag: true
        };

        let data4 = {
            schtype: '2'
        };

        let data5 = {
            schtype: '2',
            lastrun: 1501534800000
        };

        expect(scheduler.getNextDate(data1)).equal(1506673500000); //simple next day
        expect(scheduler.getNextDate(data2)).equal(1506846300000); //start date in future
        expect(scheduler.getNextDate(data3)).equal(1506673500000); //start date in last
        expect(scheduler.getNextDate(data4) > 0).true; //qa task, never run before
        expect(scheduler.getNextDate(data5) > 0).true; //qa task
    });

    it('getNextDate weekly', function(){
        let data1 = {
            schtype: '3',
            startdate: "09.28.2017",
            starttime: "11:25",
            daysofweek: "1;2;3;4;5;6;7",
            nthflag: true
        };

        //console.log('res - ', scheduler.getNextDate(data1));
        //expect(scheduler.getNextDate(data1)).equal(1506673500000); //simple next day
    });
});
