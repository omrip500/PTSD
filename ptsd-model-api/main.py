from flask import Flask, request, jsonify
import os
from analyze import run_analysis

app = Flask(__name__)

@app.route("/analyze", methods=["POST"])
def analyze():
    try:
        image_file = request.files.get("image")
        yolo_file = request.files.get("yolo")

        if not image_file or not yolo_file:
            return jsonify({"error": "Missing image or yolo file"}), 400

        image_bytes = image_file.read()
        yolo_text = yolo_file.read().decode("utf-8")

        result = run_analysis(image_bytes, yolo_text)
        return jsonify(result)

    except Exception as e:
        print("❌ שגיאה:", e)
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 6000))
    app.run(debug=False, host="0.0.0.0", port=port)
