from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from database import store_conversation

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