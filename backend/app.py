import os
import io
import json
import numpy as np
import tensorflow as tf
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from tensorflow.keras.preprocessing import image
from dotenv import load_dotenv
from PIL import Image
from groq import Groq

load_dotenv()
basedir = os.path.abspath(os.path.dirname(__file__))
frontend_dist = os.path.abspath(os.path.join(basedir, "..", "frontend", "dist"))

app = Flask(__name__, static_folder=frontend_dist, static_url_path='/')
CORS(app)

GROQ_API_KEY = os.getenv('GROQ_API_KEY')
groq_client = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None

MODEL_PATH = os.path.join(basedir, "skin_disease_model.h5")
model = tf.keras.models.load_model(MODEL_PATH, compile=False)

CLASS_NAMES = [
    "Atopic Dermatitis", "BCC", "Benign Keratosis", "Eczema",
    "Melanoma", "Nevus", "Psoriasis", "Seborrheic Keratoses",
    "Tinea Infections", "Warts Molluscum"
]

HARDCODED_URGENCY = {
    "atopic dermatitis": "Routine",
    "bcc": "Medium",
    "benign keratosis": "Low",
    "eczema": "Routine",
    "melanoma": "High",
    "nevus": "Low",
    "psoriasis": "Routine",
    "seborrheic keratoses": "Low",
    "tinea infections": "Routine",
    "warts molluscum": "Routine"
}

def get_urgency(disease_name):
    return HARDCODED_URGENCY.get(disease_name.lower(), "Routine")

HARDCODED_FALLBACK = {
    "atopic dermatitis": {
        "description": "A chronic skin condition that makes skin red, dry, and very itchy.",
        "symptoms": ["Dry and sensitive skin", "Severe itching", "Red to brownish patches", "Small raised bumps"],
        "treatment": "Use gentle moisturizers daily, avoid harsh soaps, take short warm baths."
    },
    "bcc": {
        "description": "The most common type of skin cancer. It grows slowly and rarely spreads.",
        "symptoms": ["A shiny pearly bump", "A flat flesh-colored lesion", "A sore that bleeds", "A pink growth with raised border"],
        "treatment": "See a dermatologist immediately. Treatment involves surgical removal."
    },
    "benign keratosis": {
        "description": "A harmless skin growth that looks waxy and scaly. Common in older adults.",
        "symptoms": ["Waxy or scaly bump", "Brown or black color", "Looks stuck on the skin", "Rough texture"],
        "treatment": "No treatment needed. Can be removed by a doctor if irritated."
    },
    "eczema": {
        "description": "Patches of skin become inflamed, itchy, and rough. Often runs in families.",
        "symptoms": ["Intense itching", "Red or brownish patches", "Dry sensitive skin", "Small raised bumps"],
        "treatment": "Moisturize daily, avoid harsh soaps and stress, use prescribed creams."
    },
    "melanoma": {
        "description": "The most serious type of skin cancer. Early detection is very important.",
        "symptoms": ["A new spot on the skin", "A mole that changes size or color", "Irregular borders", "Mole that itches or bleeds"],
        "treatment": "See a dermatologist immediately. Early detection saves lives."
    },
    "nevus": {
        "description": "A common mole. Most moles are harmless and normal.",
        "symptoms": ["Brown or black spot", "Round or oval shape", "Flat or slightly raised", "Uniform color"],
        "treatment": "No treatment needed. Monitor for changes. Protect from sun."
    },
    "psoriasis": {
        "description": "An immune condition causing thick scales and red patches on the skin.",
        "symptoms": ["Thick red patches", "Silvery white scales", "Dry cracked skin", "Itching and burning"],
        "treatment": "Use prescribed creams, take oatmeal baths, avoid stress, get some sunlight."
    },
    "seborrheic keratoses": {
        "description": "Harmless skin growths that look like waxy brown patches. Common with age.",
        "symptoms": ["Waxy brown patches", "Looks stuck on the skin", "Round or oval shape", "Rough surface"],
        "treatment": "No treatment needed. Can be removed by a doctor if irritated."
    },
    "tinea infections": {
        "description": "A fungal infection of the skin, also known as ringworm. Contagious but treatable.",
        "symptoms": ["Ring-shaped red rash", "Itching and burning", "Scaly patches", "Cracked skin"],
        "treatment": "Use over-the-counter antifungal creams, keep area clean and dry."
    },
    "warts molluscum": {
        "description": "A viral skin infection causing small, firm bumps on the skin. Common in children.",
        "symptoms": ["Small raised bumps", "Flesh-colored or pink", "Dimple in center", "Painless"],
        "treatment": "Most cases go away on their own within 6 to 12 months."
    }
}

def fetch_medical_details(disease_name):
    search_name = disease_name.lower().strip()
    fallback = HARDCODED_FALLBACK.get(search_name, {
        "description": f"{disease_name} is a skin condition. Consult a dermatologist.",
        "symptoms": ["Visible skin changes", "Texture abnormalities", "Color variations", "Itching or discomfort"],
        "treatment": "Consult a dermatologist"
    })
    
    if groq_client:
        try:
            prompt = f"""Provide medical information for {disease_name} in JSON format.

Return ONLY this JSON structure:
{{
    "description": "A short 3-sentence description",
    "symptoms": ["symptom 1", "symptom 2", "symptom 3", "symptom 4"],
    "treatment": "A short 1-sentence treatment advice"
}}

Keep all fields short and simple for patients."""

            completion = groq_client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[
                    {"role": "system", "content": "Return ONLY valid JSON. Keep responses short and simple."},
                    {"role": "user", "content": prompt}
                ],
                response_format={"type": "json_object"},
                temperature=0.3,
                max_tokens=350,
                timeout=5
            )
            api_data = json.loads(completion.choices[0].message.content)
            
            return {
                "description": api_data.get("description") or fallback.get("description"),
                "symptoms": api_data.get("symptoms") or fallback.get("symptoms"),
                "treatment": api_data.get("treatment") or fallback.get("treatment"),
                "urgency": get_urgency(disease_name)
            }
        except Exception as e:
            print(f"Groq API error: {e}")
    
    return {
        "description": fallback.get("description"),
        "symptoms": fallback.get("symptoms"),
        "treatment": fallback.get("treatment"),
        "urgency": get_urgency(disease_name)
    }

def preprocess_image(img_file):
    img_file.seek(0)
    pil_img = Image.open(io.BytesIO(img_file.read())).convert('RGB')
    pil_img = pil_img.resize((160, 160))
    img_array = image.img_to_array(pil_img)
    return pil_img, np.expand_dims(img_array, axis=0) / 255.0

def is_skin_image(pil_img):
    img = np.array(pil_img)
    r, g, b = img[:,:,0], img[:,:,1], img[:,:,2]
    skin_pixels = np.logical_and.reduce([
        r > 95, g > 40, b > 20,
        (np.maximum(r, np.maximum(g, b)) - np.minimum(r, np.minimum(g, b))) > 15,
        abs(r - g) > 15, r > g, r > b
    ])
    return (np.sum(skin_pixels) / skin_pixels.size) > 0.2

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400
    
    img_file = request.files['image']
    
    try:
        pil_img, img_array = preprocess_image(img_file)
        
        if not is_skin_image(pil_img):
            return jsonify({
                'error': 'invalid_image',
                'prediction': 'Not a Skin Image',
                'details': {
                    'description': 'The uploaded image does not appear to contain human skin tissue. Please upload a clear image of skin.',
                    'symptoms': [],
                    'treatment': 'Please upload a valid skin image',
                    'urgency': 'N/A'
                }
            }), 400

        preds = model.predict(img_array)
        confidence = float(np.max(preds)) * 100
        predicted_label = CLASS_NAMES[np.argmax(preds)]

        if confidence < 30:
            return jsonify({
                'prediction': 'Low Confidence',
                'confidence': round(confidence, 2),
                'details': {
                    'description': 'The model is uncertain about this image. Please upload a clearer, well-lit image.',
                    'symptoms': [],
                    'treatment': 'Please upload a clearer image',
                    'urgency': 'N/A'
                }
            }), 200

        medical_details = fetch_medical_details(predicted_label)
        
        return jsonify({
            'prediction': predicted_label,
            'confidence': round(confidence, 2),
            'details': medical_details
        }), 200
        
    except Exception as e:
        print(f"Prediction error: {e}")
        return jsonify({'error': 'Processing error', 'message': str(e)}), 500

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 10000))
    app.run(host='0.0.0.0', port=port, debug=False)