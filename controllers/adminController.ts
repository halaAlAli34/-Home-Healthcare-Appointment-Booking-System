import { Request, Response } from "express";
import Appointment from "../models/Appointment";
import Service from "../models/Service";

// ACCEPT APPOINTMENT
export const acceptAppointment = async (
  req: Request,
  res: Response
) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      {
        status: "accepted",
      },
      {
        new: true,
      }
    );

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    res.status(200).json(appointment);

  } catch (error) {
    res.status(500).json({
      message: "Failed to accept appointment",
    });
  }
};



// REJECT APPOINTMENT
export const rejectAppointment = async (
  req: Request,
  res: Response
) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      {
        status: "rejected",
      },
      {
        new: true,
      }
    );

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    res.status(200).json(appointment);

  } catch (error) {
    res.status(500).json({
      message: "Failed to reject appointment",
    });
  }
};

// DASHBOARD STATS
export const getDashboardStats = async (
  req: Request,
  res: Response
) => {
  try {

    const today = new Date()
      .toISOString()
      .split("T")[0];


    const currentMonth =
      new Date().getMonth();


    // Pending appointments
    const pendingAppointments =
      await Appointment.countDocuments({
        status: "pending",
      });



    // Today's accepted visits
    const todaysVisits =
      await Appointment.countDocuments({
        date: today,
        status: "accepted",
      });



    // Active services
    const activeServices =
      await Service.countDocuments({
        active: true,
      });



    // Revenue this month
    const appointments =
      await Appointment.find({
        status: "accepted",
      });



    let revenue = 0;


    for (const appointment of appointments) {

      const appointmentDate =
        new Date(appointment.createdAt);


      if (
        appointmentDate.getMonth() === currentMonth
      ) {

        const service =
          await Service.findOne({
            name: appointment.serviceName,
          });


        if (service) {
          revenue += service.price;
        }
      }
    }



    res.status(200).json({
      pendingAppointments,
      todaysVisits,
      activeServices,
      revenue,
    });


  } catch (error) {

    res.status(500).json({
      message: "Failed to load dashboard stats",
    });

  }
};