
// Application constants
export const APP_CONFIG = {
  name: 'Samasya Seva',
  version: '1.0.0',
  supportEmail: 'support@samasyaseva.gov.in',
  maxFileSize: 5 * 1024 * 1024, // 5MB
  maxFilesPerComplaint: 5,
} as const;

export const COMPLAINT_CATEGORIES = [
  {
    id: 'road-maintenance',
    name: 'Road Maintenance',
    description: 'Potholes, damaged roads, street lighting'
  },
  {
    id: 'garbage-collection',
    name: 'Garbage Collection',
    description: 'Waste management, missed collections'
  },
  {
    id: 'water-supply',
    name: 'Water Supply',
    description: 'Water shortage, quality issues, leakages'
  },
  {
    id: 'electricity',
    name: 'Electricity',
    description: 'Power outages, faulty connections'
  },
  {
    id: 'drainage',
    name: 'Drainage',
    description: 'Blocked drains, flooding issues'
  },
  {
    id: 'other',
    name: 'Other',
    description: 'Other civic issues'
  }
] as const;

export const COMPLAINT_STATUS = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  RESOLVED: 'Resolved',
  CLOSED: 'Closed',
  REJECTED: 'Rejected'
} as const;

export const USER_ROLES = {
  CITIZEN: 'citizen',
  STAFF: 'staff',
  ADMIN: 'admin'
} as const;

export const API_ENDPOINTS = {
  COMPLAINTS: '/complaints',
  PROFILES: '/profiles',
  AUTH: '/auth',
  UPLOAD: '/upload'
} as const;
