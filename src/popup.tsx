import React, {
  useState, useEffect
} from "react"
import moment from "moment"
import CryptoJS from "crypto-js"

import "~base.css"
import "~style.css"
import SelectionPage from "~selectionPage"
import Data from "./../hel.json"

function IndexPopup() {

  const [updatedPrice, setUpdatedPrice] = useState(null)

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
        setUpdatedPrice((1 / response.data.marketConversionPrice))
      })
      .catch(err => console.error(err))
  }

  localStorage.getItem("fiat") && localStorage.getItem("crypto") && localStorage.getItem("network") && localStorage.getItem("targetPrice") !== null ?
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
    <div className="flex flex-col items-center justify-center h-96 w-64 border-none bg-slate-900 text-white text-2xl">
      {
        (localStorage.getItem("fiat") && localStorage.getItem("crypto") && localStorage.getItem("network") && localStorage.getItem("targetPrice") !== null) ?

          <div className="flex flex-col items-center justify-center mx-4 gap-4">
            <div className="">
              Target Price - {localStorage.getItem("targetPrice")}
            </div>
            {
              updatedPrice ?
                <div className="">
                  Current Price - {updatedPrice}
                </div> : ""
            }
          </div> :
          <SelectionPage chainData={Data} />
      }

    </div>
  )
}

export default IndexPopup