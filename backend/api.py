from flask import Flask, jsonify, request
from conversation_storage import get_recent_conversations
from database import get_conversations, get_single_conversation, add_message_to_conversation, store_conversation
from flask_cors import CORS
import logging
from bson import ObjectId
from datetime import datetime
import json

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

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
        sender = data.get('sender')
        content = data.get('content')
        metadata = data.get('metadata')
        
        if not sender or not content:
            return jsonify({'error': 'Missing required fields'}), 400
            
        success = add_message_to_conversation(conversation_id, sender, content, metadata)
        if not success:
            return jsonify({'error': 'Failed to add message'}), 500
            
        return jsonify({'message': 'Message added successfully'})
    except Exception as e:
        logger.error(f"Error adding message: {str(e)}", exc_info=True)
        return jsonify({'error': str(e)}), 500

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