
const { faker } = require('@faker-js/faker');

const generateProduct = () => {
    return {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        stock: faker.random.numeric(1),
        Image: faker.image.image(),
        category: faker.commerce.department(),
        id: faker.database.mongodbObjectId()
    };
}

module.exports = {
    generateProduct,
}




