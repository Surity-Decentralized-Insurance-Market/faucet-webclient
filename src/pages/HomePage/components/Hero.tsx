import { ChangeEvent, useState } from "react";
import useApiResponse from "../../../hooks/useApiResponse";
import api from "../../../utils/api";
import { isAddress } from "web3-validator";
import { Link } from "react-router-dom";

export default function Hero() {
  const config = useApiResponse(api.getConfiguration);

  const [displayInvalidMessage, setDisplayInvalidMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [claimable, setClaimable] = useState<boolean | string>(false);
  const [addr, setAddr] = useState("");

  async function handleInput(event: ChangeEvent<HTMLInputElement>) {
    const address = event.target.value;
    if (!isAddress(address))
      return setDisplayInvalidMessage(address.length > 40);
    setDisplayInvalidMessage(false);
    const waitTime = await api.getWaitTime(address);
    if (waitTime > 0)
      return setClaimable(
        `you can claim more tokens after ${waitTime / 60} seconds`
      );
    setAddr(address);
    setClaimable(true);
  }

  return (
    <section className="h-screen bg-slate-900 text-white flex flex-col items-center p-20 gap-y-10 relative">
      <div className="flex text-7xl items-center">
        <img src="/logo.png" className="h-[1.3em]" />
        <h1 className="font-semibold">Surity</h1>
      </div>
      <h2 className="font-medium text-lg">Test (Fake) USDT Faucet</h2>

      <div className="bg-slate-800 p-8 rounded-[2rem] flex flex-col items-center gap-y-2">
        <h3>Enter you wallet address</h3>
        <p className="text-sm text-slate-400">
          You can claim {(config.data?.tokensPerRequest || 0) / Math.pow(10, 6)}{" "}
          FUSD every {(config.data?.defaultTimeout || Infinity) / 3600} hours
        </p>

        <div className="my-4 relative">
          {displayInvalidMessage && (
            <span className="absolute bottom-full right-2 text-red-500 text-xs">
              Invalid Address
            </span>
          )}
          <input
            type="text"
            name="address"
            placeholder="0x..."
            id="address"
            className="py-1 px-3 rounded-lg bg-white w-[42.8ch] text-black"
            onChange={handleInput}
          />
        </div>
        <button
          className="bg-cyan-400 px-5 py-2 text-black rounded-md hover:scale-[102%] hover:-translate-y-1 hover:shadow-lg active:translate-y-1 
        active:scale-75 duration-300 disabled:opacity-50 disabled:pointer-events-none"
          disabled={claimable != true}
          onClick={() => {
            if (!isAddress(addr)) return;
            setLoading(true);
            api
              .request(addr)
              .then(() => {
                alert("Received Tokens Successfully!");
                setClaimable(false);
                setAddr("");
              })
              .catch((err) => {
                alert(err);
              })
              .finally(() => {
                setLoading(false);
              });
          }}
        >
          {loading ? (
            <figure className="w-5 h-5 animate-spin border-2 border-dashed border-white rounded-full" />
          ) : (
            "Request"
          )}
        </button>
        {claimable != true && claimable != false && <p>{claimable}</p>}
      </div>

      <div className="bg-yellow-200 text-yellow-900 p-2 rounded-md text-sm">
        You will receive these tokens on the{" "}
        <Link
          to="https://testfaucet.bt.io/#/"
          target="_blank"
          className="underline underline-offset-2 hover:no-underline duration-150"
        >
          BTTC Donau Testnet
        </Link>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-gray-300">
        If these tokens are not needed any longer, make sure you send them back
        to 0x54e4fb4CE1388e6A67D4d7Ffb231D5E46751e4cb
      </div>
      <img
        src="/images/soparu.webp"
        alt="soparu"
        className="h-[30vh] absolute bottom-0 right-3"
      />
    </section>
  );
}
