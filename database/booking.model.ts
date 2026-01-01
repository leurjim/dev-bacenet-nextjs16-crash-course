import { Schema, model, models, Document, Model, Types } from 'mongoose';
import { Event } from './event.model';

/**
 * Booking document shape used by Mongoose and TypeScript.
 */
export interface BookingDocument extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Simple email format validation for user input.
 */
const emailValidator = {
  validator(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  },
  message: 'Email must be a valid email address.',
};

const bookingSchema = new Schema<BookingDocument>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate: emailValidator,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Index on eventId to speed up event-centric booking queries.
 */
bookingSchema.index({ eventId: 1 });

/**
 * Pre-save hook to ensure the referenced event exists and basic validity.
 */
bookingSchema.pre<BookingDocument>('save', async function preSave(next) {
  try {
    // Ensure the referenced Event exists before saving the booking.
    const eventExists = await Event.exists({ _id: this.eventId }).lean().exec();

    if (!eventExists) {
      return next(new Error('Cannot create booking: referenced event does not exist.'));
    }

    next();
  } catch (error) {
    next(error as Error);
  }
});

/**
 * Export the Booking model, reusing an existing compiled model in development.
 */
export const Booking: Model<BookingDocument> = models.Booking || model<BookingDocument>('Booking', bookingSchema);
