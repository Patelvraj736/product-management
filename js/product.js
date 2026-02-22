import { genProductId, convertToBase64 } from "./utility.js";
import { getProducts, saveProducts } from "./storage.js";

//create product
export async function createProduct(productData) {
    let products = getProducts();
    let imageBase64 = await convertToBase64(productData.image);
    const newProduct = {
        productId: genProductId(),
        productName: productData.productName,
        price: Number(productData.price),
        description: productData.description,
        image: imageBase64
    };

    products.push(newProduct);
    saveProducts(products);
}
//fetch products
export function fetchProducts() {
    return getProducts();
}
//update products
export function updateProducts(products){
    saveProducts(products);
}