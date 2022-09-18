import React from "react";
import { useAddress, useDisconnect, useMetamask } from "@thirdweb-dev/react";
import { useEffect, useState } from "react";

const NFTDropPage = () => {
  // Auth
  const connectWithMetamask = useMetamask();
  const disconnect = useDisconnect();
  const address = useAddress();

  // --
  return (
    <div className="flex h-screen flex-col lg:grid lg:grid-cols-10">
      {/*  Left */}
      <div className="lg:col-span-4 bg-gradient-to-br from-purple-500 to-pink-500">
        <div className="flex flex-col items-center justify-center py-2 lg:min-h-screen">
          <div className="bg-gradient-to-r from-sky-500 to-indigo-500 p-2 rounded-xl">
            <img
              className="w-44 rounded-xl object-cover lg:h-96 lg:w-72"
              src="https://links.papareact.com/8sg"
              alt="Image"
            />
          </div>
          <div className="space-y-2 text-center p-5">
            <h1 className="text-4xl font-bold text-white">Random Apes</h1>
            <h2 className="text-xl text-gray-300">
              A Collection of Random Ape who is pissed off
            </h2>
          </div>
        </div>
      </div>
      {/* Right */}
      <div className="flex flex-1 flex-col p-12 lg:col-span-6">
        {/* Header */}
        <header className="flex items-center justify-between">
          <h1 className="w-52 cursor-pointer text-xl font-extralight">
            The{" "}
            <span className="font-extrabold underline decoration-pink-600/50">
              Random
            </span>{" "}
            NFT MarketPlace
          </h1>
          <button
            className="rounded-full bg-purple-500 font-bold text-white px-5 py-1"
            onClick={() => {
              address ? disconnect() : connectWithMetamask();
            }}
          >
            {address ? "Connect MetaMask" : "Disconnect MetaMask"}
          </button>
        </header>
        <hr className="my-2 border" />
        {address && (
          <p className="text-green-500 text-center">
            You are logged in with wallet address {address.substring(0, 6)}...
            {address.substring(address.length - 5)}
          </p>
        )}
        {/*  Content */}
        <div className="mt-10 flex flex-1 flex-col items-center space-y-6 text-center lg:justify-center lg:space-y-0">
          <img
            className="w-80 object-cover pb-10 lg:h-40"
            src="https://links.papareact.com/bdy"
            alt="body image"
          />
          <h1 className="text-3xl font-bold lg:text-5xl lg:font-extrabold ">
            The Random Ape Coding | NFT Club
          </h1>
          <p className="pt-2 text-xl text-green-500">13/20 NFT claimed</p>
        </div>
        {/* Mint Button */}
        <button className="bg-purple-500 rounded-full font-bold text-white p-2 mt-4 h-12">
          MINT NFT (0.01 NFT)
        </button>
      </div>
    </div>
  );
};

export default NFTDropPage;
