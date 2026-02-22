import { fetchProducts, createProduct, updateProducts } from "./product.js";
import { convertToBase64 } from "./utility.js";

const productList = document.getElementById("productList");
const form = document.getElementById("productForm");
const addBtn = document.getElementById("addProductBtn");

const modalElement = document.getElementById("productModal");
const productModal = new bootstrap.Modal(modalElement);

function displayProducts() {
    const products = fetchProducts();
    productList.innerHTML = "";

    if (products.length === 0) {
        productList.innerHTML = "<p class='text-center'>No Products Available</p>";
        return;
    }

    products.forEach(product => {

        const col = document.createElement("div");
        col.className = "col-md-4";

        col.innerHTML = `
            <div class="card shadow-sm">
                <img src="${product.image}" class="card-img-top" height="200" style="object-fit:stretch">
                <div class="card-body">
                    <h5 class="card-title">${product.productName}</h5>
                    <p class="card-text">${product.description}</p>
                    <p><strong>$${product.price}</strong></p>
                    <button class="btn btn-warning btn-sm edit-btn" data-id="${product.productId}">
                        Edit
                    </button>
                    <button class="btn btn-danger btn-sm delete-btn" data-id="${product.productId}">
                        Delete
                    </button>
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
    productModal.show();
});

productList.addEventListener("click", async (e) => {

    const id = parseInt(e.target.dataset.id);
    const products = fetchProducts();

    if (e.target.classList.contains("edit-btn")) {

        const product = products.find(p => p.productId === id);

        document.getElementById("productId").value = product.productId;
        document.getElementById("productName").value = product.productName;
        document.getElementById("price").value = product.price;
        document.getElementById("description").value = product.description;

        document.querySelector(".modal-title").textContent = "Edit Product";
        productModal.show();
    }

    if (e.target.classList.contains("delete-btn")) {

        const filtered = products.filter(p => p.productId !== id);
        updateProducts(filtered);
        displayProducts();
    }
});

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("productId").value;
    const productName = document.getElementById("productName").value.trim();
    const price = document.getElementById("price").value;
    const description = document.getElementById("description").value.trim();
    const imageFile = document.getElementById("image").files[0];

    if (!productName || !price || !description) {
        alert("All fields are required");
        return;
    }

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
    displayProducts();
});

displayProducts();