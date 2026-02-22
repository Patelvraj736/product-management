import { genProductId, convertToBase64 } from "./utility.js";
import { getProducts, saveProducts } from "./storage.js";

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
export function fetchProducts() {
    return getProducts();
}
export function updateProducts(products){
    saveProducts(products);
}