import { getEvents, insertEvent, editEvent, trashEvent } from "../models/EventModel.js";

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
    console.log("testtesttesttt");
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
      console.log(result);
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
export const updateEvent = async (req, res) => {
    const eventId = req.params.id; // Get event ID from request parameters
    const eventData = req.body; // Get event details from the request body
  
    // Check if an image was uploaded
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null; // Construct the image URL if an image was uploaded
  
    // If an image was uploaded, include it in the event data
    if (imageUrl) {
      eventData.image_url = imageUrl; // Update the event data with the new image URL
    }
  
    try {
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
  console.log("eventId inside controller: " + eventId);

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
