import React, {
  useState, useEffect
} from "react"
import moment from "moment"
import CryptoJS from "crypto-js"

import "~base.css"
import "~style.css"
import SelectionPage from "~selectionPage"
import Data from "./../ChainData.json"
import Logo from "./assets/thirdFi.png"

function IndexPopup() {

  const [updatedPrice, setUpdatedPrice] = useState("")

  const timestamp = moment().unix()
  var apiKey = process.env.API_KEY
  var secretKey = process.env.CLIENT_SECRET

  var url = "https://api.thirdfi.org/api/v1/payment/currency-price"
  var method = "POST"

  var baseString = `${url}&method=${method}&timestamp=${timestamp}`

  var postData = JSON.stringify({
    fiatAmount: 1000,
    cryptoCurrency: localStorage.getItem("crypto"),
    fiatCurrency: localStorage.getItem("fiat"),
    isBuyOrSell: "BUY",
    network: localStorage.getItem("network"),
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
        console.log(response)
        setUpdatedPrice(1 / response.data.marketConversionPrice)
      })
      .catch(err => console.error(err))
  }

  (localStorage.getItem("fiat") && localStorage.getItem("crypto") && localStorage.getItem("network") && localStorage.getItem("minTargetPrice") && localStorage.getItem("maxTargetPrice")) !== null ?
    getData() : null

  // useEffect(() => {
  //   getData()
  // }, [])

  useEffect(() => {
    chrome.storage.local.get(["updatedPrice"], (res) => {
      setUpdatedPrice(res.updatedPrice)
    })
  }, [60 * 1000])


  return (
    <div className="flex flex-col items-center justify-center h-96 w-64 border-none bg-slate-900 text-white">
      <img src={Logo} className="inline w-20" />
      <div className="text-sm font-bold mb-6">PRICE TRACKER</div>
      {
        (localStorage.getItem("fiat") && localStorage.getItem("crypto") && localStorage.getItem("network") && localStorage.getItem("minTargetPrice") && localStorage.getItem("maxTargetPrice") !== null) ?

          <div className="flex flex-col justify mx-4 gap-2 text-left ml-2 text-base">
            <div className="font-semibold mx-auto">
              {`Crypto - ${localStorage.getItem("crypto")}`}
            </div>
            <div className="text-sm mx-3">
              Tracking price  from
              <span className="font-semibold"> {localStorage.getItem("minTargetPrice")}</span> to <span className="font-semibold">{localStorage.getItem("maxTargetPrice")}</span>
            </div>

            {
              updatedPrice ?
                <div className="mt-4 mx-3">
                  Current Price - {updatedPrice}
                </div> : "updating price ..."
            }
          </div> :
          <SelectionPage chainData={Data} />
      }

    </div>
  )
}

export default IndexPopup