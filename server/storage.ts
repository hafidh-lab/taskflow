import { tasks, categories, users, type User, type InsertUser, type Category, type InsertCategory, type Task, type InsertTask } from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Category methods
  getCategories(userId: number): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;
  
  // Task methods
  getTasks(userId: number): Promise<Task[]>;
  getTask(id: number): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, task: Partial<InsertTask>): Promise<Task | undefined>;
  deleteTask(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private tasks: Map<number, Task>;
  private userId: number;
  private categoryId: number;
  private taskId: number;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.tasks = new Map();
    this.userId = 1;
    this.categoryId = 1;
    this.taskId = 1;
    
    // Create default user
    const defaultUser: User = {
      id: this.userId++,
      username: "demo",
      password: "password"
    };
    this.users.set(defaultUser.id, defaultUser);
    
    // Create default categories
    const defaultCategories: Category[] = [
      { id: this.categoryId++, name: "Work", icon: "ri-briefcase-line", userId: defaultUser.id },
      { id: this.categoryId++, name: "Personal", icon: "ri-home-line", userId: defaultUser.id },
      { id: this.categoryId++, name: "Learning", icon: "ri-book-line", userId: defaultUser.id },
    ];
    
    defaultCategories.forEach(category => {
      this.categories.set(category.id, category);
    });
    
    // Create some sample tasks
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const sampleTasks: Task[] = [
      {
        id: this.taskId++,
        title: "Finalize project proposal",
        description: "Review all project requirements and submit final proposal to the client",
        dueDate: new Date(now.setHours(16, 0, 0, 0)),
        completed: false,
        priority: "high",
        categoryId: 1,
        userId: defaultUser.id,
        reminder: true,
        createdAt: new Date()
      },
      {
        id: this.taskId++,
        title: "Schedule team meeting",
        description: "Coordinate with the team for sprint planning session",
        dueDate: new Date(now.setHours(14, 30, 0, 0)),
        completed: false,
        priority: "medium",
        categoryId: 1,
        userId: defaultUser.id,
        reminder: false,
        createdAt: new Date()
      },
      {
        id: this.taskId++,
        title: "Review code pull requests",
        description: "Review and provide feedback on open pull requests from the team",
        dueDate: new Date(tomorrow.setHours(10, 0, 0, 0)),
        completed: false,
        priority: "low",
        categoryId: 1,
        userId: defaultUser.id,
        reminder: false,
        createdAt: new Date()
      },
      {
        id: this.taskId++,
        title: "Send weekly report",
        description: "Compile and email weekly status report to stakeholders",
        dueDate: new Date(now),
        completed: true,
        priority: "medium",
        categoryId: 1,
        userId: defaultUser.id,
        reminder: false,
        createdAt: new Date()
      },
      {
        id: this.taskId++,
        title: "Team retrospective",
        description: "Conduct team retrospective for the completed sprint",
        dueDate: new Date(tomorrow.setHours(14, 0, 0, 0)),
        completed: false,
        priority: "medium",
        categoryId: 1,
        userId: defaultUser.id,
        reminder: false,
        createdAt: new Date()
      },
      {
        id: this.taskId++,
        title: "Sprint planning",
        description: "Plan tasks for the next sprint",
        dueDate: new Date(nextWeek.setHours(9, 30, 0, 0)),
        completed: false,
        priority: "high",
        categoryId: 1,
        userId: defaultUser.id,
        reminder: true,
        createdAt: new Date()
      },
      {
        id: this.taskId++,
        title: "Client presentation",
        description: "Present project progress to client",
        dueDate: new Date(nextWeek.setHours(15, 0, 0, 0)),
        completed: false,
        priority: "high",
        categoryId: 1,
        userId: defaultUser.id,
        reminder: true,
        createdAt: new Date()
      }
    ];
    
    sampleTasks.forEach(task => {
      this.tasks.set(task.id, task);
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Category methods
  async getCategories(userId: number): Promise<Category[]> {
    return Array.from(this.categories.values()).filter(
      (category) => category.userId === userId
    );
  }
  
  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }
  
  async createCategory(category: InsertCategory): Promise<Category> {
    const id = this.categoryId++;
    const newCategory: Category = { 
      id,
      name: category.name,
      icon: category.icon || 'ri-list-check',
      userId: category.userId || 1 // Default user ID if not provided
    };
    this.categories.set(id, newCategory);
    return newCategory;
  }
  
  async updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined> {
    const existingCategory = this.categories.get(id);
    if (!existingCategory) return undefined;
    
    const updatedCategory: Category = { ...existingCategory, ...category };
    this.categories.set(id, updatedCategory);
    return updatedCategory;
  }
  
  async deleteCategory(id: number): Promise<boolean> {
    return this.categories.delete(id);
  }
  
  // Task methods
  async getTasks(userId: number): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(
      (task) => task.userId === userId
    );
  }
  
  async getTask(id: number): Promise<Task | undefined> {
    return this.tasks.get(id);
  }
  
  async createTask(task: InsertTask): Promise<Task> {
    const id = this.taskId++;
    // Asegurar que los valores no sean undefined
    const userId = task.userId === undefined ? 1 : task.userId;
    
    const newTask: Task = { 
      id,
      title: task.title,
      description: task.description || null,
      dueDate: task.dueDate || null,
      completed: task.completed || false,
      priority: task.priority || 'medium',
      categoryId: task.categoryId || null,
      userId: userId,
      reminder: task.reminder || null,
      createdAt: new Date()
    };
    this.tasks.set(id, newTask);
    return newTask;
  }
  
  async updateTask(id: number, task: Partial<InsertTask>): Promise<Task | undefined> {
    const existingTask = this.tasks.get(id);
    if (!existingTask) return undefined;
    
    const updatedTask: Task = { ...existingTask, ...task };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }
  
  async deleteTask(id: number): Promise<boolean> {
    return this.tasks.delete(id);
  }
}

export const storage = new MemStorage();
