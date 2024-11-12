import { getEvents, insertEvent, editEvent, trashEvent, getEventById } from "../models/EventModel.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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
export const createEvent = async (req, res) => {
    // Get event details from the request body
    const event = req.body;
    // Check if an image was uploaded
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null; // Construct the image URL
  
    // If needed, add the imageUrl to the event object
    const newEvent = {
      ...event,
      image_url: imageUrl, // Add the image URL to the event object
    };
  
    try {
      // Assuming insertEvent function accepts the event object including the image URL
      const result = await insertEvent(newEvent);
      res.status(201).json({ message: "Event created successfully", event: newEvent });
    } catch (err) {
      console.error("Error in createEvent:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };  

/**
 * Handler to update an existing event.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const updateEvent = async (req, res) => {
  const eventId = req.params.id; // Get event ID from request parameters
  const eventData = req.body; // Get event details from the request body
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null; // New image URL if an image was uploaded

  try {
    // Retrieve the existing event data
    const [oldEvent] = await getEventById(eventId); // Await getEventById and destructure result to get the first row

    if (!oldEvent) {
      return res.status(404).json({ error: "Event not found" });
    }

    // If an image was uploaded, delete the old image and update the event data
    if (imageUrl) {
      const oldPicture = oldEvent.image_url;

      // Optionally delete the old image if it exists
      if (oldPicture) {
        const oldPicturePath = path.join(__dirname, '..', oldPicture);
        fs.unlink(oldPicturePath, (err) => {
          if (err) console.error("Error deleting old image:", err);
        });
      }

      eventData.image_url = imageUrl; // Update event data with the new image URL
    }
    if (!imageUrl) {
      eventData.image_url = oldEvent.image_url;
    }

    // Update the event in the database
    const result = await editEvent(eventId, eventData);

    // Check if the event was found and updated
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.status(200).json({ message: "Event updated successfully", event: eventData });
  } catch (err) {
    console.error("Error in updateEvent:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Handler to delete an event from the database.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
export const deleteEvent = async (req, res) => {
  const eventId = req.params.id; // Get event ID from request parameters

  try {
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
