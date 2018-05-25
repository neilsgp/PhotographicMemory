from flask import Flask, render_template, request
app = Flask(__name__)

@app.route("/")
def main():
	return render_template('index.html')

@app.route("/myoData", methods=['POST'])
def myoData():
	return str(request.form)

if __name__ == "__main__":
    app.run(debug=True)
