export function genProductId(){
    let lastId = localStorage.getItem("lastId");
    if(lastId===null){
        lastId =101;
    }    
    else{
        lastId = parseInt(lastId)+1;
    }
    localStorage.setItem("lastId",lastId);
    return lastId;
}

export function convertToBase64(file){
    return new Promise((resolve,reject)=>{
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            resolve(reader.result);
        };
        reader.onerror = (error)=>{
            reject(error);
        }
    })
}