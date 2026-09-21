import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const statusEnum = pgEnum("status", [
  "Available",
  "Commissioned",
  "Private Collection",
]);

export const artworks = pgTable(
  "artworks",
  {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    categories: text("categories").array().notNull().default([]),
    medium: text("medium").notNull(),
    year: integer("year").notNull(),
    dimensions: text("dimensions").notNull(),
    image: text("image").notNull(),
    imageAlt: text("image_alt").notNull(),
    description: text("description").notNull(),
    story: text("story").notNull(),
    status: statusEnum("status").notNull().default("Available"),
    featured: boolean("featured").notNull().default(false),
    price: integer("price"),
    currency: text("currency").notNull().default("INR"),
    saleable: boolean("saleable").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => {
    return {
      statusIdx: index("artworks_status_idx").on(table.status),
      saleableIdx: index("artworks_saleable_idx").on(table.saleable),
    };
  },
);

export const cartItems = pgTable(
  "cart_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    sessionId: text("session_id").notNull(),
    artworkId: text("artwork_id")
      .notNull()
      .references(() => artworks.id, { onDelete: "cascade" }),
    quantity: integer("quantity").notNull().default(1),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => {
    return {
      sessionIdx: index("cart_session_idx").on(table.sessionId),
      sessionArtworkIdx: uniqueIndex("cart_session_artwork_idx").on(
        table.sessionId,
        table.artworkId,
      ),
    };
  },
);

export const wishlistItems = pgTable(
  "wishlist_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    sessionId: text("session_id").notNull(),
    artworkId: text("artwork_id")
      .notNull()
      .references(() => artworks.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => {
    return {
      sessionIdx: index("wishlist_session_idx").on(table.sessionId),
      sessionArtworkIdx: uniqueIndex("wishlist_session_artwork_idx").on(
        table.sessionId,
        table.artworkId,
      ),
    };
  },
);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const sessions = pgTable(
  "sessions",
  {
    id: text("id").primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => {
    return {
      userIdx: index("sessions_user_idx").on(table.userId),
    };
  },
);

export const orderStatusEnum = pgEnum("order_status", [
  "created",
  "paid",
  "failed",
  "refunded",
]);

export const orders = pgTable(
  "orders",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    razorpayOrderId: text("razorpay_order_id").notNull().unique(),
    razorpayPaymentId: text("razorpay_payment_id"),
    razorpaySignature: text("razorpay_signature"),
    amount: integer("amount").notNull(),
    currency: text("currency").notNull().default("INR"),
    status: orderStatusEnum("status").notNull().default("created"),
    customerName: text("customer_name").notNull(),
    customerEmail: text("customer_email").notNull(),
    customerPhone: text("customer_phone").notNull(),
    addressLine1: text("address_line_1").notNull(),
    addressLine2: text("address_line_2"),
    city: text("city").notNull(),
    state: text("state").notNull(),
    postalCode: text("postal_code").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    paidAt: timestamp("paid_at", { withTimezone: true }),
  },
  (table) => {
    return {
      userIdx: index("orders_user_idx").on(table.userId),
    };
  },
);

export const orderItems = pgTable(
  "order_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    artworkId: text("artwork_id").notNull(),
    title: text("title").notNull(),
    medium: text("medium").notNull(),
    price: integer("price").notNull(),
    quantity: integer("quantity").notNull().default(1),
  },
  (table) => {
    return {
      orderIdx: index("order_items_order_idx").on(table.orderId),
    };
  },
);

export type ArtworkRow = typeof artworks.$inferSelect;
export type NewArtwork = typeof artworks.$inferInsert;
export type CartItemRow = typeof cartItems.$inferSelect;
export type OrderRow = typeof orders.$inferSelect;
export type OrderItemRow = typeof orderItems.$inferSelect;
export type UserRow = typeof users.$inferSelect;
export type SessionRow = typeof sessions.$inferSelect;
export type WishlistItemRow = typeof wishlistItems.$inferSelect;