import { eq } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { PaginationParams, paginate } from "./schema/base";

/**
 * Base repository class for database operations
 * Provides common CRUD operations for a specific table
 */
export class Repository<
  TTable,
  TSelect = InferSelectModel<TTable>,
  TInsert = InferInsertModel<TTable>,
  TUpdate = Partial<TInsert>,
> {
  constructor(
    protected readonly db: NodePgDatabase<any>,
    protected readonly table: TTable,
    protected readonly idField: keyof TSelect = "id" as keyof TSelect,
  ) {}

  /**
   * Find all records with optional pagination
   */
  async findAll(params?: PaginationParams): Promise<TSelect[]> {
    let query = this.db.select().from(this.table);

    if (params) {
      query = paginate(query, params) as any;

      if (params.sortBy) {
        const order = params.sortOrder === "desc" ? "desc" : "asc";
        query = query.orderBy(params.sortBy as any, order);
      }
    }

    return query as Promise<TSelect[]>;
  }

  /**
   * Find a record by ID
   */
  async findById(id: string | number): Promise<TSelect | null> {
    const result = await this.db
      .select()
      .from(this.table)
      .where(eq(this.table[this.idField as keyof TTable], id as any))
      .limit(1);

    return result.length ? (result[0] as TSelect) : null;
  }

  /**
   * Find records by a field value
   */
  async findBy(field: keyof TSelect, value: any): Promise<TSelect[]> {
    return this.db
      .select()
      .from(this.table)
      .where(eq(this.table[field as any], value as any)) as Promise<TSelect[]>;
  }

  /**
   * Find one record by a field value
   */
  async findOneBy(field: keyof TSelect, value: any): Promise<TSelect | null> {
    const result = await this.db
      .select()
      .from(this.table)
      .where(eq(this.table[field as any], value as any))
      .limit(1);

    return result.length ? (result[0] as TSelect) : null;
  }

  /**
   * Create a new record
   */
  async create(data: TInsert): Promise<TSelect> {
    const result = await this.db
      .insert(this.table)
      .values(data as any)
      .returning();
    return result[0] as TSelect;
  }

  /**
   * Create multiple records
   */
  async createMany(data: TInsert[]): Promise<TSelect[]> {
    const result = await this.db
      .insert(this.table)
      .values(data as any)
      .returning();
    return result as TSelect[];
  }

  /**
   * Update a record by ID
   */
  async update(id: string | number, data: TUpdate): Promise<TSelect | null> {
    const result = await this.db
      .update(this.table)
      .set({
        ...data,
        updatedAt: new Date(),
      } as any)
      .where(eq(this.table[this.idField as any], id as any))
      .returning();

    return result.length ? (result[0] as TSelect) : null;
  }

  /**
   * Delete a record by ID
   */
  async delete(id: string | number): Promise<TSelect | null> {
    const result = await this.db
      .delete(this.table)
      .where(eq(this.table[this.idField as any], id as any))
      .returning();

    return result.length ? (result[0] as TSelect) : null;
  }

  /**
   * Count total records
   */
  async count(): Promise<number> {
    const result = await this.db
      .select({ count: this.db.fn.count() })
      .from(this.table);

    return Number(result[0].count);
  }

  /**
   * Check if a record exists
   */
  async exists(id: string | number): Promise<boolean> {
    const count = await this.db
      .select({ count: this.db.fn.count() })
      .from(this.table)
      .where(eq(this.table[this.idField as any], id as any));

    return Number(count[0].count) > 0;
  }
}
