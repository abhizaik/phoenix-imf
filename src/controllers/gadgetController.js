const prisma = require('../models/prismaClient');
const { generateCodename } = require('../services/codenameService');
const { generateConfirmationCode } = require('../services/random');
const { AppError } = require('../middleware/errorMiddleware');

exports.getAllGadgets = async (req, res, next) => {
  try {
    const { status } = req.query;

    // Validate status
    const allowedStatuses = ["Available", "Deployed", "Destroyed", "Decommissioned"];
    if (status && !allowedStatuses.includes(status)) {
      return next(new AppError("Invalid status. Allowed values: Available, Deployed, Destroyed, Decommissioned", 400));
    }

    // Fetch data
    const gadgets = await prisma.gadget.findMany({
      where: status ? { 
        status: status
      } : {},
      select: {
        id: true,
        name: true,
        status: true
      }
    });

    // Add mission success probability 
    const result = gadgets.map(gadget => ({
      ...gadget,
      missionSuccessProbability: Math.floor(Math.random() * 21) + 80 // We only use wepons with high success rate ;)
    }));
    
    const response = {
      message: result.length > 0 ? "Gadget(s) fetched successfully" : "No gadgets found",
      data: result
    };
    
    return res.json(response);

  } catch (error) {
    return next(error);
  }
};


exports.createGadget = async (req, res, next) => {
  try {
    // Naming the Gadget
    const gadgetName = await generateCodename();

    const gadget = await prisma.gadget.create({
      data: {
        name: gadgetName,
      }
    });

    const response = {
      message: "Gadget created successfully",
      data: gadget
    };
    return res.status(201).json(response);

  } catch (error) {
    return next(error);
  }
};


exports.decommissionGadget = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if the gadget exists
    const existingGadget = await prisma.gadget.findUnique({
      where: { id }
    });

    if (!existingGadget) {
      return next(new AppError("Gadget not found", 404));
    }

    // Check if the gadget is already decommissioned
    if (existingGadget.status === "Decommissioned") {
      //  res.status(400).json({ error: "Gadget is already decommissioned" });
      return res.json({
        message: "Gadget is already decommissioned",
        data: existingGadget
      });
    }

    // Update the gadget to mark it as "Decommissioned"
    const updatedGadget = await prisma.gadget.update({
      where: { id },
      data: {
        status: "Decommissioned",
        decommissionedAt: new Date()
      }
    });

    res.json({
      message: "Gadget successfully decommissioned",
      data: updatedGadget
    });
  } catch (error) {
    return next(error);
  }
};


exports.updateGadget = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, status } = req.body;

    // Ensure at least one field (name or status) is provided
    if (!name && !status) {
      return next(new AppError("At least one field (name or status) must be provided", 400));
    }

    // Check if the gadget exists
    const existingGadget = await prisma.gadget.findUnique({
      where: { id }
    });

    if (!existingGadget) {
      return next(new AppError("Gadget not found", 404));
    }

    // Check if gadget is already destroyed
    if (existingGadget.status === 'Destroyed') {
      return next(new AppError('Cannot update a destroyed gadget', 400));
    }
    
    // Allowed statuses
    const allowedStatuses = ["Available", "Deployed", "Destroyed", "Decommissioned"];
    if (status && !allowedStatuses.includes(status)) {
      return next(new AppError("Invalid status. Allowed values: Available, Deployed, Destroyed, Decommissioned", 400));
    }

    // If both name & status are unchanged
    if (existingGadget.name === name && existingGadget.status === status) {
      return res.status(200).json({ message: "Gadget is already up to date", data: existingGadget });
    }

    const updateData = {};

    // Update name if provided
    if (name && existingGadget.name !== name) {
      updateData.name = name;
    }

    // Handle status changes
    if (status && existingGadget.status !== status) {
      updateData.status = status;
      if (status === "Decommissioned") {
        // If marking as "Decommissioned", set the current timestamp
        updateData.decommissionedAt = new Date();
      }
    }

    // If updateData is empty (no changes)
    if (Object.keys(updateData).length === 0) {
      return res.status(200).json({ message: "No changes were made", data: existingGadget });
    }

    // Update the gadget
    const updatedGadget = await prisma.gadget.update({
      where: { id },
      data: updateData
    });

    return res.json({
      message: "Gadget successfully updated",
      data: updatedGadget
    });
  } catch (error) {
    return next(error);
  }
};


exports.selfDestruct = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if the gadget exists
    const existingGadget = await prisma.gadget.findUnique({
      where: { id }
    });

    if (!existingGadget) {
      return next(new AppError("Gadget not found", 404));
    }


    if (existingGadget.status === "Destroyed") {
      return res.json({
        message: "Gadget is already destroyed",
        data: {
          id: existingGadget.id,
          name: existingGadget.name,
          status: existingGadget.status,
        }
      });
    }


    // Generate a random 6-digit confirmation code
    const confirmationCode = generateConfirmationCode();

    // Update gadget status to "Destroyed"
    const updatedGadget = await prisma.gadget.update({
      where: { id },
      data: {
        status: "Destroyed",
      }
    });

    res.json({
      message: "Self-destruct sequence activated",
      data: {
        id: updatedGadget.id,
        name: updatedGadget.name,
        status: updatedGadget.status,
        confirmationCode,
      }
    });
  } catch (error) {
    return next(error);
  }
};