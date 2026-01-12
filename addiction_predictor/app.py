# from flask import Flask, render_template, request
# import joblib
# import pandas as pd
# import numpy as np

# app = Flask(__name__)

# # 1. Load the saved pipeline (ensure the filename matches your saved file)
# model_path = 'social_media_addiction_pipeline.pkl'
# pipeline = joblib.load(model_path)

# def get_risk_status(score):
#     """Categorizes the numerical score into Risk Levels"""
#     if score < 4.0:
#         return "Low Risk", "text-success", "Keep maintaining a healthy balance!"
#     elif 4.0 <= score <= 7.0:
#         return "Medium Risk", "text-warning", "Be mindful of your digital habits."
#     else:
#         return "High Risk", "text-danger", "Consider a digital detox or professional guidance."

# @app.route('/')
# def index():
#     return render_template('index.html')

# @app.route('/predict', methods=['POST'])
# def predict():
#     if request.method == 'POST':
#         # Extract data from Form
#         input_data = {
#             'Age': int(request.form['Age']),
#             'Gender': request.form['Gender'],
#             'Academic_Level': request.form['Academic_Level'],
#             'Avg_Daily_Usage_Hours': float(request.form['Avg_Daily_Usage_Hours']),
#             'Most_Used_Platform': request.form['Most_Used_Platform'],
#             'Affects_Academic_Performance': request.form['Affects_Academic_Performance'],
#             'Sleep_Hours_Per_Night': float(request.form['Sleep_Hours_Per_Night']),
#             'Relationship_Status': request.form['Relationship_Status'],
#             'Conflicts_Over_Social_Media': int(request.form['Conflicts_Over_Social_Media'])
#         }

#         # Convert to DataFrame
#         input_df = pd.DataFrame([input_data])

#         # Prediction
#         prediction = pipeline.predict(input_df)[0]
#         score = round(float(prediction), 2)

#         # Categorization
#         label, color_class, advice = get_risk_status(score)

#         return render_template('index.html',
#                                prediction_text=score,
#                                status=label,
#                                color=color_class,
#                                advice=advice,
#                                submitted=True)

# if __name__ == "__main__":
#     app.run(debug=True)

# import os
# import joblib
# import pandas as pd
# import numpy as np
# import google.generativeai as genai
# from flask import Flask, render_template, request, jsonify
# from flask_cors import CORS
# from dotenv import load_dotenv

# # 1. Load environment variables (API Keys)
# load_dotenv()

# app = Flask(__name__)
# CORS(app)

# # 2. Configure Google Gemini AI
# api_key = os.getenv("GOOGLE_API_KEY")
# genai.configure(api_key=api_key)
# model_gemini = genai.GenerativeModel("gemini-2.5-flash")

# # 3. Load the Scikit-Learn ML Pipeline
# # Ensure 'social_media_addiction_pipeline.pkl' is in your project folder
# model_path = "social_media_addiction_pipeline.pkl"
# pipeline = joblib.load(model_path)


# def get_risk_status(score):
#     """Categorizes the numerical score into Risk Levels for the UI"""
#     if score < 4.0:
#         return "Low Risk", "text-success", "Keep maintaining a healthy balance!"
#     elif 4.0 <= score <= 7.0:
#         return "Medium Risk", "text-warning", "Be mindful of your digital habits."
#     else:
#         return (
#             "High Risk",
#             "text-danger",
#             "Consider a digital detox or professional guidance.",
#         )


# def get_ai_recommendation(user_data, score):
#     """Sends context to Gemini to get personalized platform-wise advice"""
#     platform = user_data["Most_Used_Platform"]
#     academics = user_data["Affects_Academic_Performance"]

#     # Building a smart prompt for the LLM
#     prompt = f"""
#     Act as a friendly Digital Wellness Coach. 
#     A student has a Social Media Addiction Score of {score}/10 based on behavioral data. 
#     Their favorite platform is {platform}. 
#     Academic impact: {academics}.
    
#     Task:
#     1. If the score is >= 7, provide 3 strict but kind action steps to reduce {platform} usage specifically.
#     2. If the score is 4-7, provide 2 mindfulness tips for using {platform}.
#     3. If the score is < 4, give a short congratulatory message about their healthy digital balance.
    
#     Keep the response under 100 words, use bullet points for tips, and be very supportive.
#     """

#     try:
#         response = model_gemini.generate_content(prompt)
#         return response.text
#     except Exception as e:
#         print(f"Error calling Gemini: {e}")
#         return "AI recommendations are currently loading. Focus on mindful scrolling in the meantime."


# @app.route("/")
# def index():
#     return render_template("index.html")


# @app.route("/predict", methods=["POST"])
# def predict():
#     if request.method == "POST":
#         try:
#             # 4. Extract data from the request (JSON or Form)
#             if request.is_json:
#                 data = request.json
#                 input_data = {
#                     "Age": int(data.get("Age")),
#                     "Gender": data.get("Gender"),
#                     "Academic_Level": data.get("Academic_Level"),
#                     "Avg_Daily_Usage_Hours": float(data.get("Avg_Daily_Usage_Hours")),
#                     "Most_Used_Platform": data.get("Most_Used_Platform"),
#                     "Affects_Academic_Performance": data.get(
#                         "Affects_Academic_Performance"
#                     ),
#                     "Sleep_Hours_Per_Night": float(data.get("Sleep_Hours_Per_Night")),
#                     "Relationship_Status": data.get("Relationship_Status"),
#                     "Conflicts_Over_Social_Media": int(
#                         data.get("Conflicts_Over_Social_Media")
#                     ),
#                 }
#             else:
#                 input_data = {
#                     "Age": int(request.form["Age"]),
#                     "Gender": request.form["Gender"],
#                     "Academic_Level": request.form["Academic_Level"],
#                     "Avg_Daily_Usage_Hours": float(
#                         request.form["Avg_Daily_Usage_Hours"]
#                     ),
#                     "Most_Used_Platform": request.form["Most_Used_Platform"],
#                     "Affects_Academic_Performance": request.form[
#                         "Affects_Academic_Performance"
#                     ],
#                     "Sleep_Hours_Per_Night": float(
#                         request.form["Sleep_Hours_Per_Night"]
#                     ),
#                     "Relationship_Status": request.form["Relationship_Status"],
#                     "Conflicts_Over_Social_Media": int(
#                         request.form["Conflicts_Over_Social_Media"]
#                     ),
#                 }

#             # 5. ML Prediction using our saved Pipeline
#             input_df = pd.DataFrame([input_data])
#             prediction = pipeline.predict(input_df)[0]
#             score = round(float(prediction), 2)

#             # 6. Get standard status labels
#             label, color_class, advice = get_risk_status(score)

#             # 7. Get AI-powered smart recommendations
#             ai_insights = get_ai_recommendation(input_data, score)
#             print(f"AI Insights: {ai_insights}")

#             if request.is_json:
#                 return jsonify(
#                     {
#                         "prediction_score": score,
#                         "status": label,
#                         "color_class": color_class,
#                         "advice": advice,
#                         "ai_insights": ai_insights,
#                     }
#                 )

#             return render_template(
#                 "index.html",
#                 prediction_text=score,
#                 status=label,
#                 color=color_class,
#                 advice=advice,
#                 ai_insights=ai_insights,
#                 submitted=True,
#             )

#         except Exception as e:
#             return f"An error occurred: {str(e)}"


# if __name__ == "__main__":
#     app.run(debug=True)

import os
import joblib
import json
import pandas as pd
import numpy as np
import google.generativeai as genai
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# --- CONFIGURATION ---
api_key = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=api_key)
# Using the stable 2.5 model for 2026
model_gemini = genai.GenerativeModel("gemini-2.5-flash")

model_path = "social_media_addiction_pipeline.pkl"
pipeline = joblib.load(model_path)

def get_risk_status(score):
    if score < 4.0:
        return "Low Risk", "text-success", "Healthy Balance"
    elif 4.0 <= score <= 7.0:
        return "Medium Risk", "text-warning", "Mindfulness Required"
    else:
        return "High Risk", "text-danger", "Intervention Recommended"

# --- ENDPOINT 1: ML PREDICTION ---
@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json if request.is_json else request.form.to_dict()
        
        # Format input for pipeline
        input_data = {
            "Age": int(data["Age"]),
            "Gender": data["Gender"],
            "Academic_Level": data["Academic_Level"],
            "Avg_Daily_Usage_Hours": float(data["Avg_Daily_Usage_Hours"]),
            "Most_Used_Platform": data["Most_Used_Platform"],
            "Affects_Academic_Performance": data["Affects_Academic_Performance"],
            "Sleep_Hours_Per_Night": float(data["Sleep_Hours_Per_Night"]),
            "Relationship_Status": data["Relationship_Status"],
            "Conflicts_Over_Social_Media": int(data["Conflicts_Over_Social_Media"]),
        }

        input_df = pd.DataFrame([input_data])
        prediction = pipeline.predict(input_df)[0]
        score = round(float(prediction), 2)
        label, color, advice = get_risk_status(score)

        return jsonify({
            "status": "success",
            "prediction_score": score,
            "risk_level": label,
            "color_class": color,
            "summary": advice,
            "user_data_snapshot": input_data # Passed back to help frontend call recommendation
        })

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 400

# --- ENDPOINT 2: AI RECOMMENDATION (JSON RESPONSE) ---
@app.route("/recommend", methods=["POST"])
def recommend():
    try:
        data = request.json
        score = data.get("score")
        platform = data.get("platform")
        academics = data.get("academics")

        # Finetuned JSON Prompt
        prompt = f"""
        Act as a professional Digital Wellness Coach. 
        Analyze this data: Addiction Score: {score}/10, Platform: {platform}, Academic Impact: {academics}.
        
        Return ONLY a raw JSON object with this exact structure:
        {{
            "platform_type": "{platform}",
            "analysis_reason": "Brief explanation of why the user is in this risk category based on their habits",
            "execution_plan": ["Step 1...", "Step 2...", "Step 3..."]
        }}
        
        If the score is < 4, provide a plan focused on maintaining their good habits.
        If the score is > 7, provide strict detox steps.
        Do not include markdown formatting like ```json. Just the raw text.
        """

        response = model_gemini.generate_content(prompt)
        
        # Parse the string response into a Python dictionary
        ai_data = json.loads(response.text.strip())

        return jsonify({
            "status": "success",
            "recommendation": ai_data
        })

    except Exception as e:
        print(f"AI Error: {e}")
        return jsonify({"status": "error", "message": "Failed to generate AI insights."}), 500

@app.route("/")
def index():
    return render_template("index.html")

if __name__ == "__main__":
    app.run(debug=True)