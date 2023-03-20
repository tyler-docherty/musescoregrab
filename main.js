import puppeteer from "puppeteer";
import svg2img from "svg2img";
const linkToSheet = process.argv[2];

(async () => {
    const instance = await puppeteer.launch({ headless: true });
    const page = await instance.newPage();

    // this is to stop breakpoint fuckery
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto(linkToSheet, { timeout: 0 }); // debug remove

    // wait for and click on cookie popup
    await page.waitForSelector(".qc-cmp2-summary-buttons > button");
    await page.click(".qc-cmp2-summary-buttons > button:nth-child(2)");

    // wait for div with sheets
    await page.waitForSelector(".js-page.react-container");
    const pages = await page.$$eval("#jmuse-scroller-component > div", nodes => {
        return nodes.length - 3;
    });

    let imgs = new Array(pages)
    for (let i = 0; i < pages; i++) {
        await page.evaluate(() => {
            const height = document.querySelector(".EEnGW").clientHeight;
            document.getElementById("jmuse-scroller-component").scrollBy(0, height);
        })
        await page.waitForSelector(`.EEnGW:nth-child(${i+1})`);
        await new Promise(resolve => setTimeout(resolve, 50));
        imgs[i] = await page.evaluate((i) => {
            return document.querySelector(`.EEnGW:nth-child(${i+1}) > img`).src
        }, i)
    }

    let normalizedImages = new Array(imgs.length);
    imgs.forEach((img, index) => {
        console.log(img);
        let transformedImg = new URL(img);
        console.log(transformedImg.href);
        fetch(transformedImg, { method: "GET" })
            .then((res) => {
                normalizedImages[index] = res;
            })
            .catch((err) => {
                console.error("err", err);
            })
    })
    page.close();
})();
