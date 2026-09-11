import Event from "../models/Event.js";
import EventRegistration from "../models/EventRegistration.js";

export const registerForEvent = async (req, res) => {
  try {
    const event = await Event.findOne({
      _id: req.params.eventId,
      approvalStatus: "APPROVED",
      publicationStatus: "PUBLISHED",
      isDeleted: false
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }

    if (!event.registrationRequired) {
      return res.status(400).json({
        success: false,
        message: "Registration is not required for this event"
      });
    }

    if (
      event.registrationDeadline &&
      new Date() > event.registrationDeadline
    ) {
      return res.status(400).json({
        success: false,
        message: "Registration deadline has passed"
      });
    }

    const existingRegistration =
      await EventRegistration.findOne({
        event: event._id,
        user: req.user._id
      });

    if (
      existingRegistration &&
      existingRegistration.status === "REGISTERED"
    ) {
      return res.status(409).json({
        success: false,
        message: "You are already registered for this event"
      });
    }

    const registeredCount = await EventRegistration.countDocuments({
      event: event._id,
      status: "REGISTERED"
    });

    if (
      event.registrationLimit &&
      registeredCount >= event.registrationLimit
    ) {
      return res.status(400).json({
        success: false,
        message: "Registration limit has been reached"
      });
    }

    let registration;

    if (existingRegistration) {
      existingRegistration.status = "REGISTERED";
      existingRegistration.registeredAt = new Date();
      existingRegistration.cancelledAt = null;

      registration = await existingRegistration.save();
    } else {
      registration = await EventRegistration.create({
        event: event._id,
        user: req.user._id
      });
    }

    res.status(201).json({
      success: true,
      message: "Event registration successful",
      registration
    });
  } catch (error) {
    console.error("Event registration error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

export const cancelEventRegistration = async (req, res) => {
  try {
    const registration = await EventRegistration.findOne({
      event: req.params.eventId,
      user: req.user._id,
      status: "REGISTERED"
    });

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Active registration not found"
      });
    }

    registration.status = "CANCELLED";
    registration.cancelledAt = new Date();

    await registration.save();

    res.status(200).json({
      success: true,
      message: "Event registration cancelled successfully",
      registration
    });
  } catch (error) {
    console.error("Cancel event registration error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

export const getMyRegistrations = async (req, res) => {
  try {
    const registrations = await EventRegistration.find({
      user: req.user._id
    })
      .sort({ createdAt: -1 })
      .populate(
        "event",
        "title slug shortDescription type bannerImage date startTime endTime venue"
      );

    res.status(200).json({
      success: true,
      count: registrations.length,
      registrations
    });
  } catch (error) {
    console.error("Get my registrations error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


export const getEventRegistrations = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);

    if (!event || event.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }

    // Committee can only view registrations
    // for events they created.
    if (
      req.user.role === "COMMITTEE" &&
      event.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to view these registrations"
      });
    }

    const registrations = await EventRegistration.find({
      event: event._id,
      status: "REGISTERED"
    })
      .sort({ registeredAt: 1 })
      .populate(
        "user",
        "name email studentId department phone"
      );

    res.status(200).json({
      success: true,
      count: registrations.length,
      event: {
        id: event._id,
        title: event.title
      },
      registrations
    });
  } catch (error) {
    console.error("Get event registrations error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

export const getEventRegistrationStats = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);

    if (!event || event.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }

    if (
      req.user.role === "COMMITTEE" &&
      event.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to view these statistics"
      });
    }

    const totalRegistrations =
      await EventRegistration.countDocuments({
        event: event._id
      });

    const activeRegistrations =
      await EventRegistration.countDocuments({
        event: event._id,
        status: "REGISTERED"
      });

    const cancelledRegistrations =
      await EventRegistration.countDocuments({
        event: event._id,
        status: "CANCELLED"
      });

    const capacity = event.registrationLimit || null;

    const remainingSeats =
      capacity === null
        ? null
        : Math.max(capacity - activeRegistrations, 0);

    res.status(200).json({
      success: true,
      stats: {
        totalRegistrations,
        activeRegistrations,
        cancelledRegistrations,
        capacity,
        remainingSeats
      }
    });
  } catch (error) {
    console.error("Get registration stats error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};