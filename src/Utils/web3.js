import Web3 from "web3";

let web3;

const getWeb3 = async () => {
  if (web3) {
    return web3;
  }

  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
    } catch (error) {
      console.error("User denied account access");
    }
  } else if (window.web3) {
    web3 = new Web3(window.web3.currentProvider);
  } else {
    web3 = new Web3("http://localhost:7545");
  }
  
  return web3;
};

export default getWeb3;
