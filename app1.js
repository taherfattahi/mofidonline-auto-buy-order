const puppeteer = require('puppeteer');
const cronTime = require('cron-time-generator');
const CronJob = require('cron').CronJob;
const cron = require('node-cron');
const Cronr = require('Cronr');


var send = true;

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}


(async () => {


    const browser = await puppeteer.launch({
        headless: false,
        userDataDir: __dirname + "/user_data"
    });

    const page = await browser.newPage();

    // await page.goto('https://mofidonline.com/Login');
    await page.goto('https://mofidonline.com/Customer/AddOrder?cr=xxx=fa');


    let selectorDideban = 'div[key="watchListDiv"]';
    let selectorBtnBuySellIcon = 'div[class="BtnBuySellIcon"]';

    await page.evaluate((selectorDideban) => document.querySelector(selectorDideban).click(), selectorDideban);
    await page.evaluate((selectorBtnBuySellIcon) => document.querySelector(selectorBtnBuySellIcon).click(), selectorBtnBuySellIcon);

    // let cronJ = new CronJob(cronTime.everyDayAt(8, 30), function() {
    // let cronJ = new CronJob('01 30 8 * * *', async function() {
    //     console.log("Tick");
    //     // goFlag = true;
    //     await page.$eval( 'div#btnBuy', form => form.click() );
    // }, undefined, true, "Asia/Tehran");


    await page.$eval('input[name=drpExchangeList]', el => el.value = 'پترول');
    await page.$eval('input[name=txtCount]', el => el.value = '5,866');
    await page.$eval('input[name=txtPrice]', el => el.value = '20,380');

    console.log("wait");

    // let cronJ = new CronJob('01 13 2 * * *', async function() {
    //     console.log(new Date().getSeconds());
    //     console.log(new Date().getMilliseconds());
    //     console.log("Tick");
    //     // goFlag = true;
    //     // await page.$eval( 'div#btnBuy', form => form.click() );
    // }, undefined, true, "Asia/Tehran");



    // const pattern = '50 0 0 14 * * *';
    // const pattern = '50 0 30 8 * * *';
    // const pattern = '*/10 0 30 8 * * *';
    const pattern = '*/1 0 30 8 * * *';
    const job = new Cronr(pattern, async () => {
        console.log(new Date().getSeconds());
        console.log(new Date().getMilliseconds());
        if(new Date().getSeconds() == 0){
            if(new Date().getMilliseconds() > 10){
                if (send) {
                    console.log("Tick");
                    send = false;
                    await page.$eval('div#btnBuy', form => form.click());
                }
            }
        }
    });

    job.start();

})();