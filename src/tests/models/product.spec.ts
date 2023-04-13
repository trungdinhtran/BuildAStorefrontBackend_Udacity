import { ProductInfo, Product, ProductStore } from '../../models/product';

const productStore = new ProductStore();

describe('Product Model', () => {
  const product: ProductInfo = {
    name: 'Product Name',
    price: 888,
  };

  async function createProduct(product: ProductInfo) {
    return productStore.create(product);
  }

  async function deleteProduct(id: number) {
    return productStore.deleteProduct(id);
  }

  it('should add a product', async () => {
    const createdProduct: Product = await createProduct(product);
    expect(createdProduct).toEqual({
      id: createdProduct.id,
      ...product,
    });
    await deleteProduct(createdProduct.id);
  });

  it('should return the correct product', async () => {
    const createdProduct: Product = await createProduct(product);
    const productData = await productStore.show(createdProduct.id);
    expect(productData).toEqual(createdProduct);
    await deleteProduct(createdProduct.id);
  });

  it('should update the product', async () => {
    const createdProduct: Product = await createProduct(product);
    const newProduct: ProductInfo = {
      name: 'New Product List',
      price: 2423,
    };
    const { name, price } = await productStore.update(createdProduct.id, newProduct);
    expect(name).toEqual(newProduct.name);
    expect(price).toEqual(newProduct.price);
    await deleteProduct(createdProduct.id);
  });

  it('should remove the product', async () => {
    const createdProduct: Product = await createProduct(product);
    expect(createdProduct).toEqual({
      id: createdProduct.id,
      name: 'Product Name',
      price: 888,
    });
  });
});
