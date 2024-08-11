from flask import Flask, request, jsonify
import torch
from transformers import BertTokenizer, BertForSequenceClassification
from keras.preprocessing.sequence import pad_sequences
import torch.nn.functional as F
import numpy as np
import os

app = Flask(__name__)

# 전역 변수로 모델과 토크나이저 선언
model = None
tokenizer = None
device = None
category_map = {
    "0": "일반글",
    "1": "공격발언",
    "2": "혐오발언"
}

def load_model():
    global model, tokenizer, device
    model_path = '/app/models/letr-sol-profanity-filter'
    model = BertForSequenceClassification.from_pretrained(model_path)
    tokenizer = BertTokenizer.from_pretrained(model_path)
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    model.to(device)
    print('Model load Finished!')

# convert_input_data 및 test_sentences 함수는 이전과 동일합니다.

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    sentence = data['sentence']
    result = test_sentences([sentence])
    return jsonify(result)

if __name__ == '__main__':
    load_model()  # 서버 시작 시 모델 로드
    app.run(host='0.0.0.0', port=5000)