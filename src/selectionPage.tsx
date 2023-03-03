import React, { useState, useEffect } from 'react'
import { ReactSearchAutocomplete } from "react-search-autocomplete"

import moment from "moment"
import CryptoJS from "crypto-js"

interface ChainProp {
  id: string,
  name: string,
  network: string,
  fiatCurrenciesNotSupported: Array<Object>
}

interface FiatProp {
  id: string,
  name: string
}

function selectionPage({ chainData }) {

  const [chainList, setChainList] = useState([])
  const [currChain, setCurrChain] = useState({
    "id": "ETH",
    "name": "smooth-love-potion",
    "network": "ethereum",
    "fiatCurrenciesNotSupported": [
      {
        "fiatCurrency": "USD",
        "paymentMethod": "credit_debit_card"
      }
    ]
  })

  const [currFiat, setCurrFiat] = useState({
    "id": "USD",
    "name": "US Dollar",
  })

  const [cryptoPrice, setCryptoPrice] = useState(null)
  const [targetPrice, setTargetPrice] = useState(null)

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

  var url = "https://api.securo.dev/api/v1/payment/currency-price"
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
        localStorage.setItem("fiat", currFiat.id)
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
        cryptoPrice ?
          <div style={{ width: 200, margin: 20 }}>
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
            <br />

            <ReactSearchAutocomplete
              items={fiatList}
              onSearch={handleOnSearch}
              onSelect={handleOnSelectFiat}
              fuseOptions={{ keys: ["id", "name"] }}  // searchable items
              styling={{ zIndex: 0 }}
              showIcon={false}
              placeholder={"Select Fiat Currency"}
            />

            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={getData}>
              Fetch Price
            </button>

          </div>

          :
          <div className="mt-3 flex flex-col items-center justify-center text-base">
            <div>
              {`Current Price - ${cryptoPrice}`}
            </div>

            <input type="text" placeholder="Placeholder" className="px-3 py-3 placeholder-slate-300 text-slate-600 relative bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring" onChange={e => setTargetPrice(e.target.value)} />
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-3" onClick={() => {
              localStorage.setItem("targetPrice", targetPrice)
            }}>
              Set target
            </button>
          </div>
      }
    </div>
  )
}

export default selectionPage