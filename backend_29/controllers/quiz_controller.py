from models.quiz_model import QuizCollection
from services.quizid_service import generate_quiz_id
from flask import g
from models.web_link_model import WebQuizCollection
from models.youtube_link_model import YoutubeQuizCollection
from models.quiz_question_model import QuizQuestionCollection
from bson import ObjectId
import datetime


def create_quiz(topic: str, time_duration: str, difficulty: str):

    quiz_exist = QuizCollection.find_topic(topic)

    if quiz_exist:
        return None

    quiz_id = generate_quiz_id()
    user_id = g.user_id

    db_doc = QuizCollection(
        quiz_id=quiz_id,
        user_id=user_id,
        topic=topic,
        time_duration=time_duration,
        difficulty=difficulty,
        generate_status=False
    )
    
    db_doc.save()

    return quiz_id


def get_quiz():
    
    docs_data = QuizCollection.get_all_quiz()

    all_data = []

    for docs in docs_data:
        docs["_id"] = str(docs["_id"])
        docs["user_id"] = str(docs["user_id"])
        all_data.append(docs)

    return all_data


def get_id_quiz(quiz_id):

    quiz_meta = QuizCollection.find_quiz(quiz_id)
    questions = QuizQuestionCollection.find_ques_quizId(quiz_id)
    youtube   = YoutubeQuizCollection.find_youtube_quizId(quiz_id)
    blogs     = WebQuizCollection.find_blog_quizId(quiz_id)

    return {
        "quiz": objectConversion(quiz_meta),
        "question": objectConversion(questions),
        "youtube": objectConversion(youtube),
        "blogs": objectConversion(blogs)
    }


def get_self_quiz():
    
    user_id = g.user_id

    docs_data = QuizCollection.get_all_self_quiz(user_id)

    all_data = []

    for docs in docs_data:
        docs["_id"] = str(docs["_id"])
        docs["user_id"] = str(docs["user_id"])
        all_data.append(docs)

    return all_data


def objectConversion(data):

    # None
    if data is None:
        return None

    # Mongo document (dict)
    if isinstance(data, dict):
        clean = {}
        for k, v in data.items():
            if isinstance(v, ObjectId):
                clean[k] = str(v)
            elif isinstance(v, datetime.datetime):
                clean[k] = v.isoformat()
            elif isinstance(v, (dict, list)):
                clean[k] = objectConversion(v)
            else:
                clean[k] = v
        return clean

    # List or cursor
    if isinstance(data, list):
        return [objectConversion(item) for item in data]

    # Primitive (string, int, etc.)
    return data


def completed_generated_quiz(quiz_id):
    data = QuizCollection.completed_gen(quiz_id)
    return data


