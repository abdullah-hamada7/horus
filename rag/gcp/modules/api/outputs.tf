output "function_url" {
  value = google_cloudfunctions2_function.query_function.service_config[0].uri
}
