from flask import Flask, jsonify, request
from conversation_storage import get_recent_conversations
from database import get_conversations, get_single_conversation, add_message_to_conversation, store_conversation
from flask_cors import CORS
import logging
from bson import ObjectId
from datetime import datetime
import json
import requests

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Rasa configuration
RASA_URL = "http://localhost:5005"  # Default Rasa server URL

class JSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        if isinstance(obj, datetime):
            return obj.isoformat()
        return super().default(obj)

app = Flask(__name__)
app.json_encoder = JSONEncoder
CORS(app)

def get_rasa_response(message, sender_id):
    try:
        logger.info(f"Sending message to Rasa: {message}")
        response = requests.post(
            f"{RASA_URL}/webhooks/rest/webhook",
            json={
                "sender": sender_id,
                "message": message
            },
            timeout=10  # Add timeout to prevent hanging
        )
        logger.info(f"Rasa response status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            logger.info(f"Rasa response data: {data}")
            return data
        logger.error(f"Rasa returned non-200 status: {response.status_code}")
        return None
    except requests.exceptions.RequestException as e:
        logger.error(f"Request error when calling Rasa: {str(e)}")
        return None
    except Exception as e:
        logger.error(f"Unexpected error when calling Rasa: {str(e)}")
        return None

@app.route('/')
def index():
    return jsonify({'message': 'Hello, World!'})

@app.route('/recent-chats', methods=['GET'])
def get_conversations_list():
    try:
        logger.info("Fetching recent conversations")
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 20))
        user_id = request.args.get('user_id')
        if not user_id:
            logger.warning("No user_id provided")
            return jsonify({
                'conversations': [],
                'pagination': {
                    'page': page,
                    'per_page': per_page,
                    'total': 0,
                    'total_pages': 0
                }
            })
        
        conversations, total = get_conversations(user_id=user_id, page=page, per_page=per_page)
        
        # Format the response
        formatted_conversations = []
        for conv in conversations:
            try:
                formatted_conv = {
                    'conversation_id': str(conv.get('_id')),
                    'started_at': conv.get('started_at').isoformat() if conv.get('started_at') else None,
                    'updated_at': conv.get('updated_at').isoformat() if conv.get('updated_at') else None,
                    'participants': conv.get('participants', {}),
                    'metadata': conv.get('metadata', {}),
                    'status': conv.get('status', 'active'),
                    'summary': conv.get('summary', {}),
                }
                
                # Get the last message if available
                messages = conv.get('messages', [])
                if messages:
                    last_message = messages[-1]
                    formatted_conv['last_message'] = last_message.get('content', '')
                    formatted_conv['last_message_timestamp'] = last_message.get('timestamp').isoformat() if last_message.get('timestamp') else None
                else:
                    formatted_conv['last_message'] = ''
                    formatted_conv['last_message_timestamp'] = None
                
                formatted_conversations.append(formatted_conv)
            except Exception as e:
                logger.error(f"Error formatting conversation: {str(e)}")
                continue
        
        return jsonify({
            'conversations': formatted_conversations,
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': total,
                'total_pages': (total + per_page - 1) // per_page
            }
        })
    except Exception as e:
        logger.error(f"Error fetching conversations: {str(e)}", exc_info=True)
        return jsonify({'error': str(e)}), 500

@app.route('/chat/<conversation_id>', methods=['GET'])
def get_conversation(conversation_id):
    try:
        logger.info(f"Fetching conversation with ID: {conversation_id}")
        conversation = get_single_conversation(conversation_id)
        if not conversation:
            return jsonify({'error': 'Conversation not found'}), 404
        
        # Convert ObjectId to string and format timestamps
        conversation['_id'] = str(conversation['_id'])
        conversation['started_at'] = conversation['started_at'].isoformat()
        conversation['updated_at'] = conversation['updated_at'].isoformat()
        
        # Format message timestamps
        if 'messages' in conversation:
            for message in conversation['messages']:
                if 'timestamp' in message:
                    message['timestamp'] = message['timestamp'].isoformat()
        
        # Format summary timestamp
        if 'summary' in conversation and 'last_message_timestamp' in conversation['summary']:
            conversation['summary']['last_message_timestamp'] = conversation['summary']['last_message_timestamp'].isoformat()
        
        return jsonify(conversation)
    except Exception as e:
        logger.error(f"Error fetching conversation: {str(e)}", exc_info=True)
        return jsonify({'error': str(e)}), 500

@app.route('/chat/<conversation_id>/message', methods=['POST'])
def add_message(conversation_id):
    try:
        data = request.json
        logger.info(f"Received message data: {data}")
        
        sender = data.get('sender')
        content = data.get('content')
        metadata = data.get('metadata')
        
        if not sender or not content:
            logger.warning("Missing required fields in message")
            return jsonify({'error': 'Missing required fields'}), 400
            
        # Add user message to conversation
        logger.info(f"Adding user message to conversation {conversation_id}")
        success = add_message_to_conversation(conversation_id, sender, content, metadata)
        if not success:
            logger.error(f"Failed to add message to conversation {conversation_id}")
            return jsonify({'error': 'Failed to add message'}), 500
            
        # Get Rasa response
        logger.info(f"Getting Rasa response for message: {content}")
        rasa_response = get_rasa_response(content, conversation_id)
        
        if rasa_response:
            logger.info(f"Received Rasa response: {rasa_response}")
            # Add Rasa's response to the conversation
            for response in rasa_response:
                if 'text' in response:
                    success = add_message_to_conversation(
                        conversation_id,
                        "ai",
                        response['text'],
                        {
                            "source": "rasa",
                            "confidence": response.get('confidence', 1.0)
                        }
                    )
                    if not success:
                        logger.error(f"Failed to add Rasa response to conversation {conversation_id}")
                        return jsonify({'error': 'Failed to add AI response'}), 500
        else:
            logger.warning("No response received from Rasa")
            # Add a default response if Rasa fails
            success = add_message_to_conversation(
                conversation_id,
                "ai",
                "I'm having trouble processing your message. Please try again.",
                {"source": "system", "error": "rasa_no_response"}
            )
            if not success:
                logger.error(f"Failed to add default response to conversation {conversation_id}")
            
        return jsonify({'message': 'Message added successfully'})
    except Exception as e:
        logger.error(f"Error in add_message: {str(e)}", exc_info=True)
        return jsonify({
            'error': 'Internal server error',
            'details': str(e)
        }), 500

@app.route('/chat', methods=['POST'])
def create_conversation():
    try:
        data = request.json
        conversation = store_conversation(
            user_id=data.get('user_id'),
            username=data.get('username'),
            display_name=data.get('display_name'),
            message=data.get('message'),
            platform=data.get('platform'),
            language=data.get('language'),
            topic=data.get('topic'),
            timezone=data.get('timezone')
        )
        
        # Format timestamps for response
        conversation['started_at'] = conversation['started_at'].isoformat()
        conversation['updated_at'] = conversation['updated_at'].isoformat()
        for message in conversation['messages']:
            message['timestamp'] = message['timestamp'].isoformat()
        if 'last_message_timestamp' in conversation['summary']:
            conversation['summary']['last_message_timestamp'] = conversation['summary']['last_message_timestamp'].isoformat()
            
        return jsonify(conversation)
    except Exception as e:
        logger.error(f"Error creating conversation: {str(e)}", exc_info=True)
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    logger.info("Starting API server...")
    try:
        app.run(host='127.0.0.1', port=8000)
    except Exception as e:
        logger.error(f"Failed to start server: {str(e)}", exc_info=True) 