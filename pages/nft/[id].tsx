import React from "react";
import {
  useAddress,
  useDisconnect,
  useMetamask,
  useNFTDrop,
} from "@thirdweb-dev/react";
import { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import { sanityClient, urlFor } from "../../sanity";
import { Collection } from "../../typings";
import Link from "next/link";
import { BigNumber } from "ethers";
import toast, { Toaster } from "react-hot-toast";

interface Props {
  collection: Collection;
}

const NFTDropPage = ({ collection }: Props) => {
  const [claimedSupply, setClaimedSupply] = useState<number>(0);
  const [totalSupply, setTotalSupply] = useState<BigNumber>();
  const [loading, setLoading] = useState<boolean>(true);
  const [priceInEth, setPriceInEth] = useState<string>();
  const nftDrop = useNFTDrop(collection.address);

  // Auth
  const connectWithMetamask = useMetamask();
  const disconnect = useDisconnect();
  const address = useAddress();

  useEffect(() => {
    if (!nftDrop) return;
    const fetchPriceInEth = async () => {
      const claimedConditions = await nftDrop.claimConditions.getAll();
      setPriceInEth(claimedConditions?.[0].currencyMetadata.displayValue);
    };
    fetchPriceInEth();
  }, [nftDrop]);
  useEffect(() => {
    if (!nftDrop) return;
    const fetchNFTDropData = async () => {
      setLoading(true);
      const claimed = await nftDrop.getAllClaimed();
      const total = await nftDrop.totalSupply();
      setClaimedSupply(claimed.length);
      setTotalSupply(total);
      setLoading(false);
    };
    fetchNFTDropData();
  }, [nftDrop]);
  const mintNFT = () => {
    if (!nftDrop || !address) return;
    const quantity = 1;
    setLoading(true);
    const notifications = toast.loading("Minting....", {
      style: {
        background: "white",
        color: "green",
        fontWeight: "bolder",
        fontSize: "17px",
        padding: "20px",
      },
    });
    nftDrop
      .claimTo(address, quantity)
      .then(async (tx) => {
        const receipt = tx[0].receipt;
        const claimedTokenId = tx[0].id;
        const claimedNFT = await tx[0].data();
        toast("HOORAY!! You have sucessfully minted", {
          duration: 8000,
          style: {
            background: "white",
            color: "green",
            fontWeight: "bolder",
            fontSize: "17px",
            padding: "20px",
          },
        });
        console.log(receipt);
        console.log(claimedTokenId);
        console.log(claimedNFT);
      })

      .catch((err) => {
        console.log(err);
        toast("Whoops! Something went wrong", {
          duration: 8000,
          style: {
            background: "red",
            color: "white",
            fontWeight: "bolder",
            fontSize: "17px",
            padding: "20px",
          },
        });
      })
      .finally(() => {
        setLoading(false);
        toast.dismiss(notifications);
      });
  };
  // --
  return (
    <div className="flex h-screen flex-col lg:grid lg:grid-cols-10">
      <Toaster position="bottom-left" />
      {/*  Left */}
      <div className="lg:col-span-4 bg-gradient-to-br from-pink-500 to-purple-500">
        <div className="flex flex-col items-center justify-center py-2 lg:min-h-screen">
          <div className="bg-gradient-to-r from-sky-500 to-indigo-500 p-2 rounded-xl">
            <img
              className="w-44 rounded-xl object-cover lg:h-96 lg:w-72"
              src={urlFor(collection.previewImage).url()}
              alt="Image"
            />
          </div>
          <div className="space-y-2 text-center p-5">
            <h1 className="text-4xl font-bold text-white">
              {collection.title}
            </h1>
            <h2 className="text-xl text-gray-300">{collection.description}</h2>
          </div>
        </div>
      </div>
      {/* Right */}
      <div className="flex flex-1 flex-col p-12 lg:col-span-6">
        {/* Header */}
        <header className="flex items-center justify-between">
          <Link href={"/"}>
            <h1 className="w-52 cursor-pointer text-xl font-extralight">
              The{" "}
              <span className="font-extrabold underline decoration-pink-600/50">
                Random
              </span>{" "}
              NFT MarketPlace
            </h1>
          </Link>
          <button
            className="rounded-full bg-purple-500 font-bold text-white px-5 py-1"
            onClick={() => {
              address ? disconnect() : connectWithMetamask();
            }}
          >
            {address ? "DisConnect MetaMask" : "Connect MetaMask"}
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
            src={urlFor(collection.mainImage).url()}
            alt="body image"
          />
          <h1 className="text-3xl font-bold lg:text-5xl lg:font-extrabold ">
            The Random Animals NFT Coding | NFT Drop
          </h1>
          {loading ? (
            <p className="animate-pulse pt-2 text-xl text-green-500">
              Loading Total Supply...
            </p>
          ) : (
            <p className="pt-2 text-xl text-green-500">
              {claimedSupply}/{totalSupply?.toString()} NFT claimed
            </p>
          )}
          {loading && (
            <img
              className="h-60 object-contain"
              src="https://cdn.hackernoon.com/images/0*4Gzjgh9Y7Gu8KEtZ.gif"
            />
          )}
        </div>
        {/* Mint Button */}
        <button
          onClick={mintNFT}
          disabled={
            loading || !address || claimedSupply === totalSupply?.toNumber()
          }
          className="bg-purple-500 rounded-full font-bold text-white p-2 mt-4 h-12 disabled:bg-gray-400"
        >
          {loading ? (
            <>Loading</>
          ) : claimedSupply === totalSupply?.toNumber() ? (
            <>Sold Out</>
          ) : !address ? (
            <>Connect Wallet To Mint</>
          ) : (
            <span> MINT NFT ({priceInEth} ETH)</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default NFTDropPage;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const query = `*[_type == "collection" && slug.current == $id][0]{
  _id,
  title,
  address,
  description,
  slug{
    current
  },
  mainImage{
    asset
  },
  previewImage{
    asset
  },
  creator->{
    _id,
    name,
    address,
    bio,
    slug{
     current
   },
   image{
     asset
   },
  },
}`;
  const collection = await sanityClient.fetch(query, {
    id: params?.id,
  });
  if (!collection) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      collection,
    },
  };
};
