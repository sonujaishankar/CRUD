import { Injectable, NotFoundException } from '@nestjs/common';
import { eq, ilike, or } from 'drizzle-orm';
import { db } from '../../db';
import { products, Product } from '../../db/schema';
import { CreateProductDto, UpdateProductDto } from './products.dto';

@Injectable()
export class ProductsService {
  async findAll(search?: string) {
    if (search) {
      return db.query.products.findMany({
        where: or(
          ilike(products.name, `%${search}%`),
          ilike(products.sku, `%${search}%`),
        ),
        with: { category: true },
        orderBy: (p, { asc }) => [asc(p.name)],
      });
    }
    return db.query.products.findMany({
      with: { category: true },
      orderBy: (p, { asc }) => [asc(p.name)],
    });
  }

  async findOne(id: number) {
    const product = await db.query.products.findFirst({
      where: eq(products.id, id),
      with: { category: true },
    });
    if (!product) throw new NotFoundException(`Product #${id} not found`);
    return product;
  }

  async create(dto: CreateProductDto) {
    const [product] = await db
      .insert(products)
      .values({ ...dto, price: Number(dto.price) })
      .returning();
    return this.findOne(product.id);
  }

  async update(id: number, dto: UpdateProductDto) {
    await this.findOne(id);
    const updateData: any = { ...dto, updatedAt: new Date().toISOString() };
    if (dto.price !== undefined) updateData.price = Number(dto.price);
    await db.update(products).set(updateData).where(eq(products.id, id));
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id);
    await db.delete(products).where(eq(products.id, id));
    return { message: `Product #${id} deleted` };
  }

  async getStats() {
    const allProducts = (await db.query.products.findMany()) as any[];
    const totalProducts = allProducts.length;
    const totalValue = allProducts.reduce(
      (sum, p) => sum + parseFloat(String(p.price)) * Number(p.quantity),
      0,
    );
    const lowStock = allProducts.filter((p) => Number(p.quantity) <= 5).length;
    const outOfStock = allProducts.filter((p) => Number(p.quantity) === 0).length;
    return { totalProducts, totalValue, lowStock, outOfStock };
  }
}
