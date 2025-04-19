from pymongo import MongoClient
from datetime import datetime
import os
from dotenv import load_dotenv
from bson import ObjectId
import uuid

load_dotenv()

# MongoDB connection
MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017')
client = MongoClient(MONGO_URI)

# Ensure database exists
db = client['rasa_db']
conversations = db['conversations']

def store_conversation(user_id: str, username: str, display_name: str, message: str, 
                      platform: str = "web", language: str = "en-US", 
                      session_id: str = None, topic: str = "general", 
                      timezone: str = "UTC", response: str = None):
    """Store a conversation in MongoDB with the new format"""
    try:
        # Generate a new conversation ID if this is the first message
        conversation_id = str(uuid.uuid4())
        message_id = f"msg-{str(uuid.uuid4())[:8]}"
        
        # Create the conversation document
        conversation = {
            "_id": ObjectId(),
            "conversation_id": conversation_id,
            "started_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "participants": {
                "user": {
                    "user_id": user_id,
                    "username": username,
                    "display_name": display_name
                },
                "ai": {
                    "ai_id": "grok-3",
                    "name": "Grok",
                    "version": "3.0"
                }
            },
            "metadata": {
                "platform": platform,
                "language": language,
                "session_id": session_id or str(uuid.uuid4()),
                "context": {
                    "topic": topic,
                    "user_timezone": timezone
                }
            },
            "messages": [
                {
                    "message_id": message_id,
                    "sender": "user",
                    "content": message,
                    "timestamp": datetime.utcnow(),
                    "status": "delivered",
                    "metadata": {
                        "input_type": "text",
                        "device": platform
                    }
                }
            ],
            "status": "active",
            "summary": {
                "total_messages": 1,
                "last_message_id": message_id,
                "last_message_timestamp": datetime.utcnow()
            }
        }
        
        # If there's a response, add it to the conversation
        if response:
            response_id = f"msg-{str(uuid.uuid4())[:8]}"
            conversation["messages"].append({
                "message_id": response_id,
                "sender": "ai",
                "content": response,
                "timestamp": datetime.utcnow(),
                "status": "delivered",
                "metadata": {
                    "response_time_ms": 500,
                    "confidence_score": 0.95
                }
            })
            conversation["summary"]["total_messages"] = 2
            conversation["summary"]["last_message_id"] = response_id
            conversation["summary"]["last_message_timestamp"] = datetime.utcnow()
        
        result = conversations.insert_one(conversation)
        conversation['_id'] = str(result.inserted_id)  # Convert ObjectId to string
        return conversation
    except Exception as e:
        print(f"Error storing conversation: {e}")
        raise e

def get_single_conversation(conversation_id: str):
    """Retrieve a single conversation by ID"""
    try:
        # Try to find by conversation_id first
        conversation = conversations.find_one({"conversation_id": conversation_id})
        if not conversation:
            # If not found, try to find by _id (in case conversation_id is actually an ObjectId)
            try:
                conversation = conversations.find_one({"_id": ObjectId(conversation_id)})
            except:
                pass
        return conversation
    except Exception as e:
        print(f"Error retrieving conversation: {e}")
        raise e

def get_conversations(user_id: str = None, page: int = 1, per_page: int = 20):
    """Retrieve paginated conversations from MongoDB"""
    try:
        query = {}
        if user_id:
            query["participants.user.user_id"] = user_id
        
        # Get total count for pagination
        total = conversations.count_documents(query)
        
        # Calculate skip and limit
        skip = (page - 1) * per_page
        limit = per_page
        
        # Get paginated results
        cursor = conversations.find(query).sort("updated_at", -1).skip(skip).limit(limit)
        results = list(cursor)
        
        return results, total
    except Exception as e:
        print(f"Error retrieving conversations: {e}")
        raise e

def add_message_to_conversation(conversation_id: str, sender: str, content: str, metadata: dict = None):
    """Add a new message to an existing conversation"""
    try:
        message_id = f"msg-{str(uuid.uuid4())[:8]}"
        message = {
            "message_id": message_id,
            "sender": sender,
            "content": content,
            "timestamp": datetime.utcnow(),
            "status": "delivered",
            "metadata": metadata or {}
        }
        
        # Update the conversation
        result = conversations.update_one(
            {"conversation_id": conversation_id},
            {
                "$push": {"messages": message},
                "$set": {
                    "updated_at": datetime.utcnow(),
                    "summary.total_messages": {"$add": ["$summary.total_messages", 1]},
                    "summary.last_message_id": message_id,
                    "summary.last_message_timestamp": datetime.utcnow()
                }
            }
        )
        
        return result.modified_count > 0
    except Exception as e:
        print(f"Error adding message to conversation: {e}")
        raise e 