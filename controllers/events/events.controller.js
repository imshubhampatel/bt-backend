const Event = require("../../models/events/event.schema");

module.exports.createEvent = async (req, res) => {
  const {
    title,
    eventFees,
    eventDate,
    eventStartTime,
    eventEndTime,
    maxMembers,
    numberOfGirls,
    isGirlMendatory,
    facultyNames,
    vanue,
  } = req.body;

  try {
    const event = await Event.findOne({ title });
    if (event !== null) {
      return res.status(400).json({
        success: false,
        message: "Event already exists",
      });
    }

    const newEvent = new Event({
      title,
      eventFees,
      maxMembers,
      isGirlMendatory,
      facultyNames,
      numberOfGirls,
      eventDate,
      eventStartTime,
      eventEndTime,
      vanue,
    });

    await newEvent.save();
    return res.json({
      success: true,
      data: { event: newEvent },
      message: "Event is created",
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ success: false, error, message: "Internal Server Error" });
  }
};

module.exports.getAllEvents = async (req, res) => {
  try {
    let allEvents = await Event.find();
    return res.json({
      success: true,
      data: allEvents,
      message: "All events are fetched",
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ success: false, error, message: "Internal Server Error" });
  }
};
