import Event from "../models/Event.js";
import EventApprovalHistory from "../models/EventApprovalHistroy.js";

export const createEvent = async (req, res) => {
  try {
    const {
      title,
      slug,
      shortDescription,
      description,
      type,
      bannerImage,
      date,
      startTime,
      endTime,
      venue,
      registrationDeadline,
      registrationLimit,
      registrationRequired,
      organizer,
      contestType,
      rules,
      prize,
      eligibility,
      problemStatement
    } = req.body;

    if (!title || !slug || !description || !date) {
      return res.status(400).json({
        success: false,
        message: "Title, slug, description and date are required"
      });
    }

    const existingEvent = await Event.findOne({ slug });

    if (existingEvent) {
      return res.status(409).json({
        success: false,
        message: "An event with this slug already exists"
      });
    }

    const event = await Event.create({
      title,
      slug,
      shortDescription,
      description,
      type,
      bannerImage,
      date,
      startTime,
      endTime,
      venue,
      registrationDeadline,
      registrationLimit,
      registrationRequired,
      organizer,
      contestType,
      rules,
      prize,
      eligibility,
      problemStatement,
      createdBy: req.user._id,
      approvalStatus: "DRAFT",
      publicationStatus: "UNPUBLISHED"
    });

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      event
    });
  } catch (error) {
    console.error("Create event error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

export const getPublishedEvents = async (req, res) => {
  try {
    const events = await Event.find({
      approvalStatus: "APPROVED",
      publicationStatus: "PUBLISHED",
      isDeleted : false
    })
      .sort({ date: 1 })
      .populate("createdBy", "name");

    res.status(200).json({
      success: true,
      count: events.length,
      events
    });
  } catch (error) {
    console.error("Get published events error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};



export const getPublishedEventBySlug = async (req, res) => {
  try {
    const event = await Event.findOne({
      slug: req.params.slug,
      approvalStatus: "APPROVED",
      publicationStatus: "PUBLISHED",
      isDeleted:false
    }).populate("createdBy", "name");

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }

    res.status(200).json({
      success: true,
      event
    });
  } catch (error) {
    console.error("Get event by slug error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};




export const submitEventForApproval = async (req, res) => {
  try {
    const event = await Event.findOne({
      _id: req.params.id,
      createdBy: req.user._id
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }

    if (
      event.approvalStatus !== "DRAFT" &&
      event.approvalStatus !== "CHANGES_REQUESTED"
    ) {
      return res.status(400).json({
        success: false,
        message: "This event cannot be submitted"
      });
    }

    event.approvalStatus = "SUBMITTED";
    event.rejectionReason = "";

    await event.save();

    await EventApprovalHistory.create({
  event: event._id,
  action: "SUBMITTED",
  performedBy: req.user._id
});

    res.status(200).json({
      success: true,
      message: "Event submitted for approval",
      event
    });
  } catch (error) {
    console.error("Submit event error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};



export const approveEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }

    if (event.approvalStatus !== "SUBMITTED") {
      return res.status(400).json({
        success: false,
        message: "Only submitted events can be approved"
      });
    }

    event.approvalStatus = "APPROVED";
    event.approvedBy = req.user._id;
    event.approvedAt = new Date();
    event.rejectionReason = "";
    event.rejectedBy = null;
    event.rejectedAt = null;

    await event.save();

    res.status(200).json({
      success: true,
      message: "Event approved successfully",
      event
    });
  } catch (error) {
    console.error("Approve event error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};



export const rejectEvent = async (req, res) => {
  try {
    const { reason } = req.body;

    if (!reason || !reason.trim()) {
      return res.status(400).json({
        success: false,
        message: "Rejection reason is required"
      });
    }

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }

    if (event.approvalStatus !== "SUBMITTED") {
      return res.status(400).json({
        success: false,
        message: "Only submitted events can be rejected"
      });
    }

    event.approvalStatus = "REJECTED";
    event.rejectionReason = reason.trim();
    event.approvedBy = null;
    event.approvedAt = null;
    event.rejectedBy = req.user._id;
    event.rejectedAt = new Date();

    await event.save();

    await EventApprovalHistory.create({
  event: event._id,
  action: "REJECTED",
  performedBy: req.user._id,
  reason: reason.trim()
});



    res.status(200).json({
      success: true,
      message: "Event rejected successfully",
      event
    });
  } catch (error) {
    console.error("Reject event error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


export const requestEventChanges = async (req, res) => {
  try {
    const { reason } = req.body;

    if (!reason || !reason.trim()) {
      return res.status(400).json({
        success: false,
        message: "Change request reason is required"
      });
    }

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }

    if (event.approvalStatus !== "SUBMITTED") {
      return res.status(400).json({
        success: false,
        message: "Only submitted events can have changes requested"
      });
    }

    event.approvalStatus = "CHANGES_REQUESTED";
    event.rejectionReason = reason.trim();
    event.approvedBy = null;
    event.approvedAt = null;
    event.rejectedBy = req.user._id;
    event.rejectedAt = new Date();

    await event.save();
    await EventApprovalHistory.create({
  event: event._id,
  action: "CHANGES_REQUESTED",
  performedBy: req.user._id,
  reason: reason.trim()
});






    await EventApprovalHistory.create({
  event: event._id,
  action: "APPROVED",
  performedBy: req.user._id
});

    res.status(200).json({
      success: true,
      message: "Changes requested successfully",
      event
    });
  } catch (error) {
    console.error("Request event changes error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};



export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findOne({
      _id: req.params.id,
      createdBy: req.user._id
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }

    if (
      event.approvalStatus !== "DRAFT" &&
      event.approvalStatus !== "CHANGES_REQUESTED"
    ) {
      return res.status(400).json({
        success: false,
        message: "This event cannot be edited in its current status"
      });
    }

    const allowedFields = [
      "title",
      "slug",
      "shortDescription",
      "description",
      "type",
      "bannerImage",
      "date",
      "startTime",
      "endTime",
      "venue",
      "registrationDeadline",
      "registrationLimit",
      "registrationRequired",
      "organizer",
      "contestType",
      "rules",
      "prize",
      "eligibility",
      "problemStatement"
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        event[field] = req.body[field];
      }
    });

    event.approvalStatus = "DRAFT";
    event.rejectionReason = "";
    event.approvedBy = null;
    event.approvedAt = null;
    event.rejectedBy = null;
    event.rejectedAt = null;

    await event.save();

    res.status(200).json({
      success: true,
      message: "Event updated successfully",
      event
    });
  } catch (error) {
    console.error("Update event error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};



export const publishEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }

    if (event.approvalStatus !== "APPROVED") {
      return res.status(400).json({
        success: false,
        message: "Only approved events can be published"
      });
    }

    if (event.publicationStatus === "PUBLISHED") {
      return res.status(400).json({
        success: false,
        message: "Event is already published"
      });
    }

    event.publicationStatus = "PUBLISHED";

    await event.save();
    await EventApprovalHistory.create({
  event: event._id,
  action: "PUBLISHED",
  performedBy: req.user._id
});




    res.status(200).json({
      success: true,
      message: "Event published successfully",
      event
    });
  } catch (error) {
    console.error("Publish event error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


export const unpublishEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }

    if (event.publicationStatus !== "PUBLISHED") {
      return res.status(400).json({
        success: false,
        message: "Event is not currently published"
      });
    }

    event.publicationStatus = "UNPUBLISHED";

    await event.save();

    await EventApprovalHistory.create({
  event: event._id,
  action: "UNPUBLISHED",
  performedBy: req.user._id
});



    res.status(200).json({
      success: true,
      message: "Event unpublished successfully",
      event
    });
  } catch (error) {
    console.error("Unpublish event error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};



export const getManageableEvents = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === "COMMITTEE") {
      query.createdBy = req.user._id;
    }

    const events = await Event.find(query)
      .sort({ createdAt: -1 })
      .populate("createdBy", "name email")
      .populate("approvedBy", "name email");

    res.status(200).json({
      success: true,
      count: events.length,
      events
    });
  } catch (error) {
    console.error("Get manageable events error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findOne({
      _id: req.params.id,
      createdBy: req.user._id
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }

    if (event.isDeleted) {
      return res.status(400).json({
        success: false,
        message: "Event is already deleted"
      });
    }

    if (event.publicationStatus === "PUBLISHED") {
      return res.status(400).json({
        success: false,
        message: "Published events must be unpublished before deletion"
      });
    }

    event.isDeleted = true;
    event.publicationStatus = "UNPUBLISHED";

    await event.save();

    res.status(200).json({
      success: true,
      message: "Event deleted successfully"
    });
  } catch (error) {
    console.error("Delete event error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


export const getManageableEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("approvedBy", "name email");

    if (!event || event.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }

    if (
      req.user.role === "COMMITTEE" &&
      event.createdBy._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to view this event"
      });
    }

    res.status(200).json({
      success: true,
      event
    });
  } catch (error) {
    console.error("Get manageable event error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


export const getEventApprovalHistory = async (req, res) => {
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
        message: "You do not have permission to view this history"
      });
    }

    const history = await EventApprovalHistory.find({
      event: event._id
    })
      .sort({ createdAt: 1 })
      .populate("performedBy", "name email role");

    res.status(200).json({
      success: true,
      count: history.length,
      history
    });
  } catch (error) {
    console.error("Get approval history error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};