const rolePermissions = {
    admin: ["manage_users", "view_reports", "delete_tickets", "edit_tickets"],
    user: ["create_ticket", "view_own_ticket"]
  };
  
  module.exports = rolePermissions;
  