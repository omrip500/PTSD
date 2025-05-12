import sys
import os
import json
from PIL import Image, ImageDraw
import torch
import torch.nn as nn
from torchvision import transforms

# ===== Step 1: Parse CLI arguments =====
image_path = sys.argv[1]
yolo_path = sys.argv[2]

# ===== Step 2: Define output paths =====
annotated_output_path = "/tmp/annotated_result.png"
converted_path = os.path.splitext(image_path)[0] + "_converted.png"

# ===== Step 3: Define model (same as in training) =====
class SimpleCNN(nn.Module):
    def __init__(self, num_classes):
        super(SimpleCNN, self).__init__()
        self.features = nn.Sequential(
            nn.Conv2d(3, 32, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2, 2),
            nn.Conv2d(32, 64, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2, 2)
        )
        self.classifier = nn.Sequential(
            nn.Flatten(),
            nn.Linear(64 * 16 * 16, 128),
            nn.ReLU(),
            nn.Dropout(0.5),
            nn.Linear(128, num_classes)
        )

    def forward(self, x):
        x = self.features(x)
        x = self.classifier(x)
        return x

# ===== Step 4: Load model and weights =====
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = SimpleCNN(num_classes=4).to(device)

model_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "best_model.pth"))
model.load_state_dict(torch.load(model_path, map_location=device))
model.eval()

# ===== Step 5: Define preprocessing and class names =====
transform_inference = transforms.Compose([
    transforms.Resize((64, 64)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.5, 0.5, 0.5], std=[0.5, 0.5, 0.5])
])

class_names = ["Resting", "Surveilling", "Activated", "Resolution"]

# ===== Step 6: Load image and convert to PNG =====
original_image = Image.open(image_path).convert("RGB")
original_image.save(converted_path, "PNG")  # Save a .png version for frontend
annotated_image = original_image.copy()
draw = ImageDraw.Draw(annotated_image)
width, height = annotated_image.size

# ===== Step 7: Read YOLO annotations =====
with open(yolo_path, "r") as f:
    yolo_lines = f.readlines()

# ===== Step 8: Analyze each cell =====
summary = {"Resting": 0, "Surveilling": 0, "Activated": 0, "Resolution": 0}

for idx, line in enumerate(yolo_lines):
    try:
        parts = list(map(float, line.strip().split()))
        if len(parts) not in [4, 5]:
            continue

        # תיאום יחסיים -> פיקסלים
        if len(parts) == 4:
            x_center, y_center, box_w, box_h = parts
        else:
            _, x_center, y_center, box_w, box_h = parts

        x = int((x_center - box_w / 2) * width)
        y = int((y_center - box_h / 2) * height)
        w = int(box_w * width)
        h = int(box_h * height)

        # Crop the cell
        crop = annotated_image.crop((x, y, x + w, y + h))

        # Prepare for prediction
        input_tensor = transform_inference(crop).unsqueeze(0).to(device)

        with torch.no_grad():
            output = model(input_tensor)
            _, pred_class = torch.max(output, 1)

        class_name = class_names[pred_class.item()]
        summary[class_name] += 1

        # Draw rectangle + class name
        draw.rectangle((x, y, x + w, y + h), outline="red", width=2)
        draw.text((x + 2, y - 10), class_name, fill="red")

    except Exception:
        continue  # תמשיך אם תא מסוים נפל

# ===== Step 9: Save annotated image =====
annotated_image.save(annotated_output_path)

# ===== Step 10: Output paths for Node.js =====
result = {
    "annotatedImagePath": annotated_output_path,
    "convertedOriginalPath": converted_path,
    "summary": summary
}

print(json.dumps(result))
