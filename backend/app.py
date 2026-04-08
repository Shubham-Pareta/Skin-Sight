import os
import json
import base64
import io
import numpy as np
import tensorflow as tf
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from tensorflow.keras.preprocessing import image
from groq import Groq
from dotenv import load_dotenv
from PIL import Image

basedir = os.path.abspath(os.path.dirname(__file__))
frontend_dist = os.path.abspath(os.path.join(basedir, "..", "frontend", "dist"))
load_dotenv(os.path.join(basedir, '.env'))

app = Flask(__name__, static_folder=frontend_dist, static_url_path='/')
CORS(app)

GROQ_API_KEY = os.getenv('GROQ_API_KEY')
groq_client = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None

MODEL_PATH = os.path.join(basedir, "skin_disease_model.h5")
model = tf.keras.models.load_model(MODEL_PATH)

CLASS_NAMES = [
    "Atopic Dermatitis", "BCC", "Benign Keratosis", "Eczema", 
    "Melanoma", "Nevus", "Psoriasis", "Seborrheic Keratoses", 
    "Tinea Infections", "Warts Molluscum"
]

def encode_image_to_base64(file_storage):
    file_storage.seek(0)
    return base64.b64encode(file_storage.read()).decode('utf-8')

def perform_vision_triage(file_storage):
    if not groq_client:
        return True, "API Fallback"
    
    try:
        base64_img = encode_image_to_base64(file_storage)
        response = groq_client.chat.completions.create(
            model="llama-3.2-11b-vision-preview",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text", 
                            "text": "Analyze this image. Is it human skin with a visible abnormality (rash, mole, lesion)? Return JSON: {'is_skin': true/false, 'reason': '...'}"
                        },
                        {
                            "type": "image_url",
                            "image_url": {"url": f"data:image/jpeg;base64,{base64_img}"}
                        }
                    ]
                }
            ],
            response_format={"type": "json_object"}
        )
        result = json.loads(response.choices[0].message.content)
        return result.get('is_skin', False), result.get('reason', 'Unknown')
    except:
        return True, "API Fallback"

def fetch_disease_details(disease_name):
    if not groq_client:
        return {
            "description": f"{disease_name} identified.",
            "symptoms": ["Visible skin changes"],
            "treatment": "Consult a doctor",
            "urgency": "Routine"
        }
    
    try:
        prompt = f"Provide medical details for '{disease_name}'. JSON keys: description, symptoms (list), treatment, urgency."
        completion = groq_client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": "Output ONLY valid JSON."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"}
        )
        return json.loads(completion.choices[0].message.content)
    except:
        return {"description": "Error fetching details.", "symptoms": [], "treatment": "Consult doctor", "urgency": "Routine"}

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'no_image'}), 400
    
    img_file = request.files['image']
    is_skin, reason = perform_vision_triage(img_file)
    
    if not is_skin:
        return jsonify({'error': 'invalid_image', 'message': reason}), 400

    try:
        img_file.seek(0)
        pil_img = Image.open(io.BytesIO(img_file.read())).convert('RGB').resize((160, 160))
        img_array = image.img_to_array(pil_img)
        img_array = np.expand_dims(img_array, axis=0) / 255.0
        
        predictions = model.predict(img_array)
        confidence = round(float(np.max(predictions)) * 100, 2)
        predicted_label = CLASS_NAMES[np.argmax(predictions)]

        if confidence < 25:
            return jsonify({'error': 'low_confidence'}), 400

        medical_info = fetch_disease_details(predicted_label)
        return jsonify({'prediction': predicted_label, 'confidence': confidence, 'details': medical_info})
    except:
        return jsonify({'error': 'processing_error'}), 500

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 10000))
    app.run(host='0.0.0.0', port=port)