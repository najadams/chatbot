from database import get_conversations
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)

def get_recent_conversations(limit: int = 10, hours: int = 24):
    """
    Get recent conversations from the last specified hours.
    
    Args:
        limit (int): Maximum number of conversations to return
        hours (int): Number of hours to look back for conversations
        
    Returns:
        list: List of recent conversations
    """
    try:
        # Calculate the cutoff time
        cutoff_time = datetime.utcnow() - timedelta(hours=hours)
        
        # Get conversations from the database
        conversations = get_conversations(limit=limit)
        
        # Filter conversations by timestamp and format them
        recent_conversations = []
        for conv in conversations:
            if conv.get('timestamp', datetime.min) >= cutoff_time:
                recent_conversations.append({
                    'id': str(conv.get('_id')),
                    'sender_id': conv.get('sender_id'),
                    'message': conv.get('message'),
                    'response': conv.get('response'),
                    'timestamp': conv.get('timestamp').isoformat() if conv.get('timestamp') else None,
                    'intent': conv.get('intent'),
                    'confidence': conv.get('confidence'),
                    'entities': conv.get('entities')
                })
        
        logger.info(f"Retrieved {len(recent_conversations)} recent conversations")
        return recent_conversations
    except Exception as e:
        logger.error(f"Error getting recent conversations: {str(e)}")
        raise 