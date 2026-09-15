import News from "../models/News.js";
import NewsApprovalHistory from "../models/NewsApprovalHistory.js";

export const createNews = async (req, res) => {
  try {
    const {
      title,
      slug,
      excerpt,
      content,
      coverImage,
      category
    } = req.body;

    if (!title || !slug || !content) {
      return res.status(400).json({
        success: false,
        message: "Title, slug and content are required"
      });
    }

    const existingNews = await News.findOne({
      slug: slug.toLowerCase()
    });

    if (existingNews) {
      return res.status(409).json({
        success: false,
        message: "News with this slug already exists"
      });
    }

    const news = await News.create({
      title,
      slug: slug.toLowerCase(),
      excerpt,
      content,
      coverImage,
      category,
      createdBy: req.user._id,
      approvalStatus: "DRAFT",
      publicationStatus: "UNPUBLISHED"
    });

    res.status(201).json({
      success: true,
      message: "News created successfully",
      news
    });
  } catch (error) {
    console.error("Create news error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

export const getPublishedNews = async (req, res) => {
  try {
    const news = await News.find({
      approvalStatus: "APPROVED",
      publicationStatus: "PUBLISHED",
      isDeleted: false
    })
      .sort({ createdAt: -1 })
      .populate("createdBy", "name");

    res.status(200).json({
      success: true,
      count: news.length,
      news
    });
  } catch (error) {
    console.error("Get published news error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


export const getPublishedNewsBySlug = async (req, res) => {
  try {
    const news = await News.findOne({
      slug: req.params.slug.toLowerCase(),
      approvalStatus: "APPROVED",
      publicationStatus: "PUBLISHED",
      isDeleted: false
    }).populate("createdBy", "name");

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News not found"
      });
    }

    res.status(200).json({
      success: true,
      news
    });
  } catch (error) {
    console.error("Get published news by slug error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

export const submitNewsForApproval = async (req, res) => {
  try {
    const news = await News.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
      isDeleted: false
    });

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News not found"
      });
    }

    if (
      news.approvalStatus !== "DRAFT" &&
      news.approvalStatus !== "CHANGES_REQUESTED"
    ) {
      return res.status(400).json({
        success: false,
        message: "News cannot be submitted in its current status"
      });
    }

    news.approvalStatus = "SUBMITTED";
    news.rejectionReason = "";

    await news.save();

    await NewsApprovalHistory.create({
  news: news._id,
  action: "SUBMITTED",
  performedBy: req.user._id,
  reason: ""
});





    res.status(200).json({
      success: true,
      message: "News submitted for approval",
      news
    });
  } catch (error) {
    console.error("Submit news error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};



export const approveNews = async (req, res) => {
  try {
    const news = await News.findOne({
      _id: req.params.id,
      isDeleted: false
    });

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News not found"
      });
    }

    if (news.approvalStatus !== "SUBMITTED") {
      return res.status(400).json({
        success: false,
        message: "News is not awaiting approval"
      });
    }

    news.approvalStatus = "APPROVED";
    news.approvedBy = req.user._id;
    news.approvedAt = new Date();
    news.rejectionReason = "";
    news.rejectedBy = null;
    news.rejectedAt = null;

    await news.save();

    await NewsApprovalHistory.create({
  news: news._id,
  action: "APPROVED",
  performedBy: req.user._id,
  reason: ""
});




    res.status(200).json({
      success: true,
      message: "News approved successfully",
      news
    });
  } catch (error) {
    console.error("Approve news error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

export const rejectNews = async (req, res) => {
  try {
    const { reason } = req.body;

    if (!reason || !reason.trim()) {
      return res.status(400).json({
        success: false,
        message: "Rejection reason is required"
      });
    }

    const news = await News.findOne({
      _id: req.params.id,
      isDeleted: false
    });

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News not found"
      });
    }

    if (news.approvalStatus !== "SUBMITTED") {
      return res.status(400).json({
        success: false,
        message: "News is not awaiting approval"
      });
    }

    news.approvalStatus = "REJECTED";
    news.rejectionReason = reason.trim();
    news.rejectedBy = req.user._id;
    news.rejectedAt = new Date();
    news.approvedBy = null;
    news.approvedAt = null;

    await news.save();

    await NewsApprovalHistory.create({
  news: news._id,
  action: "REJECTED",
  performedBy: req.user._id,
  reason: news.rejectionReason
});


    res.status(200).json({
      success: true,
      message: "News rejected successfully",
      news
    });
  } catch (error) {
    console.error("Reject news error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

export const requestChangesOnNews = async (req, res) => {
  try {
    const { reason } = req.body;

    if (!reason || !reason.trim()) {
      return res.status(400).json({
        success: false,
        message: "Reason for requested changes is required"
      });
    }

    const news = await News.findOne({
      _id: req.params.id,
      isDeleted: false
    });

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News not found"
      });
    }

    if (news.approvalStatus !== "SUBMITTED") {
      return res.status(400).json({
        success: false,
        message: "News is not awaiting approval"
      });
    }

    news.approvalStatus = "CHANGES_REQUESTED";
    news.rejectionReason = reason.trim();

    news.rejectedBy = req.user._id;
    news.rejectedAt = new Date();

    news.approvedBy = null;
    news.approvedAt = null;

    await news.save();

    await NewsApprovalHistory.create({
  news: news._id,
  action: "CHANGES_REQUESTED",
  performedBy: req.user._id,
  reason: news.rejectionReason
});

    res.status(200).json({
      success: true,
      message: "Changes requested successfully",
      news
    });
  } catch (error) {
    console.error("Request changes on news error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


export const updateNews = async (req, res) => {
  try {
    const {
      title,
      slug,
      excerpt,
      content,
      coverImage,
      category
    } = req.body;

    const news = await News.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
      isDeleted: false
    });

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News not found"
      });
    }

    if (
      news.approvalStatus !== "DRAFT" &&
      news.approvalStatus !== "CHANGES_REQUESTED"
    ) {
      return res.status(400).json({
        success: false,
        message: "News cannot be updated in its current status"
      });
    }

    if (slug && slug.toLowerCase() !== news.slug) {
      const existingNews = await News.findOne({
        slug: slug.toLowerCase(),
        _id: { $ne: news._id }
      });

      if (existingNews) {
        return res.status(409).json({
          success: false,
          message: "News with this slug already exists"
        });
      }
    }

    news.title = title ?? news.title;
    news.slug = slug ? slug.toLowerCase() : news.slug;
    news.excerpt = excerpt ?? news.excerpt;
    news.content = content ?? news.content;
    news.coverImage = coverImage ?? news.coverImage;
    news.category = category ?? news.category;

    // Editing resets the approval workflow.
    news.approvalStatus = "DRAFT";
    news.publicationStatus = "UNPUBLISHED";

    news.rejectionReason = "";
    news.rejectedBy = null;
    news.rejectedAt = null;
    news.approvedBy = null;
    news.approvedAt = null;

    await news.save();

    res.status(200).json({
      success: true,
      message: "News updated successfully",
      news
    });
  } catch (error) {
    console.error("Update news error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

export const publishNews = async (req, res) => {
  try {
    const news = await News.findOne({
      _id: req.params.id,
      isDeleted: false
    });

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News not found"
      });
    }

    if (news.approvalStatus !== "APPROVED") {
      return res.status(400).json({
        success: false,
        message: "Only approved news can be published"
      });
    }

    if (news.publicationStatus === "PUBLISHED") {
      return res.status(400).json({
        success: false,
        message: "News is already published"
      });
    }

    news.publicationStatus = "PUBLISHED";

    await news.save();

    await NewsApprovalHistory.create({
  news: news._id,
  action: "PUBLISHED",
  performedBy: req.user._id,
  reason: ""
});

    res.status(200).json({
      success: true,
      message: "News published successfully",
      news
    });
  } catch (error) {
    console.error("Publish news error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

export const unpublishNews = async (req, res) => {
  try {
    const news = await News.findOne({
      _id: req.params.id,
      isDeleted: false
    });

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News not found"
      });
    }

    if (news.publicationStatus !== "PUBLISHED") {
      return res.status(400).json({
        success: false,
        message: "News is not currently published"
      });
    }

    news.publicationStatus = "UNPUBLISHED";

    await news.save();

    await NewsApprovalHistory.create({
  news: news._id,
  action: "UNPUBLISHED",
  performedBy: req.user._id,
  reason: ""
});

    res.status(200).json({
      success: true,
      message: "News unpublished successfully",
      news
    });
  } catch (error) {
    console.error("Unpublish news error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

export const getManageNews = async (req, res) => {
  try {
    const query = {
      isDeleted: false
    };

    // Committee members can only see their own news.
    if (req.user.role === "COMMITTEE") {
      query.createdBy = req.user._id;
    }

    const news = await News.find(query)
      .sort({ createdAt: -1 })
      .populate("createdBy", "name email")
      .populate("approvedBy", "name")
      .populate("rejectedBy", "name");

    res.status(200).json({
      success: true,
      count: news.length,
      news
    });
  } catch (error) {
    console.error("Get management news error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

export const getManageNewsById = async (req, res) => {
  try {
    const query = {
      _id: req.params.id,
      isDeleted: false
    };

    // Committee members can only access their own news.
    if (req.user.role === "COMMITTEE") {
      query.createdBy = req.user._id;
    }

    const news = await News.findOne(query)
      .populate("createdBy", "name email")
      .populate("approvedBy", "name email")
      .populate("rejectedBy", "name email");

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News not found"
      });
    }

    res.status(200).json({
      success: true,
      news
    });
  } catch (error) {
    console.error("Get management news by ID error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

export const deleteNews = async (req, res) => {
  try {
    const query = {
      _id: req.params.id,
      isDeleted: false
    };

    // Committee can delete only their own news.
    if (req.user.role === "COMMITTEE") {
      query.createdBy = req.user._id;
    }

    const news = await News.findOne(query);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News not found"
      });
    }

    news.isDeleted = true;
    news.publicationStatus = "UNPUBLISHED";

    await news.save();

    res.status(200).json({
      success: true,
      message: "News deleted successfully"
    });
  } catch (error) {
    console.error("Delete news error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

export const getNewsStats = async (req, res) => {
  try {
    const baseQuery = { isDeleted: false };

    if (req.user.role === "COMMITTEE") {
      baseQuery.createdBy = req.user._id;
    }

    const [
      total,
      draft,
      submitted,
      approved,
      rejected,
      changesRequested,
      published,
      unpublished
    ] = await Promise.all([
      News.countDocuments(baseQuery),

      News.countDocuments({
        ...baseQuery,
        approvalStatus: "DRAFT"
      }),

      News.countDocuments({
        ...baseQuery,
        approvalStatus: "SUBMITTED"
      }),

      News.countDocuments({
        ...baseQuery,
        approvalStatus: "APPROVED"
      }),

      News.countDocuments({
        ...baseQuery,
        approvalStatus: "REJECTED"
      }),

      News.countDocuments({
        ...baseQuery,
        approvalStatus: "CHANGES_REQUESTED"
      }),

      News.countDocuments({
        ...baseQuery,
        publicationStatus: "PUBLISHED"
      }),

      News.countDocuments({
        ...baseQuery,
        publicationStatus: "UNPUBLISHED"
      })
    ]);

    return res.status(200).json({
      success: true,
      data: {
        total,
        draft,
        submitted,
        approved,
        rejected,
        changesRequested,
        published,
        unpublished
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch news statistics"
    });
  }
};


export const getNewsApprovalHistory = async (req, res) => {
  try {
    const query = {
      _id: req.params.id,
      isDeleted: false
    };

    if (req.user.role === "COMMITTEE") {
      query.createdBy = req.user._id;
    }

    const news = await News.findOne(query);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News not found"
      });
    }

    const history = await NewsApprovalHistory.find({
      news: news._id
    })
      .populate("performedBy", "name email role")
      .sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      data: history
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch news approval history"
    });
  }
};