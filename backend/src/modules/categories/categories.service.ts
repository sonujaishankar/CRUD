import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { db } from '../../db';
import { categories } from '../../db/schema';
import { CreateCategoryDto, UpdateCategoryDto } from './categories.dto';

@Injectable()
export class CategoriesService {
  async findAll() {
    return db.query.categories.findMany({
      with: { products: true },
      orderBy: (c, { asc }) => [asc(c.name)],
    });
  }

  async findOne(id: number) {
    const category = await db.query.categories.findFirst({
      where: eq(categories.id, id),
      with: { products: true },
    });
    if (!category) throw new NotFoundException(`Category #${id} not found`);
    return category;
  }

  async create(dto: CreateCategoryDto) {
    try {
      const [category] = await db.insert(categories).values(dto).returning();
      return category;
    } catch (e: any) {
      if (e.code === '23505') throw new ConflictException('Category name already exists');
      throw e;
    }
  }

  async update(id: number, dto: UpdateCategoryDto) {
    await this.findOne(id);
    const [updated] = await db
      .update(categories)
      .set({ ...dto, updatedAt: new Date().toISOString() })
      .where(eq(categories.id, id))
      .returning();
    return updated;
  }

  async remove(id: number) {
    await this.findOne(id);
    await db.delete(categories).where(eq(categories.id, id));
    return { message: `Category #${id} deleted` };
  }
}
