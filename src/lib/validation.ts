import { z } from 'zod';

// Login Validation Schema
export const LoginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

// Enquiry Submission Validation Schema
export const EnquirySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address format'),
  phone: z.string().optional().or(z.literal('')),
  company: z.string().optional().or(z.literal('')),
  message: z.string().min(1, 'Message is required').max(5000),
  productName: z.string().optional().or(z.literal('')),
  serviceName: z.string().optional().or(z.literal('')),
  categoryName: z.string().optional().or(z.literal('')),
  pageUrl: z.string().optional().or(z.literal('')),
});

// Product URL Import Schema
export const ImportProductSchema = z.object({
  url: z.string().url('A valid URL starting with http/https is required'),
});

// Loose CMS Content Validation Schema
export const ContentUpdateSchema = z.object({
  hero: z.record(z.string(), z.any()),
  cta: z.record(z.string(), z.any()),
  sales: z.record(z.string(), z.any()).optional(),
  footer: z.record(z.string(), z.any()),
  aboutUs: z.record(z.string(), z.any()),
  director: z.record(z.string(), z.any()),
  careers: z.record(z.string(), z.any()),
  statistics: z.array(z.any()),
  services: z.array(z.any()),
  whatWeDo: z.record(z.string(), z.any()),
  highlights: z.array(z.any()),
  categories: z.array(z.any()),
  products: z.array(z.any()),
  homepageLayout: z.array(z.any()).optional(),
});
