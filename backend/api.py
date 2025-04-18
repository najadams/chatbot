from flask import Flask, jsonify
from conversation_storage import get_recent_conversations
from flask_cors import CORS
import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return jsonify({'message': 'Hello, World!'})

@app.route('/recent-conversations', methods=['GET'])
def get_conversations():
    try:
        logger.info("Fetching recent conversations")
        conversations = get_recent_conversations()
        logger.info(f"Retrieved {len(conversations)} conversations")
        return jsonify(conversations)
    except Exception as e:
        logger.error(f"Error fetching conversations: {str(e)}", exc_info=True)
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    logger.info("Starting API server...")
    try:
        app.run(host='127.0.0.1', port=8000)
    except Exception as e:
        logger.error(f"Failed to start server: {str(e)}", exc_info=True) 