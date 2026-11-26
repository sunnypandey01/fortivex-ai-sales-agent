
import { generateSalesReply } from "../services/aiService.js";
import Lead from "../models/Lead.js";
import Appointment from "../models/Appointment.js";

const normalizeTime = (time) => {
  if (!time) return "";

  const value = time.trim().toUpperCase();
  const match = value.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/);

  if (!match) return value;

  let hours = Number(match[1]);
  const minutes = match[2];
  const period = match[3];

  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  return `${String(hours).padStart(2, "0")}:${minutes}`;
};

export const chatWithAI = async (req, res) => {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Conversation messages are required"
      });
    }

    const { reply, leadData } = await generateSalesReply(messages);

    let savedLead = null;

    if (leadData.name && (leadData.email || leadData.phone)) {
      const filter = leadData.email
        ? { email: leadData.email.toLowerCase() }
        : { phone: leadData.phone };

      savedLead = await Lead.findOneAndUpdate(
        filter,
        { $set: leadData },
        {
          new: true,
          upsert: true,
          runValidators: true,
          setDefaultsOnInsert: true
        }
      );
    }

    let savedAppointment = null;
    let finalReply = reply;

    if (
      leadData.appointmentRequested === true &&
      leadData.name &&
      leadData.appointmentDate &&
      leadData.appointmentTime
    ) {
      const identity = leadData.email
        ? { email: leadData.email.toLowerCase() }
        : leadData.phone
        ? { phone: leadData.phone }
        : { name: leadData.name };

      // Check existing appointments for this customer on this date.
      const existingAppointments = await Appointment.find({
        ...identity,
        date: leadData.appointmentDate
      });

      const requestedTime = normalizeTime(leadData.appointmentTime);

      savedAppointment = existingAppointments.find(
        (appointment) =>
          normalizeTime(appointment.time) === requestedTime
      );

      // Create only if the same booking does not already exist.
      if (!savedAppointment) {
        savedAppointment = await Appointment.create({
          name: leadData.name,
          email: leadData.email,
          phone: leadData.phone,
          date: leadData.appointmentDate,
          time: requestedTime,
          purpose: leadData.appointmentPurpose
        });
      }

      finalReply += `\n\nYour appointment is scheduled for ${leadData.appointmentDate} at ${savedAppointment.time}.`;
    }

    return res.status(200).json({
      success: true,
      reply: finalReply,
      leadSaved: Boolean(savedLead),
      lead: savedLead,
      appointmentSaved: Boolean(savedAppointment),
      appointment: savedAppointment
    });

  } catch (error) {
    console.error("AI controller error:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
