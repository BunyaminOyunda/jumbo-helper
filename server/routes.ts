import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSearchHistorySchema } from "@shared/schema";
import { fromError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get product by EAN
  app.get("/api/products/:ean", async (req, res) => {
    try {
      const { ean } = req.params;
      const product = await storage.getProductByEan(ean);
      
      if (!product) {
        return res.status(404).json({ 
          message: "Product not found",
          error: "No product found with this barcode" 
        });
      }
      
      res.json(product);
    } catch (error: any) {
      console.error("Error fetching product:", error);
      res.status(500).json({ 
        message: "Internal server error",
        error: error.message 
      });
    }
  });

  // Get all products (for testing/debugging)
  app.get("/api/products", async (_req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error: any) {
      console.error("Error fetching products:", error);
      res.status(500).json({ 
        message: "Internal server error",
        error: error.message 
      });
    }
  });

  // Get search history
  app.get("/api/history", async (_req, res) => {
    try {
      const history = await storage.getSearchHistory();
      res.json(history);
    } catch (error: any) {
      console.error("Error fetching search history:", error);
      res.status(500).json({ 
        message: "Internal server error",
        error: error.message 
      });
    }
  });

  // Add to search history
  app.post("/api/history", async (req, res) => {
    try {
      const result = insertSearchHistorySchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          message: "Invalid request data",
          error: fromError(result.error).toString()
        });
      }
      
      const history = await storage.addToSearchHistory(result.data);
      res.status(201).json(history);
    } catch (error: any) {
      console.error("Error adding to search history:", error);
      res.status(500).json({ 
        message: "Internal server error",
        error: error.message 
      });
    }
  });

  // Clear search history
  app.delete("/api/history", async (_req, res) => {
    try {
      await storage.clearSearchHistory();
      res.status(204).send();
    } catch (error: any) {
      console.error("Error clearing search history:", error);
      res.status(500).json({ 
        message: "Internal server error",
        error: error.message 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
