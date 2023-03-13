export { }
import moment from "moment"
import CryptoJS from "crypto-js"

var apiKey = process.env.API_KEY
var secretKey = process.env.CLIENT_SECRET

var url = "https://api.thirdfi.org/api/v1/payment/currency-price"
var method = "POST"

var cryptoCurr: string, network: string, fiat: string, minTargetPrice: number, maxTargetPrice: number, updatedPrice: string | number

chrome.alarms.create({
    periodInMinutes: 1,
    delayInMinutes: 0
})

setInterval(() => {
    chrome.storage.local.get(["crypto", "network", "fiat", "minTargetPrice", "maxTargetPrice"], (res) => {
        cryptoCurr = res.crypto
        network = res.network
        fiat = res.fiat
        minTargetPrice = res.minTargetPrice
        maxTargetPrice = res.maxTargetPrice
    })
}, 20 * 1000)


chrome.alarms.onAlarm.addListener((alarm) => {
    if (cryptoCurr && network && fiat && minTargetPrice && maxTargetPrice) {

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
                    console.log("updated price - ", (1 / response.data.conversionPrice).toFixed(4))

                    updatedPrice = (1 / response.data.conversionPrice).toFixed(4)

                    if (minTargetPrice < parseFloat(updatedPrice) && parseFloat(updatedPrice) < maxTargetPrice) {
                        console.log("notification");

                        chrome.notifications.create(
                            "notification",
                            { type: 'basic', iconUrl: "https://raw.githubusercontent.com/ankitzm/thirdfi-defi-alert/master/src/assets/thirdFi.png", title: "ThirdFi DeFi Alert", message: `${cryptoCurr} price reached ${updatedPrice} ${fiat}` }
                        )
                    }
                })
                .catch(err => console.error(err))

        }

        getData()
    } else console.log("none");
})
