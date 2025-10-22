import React, { useState } from "react";
import web3 from "../Utils/web3";
import SeedTrace from "../src/contracts/SeedTrace.json";
import "./SeedRegistration.css";

const SeedRegistration = () => {
  const [seedID, setSeedID] = useState("");
  const [cropName, setCropName] = useState("");
  const [variety, setVariety] = useState("");
  const [lotNumber, setLotNumber] = useState("");
  const [certType, setCertType] = useState("");
  const [tagNumber, setTagNumber] = useState("");
  const [owner, setOwner] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const registerSeed = async () => {
    if (!seedID || !cropName || !variety || !lotNumber || !certType || !tagNumber || !owner) {
      setMessage("❌ Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      setMessage("⏳ Processing transaction...");

      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SeedTrace.networks[networkId];
      if (!deployedNetwork) {
        setMessage("❌ Contract not deployed on this network.");
        setLoading(false);
        return;
      }

      const contract = new web3.eth.Contract(SeedTrace.abi, deployedNetwork.address);
      const accounts = await web3.eth.getAccounts();

      await contract.methods
        .registerSeed(seedID, cropName, variety, lotNumber, certType, tagNumber, owner)
        .send({ from: accounts[0] });

      setMessage("✅ Seed registered successfully!");
      setSeedID("");
      setCropName("");
      setVariety("");
      setLotNumber("");
      setCertType("");
      setTagNumber("");
      setOwner("");
    } catch (err) {
      console.error(err);
      setMessage("❌ Error registering seed. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="seed-registration-container">
      <h2>Seed Registration</h2>
      <div className="seed-form">
        {[
          { label: "Seed ID", value: seedID, setter: setSeedID },
          { label: "Crop Name", value: cropName, setter: setCropName },
          { label: "Variety", value: variety, setter: setVariety },
          { label: "Lot Number", value: lotNumber, setter: setLotNumber },
          { label: "Certification Type", value: certType, setter: setCertType },
          { label: "Tag Number", value: tagNumber, setter: setTagNumber },
          { label: "Owner Address", value: owner, setter: setOwner },
        ].map((field) => (
          <div key={field.label}>
            <label>{field.label}</label>
            <input
              placeholder={`Enter ${field.label}`}
              value={field.value}
              onChange={(e) => field.setter(e.target.value)}
            />
          </div>
        ))}
        <button className="register-btn" onClick={registerSeed} disabled={loading}>
          {loading ? "Registering..." : "Register Seed"}
        </button>
      </div>
      {message && <div className="alert">{message}</div>}
    </div>
  );
};

export default SeedRegistration;
