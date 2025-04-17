import axios from "axios";

const RASA_API_URL =
  process.env.EXPO_PUBLIC_RASA_API_URL || "http://localhost:5005";

interface RasaResponse {
  recipient_id: string;
  text: string;
}

export const sendMessageToRasa = async (
  message: string,
  senderId: string
): Promise<RasaResponse[]> => {
  try {
    const response = await axios.post(`${RASA_API_URL}/webhooks/rest/webhook`, {
      sender: senderId,
      message: message,
    });
    return response.data;
  } catch (error) {
    console.error("Error sending message to Rasa:", error);
    throw error;
  }
};

export const startNewConversation = async (senderId: string): Promise<void> => {
  try {
    await axios.post(
      `${RASA_API_URL}/conversations/${senderId}/tracker/events`,
      {
        event: "restart",
      }
    );
  } catch (error) {
    console.error("Error starting new conversation:", error);
    throw error;
  }
};
