import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTaskSchema, insertCategorySchema, PriorityEnum } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.get("/api/users/me", async (req: Request, res: Response) => {
    // For demo purposes, always return the first user
    const user = await storage.getUser(1);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Don't return password
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });
  
  // Category routes
  app.get("/api/categories", async (req: Request, res: Response) => {
    // For demo, use the default user
    const userId = 1;
    const categories = await storage.getCategories(userId);
    res.json(categories);
  });
  
  app.post("/api/categories", async (req: Request, res: Response) => {
    try {
      const userId = 1; // Default user for demo
      const categoryData = insertCategorySchema.parse({ ...req.body, userId });
      const category = await storage.createCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid category data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create category" });
    }
  });
  
  app.put("/api/categories/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const existingCategory = await storage.getCategory(id);
      
      if (!existingCategory) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      const categoryData = insertCategorySchema.partial().parse(req.body);
      const updatedCategory = await storage.updateCategory(id, categoryData);
      res.json(updatedCategory);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid category data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update category" });
    }
  });
  
  app.delete("/api/categories/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteCategory(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete category" });
    }
  });
  
  // Task routes
  app.get("/api/tasks", async (req: Request, res: Response) => {
    // For demo, use the default user
    const userId = 1;
    const tasks = await storage.getTasks(userId);
    res.json(tasks);
  });
  
  app.get("/api/tasks/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const task = await storage.getTask(id);
      
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      res.json(task);
    } catch (error) {
      res.status(500).json({ message: "Failed to get task" });
    }
  });
  
  app.post("/api/tasks", async (req: Request, res: Response) => {
    try {
      const userId = 1; // Default user for demo
      
      // Parse date string from request
      let taskData = req.body;
      if (taskData.dueDate && typeof taskData.dueDate === 'string') {
        taskData.dueDate = new Date(taskData.dueDate);
      }
      
      // Validate priority
      if (taskData.priority) {
        PriorityEnum.parse(taskData.priority);
      }
      
      const validTaskData = insertTaskSchema.parse({ ...taskData, userId });
      const task = await storage.createTask(validTaskData);
      res.status(201).json(task);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid task data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create task" });
    }
  });
  
  app.put("/api/tasks/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const existingTask = await storage.getTask(id);
      
      if (!existingTask) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      // Parse date string from request
      let taskData = req.body;
      if (taskData.dueDate && typeof taskData.dueDate === 'string') {
        taskData.dueDate = new Date(taskData.dueDate);
      }
      
      // Validate priority if present
      if (taskData.priority) {
        PriorityEnum.parse(taskData.priority);
      }
      
      const validTaskData = insertTaskSchema.partial().parse(taskData);
      const updatedTask = await storage.updateTask(id, validTaskData);
      res.json(updatedTask);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid task data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update task" });
    }
  });
  
  app.delete("/api/tasks/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteTask(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete task" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
