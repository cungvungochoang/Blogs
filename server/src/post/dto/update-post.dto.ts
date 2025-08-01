import { Category } from "src/category/entities/category.entity";

export class UpdatePostDto {
    title: string;
    description: string;
    imageUrl: string;
    category: Category;
}