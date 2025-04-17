from pymongo import MongoClient
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

# MongoDB connection
MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017')
client = MongoClient(MONGO_URI)
db = client['rasa_db']

# Collection for conversations
conversations = db['conversations']

def store_conversation(sender_id: str, message: str, intent: str = None, 
                      confidence: float = None, entities: list = None, 
                      response: str = None):
    """Store a conversation in MongoDB"""
    conversation = {
        'sender_id': sender_id,
        'message': message,
        'intent': intent,
        'confidence': confidence,
        'entities': entities,
        'response': response,
        'timestamp': datetime.utcnow()
    }
    
    try:
        conversations.insert_one(conversation)
    except Exception as e:
        print(f"Error storing conversation: {e}")

def get_conversations(sender_id: str = None, limit: int = 100):
    """Retrieve conversations from MongoDB"""
    query = {}
    if sender_id:
        query['sender_id'] = sender_id
    
    return list(conversations.find(query).sort('timestamp', -1).limit(limit)) 