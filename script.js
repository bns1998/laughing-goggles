const ordersTableBody = document.getElementById('ordersTableBody');
const searchInput = document.getElementById('searchInput');
const agentNameInput = document.getElementById('agentName');
const suggestionsList = document.getElementById('suggestionsList');
const agentDropdown = document.getElementById('agentDropdown');
let orders = JSON.parse(localStorage.getItem('orders')) || [];

// استرجاع الطلبات المخزنة عند تحميل الصفحة
window.onload = function() {
    updateTable();
    populateAgentDropdown();
};

// إضافة طلب جديد
function addOrder() {
    const orderNumber = document.getElementById('orderNumber').value;
    const totalPrice = parseFloat(document.getElementById('totalPrice').value);
    const agentName = agentNameInput.value;
    const profit = parseFloat(document.getElementById('profit').value);
    const entryDate = new Date().toLocaleDateString();
    const notes = document.getElementById('notes').value;

    if (orders.some(order => order.number === orderNumber)) {
        alert('رقم الطلب موجود بالفعل.');
        return;
    }

    const newOrder = { number: orderNumber, totalPrice, agentName, profit, status: 'واصل', entryDate, notes };
    orders.push(newOrder);
    saveOrders();
    updateTable();
    resetForm();
}

// حفظ الطلبات في التخزين المحلي
function saveOrders() {
    localStorage.setItem('orders', JSON.stringify(orders));
}

// تحديث الجدول
function updateTable(filteredOrders = orders) {
    ordersTableBody.innerHTML = '';
    let totals = { received: 0, notReceived: 0, partial: 0 };

    filteredOrders.forEach((order, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${order.number}</td>
            <td>${order.totalPrice}</td>
            <td>${order.agentName}</td>
            <td>
                <input type="number" value="${order.profit}" onchange="updateProfit(${index}, this.value)" ${order.status === 'واصل' ? 'readonly' : ''}>
            </td>
            <td>${order.entryDate}</td>
            <td>
                <button class="${getStatusClass(order.status)}" onclick="toggleStatus(${index})">
                    ${order.status}
                </button>
            </td>
            <td>${order.notes}</td>
            <td>
                <button class="red" onclick="deleteOrder(${index})">حذف</button>
            </td>
        `;
        ordersTableBody.appendChild(row);
        totals = updateTotals(order, totals);
    });

    displayTotals(totals);
}

// دالة للحصول على فئة الحالة
function getStatusClass(status) {
    return status === 'واصل' ? 'green' : status === 'غير واصل' ? 'red' : '';
}

// تحديث المجموعات
function updateTotals(order, totals) {
    if (order.status === 'واصل') totals.received += order.profit;
    else if (order.status === 'غير واصل') totals.notReceived += order.profit;
    else if (order.status === 'واصل جزئي') totals.partial += order.profit;
    return totals;
}

// عرض المجموعات
function displayTotals
