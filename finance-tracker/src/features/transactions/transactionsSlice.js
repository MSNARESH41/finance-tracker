import { createSlice, nanoid } from '@reduxjs/toolkit';

const STORAGE_KEY = "personal-finance-tracker-transactions";

function loadTransactions() {
    try {
        const savedTransactions = localStorage.getItem(STORAGE_KEY);
        return savedTransactions ? JSON.parse(savedTransactions) : [];
    } catch {
        return [];
    } 
}

const initialState ={ items: loadTransactions(), };

const transactionsSlice = createSlice({
    name: 'transactions',
    initialState, reducers: {
        addTransaction: {
            reducer(state, action) {
                state.items.unshift(action.payload);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
            },
            prepare(transaction) {
                return {
                    payload: {
                        id: nanoid(),
                        title: transaction.title.trim(),
                        amount: Number(transaction.amount),
                        type: transaction.type,
                        category: transaction.category,
                        date: transaction.date,
                        note: transaction.note.trim(),
                        createdAt: new Date().toISOString(),
                    },
                };
            },
        },


    deleteTransaction(state, action) {
        state.items = state.items.filter((item) => item.id !== action.payload);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    },

    clearTransactions(state) {
        state.items = [];
        localStorage.removeItem(STORAGE_KEY);
    },
 }, 

});

export const { addTransaction, deleteTransaction, clearTransactions } = transactionsSlice.actions;
export default transactionsSlice.reducer;