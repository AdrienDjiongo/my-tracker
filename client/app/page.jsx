"use client";
import {
  ChevronsUp,
  ChevronsDown,
  CirclePlus,
  House,
  ChartColumn,
  ArrowDownUp,
  Settings,
} from "lucide-react";
import Link from "next/link";

import { Montserrat } from "next/font/google";
import React from "react";
import { useState, useEffect } from "react";

const montserrat = Montserrat({
  subsets: ["latin"], // Include the required subsets
  weight: ["400"], // Choose the font weights you need
  style: ["normal"], // Optional: include italic styles
});

export default function Home() {
  const [balance, setBalance] = useState("loading...");
  const [amounts, setAmounts] = useState(["loading...", "loading..."]);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch the JSON file from the public folder
    fetch(
      `https://exptrack-jdtdpcx88-adriendjiongos-projects.vercel.app/Transactions`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data.json");
        }
        return response.json();
      })
      .then((data) => {
        setTransactions(data);
        setIsLoading(false);
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  useEffect(() => {
    // Fetch the JSON file from the public folder
    fetch(
      `https://exptrack-jdtdpcx88-adriendjiongos-projects.vercel.app/Balance`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data.json");
        }
        return response.json();
      })
      .then((data) => setBalance(data))
      .catch((error) => console.error("Error:", error));
  }, []);

  useEffect(() => {
    // Fetch the JSON file from the public folder
    fetch(`https://exptrack-jdtdpcx88-adriendjiongos-projects.vercel.app/InOut`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data.json");
        }
        return response.json();
      })
      .then((data) => setAmounts(data))
      .catch((error) => console.error("Error:", error));
  }, []);

  return (
    <div className={`grid grid-cols-1 md:grid-cols-7 ${montserrat.className} `}>
      <div className="fixed md:hidden py-1 px-3 bg-[#3ec3d5a8]  bottom-0 rounded-full flex gap-2 drop-shadow-sm mb-5 hover:cursor-pointer left-1/2 transform -translate-x-1/2">
        <Link href="/" className="hover:cursor-pointer">
          <House
            className=" border-white border-[2px] p-1  rounded-full "
            color="white"
            size={40}
            strokeWidth={1.5}
          />{" "}
        </Link>
        <Link href="/Dashboard" className="hover:cursor-pointer">
          {" "}
          <ChartColumn
            className=" border-white border-[2px] p-1  rounded-full "
            color="white"
            size={40}
            strokeWidth={1.5}
          />{" "}
        </Link>

        <Link href="NewTransaction" className="hover:cursor-pointer">
          <CirclePlus
            className="bg-[#3ec3d5a8] mx-2 rounded-full "
            color="white"
            size={40}
            strokeWidth={0.8}
          />
        </Link>

        <Link href="/Transactions" className="hover:cursor-pointer">
          <ArrowDownUp
            className=" border-white border-[2px] p-1  rounded-full "
            color="white"
            size={40}
            strokeWidth={1.5}
          />
        </Link>

        <Link href="/Setttings" className="hover:cursor-pointer">
          {" "}
          <Settings
            className=" border-white border-[2px] p-1  rounded-full "
            color="white"
            size={40}
            strokeWidth={1.5}
          />{" "}
        </Link>
      </div>
      <div className="col-span-1 hidden md:block shadow-2xl">
        <div className="flex flex-col gap-4 my-10 px-4">
          <Link href="/" className="hover:cursor-pointer">
            <p className="px-4 py-2 text-lg bg-[#3ec3d5] rounded-lg">Home</p>
          </Link>

          <Link href="/Dashboard" className="hover:cursor-pointer">
            <p className="px-4 py-2 text-lg hover:bg-[#3ec3d5] rounded-lg">
              Dashboard
            </p>
          </Link>
          <Link href="/Transactions" className="hover:cursor-pointer">
            <p className="px-4 py-2 text-lg hover:bg-[#3ec3d5] rounded-lg">
              Transactions
            </p>
          </Link>

          <Link href="/" className="hover:cursor-pointer">
            <p className="px-4 py-2 text-lg hover:bg-[#3ec3d5] rounded-lg">
              settings
            </p>
          </Link>
        </div>
      </div>
      <div className="col-span-6 bg-[rgba(247,247,250)] h-[100vh] px-4">
        <div className="mt-20 mx-[5%] md:mx-[20%] flex flex-col md:flex-row justify-between">
          <div className="bg-[#41dc65] text-white border-2 border- rounded-lg px-3 py-5 w-full md:w-fit h-fit font-bold shadow-md mb-4 md:mb-0">
            <p>Incomes this month</p>
            <p className=""> + {amounts[0]} xaf </p>
          </div>
          <div className="rounded-lg px-3 text-2xl py-6 bg-[#ffffffcc] w-full md:w-fit h-fit font-bold shadow-md mb-4 md:mb-0">
            <p>Current balance</p>
            <p className="text-[#3ec3d5] text-center"> {balance} xaf </p>
          </div>
          <div className="bg-[#ff5460] text-white rounded-lg px-3 py-5 w-full md:w-fit h-fit font-bold shadow-md">
            <p>Outcomes this month</p>
            <p className=""> - {amounts[1]} xaf </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 mx-[5%] md:mx-[20%] my-10">
          <div className="flex items-center justify-between">
            <p>Recent transactions...</p>
            <Link
              href="/NewTransaction"
              className="flex items-center gap-3 bg-[#3ec3d5a8] p-3 rounded-2xl"
            >
              <span className="pt-1">New transaction</span>
              <CirclePlus
                color="white"
                size={30}
                strokeWidth={1.5}
                className="rounded-full drop-shadow-sm hover:cursor-pointer"
              />
            </Link>
          </div>
          {!isLoading ? (
            <div className="flex flex-col gap-2">
              {transactions.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {transactions.slice(0, 4).map((transaction) => (
                    <div
                      key={`transaction-${transaction._id}`}
                      className="flex my-1 flex-col gap-2"
                    >
                      <div className="bg-white px-6 py-2 shadow-md rounded-md flex justify-between">
                        <p>{transaction.description}</p>
                        <div className="flex gap-2">
                          <p
                            className={`${
                              transaction.type == "outcome"
                                ? "text-[#ff5460]"
                                : "text-[#41dc65]"
                            } font-semibold`}
                          >
                            {transaction.type == "income" ? (
                              <span>+</span>
                            ) : (
                              <span>-</span>
                            )}
                            {transaction.price} xaf
                          </p>
                          {transaction.type == "outcome" ? (
                            <ChevronsDown color="#ff5460" />
                          ) : (
                            <ChevronsUp color="#62ff8ee7" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No data</p>
              )}
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>

        <Link href="/Transactions">
          <div className="bg-zinc-300 rounded-lg px-3 py-2 w-fit mx-auto mb-5 font-semibold -mt-4">
            View all...
          </div>
        </Link>
      </div>
    </div>
  );
}
