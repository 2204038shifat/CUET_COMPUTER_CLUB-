import Project from "../models/Project.js";

export const createProject = async (req, res) => {
  try {
    const {
      title,
      slug,
      shortDescription,
      description,
      coverImage,
      technologies,
      projectUrl,
      githubUrl,
      category
    } = req.body;

    if (!title || !slug || !description) {
      return res.status(400).json({
        success: false,
        message: "Title, slug and description are required"
      });
    }

    const existingProject = await Project.findOne({
      slug: slug.toLowerCase().trim(),
      isDeleted: false
    });

    if (existingProject) {
      return res.status(409).json({
        success: false,
        message: "Project slug already exists"
      });
    }

    const project = await Project.create({
      title,
      slug: slug.toLowerCase().trim(),
      shortDescription,
      description,
      coverImage,
      technologies,
      projectUrl,
      githubUrl,
      category,
      createdBy: req.user._id
    });

    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create project"
    });
  }
};