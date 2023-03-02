import React, { useState, useEffect } from 'react'
import { ReactSearchAutocomplete } from "react-search-autocomplete"

import Data from "./../hel.json"
import moment from "moment"
import CryptoJS from "crypto-js"


function selectionPage() {

  const [chainList, setChainList] = useState([])
  const [currChain, setCurrChain] = useState({
    "id": "SLP",
    "name": "smooth-love-potion",
    "network": "ronin",
    "fiatCurrenciesNotSupported": [
      {
        "fiatCurrency": "USD",
        "paymentMethod": "credit_debit_card"
      }
    ]
  })

  var chainName = []

  const timestamp = moment().unix()

  var apiKey = process.env.API_KEY
  var secretKey = process.env.CLIENT_SECRET

  var url = "https://api.securo.dev/api/v1/payment/currency-price"
  var method = "POST"

  var baseString = `${url}&method=${method}&timestamp=${timestamp}`

  var postData = JSON.stringify({
    fiatAmount: 1000,
    cryptoCurrency: "USDT",
    fiatCurrency: "USD",
    isBuyOrSell: "BUY",
    network: "ethereum",
    paymentMethod: "credit_debit_card",
  })

  console.log(postData);


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
      .then(response => console.log(response))
      .catch(err => console.error(err))
  }

  var uniqueItems = []

  useEffect(() => {

    console.log("fsj : ", Data);

    Data.forEach(item => {
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

    console.log('lmlmlknkfdj');

    console.log(uniqueItems);

    console.log(Object.values(uniqueItems));
  }, [])

  console.log("...");
  console.log(chainList);


  const handleOnSearch = (string, results) => {
    console.log(string, results);
  };

  const handleOnSelect = (item) => {
    console.log(item);
    console.log("selected");
    setCurrChain(item)
  };

  // const handleOnHover = (result) => {
  //   console.log(result);
  // };

  const handleOnFocus = () => {
    console.log("Focused");
  };

  // const handleOnClear = () => {
  //   console.log("Cleared");
  // };


  return (
    <>
      <div style={{ width: 200, margin: 20 }}>
        <h2>10000 items!</h2>
        <div style={{ marginBottom: 20 }}>Select Crypto</div>
        <ReactSearchAutocomplete
          items={chainList}
          maxResults={4}
          onSearch={handleOnSearch}
          onSelect={handleOnSelect}
          fuseOptions={{ keys: ["id", "name"] }}  // searchable items
          styling={{ zIndex: 3 }}
          // onHover={handleOnHover}
          onFocus={handleOnFocus}
        // onClear={handleOnClear}
        />
      </div>

      <button onClick={getData}>
        data fetch fr
      </button>
    </>
  )
}

export default selectionPage