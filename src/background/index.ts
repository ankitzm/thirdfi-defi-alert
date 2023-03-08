export { }
import moment from "moment"
import CryptoJS from "crypto-js"


var apiKey = process.env.API_KEY
var secretKey = process.env.CLIENT_SECRET

var url = "https://api.thirdfi.org/api/v1/payment/currency-price"
var method = "POST"


console.log(
    "Live now; make now always the most precious time. Now will never come again."
)

var cryptoCurr: string, network: string, fiat: string, targetPrice: any

chrome.alarms.create({
    periodInMinutes: 1 / 3,
    delayInMinutes: 0
})


chrome.storage.local.get(["crypto", "network", "fiat", "targetPrice"], (res) => {
    cryptoCurr = res.crypto
    network = res.network
    fiat = res.fiat
    targetPrice = res.targetPrice

    console.log(res);
})

chrome.alarms.onAlarm.addListener((alarm) => {
    if (cryptoCurr && network && fiat && targetPrice) {

        let timestamp = moment().unix()
        let baseString = `${url}&method=${method}&timestamp=${timestamp}`

        var postData = JSON.stringify({
            fiatAmount: 1000,
            cryptoCurrency: cryptoCurr,
            fiatCurrency: fiat,
            isBuyOrSell: "BUY",
            network: network,
            paymentMethod: "credit_debit_card",
        })

        if (postData) baseString += `&body=${JSON.stringify(JSON.parse(postData))}`

        const hash = CryptoJS.HmacSHA256(baseString, secretKey).toString(
            CryptoJS.enc.Hex,
        )

        function getData() {
            const options: Object = {
                method: "POST",
                headers: {
                    "accept": "application/json",
                    "content-type": "application/json",
                    "x-sec-key": apiKey,
                    "x-sec-ts": timestamp,
                    "x-sec-sign": hash,
                },
                body: postData,
            }

            fetch(
                url,
                options,
            )
                .then(response => response.json())
                .then(response => {
                    console.log("updated price - ", 1 / response.data.conversionPrice)

                    chrome.storage.local.set({
                        updatedPrice: 1 / response.data.conversionPrice,
                    })
                })
                .catch(err => console.error(err))
        }

        getData()
    } else console.log("none");

    console.log(alarm);
    // chrome.storage.local.get(["timer"], (res) => {
    //     const time = res.timer ?? 0
    //     chrome.storage.local.set({
    //         timer: time + 1,
    //     })

    //     chrome.action.setBadgeText({
    //         text: `${time + 1}`
    //     })
    // })
})
