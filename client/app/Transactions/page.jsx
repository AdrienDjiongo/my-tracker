"use client";
import React from "react";
import { useEffect, useState } from "react";
import {
  ChevronsUp,
  ChevronsDown,
  CirclePlus,
  Filter,
  CircleDollarSign,
  ChartColumn,
  House,
  Settings,
  ArrowDownUp,
} from "lucide-react";
import { Montserrat } from "next/font/google";
import Link from "next/link";

const montserrat = Montserrat({
  subsets: ["latin"], // Include the required subsets
  weight: ["400"], // Choose the font weights you need
  style: ["normal"], // Optional: include italic styles
});

function page() {
  const [transactions, setTransactions] = useState([]);
  const [isIncomeChecked, setIsIncomeChecked] = useState(false);
  const [isOutcomeChecked, setIsOutcomeChecked] = useState(false);
  const [incomeFilter, setIncomeFilter] = useState(false);
  const [outcomeFilter, setOutcomeFilter] = useState(false);
  const [typeFilter, setTypeFilter] = useState("");
  const [search, setSearch] = useState("");
  const [selectedAfterDate, setSelectedAfterDate] = useState("");
  const [selectedBeforeDate, setSelectedBeforeDate] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [searchfilter, setSearchfilter] = useState("");
  const [afterDateFilter, setAfterDateFilter] = useState("");
  const [beforeDateFilter, setBeforeDateFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [finalFilter, setfinalFilter] = useState("");
  const [balance, setBalance] = useState("loading...");
  const [amounts, setAmounts] = useState(["loading...", "loading..."]);
  const [isloading, setIsloading] = useState(true);

  // Handle date input change
  const handleAfterDateChange = (event) => {
    setSelectedAfterDate(event.target.value); // Update the state with the selected date
    setAfterDateFilter("afterDate=" + event.target.value);
  };

  const handleBeforeDateChange = (event) => {
    setSelectedBeforeDate(event.target.value); // Update the state with the selected date
    setBeforeDateFilter("beforeDate=" + event.target.value);
  };

  const ChangeIncomeCheck = (event) => {
    setIsIncomeChecked(event.target.checked); // Update the state based on checkbox status
  };
  const ChangeOutcomeCheck = (event) => {
    setIsOutcomeChecked(event.target.checked); // Update the state based on checkbox status
  };
  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };
  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setSearchfilter("&search=" + search);
  };
  const handleMinPriceChange = (event) => {
    setMinPrice(event.target.value);
  };
  const handleMaxPriceChange = (event) => {
    setMaxPrice(event.target.value);
  };
  const handlePriceSubmit = (event) => {
    event.preventDefault();
    setPriceFilter("&minPrice=" + minPrice + "&" + "maxPrice=" + maxPrice);
  };

  console.log(new Date());
  console.log(incomeFilter + " is income filter");

  let TransactionFilter =
    "type=income&minPrice=200&maxPrice=100000&afterDate=2024/12/30";

  useEffect(() => {
    if (isIncomeChecked == isOutcomeChecked) {
      setTypeFilter(null);
    } else if (isIncomeChecked && !isOutcomeChecked) {
      setTypeFilter("type=income");
    } else if (!isIncomeChecked && isOutcomeChecked) {
      setTypeFilter("type=outcome");
    } else if (isOutcomeChecked && !isIncomeChecked) {
      setTypeFilter("type=outcome");
    } else if (!isOutcomeChecked && isIncomeChecked) {
      setTypeFilter("type=income");
    }
    setDateFilter(afterDateFilter + "&" + beforeDateFilter);

    const DF = dateFilter ? dateFilter + "&" : " ";
    const TF = typeFilter ? typeFilter : "";

    setfinalFilter(DF + TF + priceFilter + searchfilter);
  }, [
    isIncomeChecked,
    isOutcomeChecked,
    typeFilter,
    dateFilter,
    afterDateFilter,
    beforeDateFilter,
    priceFilter,
    searchfilter,
  ]);

  useEffect(() => {
    setIsloading(true);
    setTransactions([]);
    // Fetch the JSON file from the public folder
    fetch(
      `https://strong-tranquility-production.up.railway.app/filteredTransactions?${finalFilter}`
    )
      .then((response) => {
        console.log("just fetched and final filter value is" + finalFilter);
        if (!response.ok) {
          throw new Error("Failed to fetch data.json");
        }
        return response.json();
      })
      .then((data) => {
        setTransactions(data);
        setIsloading(false);
      })
      .catch((error) => console.error("Error:", error));
  }, [finalFilter]);

  useEffect(() => {
    // Fetch the JSON file from the public folder
    fetch(`https://strong-tranquility-production.up.railway.app/Balance`)
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
    fetch(`https://strong-tranquility-production.up.railway.app/InOut`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data.json");
        }
        return response.json();
      })
      .then((data) => setAmounts(data))
      .catch((error) => console.error("Error:", error));
  }, []);

  const monthNamess = [
    "Janvier",
    "Fevrier",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juilet",
    "Aout",
    "Septembre",
    "Octobre",
    "Novembre",
    "Decembre",
  ];

  console.log(new Date().toLocaleString().substr(0, 10));

  const groupedTransactions = transactions.reduce((acc, transaction) => {
    const formatDate = (dateStr) => {
      // Convert string to Date object
      const dateObj = new Date(dateStr);

      // Check if the conversion resulted in a valid date
      if (isNaN(dateObj)) {
        throw new Error("Invalid date format");
      }

      // Format the Date object as DD/MM/YYYY
      const day = String(dateObj.getDate()).padStart(2, "0");
      const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
      const year = dateObj.getFullYear();

      return `${day}/${month}/${year}`;
    };

    const yo = formatDate(transaction.date);
    const [day, month, year] = yo.split("/");
    const monthKey = `${month}/${year}`;

    const monthName = monthNamess[month - 1];

    const dateKey = yo;

    // Ensure the structure for the month exists
    if (!acc[monthKey]) {
      acc[monthKey] = {};
    }

    // Ensure the structure for the date exists
    if (!acc[monthKey][dateKey]) {
      acc[monthKey][dateKey] = [];
    }

    // Add the transaction to the corresponding date
    acc[monthKey][dateKey].push(transaction);

    return acc;
  }, {});

  return (
    <div
      className={`grid md:grid-cols-7 ${montserrat.className} min-h-[100vh]`}
    >
      <div className="col-span-1 hidden md:block top-0 left-0 shadow-2xl">
        <div className="flex flex-col gap-4 my-16 px-4">
          <Link href="/" className="hover:cursor-pointer">
            <p className="px-4 py-2 text-lg hover:bg-[#3ec3d5] rounded-lg">
              Home
            </p>
          </Link>
          <Link href="/Dashboard" className="hover:cursor-pointer">
            <p className="px-4 py-2 text-lg hover:bg-[#3ec3d5] rounded-lg">
              Dashboard
            </p>
          </Link>
          <Link href="/Transactions" className="hover:cursor-pointer">
            <p className="px-4 py-2 text-lg bg-[#3ec3d5] rounded-lg">
              Transactions
            </p>
          </Link>
          <Link href="/Setttings" className="hover:cursor-pointer">
            <p className="px-4 py-2 text-lg hover:bg-[#3ec3d5] rounded-lg">
              settings
            </p>
          </Link>
        </div>
      </div>
      <div className="col-span-6 bg-[#f7f7fa] px-4">
        <div className="flex flex-row justify-between px-6 py-4">
          <div className="rounded-lg px-2 py-4 text-center bg-[#ffffffcc] w-fit h-fit font-bold shadow-md">
            <p>Current balance</p>
            <p className="text-[#3ec3d5]">{balance} xaf</p>
          </div>
          <div className="rounded-lg px-2 text-center bg-[#ffffffcc] w-fit h-fit font-bold shadow-md">
            <p>this month</p>
            <div className="text-[#41dc65] flex text-sm rounded-lg px-2 pt-1 w-fit h-fit font-semibold">
              <ChevronsUp />
              <p>{amounts[0]} xaf</p>
            </div>
            <div className="text-[#ff5460] flex text-sm rounded-lg px-2 pb-1 w-fit h-fit font-semibold">
              <ChevronsDown />
              <p>{amounts[1]} xaf</p>
            </div>
          </div>
        </div>
        <Link className="hidden md:block" href="/NewTransaction">
          <CirclePlus
            color="white"
            size={60}
            strokeWidth={0.8}
            className="fixed bottom-0 rounded-full drop-shadow-sm mb-5 hover:cursor-pointer bg-[#3ec3d5a8] left-1/2 transform -translate-x-1/2"
          />
        </Link>
        <div className="fixed md:hidden py-1 px-3 bg-[#3ec3d5a8]  bottom-0 rounded-full flex gap-2 drop-shadow-sm mb-5 hover:cursor-pointer left-1/2 transform -translate-x-1/2">
          <Link href="/" className="hover:cursor-pointer">
            <House
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
        <div className="grid grid-cols-1 md:grid-cols-8 mx-2 md:mx-10 pb-10">
          <div className="col-span-2 text-sm flex flex-col gap-3">
            <div className="flex justify-around text-zinc-500 text-base">
              <p>Filter...</p>
              <Filter color="#3ec3d5" size={20} />
            </div>
            <div className="flex gap-2 justify-around">
              <input
                className="border-zinc-200 border-[1px] rounded-md "
                onChange={handleSearchChange}
                value={search}
              />
              <button
                className="bg-[#3ec3d5a8] text-white px-2 py-1 font-semibold rounded-lg"
                onClick={handleSearchSubmit}
              >
                search
              </button>
            </div>

            <div className=" flex justify-around md:block ">
              <div>
                {" "}
                <div className="text-zinc-500">
                  <p className="mx-auto underline text-[#3ec3d5]">by date</p>
                  <div className="flex flex-col gap-1">
                    <p>
                      from:{" "}
                      <input
                        type="date"
                        value={selectedAfterDate}
                        onChange={handleAfterDateChange}
                      />
                    </p>
                    <p>
                      to:{" "}
                      <input
                        type="date"
                        value={selectedBeforeDate}
                        onChange={handleBeforeDateChange}
                      />
                    </p>
                    <p>none</p>
                  </div>
                </div>
                <div className="text-zinc-500">
                  <p className="mx-auto underline text-[#3ec3d5]">by status</p>
                  <div className="flex flex-col gap-1">
                    <p>
                      Incomes{" "}
                      <input
                        type="checkbox"
                        checked={isIncomeChecked}
                        onChange={ChangeIncomeCheck}
                      />
                    </p>
                    <p>
                      Outcomes{" "}
                      <input
                        type="checkbox"
                        checked={isOutcomeChecked}
                        onChange={ChangeOutcomeCheck}
                      />
                    </p>
                  </div>
                </div>{" "}
              </div>

              <div>
                <div className="text-zinc-500">
                  <p className="mx-auto underline text-[#3ec3d5]">by amount</p>
                  <div className="flex flex-col gap-1">
                    <p>from:</p>{" "}
                    <input
                      onChange={handleMinPriceChange}
                      type="number"
                      name="from"
                    />
                    <p>to:</p>{" "}
                    <input
                      onChange={handleMaxPriceChange}
                      type="number"
                      name="to"
                    />
                    <button
                      className="bg-[#3ec3d5a8] text-white px-2 py-1 font-semibold rounded-lg"
                      onClick={handlePriceSubmit}
                    >
                      apply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-3 flex-col col-span-6 mx-2 md:mx-10">
            {Object.keys(groupedTransactions).length > 0 ? (
              <div>
                {Object.entries(groupedTransactions).map(([month, dates]) => (
                  <div key={`month-${month}`}>
                    <h2
                      style={{ marginTop: "20px", fontWeight: "bold" }}
                      className="font-semibold text-center text-2xl -ml-8 text-zinc-600"
                    >
                      Mois de{" "}
                      {monthNamess[parseInt(month.split("/")[0], 10) - 1]}{" "}
                      {month.split("/")[1]}
                    </h2>
                    {Object.entries(dates).map(([date, transactions]) => (
                      <div key={`date-${date}`}>
                        <h3
                          style={{ marginTop: "10px" }}
                          className="text-zinc-500"
                        >
                          Date:{" "}
                          {date.substr(0, 2) +
                            " " +
                            monthNamess[parseInt(date.substr(3, 2)) - 1] +
                            " " +
                            date.substr(6, 4)}
                        </h3>
                        {transactions
                          .sort(
                            (a, b) =>
                              new Date(b.createdAt) - new Date(a.createdAt)
                          )
                          .map((transaction) => (
                            <div
                              key={`transaction-${transaction._id}`}
                              className="flex my-4 flex-col gap-3"
                            >
                              <div className="bg-white px-3 md:px-6 py-3 shadow-md rounded-md flex justify-between">
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
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <div>
                {isloading ? (
                  <div>
                    <p>Chargement des données...</p>
                    <div className="flex gap-5 animate-pulse text-[#8f8f8f]">
                      <CircleDollarSign size={50} strokeWidth={1} />
                      <CircleDollarSign size={50} strokeWidth={1} />
                      <CircleDollarSign size={50} strokeWidth={1} />
                      <CircleDollarSign size={50} strokeWidth={1} />
                    </div>
                  </div>
                ) : (
                  <p>NO DATA</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;
