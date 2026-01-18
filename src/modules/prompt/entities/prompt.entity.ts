import { Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne } from "typeorm";
import { CustomBaseEntity } from "src/config/_common/entities/base.entity";
import { Tag } from "src/modules/tag/entities/tag.entity";
import { AIModel } from "src/modules/ai-model/entities/ai-model.entity";
import { Category } from "src/modules/category/entities/category.entity";

@Entity()
@Index(['title', 'description', 'content'], { fulltext: true })
export class Prompt extends CustomBaseEntity {
    @Column({ name: "title" })
    title: string;

    @Column({ name: "slug", default: crypto.randomUUID() })
    slug: string;

    @Column({ name: "description", type: "text", nullable: true })
    description: string;

    @Column({ name: "content", type: "text" })
    content: string;

    @Column({ name: "views", default: 0 })
    views: number;

    @Column({ name: "likes", default: 0 })
    likes: number;

    @Column({ name: "saves", default: 0 })
    saves: number;

    @Column({ name: "trending_score", type: "float", default: 0 })
    trendingScore: number;

    @Column({ name: "is_public", default: false })
    isPublic: boolean;

    @Column({ name: "is_feature", default: false })
    isFeature: boolean;

    @Column({ name: "show_cases", type: "json", nullable: true })
    showCases: string[];

    @Column({ name: "ai_model_id", nullable: true })
    aiModelId: string;

    @Column({ name: "category_id", nullable: true })
    categoryId: string;

    @ManyToOne(() => AIModel)
    @JoinColumn({ name: "ai_model_id" })
    aiModel: AIModel;

    @ManyToOne(() => Category)
    @JoinColumn({ name: "category_id" })
    category: Category;

    @ManyToMany(() => Tag)
    @JoinTable()
    tags: Tag[];
}
