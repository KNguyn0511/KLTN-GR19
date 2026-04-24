import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoriesRepository } from './categories.repository';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async create(createCategoryDto: any) {
    return await this.categoriesRepository.create(createCategoryDto);
  }

  async findAll() {
    return await this.categoriesRepository.findAll();
  }

  async findOne(id: string) {
    const category = await this.categoriesRepository.findById(id);
    if (!category) throw new NotFoundException('Không tìm thấy danh mục!');
    return category;
  }

  async findBySlug(slug: string) {
    const category = await this.categoriesRepository.findBySlug(slug);
    if (!category) throw new NotFoundException(`Không tìm thấy danh mục với slug "${slug}"!`);
    return category;
  }

  async update(id: string, updateData: any) {
    const updatedCategory = await this.categoriesRepository.update(
      id,
      updateData,
    );
    if (!updatedCategory)
      throw new NotFoundException('Không tìm thấy danh mục để cập nhật!');
    return updatedCategory;
  }

  async remove(id: string) {
    const deleted = await this.categoriesRepository.delete(id);
    if (!deleted)
      throw new NotFoundException('Không tìm thấy danh mục để xóa!');
    return { message: 'Đã xóa danh mục thành công!' };
  }
}
