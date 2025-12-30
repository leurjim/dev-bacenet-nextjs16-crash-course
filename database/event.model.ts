import { Schema, model, models, Document, Model } from 'mongoose';

/**
 * Event document shape used by Mongoose and TypeScript.
 */
export interface EventDocument extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string; // stored as ISO date string (YYYY-MM-DD)
  time: string; // stored as 24h time string (HH:MM)
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Ensure non-empty trimmed strings for required text fields.
 */
const nonEmptyStringValidator = {
  validator(value: string): boolean {
    return typeof value === 'string' && value.trim().length > 0;
  },
  message: '{PATH} must not be empty.',
};

/**
 * Create a URL-friendly slug from a title.
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Normalize a date-like string to an ISO date (YYYY-MM-DD).
 */
function normalizeDateToISO(dateInput: string): string {
  const date = new Date(dateInput);

  if (Number.isNaN(date.getTime())) {
    throw new Error('Invalid date format for Event.date');
  }

  return date.toISOString().split('T')[0];
}

/**
 * Normalize time to 24-hour HH:MM format.
 * Accepts common formats like "HH:MM", "H:MM am/pm".
 */
function normalizeTime(timeInput: string): string {
  const trimmed = timeInput.trim().toLowerCase();

  // 24-hour HH:MM
  const twentyFourHourMatch = trimmed.match(/^([01]?\d|2[0-3]):([0-5]\d)$/);
  if (twentyFourHourMatch) {
    const [, hh, mm] = twentyFourHourMatch;
    return `${hh.padStart(2, '0')}:${mm}`;
  }

  // 12-hour H:MM am/pm
  const twelveHourMatch = trimmed.match(/^(\d{1,2}):(\d{2})\s*(am|pm)$/);
  if (twelveHourMatch) {
    let [ , hourStr, minuteStr, period ] = twelveHourMatch;
    let hour = parseInt(hourStr, 10);

    if (hour < 1 || hour > 12) {
      throw new Error('Invalid hour in Event.time');
    }

    if (period === 'pm' && hour !== 12) {
      hour += 12;
    } else if (period === 'am' && hour === 12) {
      hour = 0;
    }

    return `${hour.toString().padStart(2, '0')}:${minuteStr}`;
  }

  throw new Error('Invalid time format for Event.time. Use HH:MM (24h) or H:MM am/pm.');
}

const eventSchema = new Schema<EventDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      validate: nonEmptyStringValidator,
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      validate: nonEmptyStringValidator,
    },
    overview: {
      type: String,
      required: true,
      trim: true,
      validate: nonEmptyStringValidator,
    },
    image: {
      type: String,
      required: true,
      trim: true,
      validate: nonEmptyStringValidator,
    },
    venue: {
      type: String,
      required: true,
      trim: true,
      validate: nonEmptyStringValidator,
    },
    location: {
      type: String,
      required: true,
      trim: true,
      validate: nonEmptyStringValidator,
    },
    date: {
      type: String,
      required: true,
      trim: true,
      validate: nonEmptyStringValidator,
    },
    time: {
      type: String,
      required: true,
      trim: true,
      validate: nonEmptyStringValidator,
    },
    mode: {
      type: String,
      required: true,
      trim: true,
      validate: nonEmptyStringValidator,
    },
    audience: {
      type: String,
      required: true,
      trim: true,
      validate: nonEmptyStringValidator,
    },
    agenda: {
      type: [String],
      required: true,
      validate: {
        validator(value: string[]): boolean {
          return Array.isArray(value) && value.length > 0 && value.every((item) => typeof item === 'string' && item.trim().length > 0);
        },
        message: 'Agenda must be a non-empty array of non-empty strings.',
      },
    },
    organizer: {
      type: String,
      required: true,
      trim: true,
      validate: nonEmptyStringValidator,
    },
    tags: {
      type: [String],
      required: true,
      validate: {
        validator(value: string[]): boolean {
          return Array.isArray(value) && value.length > 0 && value.every((item) => typeof item === 'string' && item.trim().length > 0);
        },
        message: 'Tags must be a non-empty array of non-empty strings.',
      },
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Unique index on slug for fast lookups and to enforce uniqueness.
 */
eventSchema.index({ slug: 1 }, { unique: true });

/**
 * Pre-save hook to generate slug, normalize date/time, and validate fields.
 */
eventSchema.pre<EventDocument>('save', function preSave(next) {
  try {
    // Generate slug only when the title is new or has been modified.
    if (this.isModified('title')) {
      this.slug = generateSlug(this.title);
    }

    // Normalize and validate date and time formats.
    if (this.isModified('date')) {
      this.date = normalizeDateToISO(this.date);
    }

    if (this.isModified('time')) {
      this.time = normalizeTime(this.time);
    }

    next();
  } catch (error) {
    next(error as Error);
  }
});

/**
 * Export the Event model, reusing an existing compiled model in development.
 */
export const Event: Model<EventDocument> = models.Event || model<EventDocument>('Event', eventSchema);
