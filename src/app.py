from flask import Flask, request, jsonify, render_template
import tensorflow as tf
import tensorflow_addons as tfa
import base64
import numpy as np
from PIL import Image
import io
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Завантаження моделей
with tf.keras.utils.custom_object_scope({'Addons>F1Score': tfa.metrics.F1Score(num_classes=4)}):
    model_vgg19 = tf.keras.models.load_model('models/VGG19-eye_disease-94.31.h5')
    model_efficientnet = tf.keras.models.load_model('models/final_model.h5')
    model_vgg16 = tf.keras.models.load_model('models/VGG16 Model.h5')

# Мітки для моделей
class_names_efficientnet = ['Cataract', 'Diabetic_Reitnopathy', 'Glaucoma', 'Normal']

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        if 'image' not in data or 'model' not in data:
            return jsonify({'error': 'Missing image or model data'}), 400
        
        encoded_image = data['image']
        model_name = data['model']
        
        encoded_image = encoded_image.split(",")[1]
        decoded_image = base64.b64decode(encoded_image)
        image = Image.open(io.BytesIO(decoded_image))
        image = image.resize((224, 224))
        image = np.array(image)
        
        print("Shape of image array:", image.shape)

        image = image / 255.0
        image = np.expand_dims(image, axis=0)
        
        print("Model selected:", model_name)

        # Класифікація за допомогою EfficientNet
        prediction_efficientnet = model_efficientnet.predict(image)
        result_index = np.argmax(prediction_efficientnet, axis=1)[0]
        confidence_efficientnet = float(np.max(prediction_efficientnet, axis=1)[0])
        result_label = class_names_efficientnet[result_index]

        # Класифікація за допомогою VGG19 і VGG16 
        prediction_vgg19 = model_vgg19.predict(image)
        prediction_vgg16 = model_vgg16.predict(image)
        
        confidence_vgg19 = float(np.max(prediction_vgg19, axis=1)[0])
        confidence_vgg16 = float(np.max(prediction_vgg16, axis=1)[0])

        # Збираємо результати
        if model_name == 'VGG19':
            final_confidence = confidence_vgg19
        elif model_name == 'VGG16':
            final_confidence = confidence_vgg16
        elif model_name == 'EfficientNet':
            final_confidence = confidence_efficientnet
        else:
            return jsonify({'error': 'Unknown model name'}), 400

        print("Prediction:", result_label, "Confidence:", final_confidence)

        return jsonify({'prediction': result_label, 'confidence': final_confidence})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
