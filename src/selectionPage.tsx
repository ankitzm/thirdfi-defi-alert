import React, { useState, useEffect } from 'react'
import { ReactSearchAutocomplete } from "react-search-autocomplete"

import moment from "moment"
import CryptoJS from "crypto-js"


function selectionPage({ chainData }) {

  const [chainList, setChainList] = useState([])
  const [currChain, setCurrChain] = useState({
    "id": "",
    "name": "",
    "network": ""
  })

  const [currFiat, setCurrFiat] = useState({
    "id": ""
  })

  const [cryptoPrice, setCryptoPrice] = useState(null)
  const [minTargetPrice, setMinTargetPrice] = useState(null)
  const [maxTargetPrice, setMaxTargetPrice] = useState(null)
  const [loader, setLoader] = useState(false)

  var chainName = []
  var fiatList = [
    {
      "id": "USD",
      "name": "US Dollar",
    },
    {
      "id": "EUR",
      "name": "Euro",
    }
  ]

  const timestamp = moment().unix()

  var apiKey = process.env.API_KEY
  var secretKey = process.env.CLIENT_SECRET

  var url = "https://api.thirdfi.org/api/v1/payment/currency-price"
  var method = "POST"

  var baseString = `${url}&method=${method}&timestamp=${timestamp}`

  var postData = JSON.stringify({
    fiatAmount: 1000,
    cryptoCurrency: currChain.id,
    fiatCurrency: currFiat.id,
    isBuyOrSell: "BUY",
    network: currChain.network,
    paymentMethod: "credit_debit_card",
  })

  if (postData) baseString += `&body=${JSON.stringify(JSON.parse(postData))}`

  const hash = CryptoJS.HmacSHA256(baseString, secretKey).toString(
    CryptoJS.enc.Hex,
  )

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

  function getData() {
    setLoader(true)
    fetch(
      url,
      options,
    )
      .then(response => response.json())
      .then(response => {
        console.log(response)
        if (response.statusCode !== 201) return

        var price = 1 / response.data.marketConversionPrice
        setCryptoPrice(price)
        localStorage.setItem("crypto", currChain.id)
        localStorage.setItem("network", currChain.network)
        localStorage.setItem("fiat", currFiat.id)
        setLoader(false)
      })
      .catch(err => console.error(err))
  }


  useEffect(() => {
    var uniqueItems = []

    chainData.forEach(item => {
      const key = item.coinId;

      if (!uniqueItems[key]) {
        chainName.push({
          id: item.symbol,
          name: key,
          network: item.network.name,
          fiatCurrenciesNotSupported: item.network.fiatCurrenciesNotSupported
        })
        uniqueItems[key] = item;
      }
    });

    setChainList(chainName)
  }, [])


  const handleOnSearch = (string, results) => {
    console.log(string, results);
  };

  const handleOnSelectCrypto = (item) => {
    console.log(item);
    console.log("selected");
    setCurrChain(item)
  };

  const handleOnSelectFiat = (item) => {
    setCurrFiat(item)
  };

  // const handleOnHover = (result) => {
  //   console.log(result);
  // };

  // const handleOnFocus = () => {
  //   console.log("Focused");
  // };

  // const handleOnClear = () => {
  //   console.log("Cleared");
  // };


  return (
    <div className='flex flex-col items-center justify-center'>
      {
        // !cryptoPrice
        !(localStorage.getItem("crypto") && localStorage.getItem("network") && localStorage.getItem("fiat")) ? <>
          <div className="w-48">
            <ReactSearchAutocomplete
              items={chainList}
              maxResults={4}
              onSearch={handleOnSearch}
              onSelect={handleOnSelectCrypto}
              fuseOptions={{ keys: ["id", "name"] }}  // searchable items
              styling={{ zIndex: 1 }}
              showIcon={false}
              placeholder={"Select Crypto"}
            />
            <div className='mt-3'>
              <ReactSearchAutocomplete
                items={fiatList}
                onSearch={handleOnSearch}
                onSelect={handleOnSelectFiat}
                fuseOptions={{ keys: ["id", "name"] }}  // searchable items
                styling={{ zIndex: 0 }}
                showIcon={false}
                placeholder={"Select Fiat Currency"}
              />
            </div>
          </div>

          <button className="bg-blue-500 hover:bg-blue-700 text-white text-base font-bold py-2 px-4 mt-4 rounded" onClick={() => {
            !(currChain.id == "" && currFiat.id == "") ? getData() : window.alert("please provide input to above field")
          }}>
            {loader ? <div
              className="inline-block h-4 w-4 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
              role="status">
              <span
                className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
              >Loading...</span>
            </div> : <>
              Fetch Price </>
            }
          </button>
        </>
          :
          <div className="w-48 flex flex-col items-center justify-center text-base">
            <div className="font-semibold">
              {`Crypto - ${currChain.id}`}
            </div>
            <div className='font-semibold mt-2'>
              {`Price - ${cryptoPrice ? cryptoPrice.toFixed(4) : ""}`}
            </div>

            <input type="text" placeholder="mininum target price" className="px-3 w-full py-3 mt-4 placeholder-slate-400 text-slate-900 relative bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring" onChange={e => setMinTargetPrice(e.target.value)} />
            <input type="text" placeholder="maximum target price" className="px-3 w-full py-3 mt-4 placeholder-slate-400 text-slate-900 relative bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring" onChange={e => setMaxTargetPrice(e.target.value)} />

            <button className="bg-blue-500 hover:bg-blue-700 text-white text-base font-bold py-2 px-4 mt-4 rounded w-full"
              onClick={() => {  
                if ((minTargetPrice && maxTargetPrice) == null) {
                  window.alert("Please set a target price first")
                }
                else {
                  localStorage.setItem("minTargetPrice", minTargetPrice)
                  localStorage.setItem("maxTargetPrice", maxTargetPrice)

                  chrome.storage.local.set({
                    crypto: localStorage.getItem("crypto")
                  })
                  chrome.storage.local.set({
                    network: localStorage.getItem("network")
                  })
                  chrome.storage.local.set({
                    fiat: localStorage.getItem("fiat")
                  })
                  chrome.storage.local.set({
                    minTargetPrice: localStorage.getItem("minTargetPrice")
                  })
                  chrome.storage.local.set({
                    maxTargetPrice: localStorage.getItem("maxTargetPrice")
                  })

                  window.alert("Target price set, please reopen the extention to check the updated price. \n We will notify you once the price reaches the target !!")
                }
              }}>
              Set Target Price
            </button>
          </div>
      }
    </div >
  )
}

export default selectionPage