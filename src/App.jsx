import React, {useEffect,useState,useRef} from "react";
import { ethers } from "ethers";
import './App.css';
import abi from "./utils/WavePortalABI.json";
import kid1 from "./utils/kid-hi.jpg";
import kid2 from "./utils/kid-real.jpg";
  const App = () => {
    const ref = useRef();
    const [currentAccount, setCurrentAccount] = useState("");
    const [totalWaves, setTotalWaves] = useState("");
    const [loading, setLoading] = useState("");
    const [allWaves, setAllWaves] = useState([]);
    const [msg, setMsg] = useState("");
    const contractAddress = "0xce95F5955c68C7B040503a90daa85FE4A46cb634";
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

    const wave = async () => {
      if(!currentAccount){
        alert("Connect your wallet first!!!");
        return;
      }
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
        setLoading("");
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
    if(!currentAccount){
        alert("Connect your wallet first!!!");
       return;
      }
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


  const getAllWaves = async () => {
    if(!currentAccount){
        alert("Connect your wallet first!!!");
      return;
      }
      setLoading(" ");
      setTotalWaves("");
      const {ethereum} = window;
    
      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress,contractABI,signer); 
        let waves = await wavePortalContract.getAllWaves();
        setLoading("");

        let wavesCleaned = [];
        waves.forEach(wave => {
          wavesCleaned.push({
            address : wave.waver,
            data : wave.data,
            timestamp : new Date(wave.timestamp*1000),
          })
        })
        setAllWaves(wavesCleaned);
        await ref.current.scrollIntoView({ behavior: "smooth" });
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
          <div className="bio">
        <p>Mining on Ethereum.... In progress</p>
        <progress value="37" max ="99"></progress>
        </div>
        </div>
          
      }
      { totalWaves &&
      <div className="dataContainer">
        <div className="header">
          Total waves are ... {totalWaves}
          </div>
        <div className="bio">
        <button className="waveButton" onClick={()=>setTotalWaves("")}>
        Clear</button>
        </div>
          
      </div>
      }
      <div className="dataContainer">
        <div className="header">
        <img src={kid1} />
          
        Chotta Bheem Here! Say Hii
        <img src={kid2} />
          
        </div>
        <div className="bio">
        Just write what you think about me..
        </div>
      </div>
        <div className="bio">
        <input onChange={()=>{setMsg(event.target.value);}} type="text" placeholder="Write sth abt me.."></input>
        </div>
      <div>
        <div className="bio">
        <button className="waveButton" onClick={()=>{wave();}}>
        Send Message
        </button>
          </div>
        <div className="bio">
        { !currentAccount && (
      
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet.
          </button>
        )}
         <button className="waveButton" onClick={getWaveCount}>
          Get Total Waves
        </button>
        <button className="waveButton" onClick={getAllWaves} href="#messages">
          Previous Waves
        </button>

          </div>
        </div>
      

      <div className=" messageLIst" id="messages" ref={ref}>
        {!!allWaves.length && <h1>What everyone has written about me .. </h1>}
             {allWaves.map((wave,index)=> {
          return (
          <div  key={index} className="message">
            <ul>
              <li> <em>Address</em> : {wave.address}</li>
              <li> <em>Message</em> : {wave.data}</li>
              <li> <em>Time</em> : {wave.timestamp.toString()}</li>
            </ul>
          </div>
          )
        })
        }
        </div>
      {!!allWaves.length && <div className="bio">
        <button className="waveButton" onClick={()=>setAllWaves([])}>
        Clear</button>
        </div>
      }
      </div>
  );
      }
      
export default App
x 