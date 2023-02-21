import {
  useState, useEffect
} from "react"

import { CountButton } from "./features/count-button"

import "~base.css"
import "~style.css"

function IndexPopup() {

  var data = JSON.stringify({
    fiatAmount: 10000,
    cryptoCurrency: "USDT",
    fiatCurrency: "INR",
    isBuyOrSell: "BUY",
    network: "ethereum",
    paymentMethod: "upi",
  })

  return (
    <div className="flex flex-row items-center justify-center h-16 w-40">
      <CountButton />
    </div>
  )
}

export default IndexPopup