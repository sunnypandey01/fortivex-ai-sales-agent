import Appointment from "../models/Appointment.js";

export const createAppointment = async (req, res) => {
  try {
    const { name, email, phone, date, time, purpose } = req.body;

    if (!name || !date || !time) {
      return res.status(400).json({
        success: false,
        message: "Name, date and time are required"
      });
    }

    const appointment = await Appointment.create({
      name, email, phone, date, time, purpose
    });

    return res.status(201).json({
      success: true,
      message: "Appointment scheduled successfully",
      appointment
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({
      date: 1,
      time: 1
    });

    return res.status(200).json({
      success: true,
      count: appointments.length,
      appointments
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};