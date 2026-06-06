output "frontend_url" {
  description = "The public URL for the static frontend"
  value       = module.frontend.website_url
}

output "api_url" {
  description = "The URL of the API (Cloud Function)"
  value       = module.api.function_url
}

output "documents_bucket" {
  description = "The GCS bucket for uploading documents"
  value       = module.vertex_search.documents_bucket
}

output "datastore_id" {
  description = "The ID of the Vertex AI Search Datastore"
  value       = module.vertex_search.datastore_id
}
