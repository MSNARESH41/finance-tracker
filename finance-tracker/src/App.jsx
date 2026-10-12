import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addTransaction,
  deleteTransaction,
  clearTransactions,
} from "./features/transactions/transactionsSlice";

const today = new Date().toISOString().slice(0, 10);

function formatMoney(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
}

export default function App() {
  const dispatch = useDispatch();
  const transactions = useSelector(
    (state) => state.transactions.items
  );

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState(today);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");

  const income = transactions
    .filter((item) => item.type === "income")
    .reduce((total, item) => total + item.amount, 0);

  const expenses = transactions
    .filter((item) => item.type === "expense")
    .reduce((total, item) => total + item.amount, 0);

  const balance = income - expenses;

  const filteredTransactions = transactions.filter(
    (item) => filter === "all" || item.type === filter
  );

  function handleSubmit(event) {
    event.preventDefault();

    if (!title.trim()) {
      setError("Please enter a transaction title.");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      setError("Please enter an amount greater than zero.");
      return;
    }

    dispatch(
      addTransaction({
        title: title.trim(),
        amount: Number(amount),
        type,
        category,
        date,
        note: "",
      })
    );

    setTitle("");
    setAmount("");
    setType("expense");
    setCategory("Food");
    setDate(today);
    setError("");
  }

  function handleClear() {
    if (window.confirm("Delete all transactions?")) {
      dispatch(clearTransactions());
    }
  }

  return (
    <div className="app">
      <header className="header">
        <div className="logo">₹ PocketWise</div>
        <p>Your personal finance dashboard</p>
      </header>

      <section className="welcome">
        <div>
          <p className="eyebrow">PERSONAL FINANCE</p>
          <h1>Money made simple.</h1>
          <p>Track your income, expenses, and savings.</p>
        </div>
      </section>

      <section className="summary">
        <article className="card balance-card">
          <p>Current Balance</p>
          <h2>{formatMoney(balance)}</h2>
        </article>

        <article className="card">
          <p>Total Income</p>
          <h2 className="income">{formatMoney(income)}</h2>
        </article>

        <article className="card">
          <p>Total Expenses</p>
          <h2 className="expense">{formatMoney(expenses)}</h2>
        </article>
      </section>

      <main className="content">
        <section className="panel">
          <h2>Add Transaction</h2>

          <form onSubmit={handleSubmit}>
            <label htmlFor="type">Transaction type</label>
            <select
              id="type"
              value={type}
              onChange={(event) => setType(event.target.value)}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>

            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              placeholder="e.g. Monthly salary"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />

            <label htmlFor="amount">Amount (₹)</label>
            <input
              id="amount"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="Enter amount"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
            />

            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              <option>Food</option>
              <option>Salary</option>
              <option>Transport</option>
              <option>Shopping</option>
              <option>Bills</option>
              <option>Education</option>
              <option>Health</option>
              <option>Investment</option>
              <option>Other</option>
            </select>

            <label htmlFor="date">Date</label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />

            {error && <p className="error">{error}</p>}

            <button className="primary-button" type="submit">
              Add Transaction
            </button>
          </form>
        </section>

        <section className="panel">
          <div className="list-heading">
            <h2>Transactions</h2>

            <select
              aria-label="Filter transactions"
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
            >
              <option value="all">All</option>
              <option value="income">Income</option>
              <option value="expense">Expenses</option>
            </select>
          </div>

          {filteredTransactions.length === 0 ? (
            <div className="empty">
              <p>No transactions yet.</p>
              <span>Add your first income or expense!</span>
            </div>
          ) : (
            <div className="transaction-list">
              {filteredTransactions.map((item) => (
                <article className="transaction" key={item.id}>
                  <div className="transaction-info">
                    <strong>{item.title}</strong>
                    <span>
                      {item.category} · {item.date}
                    </span>
                  </div>

                  <div className="transaction-actions">
                    <strong
                      className={
                        item.type === "income" ? "income" : "expense"
                      }
                    >
                      {item.type === "income" ? "+" : "−"}
                      {formatMoney(item.amount)}
                    </strong>

                    <button
                      className="delete-button"
                      type="button"
                      aria-label={`Delete ${item.title}`}
                      onClick={() => dispatch(deleteTransaction(item.id))}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}

          {transactions.length > 0 && (
            <button
              className="clear-button"
              type="button"
              onClick={handleClear}
            >
              Clear all transactions
            </button>
          )}
        </section>
      </main>

      <footer>Built with React and Redux Toolkit</footer>
    </div>
  );
}