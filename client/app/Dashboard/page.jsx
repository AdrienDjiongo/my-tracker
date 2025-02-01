"use client";
import Image from "next/image";
import { ChevronsUp, ChevronsDown, CirclePlus } from "lucide-react";
import { Montserrat } from "next/font/google";
import React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import CubicChart from "@/public/CubicChart";
import BarChart from "@/public/Barchart";
import Gpt from "@/public/gpt";
import PieChartOutputs from "@/public/PieChartInputs";
import PieChartInputs from "@/public/PieChartOutputs";
import { Pie } from "react-chartjs-2";

const montserrat = Montserrat({
  subsets: ["latin"], // Include the required subsets
  weight: ["400"], // Choose the font weights you need
  style: ["normal"], // Optional: include italic styles
});

const page = () => {
  // Get today's date
  const today = new Date();

  // Get the date of today + 1 month
  const nextMonth = new Date(today);
  nextMonth.setMonth(today.getMonth() + 1);

  // Get the date of today - 1 month
  const lastMonth = new Date(today);
  lastMonth.setMonth(today.getMonth() - 1);

  let lm = lastMonth.toISOString().split("T")[0];
  let nm = nextMonth.toISOString().split("T")[0];

  const [top3Categories, setTop3Categories] = useState(null);

  const [transactionsIN, setTransactionsIN] = useState(null);
  const [transactionsOUT, setTransactionsOUT] = useState(null);

  const [dateFilter, setDateFilter] = useState("");
  const [afterDateFilter, setAfterDateFilter] = useState("");
  const [beforeDateFilter, setBeforeDateFilter] = useState("");
  const [afterDate, setAfterDate] = useState(nm);
  const [beforeDate, setBeforeDate] = useState(lm);

  const refetch = () => {
    setDateFilter(beforeDateFilter + "&" + afterDateFilter);
    console.log(dateFilter);
  };

  const handleBeforeDateChange = (event) => {
    setBeforeDate(event.target.value);
    setBeforeDateFilter("afterDate=" + event.target.value);
  };
  const handleAfterDateChange = (event) => {
    setAfterDate(event.target.value); // Update the state with the selected date
    setAfterDateFilter("beforeDate=" + event.target.value);
  };

  useEffect(() => {
    fetch(
      dateFilter
        ? `https://exptrack-jdtdpcx88-adriendjiongos-projects.vercel.app/top3Categories?${dateFilter}`
        : `https://exptrack-jdtdpcx88-adriendjiongos-projects.vercel.app/top3Categories?afterDate=${lm}&beforeDate=${nm}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data.json");
        }
        return response.json();
      })
      .then((data) => {
        setTop3Categories(data);
      })
      .catch((error) => console.error("Error:", error));
  }, [dateFilter]);

  useEffect(() => {
    setTransactionsIN(null);
    setTransactionsOUT(null);

    // Fetch the JSON file from the public folder
    fetch(
      dateFilter
        ? `https://exptrack-jdtdpcx88-adriendjiongos-projects.vercel.app/Dashboard/filteredTransactions?${dateFilter}`
        : `https://exptrack-jdtdpcx88-adriendjiongos-projects.vercel.app/Dashboard/filteredTransactions?afterDate=${lm}&beforeDate=${nm}`
    ) // Fetch the JSON file from the public folder`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data.json");
        }
        return response.json();
      })
      .then((data) => {
        setTransactionsIN(data.IN);
        setTransactionsOUT(data.OUT);
        console.log(data.IN.totalPrice);
      })
      .catch((error) => console.error("Error:", error));
  }, [dateFilter]);

  return (
    <div className={`grid grid-cols-7 ${montserrat.className} `}>
      <div className="col-span-1  shadow-2xl   ">
        <div className="flex flex-col gap-4 my-10 px-4 ">
          <Link href="/" className=" hover:cursor-pointer ">
            {" "}
            <p className="px-4 py-2 text-lg hover:bg-[#3ec3d5] rounded-lg ">
              Home
            </p>{" "}
          </Link>

          <Link href="/Dashboard" className=" hover:cursor-pointer ">
            {" "}
            <p className="px-4 py-2 text-lg bg-[#3ec3d5] rounded-lg ">
              Dashboard
            </p>
          </Link>
          <Link href="/Transactions" className=" hover:cursor-pointer ">
            {" "}
            <p className="px-4 py-2 text-lg hover:bg-[#3ec3d5] rounded-lg ">
              Transactions
            </p>{" "}
          </Link>

          <Link href="/" className=" hover:cursor-pointer ">
            {" "}
            <p className="px-4 py-2 text-lg hover:bg-[#3ec3d5] rounded-lg ">
              {" "}
              settings{" "}
            </p>{" "}
          </Link>
        </div>
      </div>
      <div className="col-span-6 bg-[rgba(247,247,250)] min-h-[100vh]  px-4 ">
        <p className="text-2xl font-bold m-3">
          Multi-dimension analytics dashboard{" "}
        </p>
        <div className="w-full mx-4 my-3 px-10 bg-white rounded-lg flex justify-between p-3">
          <div className="flex my-auto  gap-8">
            {" "}
            <p className="font-semibold">
              From:{" "}
              <input
                type="date"
                value={beforeDate}
                onChange={handleBeforeDateChange}
                className="font-normal"
              />
            </p>{" "}
            <p className="font-semibold">
              To :{" "}
              <input
                type="date"
                value={afterDate}
                onChange={handleAfterDateChange}
                className="font-normal"
              />{" "}
            </p>
          </div>
          <button
            onClick={() => refetch()}
            className="bg-[#3ec3d5] text-white px-4 py-2 rounded-lg"
          >
            apply
          </button>
        </div>
        <div className="w-full text-center mx-4 my-3 px-10 bg-white rounded-lg p-3">
          <div className="flex justify-around ">
            <div className="flex flex-col">
              <p className="font-semibold">Incomes</p>
              <p className="text-sm text-[#41dc65]">
                {transactionsIN ? transactionsIN.totalPrice : "loading..."} xaf{" "}
              </p>
              <p className="text-xs text-center text-[#41dc65] ">
                {" "}
                {transactionsOUT
                  ? Math.round(
                      (transactionsIN.totalPrice * 100) /
                        (transactionsOUT.totalPrice + transactionsIN.totalPrice)
                    )
                  : "loading..."}{" "}
                %{" "}
              </p>
            </div>

            <div className="flex flex-col">
              <p className="font-semibold">n° of in trns</p>
              <p className="text-sm text-[#41dc65]">
                {" "}
                {transactionsIN
                  ? transactionsIN.transactionCount
                  : "loading..."}{" "}
              </p>
              <p className="text-xs text-center text-[#41dc65] ">
                {" "}
                {transactionsOUT
                  ? Math.round(
                      (transactionsIN.transactionCount * 100) /
                        (transactionsOUT.transactionCount +
                          transactionsIN.transactionCount)
                    )
                  : "loading..."}{" "}
                %{" "}
              </p>
            </div>
            <div className="flex flex-col">
              <p className="font-semibold">outcomes</p>
              <p className="text-sm text-[#ff5460]">
                {" "}
                {transactionsOUT
                  ? transactionsOUT.totalPrice
                  : "loading..."}{" "}
                xaf{" "}
              </p>
              <p className="text-xs text-center text-[#ff5460] ">
                {" "}
                {transactionsOUT
                  ? Math.round(
                      (transactionsOUT.totalPrice * 100) /
                        (transactionsOUT.totalPrice + transactionsIN.totalPrice)
                    )
                  : "loading..."}{" "}
                %{" "}
              </p>
            </div>
            <div className="flex flex-col">
              <p className="font-semibold">n° of out trns</p>
              <p className="text-sm text-[#ff5460] ">
                {" "}
                {transactionsOUT
                  ? transactionsOUT.transactionCount
                  : "loading..."}{" "}
              </p>
              <p className="text-xs text-[#ff5460] text-center">
                {" "}
                {transactionsOUT
                  ? Math.round(
                      (transactionsOUT.transactionCount * 100) /
                        (transactionsOUT.transactionCount +
                          transactionsIN.transactionCount)
                    )
                  : "loading..."}{" "}
                %{" "}
              </p>
            </div>
            <div className="flex flex-col">
              <p className="font-semibold">balance</p>
              <p className="text-sm text-[#3ec3d5]">
                {" "}
                {transactionsOUT
                  ? transactionsIN.totalPrice - transactionsOUT.totalPrice
                  : "loading..."}{" "}
                xaf{" "}
              </p>{" "}
            </div>
          </div>
        </div>
        <div className="w-full flex">
          {" "}
          <PieChartInputs
            dateFilter={dateFilter}
            className="bg-teal-300 w-1/3 m-4"
          />
          <PieChartOutputs
            dateFilter={dateFilter}
            className="bg-white w-1/3 m-4"
          />
          <div className="w-1/3  p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-semibold text-center mb-2">
              Top Categories
            </h2>

            {top3Categories && top3Categories.length > 0 ? (
              <div>
                {/* Category 1 */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold">1.</span>
                    <span>{top3Categories[0].label}</span>
                  </div>
                  <div className="w-2/3">
                    <div className="relative pt-1">
                      <div className="flex mb-2 items-center justify-between">
                        <span className="text-xs font-semibold inline-block py-1">
                          {top3Categories[0].value}%
                        </span>
                      </div>
                      <div className="flex">
                        <div className="flex w-full overflow-hidden h-2 mb-2 rounded-xl bg-gray-200">
                          <div
                            className="flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                            style={{ width: top3Categories[0].value + "%" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Category 2 */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold">2.</span>
                    <span>
                      {top3Categories[1] ? top3Categories[1].label : ""}
                    </span>
                  </div>
                  <div className="w-2/3">
                    <div className="relative pt-1">
                      <div className="flex mb-2 items-center justify-between">
                        <span className="text-xs font-semibold inline-block py-1">
                          {top3Categories[1]
                            ? top3Categories[1].value + "%"
                            : ""}
                        </span>
                      </div>
                      <div className="flex mb-2">
                        <div className="flex w-full mb-2 overflow-hidden h-2 mb-2 rounded-xl bg-gray-200">
                          <div
                            className="flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                            style={{
                              width: top3Categories[1]
                                ? top3Categories[1].value + "%"
                                : "",
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Category 3 */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold">3.</span>
                    <span>
                      {top3Categories[2] ? top3Categories[2].label : ""}
                    </span>
                  </div>
                  <div className="w-2/3">
                    <div className="relative pt-1">
                      <div className="flex mb-2 items-center justify-between">
                        <span className="text-xs font-semibold inline-block py-1">
                          {top3Categories[2]
                            ? top3Categories[2].value + "%"
                            : ""}
                        </span>
                      </div>
                      <div className="flex ">
                        <div className="flex w-full overflow-hidden h-2 mb-2 rounded-xl bg-gray-200">
                          <div
                            className="flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                            style={{
                              width: top3Categories[2]
                                ? top3Categories[2].value + "%"
                                : "",
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
