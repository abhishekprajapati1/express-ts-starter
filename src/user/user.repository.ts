import { Repository } from "@/database/repository";
import { db } from "@/database";
import {
  userProfiles,
  userRoles,
  userAddresses,
  UserProfile,
  NewUserProfile,
  UserRoleRecord,
  NewUserRole,
  UserAddress,
  NewUserAddress,
} from "./user.schema";
import { eq } from "drizzle-orm";

/**
 * User profile repository
 */
export class UserProfileRepository extends Repository<
  typeof userProfiles,
  UserProfile,
  NewUserProfile,
  Partial<NewUserProfile>
> {
  constructor() {
    super(db, userProfiles);
  }

  /**
   * Find a user profile by user ID
   */
  async findByUserId(userId: string): Promise<UserProfile | null> {
    return this.findOneBy("userId", userId);
  }
}

/**
 * User role repository
 */
export class UserRoleRepository extends Repository<
  typeof userRoles,
  UserRoleRecord,
  NewUserRole,
  Partial<NewUserRole>
> {
  constructor() {
    super(db, userRoles);
  }

  /**
   * Find all roles for a user
   */
  async findByUserId(userId: string): Promise<UserRoleRecord[]> {
    return this.findBy("userId", userId);
  }

  /**
   * Add a role to a user
   */
  async addRoleToUser(userId: string, role: string): Promise<UserRoleRecord> {
    return this.create({
      userId,
      role: role as any,
    });
  }

  /**
   * Remove a role from a user
   */
  async removeRoleFromUser(userId: string, role: string): Promise<void> {
    await db
      .delete(userRoles)
      .where(eq(userRoles.userId, userId) && eq(userRoles.role, role as any));
  }

  /**
   * Check if a user has a specific role
   */
  async hasRole(userId: string, role: string): Promise<boolean> {
    const result = await db
      .select({ count: db.fn.count() })
      .from(userRoles)
      .where(eq(userRoles.userId, userId) && eq(userRoles.role, role as any));

    return Number(result[0].count) > 0;
  }
}

/**
 * User address repository
 */
export class UserAddressRepository extends Repository<
  typeof userAddresses,
  UserAddress,
  NewUserAddress,
  Partial<NewUserAddress>
> {
  constructor() {
    super(db, userAddresses);
  }

  /**
   * Find all addresses for a user
   */
  async findByUserId(userId: string): Promise<UserAddress[]> {
    return this.findBy("userId", userId);
  }

  /**
   * Find the default address for a user
   */
  async findDefaultForUser(userId: string): Promise<UserAddress | null> {
    const result = await db
      .select()
      .from(userAddresses)
      .where(
        eq(userAddresses.userId, userId) && eq(userAddresses.isDefault, true),
      )
      .limit(1);

    return result.length ? result[0] : null;
  }

  /**
   * Set an address as default for a user
   */
  async setDefaultAddress(addressId: string): Promise<void> {
    // First, get the address to find the user ID
    const address = await this.findById(addressId);
    if (!address) {
      throw new Error("Address not found");
    }

    // Reset all addresses for this user to non-default
    await db
      .update(userAddresses)
      .set({ isDefault: false })
      .where(eq(userAddresses.userId, address.userId));

    // Set the specified address as default
    await db
      .update(userAddresses)
      .set({ isDefault: true })
      .where(eq(userAddresses.id, addressId));
  }
}

// Export repository instances
export const userProfileRepository = new UserProfileRepository();
export const userRoleRepository = new UserRoleRepository();
export const userAddressRepository = new UserAddressRepository();
