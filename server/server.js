const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"], // adjust methods as necessary
  allowedHeaders: ["Content-Type", "Authorization"],
};
// Middleware

app.use(cors(corsOptions));

// Enable CORS for your frontend origin
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  // Optional: Allow specific HTTP methods (GET, POST, PUT, DELETE, etc.)
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  // Optional: Allow specific headers
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  // Optional: Allow credentials (cookies, authorization headers)
  res.setHeader("Access-Control-Allow-Credentials", "true"); // Careful with this one!
  next();
});

app.use(express.json());

res.setHeader("Access-Control-Allow-Origin", "*");

// MongoDB Connection
mongoose
  .connect(
    "mongodb+srv://adriendjiongo:SbrQU7WjGVmtc6JV@cluster0.msgjc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("MongoDB connection successful!"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Transaction Model
const Transaction = mongoose.model("Transaction", {
  id: Number,
  description: String,
  price: Number,
  category: String,
  type: String,
  date: Date,
  createdAt: Date,
});

const Category = mongoose.model("Categories", {
  name: String,
  type: String,
});

// Routes
app.get("/Transactions", async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/Dashboard/outcomes", async (req, res) => {
  try {
    const { afterDate, beforeDate } = req.query;
    const query = {};

    // Date range filter
    if (afterDate || beforeDate) {
      const dateRange = {};
      if (afterDate) {
        const startDate = new Date(afterDate);
        if (!isNaN(startDate)) {
          dateRange.$gte = startDate;
        } else {
          return res.status(400).json({ message: "Invalid afterDate format" });
        }
      }
      if (beforeDate) {
        const endDate = new Date(beforeDate);
        if (!isNaN(endDate)) {
          dateRange.$lte = endDate;
        } else {
          return res.status(400).json({ message: "Invalid beforeDate format" });
        }
      }
      query.date = dateRange; // Add the date range filter
    }

    // Type filter
    query.type = "outcome";

    // Fetch and sort transactions
    const outcomeTransactions = await Transaction.find(query).select(
      "price category"
    );

    const updatedTransactions = outcomeTransactions.map((transaction) => {
      return {
        id: transaction.category,
        label: transaction.category,
        value: transaction.price,
      };
    });

    // Group the transactions by category and sum the prices
    const categorySum = updatedTransactions.reduce((acc, transaction) => {
      if (acc[transaction.id]) {
        acc[transaction.id].value += transaction.value;
      } else {
        acc[transaction.id] = {
          id: transaction.id,
          label: transaction.label,
          value: transaction.value,
        };
      }
      return acc;
    }, {});

    // Convert the object to an array
    const categoryArray = Object.values(categorySum);

    // Calculate the total sum of all categories
    const totalSum = categoryArray.reduce(
      (total, category) => total + category.value,
      0
    );

    // Calculate the percentage and update the value field
    const finalResult = categoryArray.map((category) => {
      const percentage = (category.value / totalSum) * 100;
      return {
        ...category,
        value: percentage.toFixed(2), // Set the percentage as the value
      };
    });

    res.json(finalResult);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

app.get("/Dashboard/incomes", async (req, res) => {
  try {
    const { afterDate, beforeDate } = req.query;
    const query = {};

    // Date range filter
    if (afterDate || beforeDate) {
      const dateRange = {};
      if (afterDate) {
        const startDate = new Date(afterDate);
        if (!isNaN(startDate)) {
          dateRange.$gte = startDate;
        } else {
          return res.status(400).json({ message: "Invalid afterDate format" });
        }
      }
      if (beforeDate) {
        const endDate = new Date(beforeDate);
        if (!isNaN(endDate)) {
          dateRange.$lte = endDate;
        } else {
          return res.status(400).json({ message: "Invalid beforeDate format" });
        }
      }
      query.date = dateRange; // Add the date range filter
    }

    // Type filter
    query.type = "income";

    // Fetch and sort transactions
    const incomeTransactions = await Transaction.find(query).select(
      "price category"
    );

    const updatedTransactions = incomeTransactions.map((transaction) => {
      return {
        id: transaction.category,
        label: transaction.category,
        value: transaction.price,
      };
    });

    // Group the transactions by category and sum the prices
    const categorySum = updatedTransactions.reduce((acc, transaction) => {
      if (acc[transaction.id]) {
        acc[transaction.id].value += transaction.value;
      } else {
        acc[transaction.id] = {
          id: transaction.id,
          label: transaction.label,
          value: transaction.value,
        };
      }
      return acc;
    }, {});

    // Convert the object to an array
    const categoryArray = Object.values(categorySum);

    // Calculate the total sum of all categories
    const totalSum = categoryArray.reduce(
      (total, category) => total + category.value,
      0
    );

    // Calculate the percentage and update the value field
    const finalResult = categoryArray.map((category) => {
      const percentage = (category.value / totalSum) * 100;
      return {
        ...category,
        value: percentage.toFixed(2), // Set the percentage as the value
      };
    });

    res.json(finalResult);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

app.get("/Balance", async (req, res) => {
  try {
    const TotalIncomesEver = await Transaction.aggregate([
      {
        $match: { type: "income" }, // Filter for type 'income'
      },
      {
        $group: {
          _id: null,
          totalPrice: { $sum: "$price" }, // Sum the 'price' field
        },
      },
    ]);
    const TotalOutcomesEver = await Transaction.aggregate([
      {
        $match: { type: "outcome" }, // Filter for type 'income'
      },
      {
        $group: {
          _id: null,
          totalPrice: { $sum: "$price" }, // Sum the 'price' field
        },
      },
    ]);
    const totalIn = TotalIncomesEver[0]?.totalPrice || 0;
    const totalOut = TotalOutcomesEver[0]?.totalPrice || 0;

    res.json(totalIn - totalOut);
  } catch (error) {
    console.error("Error calculating income total price:", error);
  }
});

app.get("/InOut", async (req, res) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  try {
    const IncomesOfThisMonth = await Transaction.aggregate([
      {
        $match: {
          type: "income",
          date: {
            $gte: startOfMonth,
            $lt: endOfMonth,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalPrice: { $sum: "$price" },
        },
      },
    ]);
    const OutcomesOfThisMonth = await Transaction.aggregate([
      {
        $match: {
          type: "outcome",
          date: {
            $gte: startOfMonth,
            $lt: endOfMonth,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalPrice: { $sum: "$price" },
        },
      },
    ]);

    res.json([
      IncomesOfThisMonth[0]?.totalPrice || 0,
      OutcomesOfThisMonth[0]?.totalPrice || 0,
    ]);
  } catch (error) {
    console.error("Error calculating monthly income total:", error);
  }
});

app.get("/filteredTransactions", async (req, res) => {
  try {
    const { type, minPrice, maxPrice, afterDate, beforeDate } = req.query;
    const query = {};

    // Date range filter
    if (afterDate || beforeDate) {
      const dateRange = {};
      if (afterDate) {
        const startDate = new Date(afterDate);
        if (!isNaN(startDate)) {
          dateRange.$gte = startDate;
        } else {
          return res.status(400).json({ message: "Invalid afterDate format" });
        }
      }
      if (beforeDate) {
        const endDate = new Date(beforeDate);
        if (!isNaN(endDate)) {
          dateRange.$lte = endDate;
        } else {
          return res.status(400).json({ message: "Invalid beforeDate format" });
        }
      }
      query.date = dateRange; // Add the date range filter
    }

    // Type filter
    if (type) query.type = type;

    // Price range filter
    if (minPrice && maxPrice) {
      query.price = { $gte: Number(minPrice), $lte: Number(maxPrice) };
    }

    // Fetch and sort transactions
    const incomeTransactions = await Transaction.find(query).sort({ date: -1 });
    res.json(incomeTransactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/top3Categories", async (req, res) => {
  try {
    const { afterDate, beforeDate } = req.query;
    const query = {};

    // Date range filter
    if (afterDate || beforeDate) {
      const dateRange = {};
      if (afterDate) {
        const startDate = new Date(afterDate);
        if (!isNaN(startDate)) {
          dateRange.$gte = startDate;
        } else {
          return res.status(400).json({ message: "Invalid afterDate format" });
        }
      }
      if (beforeDate) {
        const endDate = new Date(beforeDate);
        if (!isNaN(endDate)) {
          dateRange.$lte = endDate;
        } else {
          return res.status(400).json({ message: "Invalid beforeDate format" });
        }
      }
      query.date = dateRange; // Apply date range filter to `date_r`
    }

    // Fetch transactions with filters applied
    const transactions = await Transaction.find(query).select(
      "price category date"
    );

    // Map the transactions to get the required structure
    const updatedTransactions = transactions.map((transaction) => {
      return {
        id: transaction.category,
        label: transaction.category,
        value: transaction.price,
      };
    });

    // Group the transactions by category and sum the prices
    const categorySum = updatedTransactions.reduce((acc, transaction) => {
      if (acc[transaction.id]) {
        acc[transaction.id].value += transaction.value;
      } else {
        acc[transaction.id] = {
          id: transaction.id,
          label: transaction.label,
          value: transaction.value,
        };
      }
      return acc;
    }, {});

    // Convert the object to an array
    const categoryArray = Object.values(categorySum);

    // Calculate the total sum of all categories
    const totalSum = categoryArray.reduce(
      (total, category) => total + category.value,
      0
    );

    // Calculate the percentage and update the value field
    const finalResult = categoryArray.map((category) => {
      const percentage = (category.value / totalSum) * 100;
      return {
        ...category,
        value: percentage.toFixed(2), // Set the percentage as the value
      };
    });

    // Sort by the `value` (percentage) in descending order and get the top 3
    const top3Categories = finalResult
      .sort((a, b) => b.value - a.value) // Sort in descending order by percentage
      .slice(0, 3); // Get only the top 3 categories

    res.json(top3Categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/Dashboard/filteredTransactions", async (req, res) => {
  try {
    const { afterDate, beforeDate } = req.query;
    const query = {};

    // Date range filter
    if (afterDate || beforeDate) {
      const dateRange = {};
      if (afterDate) {
        const startDate = new Date(afterDate);
        if (!isNaN(startDate)) {
          dateRange.$gte = startDate;
        } else {
          return res.status(400).json({ message: "Invalid afterDate format" });
        }
      }
      if (beforeDate) {
        const endDate = new Date(beforeDate);
        if (!isNaN(endDate)) {
          dateRange.$lte = endDate;
        } else {
          return res.status(400).json({ message: "Invalid beforeDate format" });
        }
      }
      query.date = dateRange; // Add the date range filter
    }

    // Fetch and sort income transactions with count
    const IncomesWithinDates = await Transaction.aggregate([
      {
        $match: { date: query.date, type: "income" }, // Filter for type 'income'
      },
      {
        $group: {
          _id: null,
          totalPrice: { $sum: "$price" }, // Sum the 'price' field
          transactionCount: { $sum: 1 }, // Count the number of income transactions
        },
      },
    ]);

    // Fetch and sort outcome transactions with count
    const OutomesWithinDates = await Transaction.aggregate([
      {
        $match: { date: query.date, type: "outcome" }, // Filter for type 'outcome'
      },
      {
        $group: {
          _id: null,
          totalPrice: { $sum: "$price" }, // Sum the 'price' field
          transactionCount: { $sum: 1 }, // Count the number of outcome transactions
        },
      },
    ]);

    // Response with both total price and transaction count for both types
    let resp = {
      IN: {
        totalPrice: IncomesWithinDates[0]?.totalPrice || 0,
        transactionCount: IncomesWithinDates[0]?.transactionCount || 0,
      },
      OUT: {
        totalPrice: OutomesWithinDates[0]?.totalPrice || 0,
        transactionCount: OutomesWithinDates[0]?.transactionCount || 0,
      },
    };

    res.json(resp);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/DashboardStats", async (req, res) => {
  try {
    const incomes = await Transaction.find({ type: "income" })
      .sort({ createdAt: 1 }) // Sort by createdAt ascending
      .select("price description createdAt -_id"); // Select only price and createdAt

    for (let i = 1; i < incomes.length; i++) {
      incomes[i].price = incomes[i].price + incomes[i - 1].price;
    }

    const outcomes = await Transaction.find({ type: "outcome" })
      .sort({ createdAt: 1 }) // Sort by createdAt ascending
      .select("price description createdAt -_id"); // Select only price and createdAt

    for (let i = 1; i < outcomes.length; i++) {
      outcomes[i].price = outcomes[i].price + outcomes[i - 1].price;
    }

    res.json([incomes, outcomes]);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});
app.get("/Transaction/outcomes", async (req, res) => {
  try {
    const incomes = await Transaction.find({ type: "outcome" })
      .sort({ createdAt: 1 }) // Sort by createdAt ascending
      .select("price description createdAt -_id"); // Select only price and createdAt

    res.json(incomes);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

app.post("/Transactions", async (req, res) => {
  try {
    const { id, description, price, type, category, date } = req.body;
    const createdate = new Date();
    // const date = new Date();
    // Function to convert a DD/MM/YYYY string to a Date object
    const parseDate = (dateStr) => {
      const [day, month, year] = dateStr.split("/").map(Number);
      return new Date(year, month - 1, day); // Month is 0-indexed in JavaScript Date
    };

    const transaction = new Transaction({
      id: id,
      description: description,
      price: price,
      type: type,
      category: category,
      createdAt: new Date(),
      date: parseDate(date),
    });
    const savedTransaction = await transaction.save();
    res.status(201).json("savedTransaction");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/*app.put("/api/todos/:id", async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (todo) {
      todo.completed = !todo.completed;
      const updatedTodo = await todo.save();
      res.json(updatedTodo);
    } else {
      res.status(404).json({ message: "Todo not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});n*/

app.delete("/Transactions/:id", async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      id: req.params.id,
    });
    if (transaction) {
      res.json({ message: "Transaction deleted" });
    } else {
      res.status(404).json({ message: "Transaction not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/Categories", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/Categories", async (req, res) => {
  try {
    const { name, type } = req.body;

    const category = new Category({
      name: name,
      type: type,
    });
    const savedCategory = await category.save();
    res.status(201).json(savedCategory + "savedCategory");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete("/Categories/:id", async (req, res) => {
  try {
    const category = await Category.findOneAndDelete({
      _id: req.params.id,
    });
    if (category) {
      res.json({ message: "category deleted" });
    } else {
      res.status(404).json({ message: "category not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
