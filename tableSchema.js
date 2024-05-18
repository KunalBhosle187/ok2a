export const jsonTable = [
  {
    asset:
      "asset(asset_id, asset_name, fk_asset_group_id, fk_asset_primary_owner_id, fk_asset_secondary_owner_id, fk_asset_issue_mgr_id, fk_asset_type, asset_hosted_environment, fk_asset_location_name)",
  },
  {
    asset_group:
      "asset_group(asset_group_id, asset_group_name, fk_asset_group_business_unit, fk_asset_group_business_sub_unit, fk_asset_group_location)",
  },
  {
    asset_issuelog_report:
      "asset_issuelog_report(report_id, report_name, fk_main_report_id, fk_template_id)",
  },
  {
    config_review_template:
      "config_review_template(cr_template_id, template_name, fk_asset_test_type, scanner_type)",
  },
  {
    current_asset_issues:
      "current_asset_issues(asset_issue_id, fk_asset_id, fk_master_issue_id, issue_name, fk_reporting_status, issue_status, issue_open_since, issue_counter_date, issue_status_change_date, fk_issue_manager)",
  },
  {
    master_asset_criticality_values:
      "master_asset_criticality_values(id, label, color)",
  },
  {
    master_asset_test_type_table:
      "master_asset_test_type_table(asset_test_type_id, asset_test_type, issue_table_name)",
  },
  {
    master_issues:
      "master_issues(issue_id, issue_name, fk_asset_test_type, fk_cr_template_id, issue_riskrating)",
  },
  {
    master_location: "master_location(location_name)",
  },
  {
    master_reporting_status: "master_reporting_status(status_id, status_name)",
  },
  {
    master_request_type:
      "master_request_type(master_request_type_code, master_request_type_name)",
  },
  {
    master_risk_ratings_values: "master_risk_ratings_values(id, name, color)",
  },
  {
    request:
      "request(request_id, fk_requested_by, fk_master_request_type_code, request_status)",
  },
  {
    security_test_request:
      "security_test_request(test_request_id, test_compliance, test_assigned_on, test_start_date, test_end_date, test_due_date, test_stage, fk_request_id, fk_scheduled_by)",
  },
  {
    unique_app_issues: "unique_app_issues(fk_issue_id, app_issue_description)",
  },
  {
    unique_asset_issues:
      "unique_asset_issues(asset_issue_id, fk_asset_id, fk_master_issue_id, issue_name, fk_reporting_status, issue_status, issue_open_since, issue_counter_date, issue_status_change_date, fk_issue_manager)",
  },
  {
    unique_config_issues:
      "unique_config_issues(fk_issue_id, config_issue_description)",
  },
  {
    unique_pt_issues: "unique_pt_issues(fk_issue_id, pt_issue_description)",
  },
  {
    user: "user(id, username, fullname, designation, email)",
  },
];
