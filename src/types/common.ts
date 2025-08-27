// Base entity interface
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// Soft deletable entity interface
export interface SoftDeletableEntity extends BaseEntity {
  deletedAt?: Date;
}

// Auditable entity interface
export interface AuditableEntity extends BaseEntity {
  createdBy?: string;
  updatedBy?: string;
}

// Timestamp interface
export interface Timestamp {
  createdAt: Date;
  updatedAt: Date;
}

// ID types
export type ID = string | number;

// UUID type
export type UUID = string;

// Email type
export type Email = string;

// URL type
export type URL = string;

// Phone number type
export type PhoneNumber = string;

// Currency type
export type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD' | 'AUD' | 'CHF' | 'CNY' | 'INR' | 'BRL';

// Language type
export type Language = 'en' | 'es' | 'fr' | 'de' | 'it' | 'pt' | 'ru' | 'zh' | 'ja' | 'ko' | 'ar' | 'hi';

// Country type
export type Country = 'US' | 'CA' | 'GB' | 'DE' | 'FR' | 'IT' | 'ES' | 'JP' | 'CN' | 'IN' | 'BR' | 'AU';

// Timezone type
export type Timezone = 'UTC' | 'EST' | 'CST' | 'MST' | 'PST' | 'GMT' | 'CET' | 'JST' | 'IST' | 'AEST';

// Status types
export type Status = 'active' | 'inactive' | 'pending' | 'suspended' | 'deleted';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'cancelled';

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';

// Priority types
export type Priority = 'low' | 'medium' | 'high' | 'urgent' | 'critical';

// Severity types
export type Severity = 'info' | 'warning' | 'error' | 'critical';

// File types
export type FileType = 'image' | 'document' | 'video' | 'audio' | 'archive' | 'other';

export type ImageFormat = 'jpg' | 'jpeg' | 'png' | 'gif' | 'webp' | 'svg' | 'bmp' | 'ico';

export type DocumentFormat = 'pdf' | 'doc' | 'docx' | 'xls' | 'xlsx' | 'ppt' | 'pptx' | 'txt' | 'rtf';

export type VideoFormat = 'mp4' | 'avi' | 'mov' | 'wmv' | 'flv' | 'webm' | 'mkv';

export type AudioFormat = 'mp3' | 'wav' | 'aac' | 'ogg' | 'flac' | 'wma';

export type ArchiveFormat = 'zip' | 'rar' | '7z' | 'tar' | 'gz' | 'bz2';

// MIME types
export type MimeType = 
  | 'image/jpeg'
  | 'image/png'
  | 'image/gif'
  | 'image/webp'
  | 'image/svg+xml'
  | 'application/pdf'
  | 'application/msword'
  | 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  | 'application/vnd.ms-excel'
  | 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  | 'application/vnd.ms-powerpoint'
  | 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  | 'text/plain'
  | 'text/csv'
  | 'application/json'
  | 'video/mp4'
  | 'video/avi'
  | 'video/quicktime'
  | 'audio/mpeg'
  | 'audio/wav'
  | 'audio/aac'
  | 'application/zip'
  | 'application/x-rar-compressed'
  | 'application/x-7z-compressed';

// Date range interface
export interface DateRange {
  startDate: Date;
  endDate: Date;
}

// Time range interface
export interface TimeRange {
  startTime: string;
  endTime: string;
}

// Address interface
export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: Country;
  latitude?: number;
  longitude?: number;
}

// Contact information interface
export interface ContactInfo {
  email: Email;
  phone?: PhoneNumber;
  website?: URL;
  address?: Address;
}

// Social media links interface
export interface SocialMedia {
  facebook?: URL;
  twitter?: URL;
  linkedin?: URL;
  instagram?: URL;
  youtube?: URL;
  github?: URL;
}

// Metadata interface
export interface Metadata {
  title?: string;
  description?: string;
  keywords?: string[];
  author?: string;
  image?: URL;
  url?: URL;
  type?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
}

// SEO interface
export interface SEO {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: URL;
  ogImage?: URL;
  ogType?: string;
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  noIndex?: boolean;
  noFollow?: boolean;
}

// Configuration interface
export interface Config {
  environment: 'development' | 'staging' | 'production';
  debug: boolean;
  apiUrl: URL;
  appUrl: URL;
  version: string;
  buildNumber: string;
  features: Record<string, boolean>;
  limits: Record<string, number>;
}

// Feature flag interface
export interface FeatureFlag {
  name: string;
  enabled: boolean;
  description?: string;
  rolloutPercentage?: number;
  targetUsers?: string[];
  targetEnvironments?: string[];
}

// Environment variables interface
export interface Environment {
  NODE_ENV: 'development' | 'production' | 'test';
  DATABASE_URL: string;
  NEXTAUTH_SECRET: string;
  NEXTAUTH_URL: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  GITHUB_ID?: string;
  GITHUB_SECRET?: string;
  REDIS_URL?: string;
  SMTP_HOST?: string;
  SMTP_PORT?: number;
  SMTP_USER?: string;
  SMTP_PASS?: string;
  AWS_ACCESS_KEY_ID?: string;
  AWS_SECRET_ACCESS_KEY?: string;
  AWS_REGION?: string;
  AWS_S3_BUCKET?: string;
  STRIPE_SECRET_KEY?: string;
  STRIPE_PUBLISHABLE_KEY?: string;
  STRIPE_WEBHOOK_SECRET?: string;
}

// Error interface
export interface AppError {
  code: string;
  message: string;
  details?: Record<string, any>;
  stack?: string;
  timestamp: Date;
  userId?: string;
  requestId?: string;
}

// Log level type
export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

// Log entry interface
export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  context?: Record<string, any>;
  userId?: string;
  requestId?: string;
  ip?: string;
  userAgent?: string;
  url?: string;
  method?: string;
  statusCode?: number;
  duration?: number;
}

// Cache entry interface
export interface CacheEntry<T = any> {
  key: string;
  value: T;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
  hits: number;
  ttl: number;
}

// Cache options interface
export interface CacheOptions {
  ttl?: number;
  maxSize?: number;
  maxAge?: number;
  staleWhileRevalidate?: number;
  tags?: string[];
}

// Database connection interface
export interface DatabaseConnection {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl?: boolean;
  pool?: {
    min: number;
    max: number;
    idleTimeoutMillis: number;
  };
}

// Email template interface
export interface EmailTemplate {
  name: string;
  subject: string;
  html: string;
  text: string;
  variables: string[];
  category: string;
}

// Email message interface
export interface EmailMessage {
  to: Email | Email[];
  cc?: Email | Email[];
  bcc?: Email | Email[];
  subject: string;
  html?: string;
  text?: string;
  template?: string;
  variables?: Record<string, any>;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
}

// SMS message interface
export interface SMSMessage {
  to: PhoneNumber | PhoneNumber[];
  message: string;
  template?: string;
  variables?: Record<string, any>;
}

// Push notification interface
export interface PushNotification {
  title: string;
  body: string;
  data?: Record<string, any>;
  image?: URL;
  icon?: URL;
  badge?: number;
  sound?: string;
  tag?: string;
  requireInteraction?: boolean;
  silent?: boolean;
  renotify?: boolean;
  actions?: Array<{
    action: string;
    title: string;
    icon?: URL;
  }>;
}

// Webhook interface
export interface Webhook {
  id: string;
  name: string;
  url: URL;
  events: string[];
  secret?: string;
  active: boolean;
  retryCount: number;
  lastDelivery?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Webhook delivery interface
export interface WebhookDelivery {
  id: string;
  webhookId: string;
  event: string;
  payload: any;
  response: {
    statusCode: number;
    headers: Record<string, string>;
    body: string;
  };
  attempts: number;
  delivered: boolean;
  deliveredAt?: Date;
  createdAt: Date;
}

// Rate limit interface
export interface RateLimit {
  limit: number;
  remaining: number;
  reset: Date;
  retryAfter?: number;
}

// Pagination options interface
export interface PaginationOptions {
  page: number;
  limit: number;
  offset?: number;
  total?: number;
}

// Sort options interface
export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

// Filter options interface
export interface FilterOptions {
  field: string;
  operator: string;
  value: any;
}

// Search options interface
export interface SearchOptions {
  query: string;
  fields?: string[];
  fuzzy?: boolean;
  highlight?: boolean;
  page?: number;
  limit?: number;
}

// Export options interface
export interface ExportOptions {
  format: 'csv' | 'json' | 'xlsx' | 'pdf';
  fields?: string[];
  filters?: FilterOptions[];
  sort?: SortOptions[];
  includeHeaders?: boolean;
  dateFormat?: string;
  timezone?: Timezone;
}

// Import options interface
export interface ImportOptions {
  format: 'csv' | 'json' | 'xlsx';
  mapping?: Record<string, string>;
  skipRows?: number;
  validateData?: boolean;
  updateExisting?: boolean;
  createMissing?: boolean;
}

// Backup options interface
export interface BackupOptions {
  includeData: boolean;
  includeFiles: boolean;
  includeLogs: boolean;
  compression: boolean;
  encryption: boolean;
  retention: number;
}

// Maintenance window interface
export interface MaintenanceWindow {
  startTime: Date;
  endTime: Date;
  reason: string;
  affectedServices: string[];
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
}

// System health interface
export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  checks: Array<{
    name: string;
    status: 'healthy' | 'unhealthy';
    responseTime: number;
    lastChecked: Date;
    error?: string;
  }>;
  uptime: number;
  version: string;
  timestamp: Date;
}

import { Annotation } from '@/components/ui/annotation-canvas';

export interface CapturedMedia {
  id: string;
  type: 'video' | 'screenshot';
  src: string;
  timestamp: string;
  selected: boolean;
  annotations?: Annotation[];
  annotatedSrc?: string; // URL of the annotated image
}

export interface AnnotationState {
  [mediaId: string]: Annotation[];
}
