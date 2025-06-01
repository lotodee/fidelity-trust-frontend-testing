import axios from "axios";

   const getBTCtoUSDExchangeRate = async ()=>{
  try {
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price",
      {
        params: {
          ids: "bitcoin",
          vs_currencies: "usd",
        },
      }
    );
    return response.data.bitcoin.usd;
  } catch (error) {
    console.error("Error fetching BTC price:", error);
    return null;
  }
}

export const cryptoAPI = {

    


 convertUSDToBTC : async (usdAmount:any) =>{
  const rate = await getBTCtoUSDExchangeRate();
  if (!rate) return null;
 const btcAmount = usdAmount / rate;
 return parseFloat(btcAmount.toFixed(5));
},

}