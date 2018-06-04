from flask import Flask, render_template, request
import os
import json

app = Flask(__name__)

@app.route("/")
def main():
	return render_template('index.html')

@app.route("/myoData", methods=['POST'])
def myoData():
	toStore = {}
	toStore["gestureType"] = str(request.form["gestureType"])
	toStore["timestamp"] = str(request.form["timestamp"])
	toStore["imageb64"] = str(request.form["image"])

	jsonString = json.dumps(toStore)
	jsonObject = json.loads(jsonString)

	with open('data.txt', 'w') as outfile:
		json.dump(jsonObject, outfile)
		
	return(jsonString)

if __name__ == "__main__":
    app.run(debug=True)
