let accessToken = '';
let refreshToken = '';
let categories = [];
let tags = [];

const API_BASE = "http://13.62.47.180:8000/";  // your live server

// ----- LOGIN -----
async function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        const res = await fetch(`${API_BASE}gettoken/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        const data = await res.json();
        document.getElementById("tokens").textContent = JSON.stringify(data, null, 2);

        if (res.ok && data.access) {
            accessToken = data.access;
            refreshToken = data.refresh;
            localStorage.setItem("access", accessToken);
            localStorage.setItem("refresh", refreshToken);

            await loadCategories();
            await loadTags();
            await fetchPosts();
        } else {
            alert("Login failed: " + (data.detail || "Check credentials"));
        }
    } catch (err) {
        console.error(err);
        alert("Login error: " + err.message);
    }
}

// ----- SIGNUP -----
async function signup() {
    const username = document.getElementById("signup_username").value;
    const password = document.getElementById("signup_password").value;

    try {
        const res = await fetch(`${API_BASE}signup/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        const data = await res.json();
        document.getElementById("signup_result").textContent = JSON.stringify(data, null, 2);

        if (res.ok) {
            alert("Signup successful! You can now log in.");
        } else {
            alert("Signup failed: " + (data.error || "Unknown error"));
        }
    } catch (err) {
        console.error(err);
        alert("Signup error: " + err.message);
    }
}

// ----- LOAD CATEGORIES -----
async function loadCategories() {
    if (!accessToken) return;
    try {
        const res = await fetch(`${API_BASE}categories/`, {
            headers: { 'Authorization': 'Bearer ' + accessToken }
        });
        categories = await res.json();
        const catSelect = document.getElementById('newCategory');
        catSelect.innerHTML = '';
        categories.forEach(c => {
            const option = document.createElement('option');
            option.value = c.id;
            option.textContent = c.name;
            catSelect.appendChild(option);
        });
    } catch (err) {
        console.error("Error loading categories:", err);
    }
}

// ----- LOAD TAGS -----
async function loadTags() {
    if (!accessToken) return;
    try {
        const res = await fetch(`${API_BASE}tags/`, {
            headers: { 'Authorization': 'Bearer ' + accessToken }
        });
        tags = await res.json();
        const tagSelect = document.getElementById('newTags');
        tagSelect.innerHTML = '';
        tags.forEach(t => {
            const option = document.createElement('option');
            option.value = t.id;
            option.textContent = t.name;
            tagSelect.appendChild(option);
        });
    } catch (err) {
        console.error("Error loading tags:", err);
    }
}

// ----- FETCH POSTS -----
async function fetchPosts() {
    if (!accessToken) { alert('Login first'); return; }
    try {
        const res = await fetch(`${API_BASE}posts/`, {
            headers: { 'Authorization': 'Bearer ' + accessToken }
        });
        const posts = await res.json();
        const tbody = document.querySelector('#postsTable tbody');
        tbody.innerHTML = '';
        posts.forEach(p => {
            const tr = document.createElement('tr');
            const categoryName = categories.find(c => c.id === p.category)?.name || 'N/A';
            const tagNames = tags.filter(t => p.tags.includes(t.id)).map(t => t.name).join(', ');
            tr.innerHTML = `
                <td>${p.id}</td>
                <td>${p.title}</td>
                <td>${p.content}</td>
                <td>${p.author}</td>
                <td>${categoryName}</td>
                <td>${tagNames}</td>
                <td>${p.status}</td>
                <td>
                    <button onclick="editPost(${p.id})">Edit</button>
                    <button onclick="deletePost(${p.id})">Delete</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        console.error("Error fetching posts:", err);
    }
}

// ----- CREATE POST -----
async function createPost() {
    if (!accessToken) { alert('Login first'); return; }
    const title = document.getElementById('newTitle').value;
    const content = document.getElementById('newContent').value;
    const category = parseInt(document.getElementById('newCategory').value);
    const tagsSelected = Array.from(document.getElementById('newTags').selectedOptions);
    const tagsIds = tagsSelected.map(opt => parseInt(opt.value));
    const status = document.getElementById('newStatus').value;

    try {
        const res = await fetch(`${API_BASE}posts/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            },
            body: JSON.stringify({ title, content, category, tags: tagsIds, status })
        });
        const post = await res.json();
        if (res.ok) {
            alert('Post created with ID ' + post.id);
            fetchPosts();
        } else {
            alert('Failed to create post: ' + (post.detail || 'Unknown error'));
        }
    } catch (err) {
        console.error("Error creating post:", err);
    }
}

// ----- EDIT POST -----
async function editPost(id) {
    const newTitle = prompt('New Title?');
    if (!newTitle) return;

    try {
        const res = await fetch(`${API_BASE}posts/${id}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            },
            body: JSON.stringify({ title: newTitle })
        });
        if (res.ok) fetchPosts();
        else {
            const data = await res.json();
            alert("Edit failed: " + (data.detail || 'Unknown error'));
        }
    } catch (err) {
        console.error("Error editing post:", err);
    }
}

// ----- DELETE POST -----
async function deletePost(id) {
    if (!confirm('Delete post ' + id + '?')) return;

    try {
        const res = await fetch(`${API_BASE}posts/${id}/`, {
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + accessToken }
        });
        if (res.ok) fetchPosts();
        else {
            const data = await res.json();
            alert("Delete failed: " + (data.detail || 'Unknown error'));
        }
    } catch (err) {
        console.error("Error deleting post:", err);
    }
}
