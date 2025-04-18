from pymongo import MongoClient
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

# MongoDB connection
MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017')
client = MongoClient(MONGO_URI)

# Ensure database exists
db = client['rasa_db']
conversations = db['conversations']

def store_conversation(sender_id: str, message: str, intent: str = None, 
                      confidence: float = None, entities: list = None, 
                      response: str = None):
    """Store a conversation in MongoDB"""
    try:
        conversation = {
            'sender_id': sender_id,
            'message': message,
            'intent': intent,
            'confidence': confidence,
            'entities': entities,
            'response': response,
            'timestamp': datetime.utcnow()
        }
        
        result = conversations.insert_one(conversation)
        print(f"Stored conversation with ID: {result.inserted_id}")
        return result.inserted_id
    except Exception as e:
        print(f"Error storing conversation: {e}")
        raise e

def get_conversations(sender_id: str = None, limit: int = 100):
    """Retrieve conversations from MongoDB"""
    try:
        query = {}
        if sender_id:
            query['sender_id'] = sender_id
        
        # Print debug information
        count = conversations.count_documents(query)
        print(f"Found {count} conversations in database")
        
        cursor = conversations.find(query).sort('timestamp', -1).limit(limit)
        results = list(cursor)
        print(f"Retrieved {len(results)} conversations")
        return results
    except Exception as e:
        print(f"Error retrieving conversations: {e}")
        raise e 