
import Lead from "../models/Lead.js";

export const createLead = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      requirements,
      qualificationStatus,
      conversationSummary
    } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Customer name is required"
      });
    }

    const lead = await Lead.create({
      name,
      phone,
      email,
      requirements,
      qualificationStatus,
      conversationSummary
    });

    return res.status(201).json({
      success: true,
      message: "Lead saved successfully",
      lead
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


export const getLeads = async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: leads.length,
      leads
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
