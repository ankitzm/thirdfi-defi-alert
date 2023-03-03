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


  return (
    <div className="flex flex-col items-center justify-center h-96 w-64 border-2">
      {
        (localStorage.getItem("fiat") && localStorage.getItem("crypto") && localStorage.getItem("targetPrice") !== null) ?
          <>vdsvsrsf</> :
          <SelectionPage chainData={Data} />
      }

    </div>
  )
}

export default IndexPopup