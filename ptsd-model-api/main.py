from flask import Flask, request, jsonify
import tempfile
import os
import subprocess
import base64
import json

app = Flask(__name__)

@app.route("/analyze", methods=["POST"])
def analyze():
    try:
        # קבצים מהבקשה
        image_file = request.files["image"]
        yolo_file = request.files["yolo"]

        # שמירה זמנית
        with tempfile.NamedTemporaryFile(delete=False, suffix=".tif") as temp_image, \
             tempfile.NamedTemporaryFile(delete=False, suffix=".txt") as temp_yolo:

            image_path = temp_image.name
            yolo_path = temp_yolo.name

            image_file.save(image_path)
            yolo_file.save(yolo_path)

        # הרצת הסקריפט
        script_path = os.path.join(os.path.dirname(__file__), "analyze.py")
        result = subprocess.run(
            ["python3", script_path, image_path, yolo_path],
            capture_output=True,
            text=True
        )

        if result.returncode != 0:
            return jsonify({"error": result.stderr}), 500

        output = json.loads(result.stdout)

        # קריאה והמרה של התמונות ל-base64
        with open(output["annotatedImagePath"], "rb") as f:
            annotated_b64 = base64.b64encode(f.read()).decode("utf-8")

        with open(output["convertedOriginalPath"], "rb") as f:
            original_b64 = base64.b64encode(f.read()).decode("utf-8")

        # מחיקה
        os.remove(image_path)
        os.remove(yolo_path)
        os.remove(output["annotatedImagePath"])
        os.remove(output["convertedOriginalPath"])

        return jsonify({
            "annotated_image_base64": annotated_b64,
            "converted_original_base64": original_b64,
            "summary": output["summary"]
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=False, host="0.0.0.0", port=6000)
