import os
import json
import functions_framework
from google.cloud import discoveryengine_v1 as discoveryengine

SYSTEM_PROMPT = (
    "أنت حورس (حورس)، مرشد سياحي مصري ذكي، خبير، وودود للغاية.\n"
    "مهمتك الأساسية هي الإجابة عن سؤال المستخدم بشكل كامل ودقيق ومفصل بناءً على المعلومات الواردة في المستندات المرفقة.\n"
    "يرجى الالتزام بالتعليمات التالية بدقة لتقديم تجربة ممتازة:\n"
    "1. أجب عن سؤال المستخدم مباشرة باستخدام الحقائق الموجودة في المستندات أولاً وقبل كل شيء. لا تكتفِ بالترحيب أو التعريف بنفسك فقط، بل قدم إجابة مفصلة عما سأل عنه المستخدم (مثل أبو الهول، الأهرامات، الطعام، إلخ).\n"
    "2. حافظ على نبرة دافئة، ترحيبية، ومحبة لمصر وثقافتها وتاريخها العريق.\n"
    "3. يجب أن تكون الإجابة باللغة العربية الفصحى الواضحة والجميلة.\n"
    "4. إذا لم تكن المعلومات المطلوبة موجودة في المستندات المرفقة، ولكن السؤال يتعلق بمصر (تاريخها، معالمها، سياحتها، ثقافتها، أو أكلها)، فيمكنك الإجابة عن السؤال بدقة وتفصيل بناءً على معلوماتك العامة كمرشد سياحي خبير ومطلع، مع الإشارة بلطف وذكاء إلى أن هذه تفاصيل إضافية مكملة لدليلك المكتوب. أما إذا كان السؤال خارج سياق مصر تماماً، فاعتذر بلطف ووضح أنك مرشد سياحي مخصص لمصر وتاريخها فقط.\n"
    "5. لا تقم بتكرار نص الترحيب التعريفي الطويل في كل إجابة. عرف بنفسك كـ 'حورس مرشدك السياحي' باختصار شديد فقط إذا لزم الأمر، وركز بالكامل على الإجابة عن السؤال."
)


def check_query_intercept(query: str) -> str:
    query_clean = query.strip().lower()
    
    # List of common Arabic offensive words / impolite expressions
    impolite_keywords = [
        "غبى", "غبي", "حمار", "كلب", "يا كلب", "يا حمار", "شتم", "شتيمة", 
        "سخيف", "سيء", "فاشل", "غباء", "حقير", "ابله", "أبله"
    ]
    
    # Check if any impolite word is in query
    if any(word in query_clean for word in impolite_keywords):
        return (
            "أهلاً بك! بصفتي حورس، مرشدك السياحي، يسعدني دائماً الإجابة على استفساراتك بأدب واحترام. "
            "يرجى صياغة سؤالك بطريقة لبقة ومحترمة لنستكشف سوياً جمال مصر وتاريخها العريق."
        )
    
    # Extensive list of Egypt-related keywords (landmarks, historical figures, cities, food, etc.)
    egypt_keywords = [
        # Arabic core & locations
        "مصر", "قاهرة", "جيزة", "أهرام", "اهرام", "أبو الهول", "ابو الهول", "نيل", 
        "أقصر", "اقصر", "أسوان", "اسوان", "معبد", "فراعنة", "فرعون", "سياحة", "سفر", 
        "رحلة", "تاريخ", "متحف", "شرم", "غردقة", "دهب", "سيوة", "صحراء", "أكل", "اكل", 
        "كشري", "فلوكة", "خان الخليلي", "مترو", "تاجير", "تأشيرة", "فيزا", "فندق", 
        "طيران", "حورس", "اسكندرية", "إسكندرية", "بحر",
        # Added broad Egyptian tourist & historical terms
        "سمبل", "ابو سمبل", "أبو سمبل", "الملوك", "الملكات", "الكرنك", "فيلة", "حتشبسوت", 
        "خوفو", "خفرع", "منقرع", "سقارة", "دهشور", "مومياء", "مومياوات", "تحرير", "التحرير", 
        "صلاح الدين", "القلعة", "محمد علي", "الأزهر", "الازهر", "الزمالك", "الجزيرة", 
        "كورنيش", "المعلقة", "بابل", "سرجة", "عزرا", "كنيسة", "كنائس", "مسجد", "مساجد", 
        "توت عنخ", "توت عنخ آمون", "توت عنخ امون", "رمسيس", "نفرتيتي", "لوحة الحلم", "تحتمس", 
        "الدرج العظيم", "مركب خوفو", "فول", "طعمية", "فلافل", "ملوخية", "محشي", "شاورما", 
        "كباب", "كفتة", "بسبوسة", "كنافة", "أم علي", "ام علي", "سحلب", "كركديه", "بخشيش", 
        "جنيه", "شريحة", "أورنج", "فودافون", "اتصالات", "وي", "أوبر", "كريم", "مرسى علم", 
        "الجونة", "غطس", "غوص", "راس محمد", "رأس محمد", "البلو هول", "واحة", "واحات", 
        "البيضاء", "السوداء", "كاترين", "موسى", "الرمال", "كليوباترا", "المصري الكبير",
        # English equivalents/terms for transliterated queries
        "egypt", "pyramid", "sphinx", "cairo", "luxor", "aswan", "museum", "nile", 
        "karnak", "ramses", "gem", "hotel", "food", "koshary", "flight", "visa", 
        "sharm", "hurghada", "dahab", "siwa", "desert", "sinai", "abu simbel", 
        "temple", "kings", "mummy", "mummies", "tahrir", "citadel", "mosque", 
        "church", "synagogue", "khan", "zamalek"
    ]
    
    is_related_to_egypt = any(word in query_clean for word in egypt_keywords)
    
    # Check for short / unclear / meaningless queries
    words = query_clean.split()
    if len(words) == 0 or len(query_clean) < 3 or (len(words) == 1 and not is_related_to_egypt):
        return (
            "أهلاً بك! أنا حورس مرشدك السياحي. لم يتبين لي مقصدك بوضوح من هذا السؤال. "
            "هل يمكنك إعادة كتابة طلبك بوصف أفضل أو تفاصيل أكثر (مثلاً: المعالم التي تود زيارتها، "
            "أو موضوع معين في تاريخ مصر) حتى أتمكن من إرشادك بشكل مثالي؟"
        )
        
    if not is_related_to_egypt:
        return (
            "أهلاً بك! أنا حورس، مرشدك السياحي المخصص لمصر فقط 🇪🇬. "
            "سؤالك الكريم يبدو خارجاً عن السياق ؛ حيث إنني متخصص حصرياً في تاريخ مصر، "
            "ثقافتها، ومعالمها السياحية الجميلة. يسعدني جداً الإجابة على أي سؤال يخص رحلتك إلى أرض الكنانة!"
        )
        
    return None


@functions_framework.http
def query_kb(request):
    # Set CORS headers for preflight requests
    if request.method == "OPTIONS":
        headers = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Max-Age": "3600",
        }
        return ("", 204, headers)

    # Set CORS headers for the main request
    headers = {"Access-Control-Allow-Origin": "*"}

    try:
        request_json = request.get_json(silent=True)
        query = request_json.get("query") if request_json else None

        if not query:
            return (json.dumps({"error": "No query provided"}), 400, headers)

        # Pre-intercept query checks for safety, out-of-context, or unclear inputs
        intercepted_message = check_query_intercept(query)
        if intercepted_message:
            return (json.dumps({"answer": intercepted_message, "sources": []}), 200, headers)

        project_id = os.environ.get("PROJECT_ID")
        location = os.environ.get("LOCATION_ID", "global")
        datastore_id = os.environ.get("DATASTORE_ID")

        client = discoveryengine.SearchServiceClient()

        serving_config = client.serving_config_path(
            project=project_id,
            location=location,
            data_store=datastore_id,
            serving_config="default_config",
        )

        search_request = discoveryengine.SearchRequest(
            serving_config=serving_config,
            query=query,
            page_size=5,
            content_search_spec=discoveryengine.SearchRequest.ContentSearchSpec(
                summary_spec=discoveryengine.SearchRequest.ContentSearchSpec.SummarySpec(
                    summary_result_count=5,
                    include_citations=True,
                    model_prompt_spec=discoveryengine.SearchRequest.ContentSearchSpec.SummarySpec.ModelPromptSpec(
                        preamble=SYSTEM_PROMPT
                    )
                ),
                extractive_content_spec=discoveryengine.SearchRequest.ContentSearchSpec.ExtractiveContentSpec(
                    max_extractive_answer_count=3,
                    max_extractive_segment_count=2
                )
            ),
        )

        response = client.search(search_request)

        # Extract sources first to check if any results were found
        sources = []
        for result in response.results:
            doc = result.document
            source_link = doc.derived_struct_data.get("link", "N/A") if doc.derived_struct_data else "N/A"
            
            # Robust extraction of content snippets/extractive answers
            snippet_text = ""
            if doc.derived_struct_data:
                if "extractive_answers" in doc.derived_struct_data:
                    answers = doc.derived_struct_data["extractive_answers"]
                    if answers:
                        snippet_text = answers[0].get("content", "")
                elif "extractive_segments" in doc.derived_struct_data:
                    segments = doc.derived_struct_data["extractive_segments"]
                    if segments:
                        snippet_text = segments[0].get("content", "")
                elif "snippets" in doc.derived_struct_data:
                    snippets = doc.derived_struct_data["snippets"]
                    if snippets:
                        snippet_text = snippets[0].get("snippet", "")

            sources.append(
                {
                    "title": doc.derived_struct_data.get("title", "Document") if doc.derived_struct_data else "Document",
                    "snippet": snippet_text,
                    "link": source_link,
                }
            )

        # Extract answer from summary with proper fallback logic
        if not sources:
            answer = (
                "أهلاً بك! لقد بحثت في دليلي السياحي المعتمد لمصر. هذا الاستفسار غير مغطى بالتفصيل في مستنداتي المكتوبة، "
                "ولكن بصفتي حورس مرشدك الخبير، يسعدني الإجابة عن أي أسئلة تخص الأهرامات، معابد الأقصر وأسوان، "
                "أكلات مصر اللذيذة كالكشري، وتفاصيل الفنادق وتأشيرات السفر المتاحة في دليلي."
            )
        elif response.summary and response.summary.summary_text:
            answer = response.summary.summary_text
        else:
            # Fallback to the top extractive answer or snippet if summary generation is empty
            top_snippet = None
            for src in sources:
                if src.get("snippet"):
                    top_snippet = src["snippet"]
                    break
            
            if top_snippet:
                answer = (
                    f"أهلاً بك! لقد بحثت في دليلي وعثرت على التفاصيل التالية المباشرة:\n\n"
                    f"{top_snippet}\n\n"
                    f"يمكنك أيضاً مراجعة المصادر المرجعية المرفقة أدناه لمزيد من التفاصيل."
                )
            else:
                answer = "أهلاً بك! لقد عثرت على مستندات ذات صلة في دليلي السياحي، ولكن لم أتمكن من تلخيصها بشكل كامل. يمكنك الاطلاع على المصادر أدناه."

        return (json.dumps({"answer": answer, "sources": sources}), 200, headers)

    except Exception as e:
        print(f"Error: {e}")
        return (json.dumps({"error": str(e)}), 500, headers)

