from flask import Blueprint, request
from datetime import datetime, timedelta
from spacy.matcher import PhraseMatcher
from elasticsearch import Elasticsearch
import dateparser
import spacy
import json

es = Elasticsearch('http://mongo.chinmaydesai.site:9200')
print("Connected to ElasticSearch\t", es.ping())

INDEX_NAME = "unverified_posts"

search = Blueprint("search", __name__)

print("Loading NLP...")
nlp = spacy.load("en_core_web_lg")
print("Loaded!")

disaster_keywords = {
    "natural_disasters": [
        "earthquake", "flood", "tsunami", "landslide", "avalanche", 
        "hurricane", "typhoon", "cyclone", "tornado", "storm", 
        "wildfire", "forest fire", "drought", "volcano", "eruption"
    ],
    "man_made_disasters": [
        "explosion", "fire", "chemical spill", "gas leak", 
        "building collapse", "pollution", "oil spill", 
        "plane crash", "train derailment", "car crash"
    ],
    "violence_and_security": [
        "shooting", "attack", "terrorist", "riot", "protest", 
        "bomb", "hostage", "war", "gunfire", "looting", 
        "explosion", "armed"
    ],
    "health_disasters": [
        "pandemic", "epidemic", "outbreak", "infection", 
        "disease", "quarantine", "virus", "vaccine", 
        "contamination", "poisoning"
    ],
    "infrastructure_disasters": [
        "power outage", "blackout", "bridge collapse", 
        "roadblock", "traffic", "closure", "train derailment"
    ]
}
matcher = PhraseMatcher(nlp.vocab)
disasters = []
for keyword in disaster_keywords:
    disasters += disaster_keywords[keyword]
patterns = [nlp.make_doc(text) for text in disasters] 
matcher.add("DISASTER", None, *patterns)


def build_date_range_filter(start_date, end_date=None):
    if not start_date:
        return None

    date_filter = {"range": {"date": {}}}
    date_filter["range"]["date"]["gte"] = start_date.strftime("%Y-%m-%d")

    if end_date:
        date_filter["range"]["date"]["lte"] = end_date.strftime("%Y-%m-%d")

    return date_filter


def detect_priority(phrase):
    priority_keywords = {
    "high": [
        "high", "emergency", "urgent", "sos", "critical", "immediate", "life-threatening",
        "evacuate", "high alert", "rescue", "catastrophic"
    ],
    "medium": [
        "medium", "important", "warning", "caution", "alert", "moderate", "significant",
        "serious", "needs attention"
    ],
    "low": [
        "low", "update", "minor", "low priority", "routine", "informational",
        "no immediate danger"
    ]
}
    phrase_lower = phrase.lower()
    
    if any(keyword in phrase_lower for keyword in priority_keywords["high"]):
        return "high"
    
    elif any(keyword in phrase_lower for keyword in priority_keywords["medium"]):
        return "medium"
    
    elif any(keyword in phrase_lower for keyword in priority_keywords["low"]):
        return "low"
    
    else:
        return None


def detect_disasters(doc):
    lemmatized_doc = []
    for token in doc:
        lemmatized_doc.append(token.lemma_)

    lemmatized_doc = nlp.make_doc(" ".join(lemmatized_doc))

    matches = matcher(lemmatized_doc)

    for match_id, start, end in matches:
        span = lemmatized_doc[start:end]
        return span.text
    
    return None


def preprocess_query(query, entities):
    
    
    doc = nlp(query.lower())
    entities['disaster_type'] = detect_disasters(doc)
    entities['priority'] = detect_priority(query.lower())


    for ent in doc.ents:
        # Location
        if ent.label_ == "GPE":
            entities["location"] = ent.text

        # Date
        elif ent.label_ == "DATE":
            parsed_date = parse_date_range(ent.text)
            if parsed_date:
                entities["date"] = parsed_date

    if "recent" in query.lower():
        entities["date"] = (datetime.now(), None)

    return entities


def parse_date_range(phrase):
    today = datetime.now()

    if "last week" in phrase:
        start_date = today - timedelta(days=today.weekday() + 7)
        end_date = start_date + timedelta(days=6)
    elif "this week" in phrase:
        start_date = today - timedelta(days=today.weekday())
        end_date = min(start_date + timedelta(days=6), today)  # Restrict end_date to today
    elif "past week" in phrase:
        start_date = today - timedelta(days=7)
        end_date = today
    elif "last month" in phrase:
        start_of_this_month = today.replace(day=1)
        end_of_last_month = start_of_this_month - timedelta(days=1)
        start_date = end_of_last_month.replace(day=1)
        end_date = end_of_last_month
    elif "this month" in phrase:
        start_date = today.replace(day=1)
        end_date = today
    elif "past month" in phrase:
        start_date = today - timedelta(days=30)
        end_date = today
    elif "last year" in phrase:
        start_date = today.replace(year=today.year - 1, month=1, day=1)
        end_date = today.replace(year=today.year - 1, month=12, day=31)
    elif "this year" in phrase:
        start_date = today.replace(month=1, day=1)
        end_date = today
    elif "yesterday" in phrase:
        start_date = today - timedelta(days=1)
        end_date = start_date
    elif "last weekend" in phrase:
        last_saturday = today - timedelta(days=today.weekday() + 2)
        last_sunday = last_saturday + timedelta(days=1)
        start_date = last_saturday
        end_date = last_sunday
    elif "this weekend" in phrase:
        last_saturday = today - timedelta(days=today.weekday() + 2)
        last_sunday = last_saturday + timedelta(days=1)
        start_date = last_saturday if last_saturday <= today else None
        end_date = last_sunday if last_sunday <= today else None
    elif "last quarter" in phrase:
        current_quarter = (today.month - 1) // 3 + 1
        start_month = 3 * (current_quarter - 2) + 1
        end_month = start_month + 2
        if start_month <= 0:
            start_month += 12
            end_month += 12
            year = today.year - 1
        else:
            year = today.year
        start_date = datetime(year, start_month, 1)
        end_date = datetime(year, end_month, 1) + timedelta(days=-1)
    elif "past 7 days" in phrase:
        start_date = today - timedelta(days=7)
        end_date = today
    elif "past 30 days" in phrase:
        start_date = today - timedelta(days=30)
        end_date = today
    elif "last 6 months" in phrase:
        six_months_ago = today - timedelta(days=182)
        start_date = six_months_ago.replace(day=1)
        end_date = today
    else:
        # start_date = dateparser.parse(phrase)
        # end_date = None if not start_date or start_date > today else start_date
        start_date, end_date = None, None

    return start_date, end_date


def build_es_query(entities):
    query = {"bool": {"must": [], "filter": []}}

    if entities['query']:
        query["bool"]["must"].append({"match": {"post_body": entities['query']}})

    if entities['disaster_type']:
        query["bool"]["must"].append({"match": {"disaster_type": entities['disaster_type']}})
    
    if entities['location']:
        query["bool"]["must"].append({"match_phrase": {"location": entities['location']}})
    
    if entities['priority']:
        query["bool"]["must"].append({"match_phrase": {"priority": entities['priority']}})

    if entities['date']:
        start_date, end_date= entities['date']
        query["bool"]["filter"].append({
            "range": {
                "date": {
                    "gte": start_date,
                    "lte": end_date
                }
            }
        })
    
    return {"query": query}


def search_elastic_db(es, index, query):
    response = es.search(index=index, body=query)
    return response["hits"]["hits"]


@search.route("/")
def index():
    return "Elastic search pipeline"

@search.post("/elastic")
def elasticSearch():
    entities = {
        "query": None,
        "disaster_type": None,
        "location": None,
        "date": None,
        "priority": None
    }
    print(request.form)
    query_string = request.form.get('query')
    print(True if request.form.get('nlp') else False)
    print(request.form.get('nlp'))
    if request.form.get('nlp', False) == 'false':
        disaster_type = request.form.get('disaster_type')
        location = request.form.get('location')
        date = request.form.get('date')
        try:
            date = dateparser.parse(date)
        except:
            date = None
        print(date, type(date))
        priority = request.form.get('priority')
        entities = {
            "query": query_string,
            "disaster_type": disaster_type,
            "location": location,
            "date": date,
            "priority": priority
        }
        print("Manuel: ", entities)
    else:
        entities = preprocess_query(query_string, entities)
        print(entities)

    es_query = build_es_query(entities)
    print(es_query)

    results = search_elastic_db(es, INDEX_NAME, es_query)

    entities_formatted = entities
    entities_formatted['date'] = " to ".join(date.strftime("%d-%m-%Y") for date in entities_formatted['date'] if date) if entities_formatted['date'] else None

    return {"parameters" : entities, "results": [result['_source'] for result in results]}

    # print(query_string, doc_type, location, date_range, priority)
    # return {'output': [query_string, location, doc_type, date_range, priority]} 

@search.get("/autocomplete")
def esautocomplete():
    query = request.args.get('query')
    baseQuery ={
        "_source": [],
        "size": 0,
        "min_score": 0.5,
        "query": {
            "bool": {
                "must": [
                    {
                        "match_phrase_prefix": {
                            "post_body": {
                                "query": "{}".format(query)
                            }
                        }
                    }
                ],
                "filter": [],
                "should": [],
                "must_not": []
            }
        },
        "aggs": {
            "auto_complete": {
                "terms": {
                    "field": "post_body.keyword",
                    "order": {
                        "_count": "desc"
                    },
                    "size": 25
                }
            }
        }
    }

    print(baseQuery)
    res = es.search(index=INDEX_NAME, body=baseQuery)
    return dict(res)

@search.post("/add-post")
def addPost():
    try:
        template = {
            "post_title": "",
            "post_body": "",
            "date": None,
            "likes": 0,
            "retweets": 0,
            "post_image_url": "",
            "post_image_b64": "",
            "location": "",
            "url": "",
            "disaster_type": "",
            "source": "AapdaMitra App",
        }

        data = request.json
        for key in data.keys():
            template[key] = data[key]

        print(template)

        es.index(index=INDEX_NAME, document=dict(template))
        return {"onload": "Successful"}
    except Exception as e:
        print(e)
        return {"error": "something went wrong"}

