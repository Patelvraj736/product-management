//store into ls
export function saveProducts(products){
    localStorage.setItem("products",JSON.stringify(products));
}
//fetch from ls
export function getProducts(){
    let products = localStorage.getItem("products");
    return products ? JSON.parse(products) : [];
}
