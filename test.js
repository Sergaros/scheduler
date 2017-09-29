const scheduler = require('index.js');
const expect = require('chai').expect

describe('Scheduler tests:', function(){

    //calcDay
    it('CalcDay simple task', function(){ //simple day task
        let data = {
            date: 1483264800000
        };
        expect(scheduler.calcDay(data)).equal(1483351200000);
    });

    it('CalcDay everynday task', function(){
        let data = {
            date: 1483264800000,
            everynday: 3
        };
        expect(scheduler.calcDay(data)).equal(1483524000000);
    });

    it('CalcDay daysofweek task', function(){
        let data1 = {
            date: 1483264800000,
            daysofweek: '2;4;7'
        };

        let data2 = {
            date: 1483437600000,
            daysofweek: '2;4;7'
        };

        let data3 = {
            date: 1483610400000,
            daysofweek: '2;4;7'
        };

        expect(scheduler.calcDay(data1)).equal(1483437600000);
        expect(scheduler.calcDay(data2)).equal(1483610400000);
        expect(scheduler.calcDay(data3)).equal(1484042400000);
    });

    //calcWeek
    it('CalcWeek simple task', function(){
        let data = {
            date: 1483264800000
        };
        expect(scheduler.calcWeek(data)).equal(1483869600000);
    });

    it('CalcWeek everynweek task', function(){ //simple day task
        let data = {
            date: 1483264800000,
            everynweek: 3
        };
        expect(scheduler.calcWeek(data)).equal(1485079200000);
    });

    it('CalcWeek daysofweek task', function(){
        let data = {
            date: 1483264800000,
            daysofweek: '5'
        };
        expect(scheduler.calcWeek(data)).equal(1484301600000);
    });

    //calcMonth
    it('CalcMonth simple task', function(){
        let data = {
            date: 1483264800000
        };
        expect(scheduler.calcMonth(data)).equal(1485943200000);
    });

    it('CalcMonth day task', function(){
        let data1 = {
            date: 1483264800000,
            day: 5
        };

        let data2 = {
            date: 1483264800000,
            day: 31
        };

        expect(scheduler.calcMonth(data1)).equal(1486288800000);
        expect(scheduler.calcMonth(data2)).equal(1488276000000);
    });

    it('CalcMonth weekofmonth & daysofweek task', function(){
        let data1 = {
            date: 1483264800000,
            weekofmonth: 2
        };

        let data2 = {
            date: 1483264800000,
            weekofmonth: 4
        };

        let data3 = {
            date: 1483264800000,
            weekofmonth: 5,
            daysofweek: '3;4'
        };

        let data4 = {
            date: 1483264800000,
            weekofmonth: 2,
            daysofweek: '1'
        };

        expect(scheduler.calcMonth(data1)).equal(1487152800000);
        expect(scheduler.calcMonth(data2)).equal(1488276000000);
        expect(scheduler.calcMonth(data3)).equal(1487844000000);
        expect(scheduler.calcMonth(data4)).equal(1487584800000);
    });

    it('CalcMonth simple task', function(){
        let data1 = {
            date: 1483264800000,
            monthes: '5'
        };

        let data2 = {
            date: 1483264800000,
            weekofmonth: 2,
            daysofweek: '1',
            monthes: '4'
        };

        expect(scheduler.calcMonth(data1)).equal(1493629200000);
        expect(scheduler.calcMonth(data2)).equal(1492419600000);
    });


});
