import os
import io
import sys
import json
import base64
from PIL import Image, ImageDraw
import torch
from torchvision import transforms, models

# ===== Class Names and Colors =====
class_names = ["Resting", "Surveilling", "Activated", "Resolution"]
class_colors = {
    "Resting": "blue",
    "Surveilling": "green",
    "Activated": "red",
    "Resolution": "yellow"
}

# ===== Load ResNet18 Model =====
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
num_classes = len(class_names)

model = models.resnet18(pretrained=False)
model.fc = torch.nn.Linear(model.fc.in_features, num_classes)

model_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "best_model.pth"))
model.load_state_dict(torch.load(model_path, map_location=device))
model = model.to(device)
model.eval()

# ===== Transform for Inference =====
transform_inference = transforms.Compose([
    transforms.Resize((256, 256)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.5, 0.5, 0.5], std=[0.5, 0.5, 0.5])
])

# ===== Analysis Function =====
def run_analysis(image_bytes: bytes, yolo_text: str):
    original_image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    annotated_image = original_image.copy()
    draw = ImageDraw.Draw(annotated_image)
    width, height = original_image.size

    summary = {name: 0 for name in class_names}

    for idx, line in enumerate(yolo_text.strip().splitlines()):
        try:
            parts = list(map(float, line.strip().split()))
            if len(parts) not in [4, 5]:
                continue
            if len(parts) == 4:
                x_center, y_center, box_w, box_h = parts
            else:
                _, x_center, y_center, box_w, box_h = parts

            x = int((x_center - box_w / 2) * width)
            y = int((y_center - box_h / 2) * height)
            w = int(box_w * width)
            h = int(box_h * height)

            crop = annotated_image.crop((x, y, x + w, y + h))
            input_tensor = transform_inference(crop).unsqueeze(0).to(device)

            with torch.no_grad():
                output = model(input_tensor)
                _, pred_class = torch.max(output, 1)

            class_name = class_names[pred_class.item()]
            summary[class_name] += 1

            color = class_colors.get(class_name, "white")
            draw.rectangle((x, y, x + w, y + h), outline=color, width=2)
            draw.text((x + 2, y - 10), class_name, fill=color)

        except Exception as e:
            print(f"❌ Error in cell {idx}: {e}", file=sys.stderr)
            continue

    # Convert images to base64
    annotated_buf = io.BytesIO()
    annotated_image.save(annotated_buf, format="PNG")
    annotated_b64 = base64.b64encode(annotated_buf.getvalue()).decode("utf-8")

    original_buf = io.BytesIO()
    original_image.save(original_buf, format="PNG")
    original_b64 = base64.b64encode(original_buf.getvalue()).decode("utf-8")

    return {
        "annotated_image_base64": annotated_b64,
        "converted_original_base64": original_b64,
        "summary": summary
    }

# ===== Optional: CLI Usage for Debugging =====
if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python analyze.py <image_path> <yolo_path>", file=sys.stderr)
        sys.exit(1)

    image_path = sys.argv[1]
    yolo_path = sys.argv[2]

    with open(image_path, "rb") as img_f, open(yolo_path, "r") as yolo_f:
        image_bytes = img_f.read()
        yolo_text = yolo_f.read()

    result = run_analysis(image_bytes, yolo_text)
    print(json.dumps(result))
