from flask import Flask
from query_data import ss_query, chat_query
from flask import request
from flask_cors import CORS, cross_origin
import json
from logging.handlers import RotatingFileHandler
from flask import jsonify

app = Flask(__name__)
CORS(app)
# @app.route('/success/<res>')
# def success(res):
#    return '%s' % res

@app.route('/chat', methods=['POST', 'OPTIONS'])
@cross_origin()

# def _build_cors_preflight_response():
#     print(request.form)
#     response = make_response()
#     response.headers.add("Access-Control-Allow-Origin", "*")
#     response.headers.add('Access-Control-Allow-Headers', "*")
#     response.headers.add('Access-Control-Allow-Methods', "*")
#     return response

def chat():
    # if request.method == "OPTIONS": # CORS preflight
    #     return _build_cors_preflight_response()
    req = json.loads(request.data)
    qtype = req['qtype']
    query = req['query']
    print(query)
    if qtype == 0:
        res = ss_query(query)
        serialized_res = [{"document": {"page_content": doc.page_content, 
                                "metadata": doc.metadata}, 
                                "score": float(score)} 
                                for doc, score in res]
    else:
        res = chat_query(query)

        serialized_res = [{"document": {"page_content": doc.page_content, 
                                "metadata": doc.metadata}} 
                                for doc in res['source_documents']]
        serialized_res.append({'answer':res['answer']})
    # response = jsonify(res)
    # response.headers.add('Access-Control-Allow-Origin', '*')

    print(serialized_res)
    return jsonify(serialized_res)

# def _corsify_actual_response(response):
#     response.headers.add("Access-Control-Allow-Origin", "*")
#     return response



if __name__ == '__main__':

    app.run(port=6001)
