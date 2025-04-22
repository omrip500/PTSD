# PTSD Research Tool

A research project focusing on building a machine learning model to predict microglial cell activation in PTSD research, supported by a web application for image upload and analysis.

---

## 🔍 Project Overview

This project combines two main parts:

- **Deep Learning Model** (CNN):
  - A trained Convolutional Neural Network (CNN) model for classifying individual microglia cells based on their activation status.
  - The model was trained on crops (cell images) extracted via YOLO-based segmentation.
  - Final validation accuracy: ~80.8%

- **Web Application** (Frontend + Backend):
  - Allows researchers to upload datasets of microglia cell images.
  - View past uploaded datasets and results.
  - Export analysis results.
  
In future stages, the web backend will communicate with the trained model's REST API to perform real-time predictions and return JSON results.

---

## 📂 Repository Structure

```bash
.
├── backend/              # Node.js + Express server (API endpoints)
├── docs/                 # Project documentation (requirements, design, literature review)
├── frontend/             # React-based web application
├── screenshots/          # Screenshots from the web app
├── best_model.pth        # Trained SimpleCNN model (PyTorch)
├── model.ipynb           # Jupyter Notebook for model training
├── README.md             # Project description and instructions
├── .gitignore            # Git ignore rules
├── package.json          # Backend dependencies and scripts
├── package-lock.json     # Exact versions of installed Node.js packages
```

---

## 📢 Main Features

### Deep Learning Model
- **Model Architecture**: 2 Convolutional layers + fully connected classifier.
- **Data Augmentation**: Random cropping, flipping, color jittering.
- **Training**: Early stopping and best model saving.
- **Classification Output**: 4 classes of microglia activation stages.

### Web Application
- **Upload New Dataset**: Upload new images, categorized by group (control/experiment).
- **View Past Results**: Browse previously analyzed datasets.
- **Export Analysis Results**: Download a report of the dataset analysis.

---

## 🖼️ Web Application Screenshots

> A glimpse into the web interface:

### Dashboard Screen
<img src="./screenshots/Screenshot 2025-04-22 at 9.28.46.png" width="700"/>

### Upload New Dataset Screen
<img src="./screenshots/Screenshot 2025-04-22 at 9.48.52.png" width="700"/>

### Resulsts Anaylysis
<img src="./screenshots/Screenshot 2025-04-22 at 9.29.43.png" width="700"/>

---

## 📊 Model Performance
- **Validation Accuracy**: ~80.82%
- **Test Accuracy**: ~78.46%

---

## 🚀 Future Work
- Develop REST API to serve the model (Flask / FastAPI).
- Integrate frontend-backend communication with model predictions.
- Collect more labeled data to improve classification for minority classes.

---

## 🔗 How to Run Locally

1. Clone the repository.
2. Install dependencies.
3. Run the app.

```bash
# Clone
$ git clone https://github.com/<your-username>/PTSD.git
$ cd PTSD

# Install dependencies
$ npm install

# Start the app
$ npm start
```

> **Environment Variables:**  
> In the `backend/` folder, create a `.env` file with the following content:

```
# MongoDB Configuration
PORT=YOUR_PORT
MONGO_URI=YOUR_MONGO_URI

# AWS S3 Configuration
AWS_ACCESS_KEY_ID=YOUR_AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY=YOUR_AWS_SECRET_ACCESS_KEY
AWS_REGION=YOUR_AWS_REGION
AWS_BUCKET_NAME=YOUR_AWS_BUCKET_NAME
```

---

## 🗕️ Authors
- Omri Peer
- Noam Sella

Supervision:
- Dr. Sharon Yalov Handzel (Technical Mentor)
- Dr. Lilach Gavish (Biological Mentor, Hebrew University)

---

## 🛍️ Acknowledgments
Special thanks to Dr. Lilach Gavish for providing the original datasets used to train the model.
