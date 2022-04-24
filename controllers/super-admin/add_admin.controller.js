const SuperAdmin = require("../../models/admins/super-admin.schema");
const Admin = require("../../models/admins/admin.schema");

module.exports.addAdmin = async (req, res) => {
  let superAdminId = req.params.superAdminId;
  console.log(req.user);
  console.log(req.params);

  try {
    let superAdmin = await SuperAdmin.findOne({ _id: superAdminId });
    if (!superAdmin) console.log("cannot find superadmin");
    let admin = await Admin.create(req.body);
    console.log(admin);
  } catch (error) {}
};
