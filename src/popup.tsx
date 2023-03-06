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

  var url = "https://api.securo.dev/api/v1/payment/currency-price"
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

  localStorage.getItem("fiat") && localStorage.getItem("crypto") && localStorage.getItem("network") && localStorage.getItem("targetPrice") !== null ?
    setInterval(getData, 10 * 1000) : null

  useEffect(() => {
    getData
  }, [])
  return (
    <div className="flex flex-col items-center justify-center h-96 w-64 border-2">
      {
        (localStorage.getItem("fiat") && localStorage.getItem("crypto") && localStorage.getItem("network") && localStorage.getItem("targetPrice") !== null) ?

          <div>
            Target Price - {localStorage.getItem("targetPrice")}
            Current Price - {updatedPrice}
          </div> :
          <SelectionPage chainData={Data} />
      }

    </div>
  )
}

export default IndexPopup