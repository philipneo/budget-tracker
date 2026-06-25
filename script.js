const STORAGE_KEY = 'budget-transactions';
const form = document.querySelector('#transactionForm');
const summary = document.querySelector('#summary');
const transactionsEl = document.querySelector('#transactions');
const categoriesEl = document.querySelector('#categories');

let transactions = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

function money(value) {
  return `$${value.toFixed(2)}`;
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

function renderSummary() {
  const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = income - expense;

  summary.innerHTML = [
    ['Balance', balance],
    ['Income', income],
    ['Expenses', expense]
  ].map(([label, value]) => `<article class="card"><span>${label}</span><strong>${money(value)}</strong></article>`).join('');
}

function renderCategories() {
  const totals = transactions.reduce((data, item) => {
    const sign = item.type === 'expense' ? -1 : 1;
    data[item.category] = (data[item.category] || 0) + item.amount * sign;
    return data;
  }, {});

  categoriesEl.innerHTML = Object.entries(totals).map(([category, total]) => `
    <div class="row"><span>${category}</span><strong>${money(total)}</strong></div>
  `).join('') || '<p>No categories yet.</p>';
}

function renderTransactions() {
  transactionsEl.innerHTML = transactions.map(item => `
    <div class="row">
      <span>${item.name}<br><small>${item.category}</small></span>
      <strong class="${item.type}">${item.type === 'expense' ? '-' : '+'}${money(item.amount)}</strong>
    </div>
  `).join('') || '<p>No transactions yet.</p>';
}

function render() {
  renderSummary();
  renderTransactions();
  renderCategories();
}

form.addEventListener('submit', event => {
  event.preventDefault();
  transactions.unshift({
    name: form.name.value.trim(),
    amount: Number(form.amount.value),
    type: form.type.value,
    category: form.category.value
  });
  save();
  form.reset();
  render();
});

render();
