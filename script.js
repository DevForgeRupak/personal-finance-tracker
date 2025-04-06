// Initialize transactions array from localStorage or empty array
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// DOM Elements
const totalIncomeEl = document.getElementById('total-income');
const totalExpenseEl = document.getElementById('total-expense');
const netBalanceEl = document.getElementById('net-balance');
const quickAddForm = document.getElementById('quickAddForm');
const financeChartEl = document.getElementById('financeChart');

// Initialize chart
let financeChart;

// Update dashboard with current data
function updateDashboard() {
    // Calculate totals
    const income = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const expense = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const balance = income - expense;

    // Update DOM
    totalIncomeEl.textContent = `₹${income.toFixed(2)}`;
    totalExpenseEl.textContent = `₹${expense.toFixed(2)}`;
    netBalanceEl.textContent = `₹${balance.toFixed(2)}`;

    // Update or create chart
    if (financeChart) {
        financeChart.data.datasets[0].data = [income, expense];
        financeChart.update();
    } else {
        financeChart = new Chart(financeChartEl, {
            type: 'pie',
            data: {
                labels: ['Income', 'Expenses'],
                datasets: [{
                    data: [income, expense],
                    backgroundColor: ['#4CAF50', '#F44336']
                }]
            }
        });
    }
}

// Handle form submission
quickAddForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(quickAddForm);
    const transaction = {
        id: Date.now(),
        type: formData.get('type'),
        amount: parseFloat(formData.get('amount')),
        description: formData.get('description'),
        date: new Date().toISOString()
    };

    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    
    updateDashboard();
    quickAddForm.reset();
});

// Initialize dashboard
updateDashboard();