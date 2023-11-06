const generateProductErrorInfo = (product) => {
    
    return `Una o mas propiedades fueron enviadas incompletas o no validas.
    lista de propiedades requeridas
    -name: type String, resibido: ${product.name}
    -description: type String, resibido: ${product.description}
    -price: type Number, resibido: ${product.price}
    -stock: type Number, resibido: ${product.stock}
    -image: type String, resibido: ${product.image}
    -category: type String, resibido: ${product.category}
    `
}
 
module.exports ={
    generateProductErrorInfo
}