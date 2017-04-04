
from flask import Flask, render_template, redirect, request, jsonify
import json

app = Flask(__name__)

@app.route('/')
def main():
    return render_template('demo.html')

if __name__ == "__main__":
    app.run(host="0.0.0.0", port="1995", threaded=True)
