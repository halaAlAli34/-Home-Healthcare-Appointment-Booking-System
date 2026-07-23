import { Request, Response } from "express";
import Service from "../models/Service";


// GET ALL SERVICES
export const getServices = async (
  req: Request,
  res: Response
) => {
  try {
    const services = await Service.find();

    res.status(200).json(services);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch services",
    });
  }
};


// CREATE SERVICE
export const createService = async (
  req: Request,
  res: Response
) => {
  try {

    const service = await Service.create(req.body);

    res.status(201).json(service);

  } catch (error) {

    res.status(500).json({
      message: "Failed to create service",
    });

  }
};

export const updateService = async (
  req: Request,
  res: Response
) => {
  try {

    const service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );


    if (!service) {
      return res.status(404).json({
        message: "Service not found",
      });
    }


    res.status(200).json(service);


  } catch (error) {

    res.status(500).json({
      message: "Failed to update service",
    });

  }
};



// DELETE SERVICE
export const deleteService = async (
  req: Request,
  res: Response
) => {
  try {

    const service = await Service.findByIdAndDelete(
      req.params.id
    );


    if (!service) {
      return res.status(404).json({
        message: "Service not found",
      });
    }


    res.status(200).json({
      message: "Service deleted successfully",
    });


  } catch (error) {

    res.status(500).json({
      message: "Failed to delete service",
    });

  }
};