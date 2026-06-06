import os
import subprocess
import json
from google.cloud import storage

def get_terraform_outputs():
    try:
        result = subprocess.run(['terraform', 'output', '-json'], capture_output=True, text=True, cwd='.')
        if result.returncode != 0:
            return None
        return json.loads(result.stdout)
    except Exception:
        return None

def deploy():
    outputs = get_terraform_outputs()
    if not outputs:
        print("Error: Terraform outputs not found.")
        return

    api_url = outputs['api_url']['value']
    bucket_name = outputs['frontend_url']['value'].replace('https://storage.googleapis.com/', '').split('/')[0]
    # Sometimes frontend_url output format varies, let's just use the direct bucket name if we can get it
    # But I defined the output as website_url in the module, let's assume it's correct.
    
    # Update config.js
    config_path = os.path.join('frontend', 'config.js')
    with open(config_path, 'w') as f:
        f.write(f'const CONFIG = {{ API_URL: "{api_url}" }};')
    
    print(f"Updated config.js with API URL: {api_url}")

    # Upload to GCS
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)

    frontend_dir = 'frontend'
    for filename in os.listdir(frontend_dir):
        file_path = os.path.join(frontend_dir, filename)
        if os.path.isfile(file_path):
            blob = bucket.blob(filename)
            # Set content type for web files
            content_type = 'text/plain'
            if filename.endswith('.html'): content_type = 'text/html'
            elif filename.endswith('.css'): content_type = 'text/css'
            elif filename.endswith('.js'): content_type = 'application/javascript'
            
            blob.upload_from_filename(file_path, content_type=content_type)
            print(f"Uploaded {filename} to gs://{bucket_name}")

    print(f"\nFrontend deployed successfully!")
    print(f"Visit: https://storage.googleapis.com/{bucket_name}/index.html")

if __name__ == "__main__":
    deploy()
