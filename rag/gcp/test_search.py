from google.cloud import discoveryengine_v1 as discoveryengine
import json

project_id = "gcp-ai-494313"
location = "global"
datastore_id = "gcp-rag-dev-ds-unosbi63"

client = discoveryengine.SearchServiceClient()
serving_config = client.serving_config_path(
    project=project_id,
    location=location,
    data_store=datastore_id,
    serving_config="default_config",
)

query = "أبو الهول"
search_request = discoveryengine.SearchRequest(
    serving_config=serving_config,
    query=query,
    page_size=5,
    content_search_spec=discoveryengine.SearchRequest.ContentSearchSpec(
        extractive_content_spec=discoveryengine.SearchRequest.ContentSearchSpec.ExtractiveContentSpec(
            max_extractive_answer_count=3,
            max_extractive_segment_count=2
        )
    ),
)

try:
    response = client.search(search_request)
    print(f"Results for search: '{query}'")
    for i, result in enumerate(response.results):
        doc = result.document
        title = doc.derived_struct_data.get('title', 'N/A') if doc.derived_struct_data else 'N/A'
        ext_answers = []
        if doc.derived_struct_data and 'extractive_answers' in doc.derived_struct_data:
            for ans in doc.derived_struct_data['extractive_answers']:
                ext_answers.append(ans.get('content', ''))
        print(f"{i+1}. ID: {doc.id}, Title: {title}")
        print(f"   Extractive Answers: {ext_answers}")
except Exception as e:
    print(f"Error: {e}")

