output "instance_public_ip" {
  description = "The public IP address of the deployed EC2 server."
  value       = aws_instance.app_server.public_ip
}

output "app_url" {
  description = "The public URL to access the Virtual Egyptian Museum application."
  value       = "http://${aws_instance.app_server.public_ip}"
}

output "ssh_connection" {
  description = "Helper SSH connection command."
  value       = "ssh -i <path-to-your-dev.pem> ubuntu@${aws_instance.app_server.public_ip}"
}

output "deploy_hint" {
  description = "Instructions to deploy the application codebase using the deploy.ps1 script."
  value       = "Run: .\\deploy.ps1 -ServerIp ${aws_instance.app_server.public_ip} -KeyPath <path-to-your-dev.pem>"
}

output "database_url" {
  description = "The database connection URL."
  value       = var.database_url
  sensitive   = true
}

output "rag_api_url" {
  description = "The RAG query API URL."
  value       = var.rag_api_url
}

output "admin_passcode" {
  description = "The admin passcode."
  value       = var.admin_passcode
  sensitive   = true
}
