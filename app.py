from flask import Flask, render_template, request, url_for, redirect
import os
import json

app = Flask(__name__)

@app.route("/")
def index():
	return render_template('index.html')

@app.route("/pair")
def pair():
	return render_template('pair.html')

@app.route("/login")
def login():
	return render_template('login.html')

@app.route("/glass")
def glass():
	return render_template('oauth21.htm')

@app.route("/myoData", methods=['POST'])
def myoData():
	toStore = {}

	toStore["gestureType"] = str(request.form["gestureType"])
	toStore["timestamp"] = str(request.form["timestamp"])
	toStore["imageb64"] = str(request.form["image"])

	jsonString = json.dumps(toStore)
	jsonObject = json.loads(jsonString)

	with open('data.txt', 'a+') as outfile:
		json.dump(jsonObject, outfile)
		outfile.write("\n")
	# string_to_image = []
	# with open('data.txt') as f: 
	# 	for x in f.readlines():
	# 		x = x.strip("\n")
	# 		print(" hello")
	# 		jsonObj = json.loads(x)
	# 		imageObj = jsonObj["imageb64"]
	# 		image = imageObj.split(",")[1]
	# 		underscore = "_"
	# 		name = jsonObj["timestamp"] + underscore + jsonObj["gestureType"]
	# 		with open(name + ".png", "wb") as fh:
	# 			fh.write(image.decode('base64'))
	return(jsonString)

if __name__ == "__main__":
    app.run(debug=True)