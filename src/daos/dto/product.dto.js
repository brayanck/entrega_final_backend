class productDTO{
    constructor(product){
        this.name = product.name;
        this.description = product.description;
        this.price= product.price;
        this.image=product.image;
        this.category = product.category;
        this.stock = product.stock
        this.owner=product.owner
    }
    

}
module.exports=productDTO