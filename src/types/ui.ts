// Theme types
export type Theme = 'light' | 'dark' | 'system';

// Color scheme types
export type ColorScheme = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';

// Size types
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

// Variant types
export type Variant = 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary';

// Position types
export type Position = 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

// Alignment types
export type Alignment = 'start' | 'center' | 'end' | 'justify' | 'between' | 'around' | 'evenly';

// Notification types
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

// Modal types
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

// Loading state types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// Form field types
export type FieldType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'file';

// Input validation types
export type ValidationType = 'required' | 'email' | 'minLength' | 'maxLength' | 'pattern' | 'custom';

// Table column types
export type ColumnType = 'text' | 'number' | 'date' | 'boolean' | 'action' | 'image' | 'status' | 'custom';

// Sort direction types
export type SortDirection = 'asc' | 'desc' | null;

// Filter operator types
export type FilterOperator = 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'in' | 'notIn' | 'gt' | 'gte' | 'lt' | 'lte' | 'between' | 'isNull' | 'isNotNull';

// Notification interface
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  dismissible?: boolean;
  persistent?: boolean;
}

// Modal interface
export interface Modal {
  id: string;
  isOpen: boolean;
  title?: string;
  content: React.ReactNode;
  size?: ModalSize;
  onClose?: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}

// Form field interface
export interface FormField {
  name: string;
  label?: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  defaultValue?: any;
  validation?: ValidationRule[];
  options?: SelectOption[];
  multiple?: boolean;
  accept?: string;
  maxSize?: number;
  min?: number;
  max?: number;
  step?: number;
  rows?: number;
  cols?: number;
  autoComplete?: string;
  autoFocus?: boolean;
}

// Validation rule interface
export interface ValidationRule {
  type: ValidationType;
  value?: any;
  message?: string;
  validator?: (value: any) => boolean | string;
}

// Select option interface
export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  group?: string;
}

// Table column interface
export interface TableColumn<T = any> {
  key: string;
  title: string;
  type: ColumnType;
  sortable?: boolean;
  filterable?: boolean;
  width?: number | string;
  minWidth?: number | string;
  maxWidth?: number | string;
  align?: Alignment;
  render?: (value: any, row: T, index: number) => React.ReactNode;
  formatter?: (value: any) => string;
  accessor?: (row: T) => any;
}

// Table sort interface
export interface TableSort {
  key: string;
  direction: SortDirection;
}

// Table filter interface
export interface TableFilter {
  key: string;
  operator: FilterOperator;
  value: any;
  secondValue?: any;
}

// Pagination interface
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Breadcrumb item interface
export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  active?: boolean;
}

// Tab item interface
export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
  badge?: string | number;
}

// Menu item interface
export interface MenuItem {
  id: string;
  label: string;
  href?: string;
  icon?: React.ReactNode;
  children?: MenuItem[];
  disabled?: boolean;
  badge?: string | number;
  onClick?: () => void;
}

// Sidebar section interface
export interface SidebarSection {
  id: string;
  title?: string;
  items: MenuItem[];
  collapsible?: boolean;
  collapsed?: boolean;
}

// Chart data interface
export interface ChartData {
  label: string;
  value: number;
  color?: string;
  data?: Record<string, any>;
}

// Chart configuration interface
export interface ChartConfig {
  type: 'line' | 'bar' | 'pie' | 'area' | 'doughnut' | 'radar';
  data: ChartData[];
  options?: Record<string, any>;
  height?: number | string;
  width?: number | string;
}

// File upload interface
export interface FileUpload {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  url?: string;
  error?: string;
  preview?: string;
}

// Dropdown option interface
export interface DropdownOption {
  value: string | number;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  divider?: boolean;
  onClick?: () => void;
}

// Tooltip interface
export interface Tooltip {
  content: string | React.ReactNode;
  position?: Position;
  delay?: number;
  disabled?: boolean;
}

// Popover interface
export interface Popover {
  trigger: React.ReactNode;
  content: React.ReactNode;
  position?: Position;
  disabled?: boolean;
  closeOnClickOutside?: boolean;
}

// Accordion item interface
export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
  defaultOpen?: boolean;
}

// Stepper step interface
export interface StepperStep {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  status: 'pending' | 'current' | 'completed' | 'error';
  disabled?: boolean;
}

// Progress interface
export interface Progress {
  value: number;
  max?: number;
  min?: number;
  size?: Size;
  variant?: Variant;
  showValue?: boolean;
  animated?: boolean;
  striped?: boolean;
}

// Badge interface
export interface Badge {
  content: string | number;
  variant?: Variant;
  size?: Size;
  color?: ColorScheme;
  rounded?: boolean;
  dot?: boolean;
}

// Avatar interface
export interface Avatar {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: Size;
  shape?: 'circle' | 'square';
  status?: 'online' | 'offline' | 'away' | 'busy';
}

// Card interface
export interface Card {
  title?: string;
  subtitle?: string;
  content: React.ReactNode;
  footer?: React.ReactNode;
  header?: React.ReactNode;
  image?: string;
  variant?: Variant;
  padding?: Size;
  shadow?: boolean;
  bordered?: boolean;
}

// Alert interface
export interface Alert {
  type: NotificationType;
  title?: string;
  message: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  dismissible?: boolean;
  onDismiss?: () => void;
}

// Skeleton interface
export interface Skeleton {
  type: 'text' | 'title' | 'avatar' | 'button' | 'image' | 'card';
  width?: number | string;
  height?: number | string;
  lines?: number;
  animated?: boolean;
}

// Loading spinner interface
export interface LoadingSpinner {
  size?: Size;
  color?: ColorScheme;
  thickness?: number;
  speed?: number;
  label?: string;
}

// Empty state interface
export interface EmptyState {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  image?: string;
}

// Error boundary interface
export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

// Responsive breakpoint interface
export interface ResponsiveBreakpoint {
  sm: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
}

// Animation interface
export interface Animation {
  type: 'fade' | 'slide' | 'scale' | 'rotate' | 'bounce' | 'shake';
  duration?: number;
  delay?: number;
  easing?: string;
  direction?: 'in' | 'out' | 'in-out';
}

// Transition interface
export interface Transition {
  enter: Animation;
  exit: Animation;
  appear?: boolean;
  unmountOnExit?: boolean;
  mountOnEnter?: boolean;
}
