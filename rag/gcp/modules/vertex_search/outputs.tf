output "documents_bucket" {
  value = google_storage_bucket.docs_bucket.name
}

output "datastore_id" {
  value = google_discovery_engine_data_store.kb_datastore.data_store_id
}

output "engine_id" {
  value = google_discovery_engine_search_engine.kb_search_engine.engine_id
}

output "location_id" {
  value = google_discovery_engine_data_store.kb_datastore.location
}
