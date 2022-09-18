import React, {useEffect,useState} from "react";
import { ethers } from "ethers";
import './App.css';
import abi from "./utils/WavePortalABI.json";

  const App = () => {

    const [currentAccount, setCurrentAccount] = useState("");
    const [totalWaves, setTotalWaves] = useState("");
    const [loading, setLoading] = useState("");
    const contractAddress = "0xDF4cc04284CB6502D74764B08c50D9025972A6a7";
    const contractABI = abi.abi;
    const date = new Date();

    const checkIfWalletIsConnected = async () => {
    try{
    const {ethereum} = window;
    if(!ethereum){
      console.log("Metamask isnt connected!");
    }
    else{
      console.log("Metaask Wallet is connected!!",ethereum);
    }

    const accounts = await ethereum.request({method : "eth_accounts"});

      if(accounts.length !==0){
        const account = accounts[0];
        console.log("Found authorized account! : ",account);
        setCurrentAccount(account);
      }
      else{
        console.log("No authorized account found!!");
      }
    }
    catch(error){
      console.log(error);
    }
  }
    
    const connectWallet = async () => {
      try{
        let {ethereum} = window;

        if(!ethereum){
          console.log("Metamask not there!");
          return;
        }
        const accounts = await ethereum.request({method : "eth_requestAccounts"});
        setCurrentAccount(accounts[0]);
        console.log("Connected to : ",accounts[0]);
        //window.location.reload(true);
      }
      catch(error){
        console.log(error);
      }
    }

    const wave = async ( msg) => {
      setLoading(" ");
      const {ethereum} = window;
      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress,contractABI,signer);   
        try{
        const waveTxn = await wavePortalContract.wave(msg);
        console.log("Mining ... : ", waveTxn.hash);
        
        await waveTxn.wait();
        console.log("Mined ... :", waveTxn.hash);

        let count = await wavePortalContract.getTotalWaves();
        setLoading("");
        // sleep(0.1);
        setTotalWaves(count.toNumber());
        console.log("Total waves are  : ", totalWaves);
        }
        catch(error){
          setLoading("");
          console.log(err);
        }
      }
      else{
        console.log("Ethereum obj doesnt exist");
      }
  }
  const getWaveCount = async () => {
      setLoading(" ");
      setTotalWaves("");
      const {ethereum} = window;
      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress,contractABI,signer); 
        let count = await wavePortalContract.getTotalWaves();
        setLoading("");
        // sleep(0.1);
        setTotalWaves(count.toNumber());
        console.log("Total waves are  : ", totalWaves);
      }
      else{
        console.log("Ethereum obj doesnt exist");
      }
  }
  useEffect(()=>{
    checkIfWalletIsConnected();
  },[])
  
  return (
    <div className="mainContainer">
      { loading &&
        <div className="dataContainer">
        <p>Mining on Ethereum.... In progress</p>
        <progress value="37" max ="99"></progress>
        </div>
          
      }
      { totalWaves &&
      <div className="dataContainer">
        <div className="header">
          Total waves are ... {totalWaves}
        </div>
      </div>
      }
      <div className="dataContainer">
        <div className="header">
        Chotta Bheem Here!!
        </div>
        <div className="bio">
        Just write what you think about me..
        </div>
        
        <input type="text"></input>
        <button className="waveButton" onClick={wave}>
          Send Message
        </button>
        
        { !currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet.
          </button>
        )}

         <button className="waveButton" onClick={getWaveCount}>
          Get Total Waves
        </button>
      </div>
      
    </div>
  );
}
export default App
