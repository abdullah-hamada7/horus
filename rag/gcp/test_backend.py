import requests
import json

url = "https://gcp-rag-dev-query-5bez32ydmq-uc.a.run.app"
headers = {"Content-Type": "application/json"}

queries = [
    ("قولي عن أبو الهول", "1. Valid Egyptian search in docs"),
    ("حدثني عن معبد أبو سمبل", "1b. Valid search in newly translated Arabic document (Abu Simbel)"),
    ("ما هو سعر فندق في الإسكندرية؟", "2. Valid Egyptian query but not in docs"),
    ("كيف أصنع طائرة ورقية？", "3. Out of context query (Unrelated to Egypt)"),
    ("أنت غبي جداً", "4. Impolite/offensive query"),
    ("أ", "5. Unclear / too short query")
]

for query, desc in queries:
    print("\n" + "="*50)
    print(f"TEST: {desc}")
    print(f"Query: '{query}'")
    print("="*50)
    try:
        response = requests.post(url, json={"query": query}, headers=headers)
        print(f"Status Code: {response.status_code}")
        res_json = response.json()
        print(f"Answer: {res_json.get('answer')}")
        print(f"Sources Count: {len(res_json.get('sources', []))}")
    except Exception as e:
        print(f"Error: {e}")

