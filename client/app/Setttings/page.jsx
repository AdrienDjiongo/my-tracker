"use client";
import { Montserrat } from "next/font/google";
import React, { use } from "react";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  CirclePlus,
  ChartColumn,
  House,
  Settings,
  ArrowDownUp,
} from "lucide-react";
const montserrat = Montserrat({
  subsets: ["latin"], // Include the required subsets
  weight: ["400"], // Choose the font weights you need
  style: ["normal"], // Optional: include italic styles
});

const page = () => {
  const [inputcategorie, setInputCategorie] = useState("");
  const [outputcategorie, setOutputCategorie] = useState("");
  const [categories, setCategories] = useState([]);
  const [catchange, setCatchange] = useState(0);

  useEffect(() => {
    fetch("https://strong-tranquility-production.up.railway.app/Categories")
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error("Error:", error));
  }, [catchange]);

  const addNewInputCategory = () => {
    fetch("https://strong-tranquility-production.up.railway.app/Categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: inputcategorie,
        type: "income",
      }),
    })
      .then((response) => response.json())
      .then((data) => console.log("Response:", data))
      .then(() => setCatchange(catchange + 1))
      .catch((error) => {
        console.error("Error:", error);
        return 0;
      });

    setInputCategorie("");
  };

  const addNewOutputCategory = () => {
    fetch("https://strong-tranquility-production.up.railway.app/Categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: outputcategorie,
        type: "outcome",
      }),
    })
      .then((response) => response.json())
      .then((data) => console.log("Response:", data))
      .then(() => setCatchange(catchange + 1))
      .catch((error) => {
        console.error("Error:", error);
        return 0;
      });

    setOutputCategorie("");
    setCatchange(catchange + 1);
  };

  const deleteCategory = (id) => {
    fetch(
      `https://strong-tranquility-production.up.railway.app/Categories/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => console.log("Response:", data))
      .then(() => setCatchange(catchange + 1))
      .catch((error) => {
        console.error("Error:", error);
        return 0;
      });
  };

  return (
    <div className={`grid grid-cols-7 ${montserrat.className} `}>
      <div className="col-span-1 hidden md:block min-h-[100vh]  shadow-2xl   ">
        <div className="flex flex-col gap-4 my-10 px-4 ">
          <Link href="/" className=" hover:cursor-pointer ">
            {" "}
            <p className="px-4 py-2 text-lg hover:bg-[#3ec3d5] rounded-lg ">
              Home
            </p>{" "}
          </Link>

          <Link href="/Dashboard" className=" hover:cursor-pointer ">
            {" "}
            <p className="px-4 py-2 text-lg hover:bg-[#3ec3d5] rounded-lg ">
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
            <p className="px-4 py-2 text-lg bg-[#3ec3d5] rounded-lg ">
              {" "}
              settings{" "}
            </p>{" "}
          </Link>
        </div>
      </div>

      <div className="col-span-7 md:col-span-6 bg-[rgba(247,247,250)] min-h-[100vh]  px-4 ">
        <p className="text-2xl font-bold m-3">Paramètres</p>
        <div className="flex flex-col md:flex-row gap-4 ">
          <div className="bg-white shadow-md rounded-md w-fit px-6 py-4 mx-auto ">
            <p className="my-4 font-semibold ">inputs categories</p>
            <input
              className=" border-zinc-300 border-[1px] rounded-md mb-2  "
              type="text"
              value={inputcategorie}
              onChange={(e) => setInputCategorie(e.target.value)}
            />{" "}
            <span
              className="text-xl rounded-md bg-blue-400 px-2 hover:cursor-pointer"
              onClick={addNewInputCategory}
            >
              +
            </span>
            {categories
              .filter((category) => category.type === "income")
              .map((category) => (
                <p
                  key={category._id}
                  className=" px-6 py-1 flex justify-between"
                >
                  {" "}
                  <span>{category.name}</span>{" "}
                  <span
                    className=" hover:cursor-pointer bg-[#ff5460] text-white px-2 rounded-sm  "
                    onClick={() => deleteCategory(category._id)}
                  >
                    x
                  </span>{" "}
                </p>
              ))}
          </div>
          <div className="bg-white shadow-md rounded-md w-fit px-6 py-4 mx-auto ">
            <p className="my-4 font-semibold ">Outputs categories</p>
            <input
              className=" border-zinc-300 border-[1px] rounded-md mb-2  "
              type="text"
              value={outputcategorie}
              onChange={(e) => setOutputCategorie(e.target.value)}
            />{" "}
            <span
              className="text-xl rounded-md bg-blue-400 px-2 hover:cursor-pointer"
              onClick={addNewOutputCategory}
            >
              +
            </span>
            {categories
              .filter((category) => category.type === "outcome")
              .map((category) => (
                <p
                  key={category._id}
                  className=" px-6 py-1 flex justify-between"
                >
                  {" "}
                  <span>{category.name}</span>{" "}
                  <span
                    className=" hover:cursor-pointer bg-[#ff5460] text-white px-2 rounded-sm  "
                    onClick={() => deleteCategory(category._id)}
                  >
                    x
                  </span>{" "}
                </p>
              ))}
          </div>
        </div>
      </div>

      <div className=" md:hidden fixed py-1 px-3 bg-[#3ec3d5a8]  bottom-0 rounded-full flex gap-2 drop-shadow-sm mb-5 hover:cursor-pointer left-1/2 transform -translate-x-1/2">
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
    </div>
  );
};

export default page;
