import { type User, type InsertUser, type Product, type InsertProduct, type SearchHistory, type InsertSearchHistory } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Product methods
  getProductByEan(ean: string): Promise<Product | undefined>;
  getAllProducts(): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  
  // Search history methods
  getSearchHistory(): Promise<SearchHistory[]>;
  addToSearchHistory(history: InsertSearchHistory): Promise<SearchHistory>;
  clearSearchHistory(): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private products: Map<string, Product>;
  private searchHistoryItems: Map<string, SearchHistory>;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.searchHistoryItems = new Map();
    
    // Initialize with mock grocery products
    this.initializeMockProducts();
  }

  private initializeMockProducts() {
    const mockProducts: InsertProduct[] = [
      // Dairy & Eggs - Aisle 1
      {
        ean: "0001234567890",
        name: "Organic Whole Milk",
        price: 4.99,
        category: "Dairy",
        aisle: "A1",
        shelf: "Top",
        mapX: 17.5,
        mapY: 35,
      },
      {
        ean: "0001234567891",
        name: "Greek Yogurt Vanilla",
        price: 3.49,
        category: "Dairy",
        aisle: "A1",
        shelf: "Middle",
        mapX: 17.5,
        mapY: 50,
      },
      {
        ean: "0001234567892",
        name: "Farm Fresh Eggs (12 count)",
        price: 5.99,
        category: "Dairy",
        aisle: "A1",
        shelf: "Bottom",
        mapX: 17.5,
        mapY: 65,
      },
      
      // Bakery - Aisle 2
      {
        ean: "0002234567890",
        name: "Whole Wheat Bread",
        price: 3.99,
        category: "Bakery",
        aisle: "A2",
        shelf: "Top",
        mapX: 37.5,
        mapY: 30,
      },
      {
        ean: "0002234567891",
        name: "Chocolate Chip Cookies",
        price: 4.49,
        category: "Bakery",
        aisle: "A2",
        shelf: "Middle",
        mapX: 37.5,
        mapY: 45,
      },
      {
        ean: "0002234567892",
        name: "Blueberry Muffins (6 pack)",
        price: 5.99,
        category: "Bakery",
        aisle: "A2",
        shelf: "Top",
        mapX: 37.5,
        mapY: 60,
      },
      
      // Produce - Aisle 3
      {
        ean: "0003234567890",
        name: "Organic Bananas",
        price: 2.99,
        category: "Produce",
        aisle: "A3",
        shelf: "Display",
        mapX: 57.5,
        mapY: 40,
      },
      {
        ean: "0003234567891",
        name: "Fresh Strawberries",
        price: 6.99,
        category: "Produce",
        aisle: "A3",
        shelf: "Display",
        mapX: 57.5,
        mapY: 55,
      },
      {
        ean: "0003234567892",
        name: "Baby Spinach (5 oz)",
        price: 3.49,
        category: "Produce",
        aisle: "A3",
        shelf: "Refrigerated",
        mapX: 57.5,
        mapY: 25,
      },
      
      // Beverages - Aisle 4
      {
        ean: "0004234567890",
        name: "Orange Juice (64 oz)",
        price: 5.99,
        category: "Beverages",
        aisle: "A4",
        shelf: "Top",
        mapX: 77.5,
        mapY: 35,
      },
      {
        ean: "0004234567891",
        name: "Sparkling Water (12 pack)",
        price: 7.99,
        category: "Beverages",
        aisle: "A4",
        shelf: "Bottom",
        mapX: 77.5,
        mapY: 50,
      },
      {
        ean: "0004234567892",
        name: "Cold Brew Coffee",
        price: 4.49,
        category: "Beverages",
        aisle: "A4",
        shelf: "Middle",
        mapX: 77.5,
        mapY: 42,
      },
      
      // Additional popular items
      {
        ean: "8712345678901",
        name: "Pasta Penne (1 lb)",
        price: 2.49,
        category: "Pantry",
        aisle: "A2",
        shelf: "Middle",
        mapX: 37.5,
        mapY: 38,
      },
      {
        ean: "5012345678901",
        name: "Tomato Sauce (24 oz)",
        price: 3.29,
        category: "Pantry",
        aisle: "A2",
        shelf: "Bottom",
        mapX: 37.5,
        mapY: 52,
      },
      {
        ean: "4012345678901",
        name: "Cheddar Cheese Block",
        price: 6.99,
        category: "Dairy",
        aisle: "A1",
        shelf: "Middle",
        mapX: 17.5,
        mapY: 42,
      },
    ];

    mockProducts.forEach((product) => {
      const id = randomUUID();
      const productWithId: Product = { ...product, id };
      this.products.set(product.ean, productWithId);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getProductByEan(ean: string): Promise<Product | undefined> {
    return this.products.get(ean);
  }

  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = { ...insertProduct, id };
    this.products.set(product.ean, product);
    return product;
  }

  async getSearchHistory(): Promise<SearchHistory[]> {
    return Array.from(this.searchHistoryItems.values())
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 10); // Return last 10 searches
  }

  async addToSearchHistory(insertHistory: InsertSearchHistory): Promise<SearchHistory> {
    const id = randomUUID();
    const history: SearchHistory = { ...insertHistory, id };
    this.searchHistoryItems.set(id, history);
    return history;
  }

  async clearSearchHistory(): Promise<void> {
    this.searchHistoryItems.clear();
  }
}

export const storage = new MemStorage();
