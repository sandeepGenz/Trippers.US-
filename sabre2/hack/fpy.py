from flask import Flask,request,jsonify,Response
import joblib
import requests

import subprocess
#scrapy crawl hack -O op.json
import json
app = Flask(__name__)

model = joblib.load('Tourism_model.joblib')

@app.route('/')
def hello_world():
     return Response("Trippers.us")

# @app.route('/check')
# def scrapper():

#     subprocess.run(["scrapy", "crawl","hack","-O","op.json"])

#     with open('op.json','r') as f:
#         data = json.load(f)
      
#     return jsonify(data)

@app.route('/check',methods=['GET', 'POST'])
def scrapper():

    input_data = request.get_json()
    city = input_data['city']

    with open('/home/sandeep/Desktop/sabre2/hack/hack/spiders/cityName.txt', 'w') as file:
    # Write the string to the file   /home/sandeep/Desktop/sabre2/hack/hack/spiders
        file.write(city)

    subprocess.run(["scrapy", "crawl","hack","-O","op.json"])

    

    with open('op.json','r') as f:
        data = json.load(f)

    mydict={
        "list": data
    }
    conv = json.dumps(mydict)
      
    return (conv)

# @app.route('/postt',methods=['GET', 'POST'])
# def post():

#     url = "http://localhost:5000/ml"

#     payload = {

#         'attractionType' : "Worship",
#         'attractionsNearby': 78.984,
#         'restaurentsNearby' : 67.8

#     }

#     response = requests.post(url,json=payload)

#     type(response)

#     return Response((response), status=422, mimetype='application/json')
    # return jsonify(response)

@app.route('/ml',methods=['GET', 'POST'])
def ml():

    input_data = request.get_json()

    attractionType = input_data['attractionType']
    attractionsNearby = input_data['attractionsNearby']
    restaurentsNearby = input_data['restaurentsNearby'] 

    arr = [[]]

    if attractionType.lower() == "adventure":
        arr = [[attractionsNearby,restaurentsNearby,1,0,0,0,0]]

    elif attractionType.lower() == "amusement":
        arr = [[attractionsNearby,restaurentsNearby,0,1,0,0,0]]

    elif attractionType.lower() == "historical":
        arr = [[attractionsNearby,restaurentsNearby,0,0,1,0,0]]

    elif attractionType.lower() == "shopping":
        arr = [[attractionsNearby,restaurentsNearby,0,0,0,1,0]]

    else:
        arr = [[attractionsNearby,restaurentsNearby,0,0,0,0,1]]

    
    prediction = model.predict(arr)

    to_list = prediction.tolist()

    print(type(to_list))

    print(to_list)

    to_dict = {

        "KFscore" : to_list[0][0],
        "SCscore" : to_list[0][1],
        "LMscore" : to_list[0][2]
    }

    conv = json.dumps(to_dict)

    print(type(conv))

    # return jsonify(prediction.tolist())
    return (conv)

# @app.route('/data',methods=['GET', 'POST'])
# def data():
#     input_data = request.get_json()
#     city = input_data['city']




if __name__ == '__main__':
    app.run(debug=True)
