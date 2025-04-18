from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from database import store_conversation, get_conversations
from datetime import datetime, timedelta
from collections import defaultdict

class StoreConversationAction(Action):
    def name(self) -> Text:
        return "action_store_conversation"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        # Get the latest message
        latest_message = tracker.latest_message
        sender_id = tracker.sender_id
        
        # Store conversation in MongoDB
        store_conversation(
            sender_id=sender_id,
            message=latest_message.get("text", ""),
            intent=latest_message.get("intent", {}).get("name"),
            confidence=latest_message.get("intent", {}).get("confidence"),
            entities=latest_message.get("entities", []),
            response=tracker.latest_bot_message.get("text", "") if tracker.latest_bot_message else None
        )
        
        return []

def get_recent_conversations(sender_id: str = None, days: int = 7):
    """Get recent conversations grouped by daily sessions"""
    conversations = get_conversations(sender_id)
    
    # Group conversations by date
    daily_sessions = defaultdict(list)
    for conv in conversations:
        conv_date = conv['timestamp'].date()
        daily_sessions[conv_date].append(conv)
    
    # Sort dates in descending order
    sorted_dates = sorted(daily_sessions.keys(), reverse=True)
    
    # Format the data for the frontend
    formatted_sessions = []
    for date in sorted_dates:
        sessions = daily_sessions[date]
        # Group conversations by session (based on time gaps)
        current_session = []
        sessions_by_time = []
        
        for i, conv in enumerate(sessions):
            if i > 0:
                time_diff = conv['timestamp'] - sessions[i-1]['timestamp']
                if time_diff > timedelta(minutes=30):  # New session if gap > 30 minutes
                    if current_session:
                        sessions_by_time.append(current_session)
                    current_session = []
            current_session.append(conv)
        
        if current_session:
            sessions_by_time.append(current_session)
        
        # Format each session
        for session in sessions_by_time:
            first_message = session[0]
            last_message = session[-1]
            
            formatted_sessions.append({
                'id': str(first_message['_id']),
                'title': first_message['intent'] or 'Conversation',
                'lastMessage': last_message['message'],
                'timestamp': format_timestamp(last_message['timestamp']),
                'unreadCount': 0,  # You can implement unread tracking if needed
                'date': date.strftime('%Y-%m-%d'),
                'messages': session
            })
    
    return formatted_sessions

def format_timestamp(timestamp):
    """Format timestamp for display"""
    now = datetime.now()
    today = now.date()
    yesterday = today - timedelta(days=1)
    
    if timestamp.date() == today:
        return timestamp.strftime('%I:%M %p')
    elif timestamp.date() == yesterday:
        return 'Yesterday'
    elif (now - timestamp).days < 7:
        return timestamp.strftime('%A')
    else:
        return timestamp.strftime('%b %d') 