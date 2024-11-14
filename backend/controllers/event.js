import { getEvents, insertEvent, editEvent, trashEvent, getEventById } from "../models/EventModel.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { handleValidationErrors } from "../verificationMiddleware/validator.js";
import { check } from "express-validator";

/**
 * Handler to show all events.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
export const showEvents = async (req, res) => {
  try {
    const events = await getEvents();
    res.status(200).json(events);
  } catch (err) {
    console.error("Error in showEvents:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Handler to insert a new event.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */

const validationRules = [
  check("name")
    .notEmpty().withMessage("Eventnamn är obligatoriskt")
    .isLength({ min: 3 }).withMessage("Eventnamnet måste vara minst 3 tecken långt"),
  
  check("description")
    .notEmpty().withMessage("Beskrivning är obligatorisk")
    .isLength({ min: 10 }).withMessage("Beskrivningen måste vara minst 10 tecken lång"),

  check("price")
    .notEmpty().withMessage("Pris är obligatoriskt")
    .isNumeric().withMessage("Pris måste vara ett numeriskt värde")
    .isFloat({ gt: 0 }).withMessage("Pris måste vara ett positivt tal"),

  check("booking_link")
    .optional()
    .isURL().withMessage("Bokningslänk måste vara en giltig URL"),

  check("schedule")
    .notEmpty().withMessage("Schema är obligatoriskt")
    .isISO8601().withMessage("Schema måste vara i ett giltigt datum/tid-format (ISO 8601)"),
];

// Create event handler
export const createEvent = [
  ...validationRules,
  handleValidationErrors,

  async (req, res) => {
    const event = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const newEvent = {
      ...event,
      image_url: imageUrl,
    };

    try {
      const result = await insertEvent(newEvent);
      const eventWithInsertId = {
        ...newEvent,
        event_id: result.insertId,
      }
      res.status(201).json({ message: "Eventet skapades framgångsrikt", event: eventWithInsertId });
    } catch (err) {
      console.error("Fel i createEvent:", err);
      res.status(500).json({ error: "Internt serverfel" });
    }
  }
];

// dirname in ES Modulees
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Update event handler
export const updateEvent = [
  ...validationRules,
  handleValidationErrors,

  async (req, res) => {
    const eventId = req.params.id;
    const eventData = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    try {
      const [oldEvent] = await getEventById(eventId);
      if (!oldEvent) {
        return res.status(404).json({ error: "Event not found" });
      }

      if (imageUrl) {
        const oldPicture = oldEvent.image_url;
        if (oldPicture) {
          const oldPicturePath = path.join(__dirname, '..', oldPicture);
          fs.unlink(oldPicturePath, (err) => {
            if (err) console.error("Error deleting old image:", err);
          });
        }
        eventData.image_url = imageUrl;
      } else {
        eventData.image_url = oldEvent.image_url;
      }

      const result = await editEvent(eventId, eventData);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Event not found" });
      }

      res.status(200).json({ message: "Event updated successfully", event: eventData });
    } catch (err) {
      console.error("Error in updateEvent:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
];


/* Handler to delete an event from the database. */
export const deleteEvent = async (req, res) => {
  const eventId = req.params.id;

  try {
    // Retrieve the event and its image URL
    const [event] = await getEventById(eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Delete the image file if it exists
    const imageUrl = event.image_url;
    if (imageUrl) {
      const imagePath = path.join(__dirname, "..", imageUrl);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Error deleting image:", err);
        }
      });
    }

    // Proceed to delete the event from the database
    const result = await trashEvent(eventId);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (err) {
    console.error("Error in deleteEvent:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
