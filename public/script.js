// API base URL
const API_BASE = '/api';

// DOM elements
const addItemForm = document.getElementById('addItemForm');
const itemsList = document.getElementById('itemsList');
const loading = document.getElementById('loading');
const editModal = document.getElementById('editModal');
const editItemForm = document.getElementById('editItemForm');
const closeModal = document.querySelector('.close');

// State
let items = [];

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadItems();
    setupEventListeners();
});

// Event listeners
function setupEventListeners() {
    // Add item form
    addItemForm.addEventListener('submit', handleAddItem);
    
    // Edit item form
    editItemForm.addEventListener('submit', handleEditItem);
    
    // Close modal
    closeModal.addEventListener('click', closeEditModal);
    window.addEventListener('click', (e) => {
        if (e.target === editModal) {
            closeEditModal();
        }
    });
}

// API functions
async function apiRequest(url, options = {}) {
    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
            },
            ...options
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Request failed');
        }
        
        return data;
    } catch (error) {
        console.error('API request failed:', error);
        showMessage(error.message, 'error');
        throw error;
    }
}

async function fetchItems() {
    return apiRequest(`${API_BASE}/items`);
}

async function createItem(item) {
    return apiRequest(`${API_BASE}/items`, {
        method: 'POST',
        body: JSON.stringify(item)
    });
}

async function updateItem(id, item) {
    return apiRequest(`${API_BASE}/items/${id}`, {
        method: 'PUT',
        body: JSON.stringify(item)
    });
}

async function deleteItem(id) {
    return apiRequest(`${API_BASE}/items/${id}`, {
        method: 'DELETE'
    });
}

// UI functions
function showMessage(message, type = 'success') {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    // Insert at the top of the container
    const container = document.querySelector('.container');
    container.insertBefore(messageDiv, container.firstChild.nextSibling);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

function showLoading() {
    loading.style.display = 'block';
    itemsList.style.display = 'none';
}

function hideLoading() {
    loading.style.display = 'none';
    itemsList.style.display = 'block';
}

function renderItems() {
    if (items.length === 0) {
        itemsList.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">No items found. Add one above!</p>';
        return;
    }
    
    itemsList.innerHTML = items.map(item => `
        <div class="item" data-id="${item.id}">
            <h3>${escapeHtml(item.name)}</h3>
            <p>${escapeHtml(item.description)}</p>
            <div class="item-actions">
                <button class="btn-edit" onclick="openEditModal(${item.id})">Edit</button>
                <button class="btn-delete" onclick="handleDeleteItem(${item.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Event handlers
async function loadItems() {
    try {
        showLoading();
        const response = await fetchItems();
        items = response.data;
        renderItems();
        hideLoading();
    } catch (error) {
        hideLoading();
        // Error already handled in apiRequest
    }
}

async function handleAddItem(e) {
    e.preventDefault();
    
    const formData = new FormData(addItemForm);
    const item = {
        name: formData.get('name').trim(),
        description: formData.get('description').trim()
    };
    
    if (!item.name || !item.description) {
        showMessage('Please fill in all fields', 'error');
        return;
    }
    
    try {
        const response = await createItem(item);
        items.push(response.data);
        renderItems();
        addItemForm.reset();
        showMessage('Item added successfully!');
    } catch (error) {
        // Error already handled in apiRequest
    }
}

async function handleEditItem(e) {
    e.preventDefault();
    
    const formData = new FormData(editItemForm);
    const id = parseInt(document.getElementById('editItemId').value);
    const item = {
        name: formData.get('name').trim(),
        description: formData.get('description').trim()
    };
    
    if (!item.name || !item.description) {
        showMessage('Please fill in all fields', 'error');
        return;
    }
    
    try {
        const response = await updateItem(id, item);
        const index = items.findIndex(item => item.id === id);
        if (index !== -1) {
            items[index] = response.data;
            renderItems();
        }
        closeEditModal();
        showMessage('Item updated successfully!');
    } catch (error) {
        // Error already handled in apiRequest
    }
}

async function handleDeleteItem(id) {
    if (!confirm('Are you sure you want to delete this item?')) {
        return;
    }
    
    try {
        await deleteItem(id);
        items = items.filter(item => item.id !== id);
        renderItems();
        showMessage('Item deleted successfully!');
    } catch (error) {
        // Error already handled in apiRequest
    }
}

function openEditModal(id) {
    const item = items.find(item => item.id === id);
    if (!item) return;
    
    document.getElementById('editItemId').value = item.id;
    document.getElementById('editItemName').value = item.name;
    document.getElementById('editItemDescription').value = item.description;
    
    editModal.style.display = 'block';
}

function closeEditModal() {
    editModal.style.display = 'none';
    editItemForm.reset();
}