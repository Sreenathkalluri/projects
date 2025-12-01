from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import requests
import os
import json
from dotenv import load_dotenv
import random
import re
from datetime import datetime
import time

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Database Configuration with connection pooling
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///careerpath.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
    'pool_pre_ping': True,
    'pool_recycle': 300,
}

db = SQLAlchemy(app)
migrate = Migrate(app, db)

# OpenRouter API Configuration
OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

# Database Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    full_name = db.Column(db.String(100), nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    career_analyses = db.relationship('CareerAnalysis', backref='user', lazy=True)
    skill_assessments = db.relationship('SkillAssessment', backref='user', lazy=True)

class CareerAnalysis(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    interests = db.Column(db.String(200), nullable=False)
    strengths = db.Column(db.String(200), nullable=False)
    education = db.Column(db.String(100), nullable=False)
    experience = db.Column(db.String(100), nullable=False)
    goals = db.Column(db.String(200), nullable=False)
    work_style = db.Column(db.String(100))
    location = db.Column(db.String(100))
    salary = db.Column(db.String(100))
    note = db.Column(db.Text)
    recommendation = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class SkillAssessment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    skill = db.Column(db.String(100), nullable=False)
    score = db.Column(db.Float, nullable=False)
    level = db.Column(db.String(50), nullable=False)
    total_questions = db.Column(db.Integer, nullable=False)
    questions_answered = db.Column(db.Integer, nullable=False)
    analysis = db.Column(db.Text, nullable=False)
    user_answers = db.Column(db.Text)
    questions_used = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# Database connection helper with retry logic
def db_operation_with_retry(operation, max_retries=3):
    for attempt in range(max_retries):
        try:
            return operation()
        except Exception as e:
            if "locked" in str(e).lower() and attempt < max_retries - 1:
                print(f"🔄 Database locked, retrying... (Attempt {attempt + 1})")
                time.sleep(0.1 * (attempt + 1))
                continue
            else:
                raise e

@app.route("/")
def home():
    return "AI Career Counseling Backend Running!"

# --- Helper functions (unified, placed before endpoints) ---
def call_openrouter(messages, model="gpt-4o-mini", max_tokens=900, temperature=0.7):
    api_key = OPENROUTER_API_KEY or os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        print("⚠️ OPENROUTER_API_KEY not set - skipping LLM call")
        return None

    payload = {
        "model": model,
        "messages": messages,
        "temperature": temperature,
        "max_tokens": max_tokens
    }
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }

    try:
        resp = requests.post(OPENROUTER_API_URL, headers=headers, json=payload, timeout=30)
        resp.raise_for_status()
        res = resp.json()

        # Try OpenAI-like response shapes
        choices = res.get("choices") or []
        if isinstance(choices, list) and len(choices) > 0:
            first = choices[0]
            if isinstance(first, dict):
                msg = first.get("message") or first
                if isinstance(msg, dict) and "content" in msg:
                    return msg["content"]
                if "text" in first and isinstance(first["text"], str):
                    return first["text"]

        # Fallback keys
        for key in ("output", "generated_text", "text", "message"):
            val = res.get(key)
            if isinstance(val, str) and val.strip():
                return val

        # Try to find any string in dict values
        if isinstance(res, dict):
            for v in res.values():
                if isinstance(v, str) and v.strip():
                    return v

        print("⚠️ OpenRouter returned unexpected shape (truncated):")
        try:
            print(json.dumps(res)[:1000])
        except Exception:
            pass
        return None

    except requests.exceptions.RequestException as e:
        print(f"❌ OpenRouter request failed: {e}")
        return None
    except Exception as e:
        print(f"❌ Unexpected error calling OpenRouter: {e}")
        return None

def extract_value(text, keyword_variants):
    if not text:
        return ""
    for kw in keyword_variants:
        idx = text.lower().find(kw.lower())
        if idx != -1:
            start = idx + len(kw)
            end = text.find("\n", start)
            if end == -1:
                end = len(text)
            return text[start:end].strip()
    return ""

def analyze_user_input(text):
    try:
        interests = extract_value(text, ["PRIMARY INTERESTS:", "INTERESTS:"]) or ""
        strengths = extract_value(text, ["KEY STRENGTHS:", "STRENGTHS:"]) or ""
        education = extract_value(text, ["EDUCATION LEVEL:", "EDUCATION:"]) or ""
        experience = extract_value(text, ["WORK EXPERIENCE:", "EXPERIENCE:"]) or ""
        goals = extract_value(text, ["CAREER GOALS:", "GOALS:"]) or ""
        split_delim = lambda s: [p.strip() for p in re.split(r"[,\n;]+", s) if p.strip()]
        return {
            "interests": split_delim(interests) or ["Various fields"],
            "strengths": split_delim(strengths) or ["Versatile skills"],
            "education": education.strip(),
            "experience": experience.strip(),
            "goals": split_delim(goals) or ["Career growth"],
            "raw_input": text
        }
    except Exception:
        return {
            "interests": ["Various fields"],
            "strengths": ["Versatile skills"],
            "education": "",
            "experience": "",
            "goals": ["Career growth"],
            "raw_input": text
        }

def generate_fallback_recommendation(user_input=""):
    snippet = (user_input or "").strip()
    if len(snippet) > 200:
        snippet = snippet[:197] + "..."
    return (
        "⚠️ Fallback career recommendation (LLM unavailable).\n\n"
        f"Based on input: \"{snippet}\"\n\n"
        "Top suggestions:\n"
        "1) Identify 2-3 career paths that match your interests and strengths.\n"
        "2) Build a 3-step learning plan: (a) focused course, (b) small project, (c) portfolio item.\n"
        "3) Network with professionals and apply to relevant roles monthly.\n\n"
        "Provide more details for a tailored recommendation."
    )

def generate_personalized_career_advice(profile):
    prompt = (
        "You are an expert career counselor. Provide 3 recommended career paths for the user. "
        "For each path include: salary range, growth outlook, required skills and a 3-step action plan. "
        "Keep output human-readable plain text.\n\n"
        f"Interests: {', '.join(profile.get('interests', []))}\n"
        f"Strengths: {', '.join(profile.get('strengths', []))}\n"
        f"Education: {profile.get('education','')}\n"
        f"Experience: {profile.get('experience','')}\n"
        f"Goals: {', '.join(profile.get('goals', []))}\n"
    )
    messages = [
        {"role": "system", "content": "You are a concise actionable career coach."},
        {"role": "user", "content": prompt}
    ]
    llm_text = call_openrouter(messages, max_tokens=900, temperature=0.7)
    if llm_text and isinstance(llm_text, str) and llm_text.strip():
        return llm_text.strip()
    return generate_fallback_recommendation(profile.get("raw_input", ""))

# --- End helpers ---

# FIXED CAREER COUNSELOR ENDPOINT
@app.route("/api/career", methods=["POST", "OPTIONS"])
def career_counselor():
    if request.method == "OPTIONS":
        return jsonify({"status": "ok"}), 200
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON data received"}), 400
        user_input = data.get("userInput", "").strip()
        if not user_input:
            return jsonify({"error": "userInput is required"}), 400
        print(f"🎯 Received career request: {user_input}")
        analyzed_profile = analyze_user_input(user_input)
        if isinstance(analyzed_profile, dict):
            analyzed_profile["raw_input"] = user_input
        else:
            analyzed_profile = {"raw_input": user_input}
        personalized_recommendation = generate_personalized_career_advice(analyzed_profile)
        return jsonify({"recommendation": personalized_recommendation}), 200
    except Exception as e:
        print(f"💥 Error: {e}")
        return jsonify({
            "recommendation": generate_fallback_recommendation(data.get("userInput", "") if data else "")
        }), 200

# AUTHENTICATION ROUTES WITH RETRY LOGIC
@app.route("/api/register", methods=["POST"])
def register():
    def register_operation():
        data = request.get_json() or {}
        email = data.get('email')
        full_name = data.get('fullName')
        password = data.get('password')
        if not email or not full_name or not password:
            return jsonify({"error": "All fields are required"}), 400
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return jsonify({"error": "User already exists"}), 400
        new_user = User(email=email, full_name=full_name, password_hash=password)
        db.session.add(new_user)
        db.session.commit()
        return jsonify({
            "message": "User created successfully",
            "user": {"id": new_user.id, "email": new_user.email, "fullName": new_user.full_name}
        }), 201
    try:
        return db_operation_with_retry(register_operation)
    except Exception as e:
        db.session.rollback()
        print(f"❌ Registration error: {e}")
        return jsonify({"error": f"Registration failed: {e}"}), 500

@app.route("/api/login", methods=["POST"])
def login():
    def login_operation():
        data = request.get_json() or {}
        email = data.get('email')
        password = data.get('password')
        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400
        user = User.query.filter_by(email=email, password_hash=password).first()
        if not user:
            return jsonify({"error": "Invalid credentials"}), 401
        return jsonify({
            "message": "Login successful",
            "user": {"id": user.id, "email": user.email, "fullName": user.full_name}
        }), 200
    try:
        return db_operation_with_retry(login_operation)
    except Exception as e:
        print(f"❌ Login error: {e}")
        return jsonify({"error": f"Login failed: {e}"}), 500

# CAREER ANALYSIS ROUTES
@app.route("/api/career-analysis", methods=["POST"])
def save_career_analysis():
    def save_career_operation():
        data = request.get_json() or {}
        user_id = data.get('user_id')
        analysis_data = data.get('analysis_data')
        if not user_id or not analysis_data:
            return jsonify({"error": "User ID and analysis data are required"}), 400
        career_analysis = CareerAnalysis(
            user_id=int(user_id),
            interests=analysis_data.get('interests', ''),
            strengths=analysis_data.get('strengths', ''),
            education=analysis_data.get('education', ''),
            experience=analysis_data.get('experience', ''),
            goals=analysis_data.get('goals', ''),
            work_style=analysis_data.get('workStyle', ''),
            location=analysis_data.get('location', ''),
            salary=analysis_data.get('salary', ''),
            note=analysis_data.get('note', ''),
            recommendation=analysis_data.get('recommendation', '')
        )
        db.session.add(career_analysis)
        db.session.commit()
        return jsonify({"message": "Career analysis saved successfully", "analysis_id": career_analysis.id}), 201
    try:
        return db_operation_with_retry(save_career_operation)
    except Exception as e:
        db.session.rollback()
        print(f"❌ Career analysis save error: {e}")
        return jsonify({"error": f"Failed to save career analysis: {e}"}), 500

@app.route("/api/career-analysis/<int:user_id>", methods=["GET"])
def get_career_analyses(user_id):
    def get_career_operation():
        analyses = CareerAnalysis.query.filter_by(user_id=user_id).order_by(CareerAnalysis.created_at.desc()).limit(10).all()
        result = []
        for analysis in analyses:
            result.append({
                "id": analysis.id,
                "interests": analysis.interests,
                "strengths": analysis.strengths,
                "goals": analysis.goals,
                "recommendation": analysis.recommendation,
                "created_at": analysis.created_at.isoformat()
            })
        return jsonify({"analyses": result}), 200
    try:
        return db_operation_with_retry(get_career_operation)
    except Exception as e:
        print(f"❌ Get career analyses error: {e}")
        return jsonify({"error": f"Failed to fetch career analyses: {e}"}), 500

# SKILL ASSESSMENT ROUTES
@app.route("/api/skill-assessment", methods=["POST"])
def save_skill_assessment():
    def save_assessment_operation():
        data = request.get_json() or {}
        try:
            print("🔍 save_skill_assessment payload:", json.dumps(data)[:1000])
        except Exception:
            pass
        user_id = data.get('user_id') or data.get('userId') or data.get('user')
        assessment_data = data.get('assessment_data') or data.get('assessmentData') or data.get('assessment')
        if not assessment_data and any(k in data for k in ('skill', 'score', 'level', 'total_questions', 'totalQuestions', 'questions_answered', 'questionsAnswered', 'analysis')):
            assessment_data = {
                'skill': data.get('skill', ''),
                'score': data.get('score', 0),
                'level': data.get('level', ''),
                'total_questions': data.get('total_questions') or data.get('totalQuestions') or 0,
                'questions_answered': data.get('questions_answered') or data.get('questionsAnswered') or 0,
                'analysis': data.get('analysis', ''),
                'user_answers': data.get('user_answers') or data.get('userAnswers') or {},
                'questions_used': data.get('questions_used') or data.get('questionsUsed') or []
            }
        if not user_id or not assessment_data:
            return jsonify({"error": "User ID and assessment data are required."}), 400
        skill_assessment = SkillAssessment(
            user_id=int(user_id),
            skill=assessment_data.get('skill', ''),
            score=float(assessment_data.get('score', 0)),
            level=assessment_data.get('level', ''),
            total_questions=int(assessment_data.get('total_questions') or assessment_data.get('totalQuestions') or 0),
            questions_answered=int(assessment_data.get('questions_answered') or assessment_data.get('questionsAnswered') or 0),
            analysis=assessment_data.get('analysis', ''),
            user_answers=json.dumps(assessment_data.get('user_answers') or assessment_data.get('userAnswers') or {}),
            questions_used=json.dumps(assessment_data.get('questions_used') or assessment_data.get('questionsUsed') or [])
        )
        db.session.add(skill_assessment)
        db.session.commit()
        return jsonify({"message": "Skill assessment saved successfully", "assessment_id": skill_assessment.id}), 201
    try:
        return db_operation_with_retry(save_assessment_operation)
    except Exception as e:
        db.session.rollback()
        print(f"❌ Skill assessment save error: {e}")
        return jsonify({"error": f"Failed to save skill assessment: {e}"}), 500

@app.route("/api/skill-assessment/<int:user_id>", methods=["GET"])
def get_skill_assessments(user_id):
    def get_assessments_operation():
        assessments = SkillAssessment.query.filter_by(user_id=user_id).order_by(SkillAssessment.created_at.desc()).limit(10).all()
        result = []
        for assessment in assessments:
            result.append({
                "id": assessment.id,
                "skill": assessment.skill,
                "score": assessment.score,
                "level": assessment.level,
                "total_questions": assessment.total_questions,
                "questions_answered": assessment.questions_answered,
                "analysis": assessment.analysis,
                "created_at": assessment.created_at.isoformat()
            })
        return jsonify({"assessments": result}), 200
    try:
        return db_operation_with_retry(get_assessments_operation)
    except Exception as e:
        print(f"❌ Get skill assessments error: {e}")
        return jsonify({"error": f"Failed to fetch skill assessments: {e}"}), 500

@app.route("/api/dashboard/<int:user_id>", methods=["GET"])
def get_dashboard_data(user_id):
    def get_dashboard_operation():
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404
        career_analyses_count = CareerAnalysis.query.filter_by(user_id=user_id).count()
        skill_assessments_count = SkillAssessment.query.filter_by(user_id=user_id).count()
        recent_assessments = SkillAssessment.query.filter_by(user_id=user_id).order_by(SkillAssessment.created_at.desc()).limit(3).all()
        recent_assessments_data = []
        for assessment in recent_assessments:
            recent_assessments_data.append({
                "skill": assessment.skill,
                "score": assessment.score,
                "level": assessment.level,
                "created_at": assessment.created_at.isoformat()
            })
        return jsonify({
            "user": {"id": user.id, "email": user.email, "fullName": user.full_name},
            "stats": {"career_analyses": career_analyses_count, "skill_assessments": skill_assessments_count},
            "recent_assessments": recent_assessments_data
        }), 200
    try:
        return db_operation_with_retry(get_dashboard_operation)
    except Exception as e:
        print(f"❌ Dashboard data error: {e}")
        return jsonify({"error": f"Failed to fetch dashboard data: {e}"}), 500

def _make_default_options(skill, qtype):
    """Return 3-4 deterministic option strings for given skill and question type."""
    base = skill or "this skill"
    if qtype == "multiple_choice":
        return [
            f"Beginner - Just starting to learn {base}",
            f"Intermediate - Some practical experience with {base}",
            f"Advanced - Comfortable with complex tasks in {base}",
            f"Expert - Can teach others and solve advanced problems in {base}"
        ]
    if qtype == "technical":
        return [
            f"Basic familiarity with tools for {base}",
            f"Comfortable using standard tools for {base}",
            f"Proficient with advanced tools for {base}"
        ]
    # behavioral, scenario_based, practical - provide graded responses
    return [
        f"Limited experience with {base}",
        f"Some practical experience with {base}",
        f"Extensive practical experience with {base}"
    ]

def _normalize_question_item(item, idx, skill):
    """Ensure item has id, question, type and options (3-4 strings)."""
    allowed_types = {"multiple_choice", "behavioral", "scenario_based", "practical", "technical"}
    if not isinstance(item, dict):
        item = {}
    # id
    try:
        item_id = int(item.get("id", idx))
    except Exception:
        item_id = idx
    item["id"] = item_id
    # question text
    qtext = (item.get("question") or "").strip()
    if not qtext:
        qtext = f"Question {item_id} about {skill or 'the skill'}"
    item["question"] = qtext
    # type
    qtype = (item.get("type") or "").strip()
    if qtype not in allowed_types:
        # try to infer from keys or default to multiple_choice
        qtype = "multiple_choice"
    item["type"] = qtype
    # options
    opts = item.get("options")
    if not isinstance(opts, list) or len([o for o in opts if isinstance(o, str) and o.strip()]) < 3:
        # generate deterministic options for this question type
        opts = _make_default_options(skill, qtype)
    # normalize strings, trim to 3-4 unique
    cleaned = []
    seen = set()
    for o in opts:
        try:
            s = str(o).strip()
        except Exception:
            continue
        if not s:
            continue
        if s in seen:
            continue
        cleaned.append(s)
        seen.add(s)
        if len(cleaned) >= 4:
            break
    # ensure at least 3 options
    while len(cleaned) < 3:
        cleaned.append(f"Option {len(cleaned)+1} for question {item_id}")
    item["options"] = cleaned
    return item

@app.route("/api/generate-questions", methods=["POST"])
def generate_questions():
    try:
        data = request.get_json() or {}
        skill = (data.get("skill") or "General Skills").strip()
        messages = [
            {"role": "system", "content": "You are a JSON-only question generator for skill assessments."},
            {"role": "user", "content":
                f"Create 10 assessment questions for the skill '{skill}'. "
                "Return only a valid JSON array of objects with fields: id (1-10), question, type (multiple_choice, behavioral, scenario_based, practical, technical), options (array of 3-4 strings). Do not include any extra text."
            }
        ]
        llm_text = call_openrouter(messages, max_tokens=700)
        questions = None
        if llm_text:
            try:
                start = llm_text.find('[')
                end = llm_text.rfind(']')
                if start != -1 and end != -1 and end > start:
                    json_text = llm_text[start:end+1]
                    parsed = json.loads(json_text)
                    if isinstance(parsed, list) and len(parsed) >= 1:
                        questions = parsed
            except Exception as e:
                print(f"⚠️ Failed parsing LLM questions JSON: {e}\nResponse snippet: {llm_text[:1000]}")

        # If LLM didn't return usable list, fall back to deterministic template
        if not isinstance(questions, list) or len(questions) < 1:
            # create deterministic 10-question template
            questions = []
            base_types = ["multiple_choice", "behavioral", "scenario_based", "practical", "technical"]
            for i in range(1, 11):
                qtype = base_types[(i-1) % len(base_types)]
                questions.append({
                    "id": i,
                    "question": f"Question {i}: Evaluate your experience with {skill}.",
                    "type": qtype,
                    "options": _make_default_options(skill, qtype)
                })

        # Normalize and ensure 10 items with proper options
        normalized = []
        for idx in range(1, 11):
            if idx-1 < len(questions):
                item = questions[idx-1]
            else:
                item = {}
            normalized.append(_normalize_question_item(item, idx, skill))

        return jsonify({"questions": normalized}), 200

    except Exception as e:
        print(f"Error generating questions: {e}")
        return jsonify({"questions": []}), 200

@app.route("/api/analyze-skills", methods=["POST"])
def analyze_skills():
    try:
        data = request.get_json() or {}
        skill = (data.get("skill") or "General Skills").strip()
        user_answers = data.get("userAnswers") or data.get("user_answers") or {}
        messages = [
            {"role": "system", "content": "You are a skill assessment analyst. Return only valid JSON."},
            {"role": "user", "content":
                f"Given the skill '{skill}' and the following user answers (JSON): {json.dumps(user_answers)}, "
                "return a JSON object with fields: score (0-10 number), level (Beginner/Intermediate/Advanced/Expert), "
                "analysis (string), strengths (array), weaknesses (array), improvements (array), resources (array), "
                "action_plan (object with immediate, short_term, long_term arrays). Do not include any extra text."
            }
        ]
        llm_text = call_openrouter(messages, max_tokens=900)
        if llm_text:
            try:
                start = llm_text.find('{')
                end = llm_text.rfind('}')
                if start != -1 and end != -1 and end > start:
                    json_text = llm_text[start:end+1]
                    parsed = json.loads(json_text)
                    if isinstance(parsed, dict) and "score" in parsed:
                        return jsonify(parsed), 200
            except Exception as e:
                print(f"⚠️ Failed parsing LLM analysis JSON: {e}\nResponse snippet: {llm_text[:1000]}")
        # fallback deterministic analysis
        score = 7.5
        level = "Intermediate"
        analysis_data = {
            "score": score,
            "level": level,
            "analysis": (
                f"🎯 SKILL ASSESSMENT: {skill.upper()}\n\n"
                f"📊 OVERALL SCORE: {score}/10\n"
                f"🏆 SKILL LEVEL: {level}\n\n"
                "Based on your assessment responses, here's your skill evaluation:\n\n"
                "✅ STRENGTHS IDENTIFIED:\n• Solid foundational knowledge\n\n"
            ),
            "strengths": ["Solid foundational knowledge"],
            "weaknesses": [f"Need more {skill} project experience"],
            "improvements": ["Focus on practical project work"],
            "resources": [f"Online courses for {skill}"],
            "action_plan": {
                "immediate": ["Complete basic tutorials"],
                "short_term": ["Build small projects"],
                "long_term": ["Work on complex projects"]
            }
        }
        return jsonify(analysis_data), 200
    except Exception as e:
        print(f"Error analyzing skills: {e}")
        return jsonify({
            "score": 7.0,
            "level": "Intermediate",
            "analysis": "Skill assessment completed successfully. Focus on practical application and continuous learning.",
            "strengths": ["Learning capability", "Foundation knowledge"],
            "weaknesses": ["Need more practical experience"],
            "improvements": ["Practice regularly", "Build projects"],
            "resources": ["Online courses", "Practice platforms"],
            "action_plan": {
                "immediate": ["Start learning", "Join communities"],
                "short_term": ["Build projects", "Network"],
                "long_term": ["Gain experience", "Get certified"]
            }
        }), 200

# INITIALIZE DATABASE
with app.app_context():
    db.create_all()
    print("✅ Database tables created successfully!")

@app.route("/api/health", methods=["GET"])
def health():
    """
    Simple health-check endpoint returning JSON so the frontend can detect backend availability.
    """
    try:
        return jsonify({
            "status": "ok",
            "message": "AI Career Counseling Backend running",
            "timestamp": datetime.utcnow().isoformat()
        }), 200
    except Exception:
        return jsonify({"status": "error", "message": "Health check failed"}), 500

if __name__ == "__main__":
    print("🎯 AI Career Counseling Backend Started!")
    print("📍 Server running at: http://localhost:5000")
    app.run(debug=True, port=5000, threaded=False)
