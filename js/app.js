import { fetchProducts, createProduct, updateProducts } from "./product.js";
import { convertToBase64 } from "./utility.js";

const productList = document.getElementById("productList");
const form = document.getElementById("productForm");
const addBtn = document.getElementById("addProductBtn");
const modalElement = document.getElementById("productModal");
const productModal = new bootstrap.Modal(modalElement);
const imageInput = document.getElementById("image");
const imagePreview = document.getElementById("imagePreview");


function displayProducts(data) {

    const products = data || fetchProducts();
    productList.innerHTML = "";

    if (products.length === 0) {
        productList.innerHTML = "<p class='text-center'>No Products Available</p>";
        return;
    }

    products.forEach(product => {

        const col = document.createElement("div");
        col.className = "col-md-4";

col.innerHTML = `
    <div class="card shadow-sm product-card h-100">
        <img src="${product.image}" class="card-img-top product-img">
        <div class="card-body d-flex flex-column">

            <small class="text-muted mb-1">
                ID: ${product.productId}
            </small>

            <h5 class="card-title mb-2">
                ${product.productName}
            </h5>

            <p class="card-text text-muted small">
                ${product.description}
            </p>

            <p class="fw-bold mt-auto">
                ₹ ${product.price}
            </p>

            <div class="d-flex justify-content-between mt-3">
                <button class="btn btn-outline-secondary btn-sm edit-btn" data-id="${product.productId}">
                    Edit
                </button>
                <button class="btn btn-outline-danger btn-sm delete-btn" data-id="${product.productId}">
                    Delete
                </button>
            </div>
        </div>
    </div>
`;
        productList.appendChild(col);
    });
}

addBtn.addEventListener("click", () => {
    form.reset();
    document.getElementById("productId").value = "";
    document.querySelector(".modal-title").textContent = "Add Product";
    imagePreview.src = "";
    imagePreview.classList.add("d-none");
    productModal.show();
});
imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];

    if (!file) {
        imagePreview.classList.add("d-none");
        return;
    }
    const reader = new FileReader();
    reader.onload = function (e) {
        imagePreview.src = e.target.result;
        imagePreview.classList.remove("d-none");
    };
    reader.readAsDataURL(file);
});
const filterInput = document.getElementById("filterId");
const sortSelect = document.getElementById("sortSelect");

filterInput.addEventListener("input", applyFilterSort);
sortSelect.addEventListener("change", applyFilterSort);

function applyFilterSort() {

    let products = fetchProducts();

    const filterValue = filterInput.value;

    if (filterValue) {
        products = products.filter(p => p.productId === Number(filterValue));
    }

    const sortValue = sortSelect.value;

    switch (sortValue) {

        case "idAsc":
            products.sort((a, b) => a.productId - b.productId);
            break;

        case "idDesc":
            products.sort((a, b) => b.productId - a.productId);
            break;

        case "nameAsc":
            products.sort((a, b) => a.productName.localeCompare(b.productName));
            break;

        case "nameDesc":
            products.sort((a, b) => b.productName.localeCompare(a.productName));
            break;

        case "priceAsc":
            products.sort((a, b) => a.price - b.price);
            break;

        case "priceDesc":
            products.sort((a, b) => b.price - a.price);
            break;
    }

    displayProducts(products);
}
productList.addEventListener("click", async (e) => {

    const id = parseInt(e.target.dataset.id);
    const products = fetchProducts();

    if (e.target.classList.contains("edit-btn")) {

        const product = products.find(p => p.productId === id);

        document.getElementById("productId").value = product.productId;
        document.getElementById("productName").value = product.productName;
        document.getElementById("price").value = product.price;
        document.getElementById("description").value = product.description;
        imagePreview.src = product.image;
        imagePreview.classList.remove("d-none");
        document.querySelector(".modal-title").textContent = "Edit Product";
        productModal.show();
    }

    if (e.target.classList.contains("delete-btn")) {

        const confirmDelete = confirm("Are you sure you want to delete this product?");

        if (!confirmDelete) return;

        const filtered = products.filter(p => p.productId !== id);
        updateProducts(filtered);
        applyFilterSort();
    }
});

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("productId").value;
    const productName = document.getElementById("productName").value.trim();
    const price = document.getElementById("price").value;
    const description = document.getElementById("description").value.trim();
    const imageFile = document.getElementById("image").files[0];
    const maxSize = 300 * 1024;

    if (imageFile && imageFile.size > maxSize) {
        alert("Image size must be less than 300 KB");
        return;
    }

    if (!productName || !price || !description) {
        alert("All fields are required");
        return;
    }
    const confirmMessage = id
        ? "Are you sure you want to update this product?"
        : "Are you sure you want to add this product?";

    const confirmAction = confirm(confirmMessage);

    if (!confirmAction) return;

    let products = fetchProducts();

    if (id) {
        const product = products.find(p => p.productId === parseInt(id));

        product.productName = productName;
        product.price = Number(price);
        product.description = description;

        if (imageFile) {
            product.image = await convertToBase64(imageFile);
        }

        updateProducts(products);

    } else {
        if (!imageFile) {
            alert("Image is required");
            return;
        }

        await createProduct({
            productName,
            price,
            description,
            image: imageFile
        });
    }

    productModal.hide();
    applyFilterSort();
});

applyFilterSort();