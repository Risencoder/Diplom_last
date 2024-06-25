import unittest
import json
import sys
import os

# Додаємо шлях до папки src до sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../src')))

from app import app

class AppTestCase(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_predict_efficientnet(self):
        with open("tests/test_image_base64.txt", "r") as f:
            test_image_base64 = f.read()
        payload = json.dumps({"image": test_image_base64, "model": "EfficientNet"})
        response = self.app.post('/predict', headers={"Content-Type": "application/json"}, data=payload)
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn('prediction', data)
        self.assertIn('confidence', data)

    def test_predict_vgg16(self):
        with open("tests/test_image_base64.txt", "r") as f:
            test_image_base64 = f.read()
        payload = json.dumps({"image": test_image_base64, "model": "VGG16"})
        response = self.app.post('/predict', headers={"Content-Type": "application/json"}, data=payload)
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn('prediction', data)
        self.assertIn('confidence', data)

    def test_predict_vgg19(self):
        with open("tests/test_image_base64.txt", "r") as f:
            test_image_base64 = f.read()
        payload = json.dumps({"image": test_image_base64, "model": "VGG19"})
        response = self.app.post('/predict', headers={"Content-Type": "application/json"}, data=payload)
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn('prediction', data)
        self.assertIn('confidence', data)

if __name__ == '__main__':
    unittest.main()
