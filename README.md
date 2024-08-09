
# <img src="https://dpanther.fiu.edu/dpanther/dpmain/Images/branding_dpanther_lg.png" alt="dPanther Logo" width="200"/> dPanther Chatbot

This project is an open-source initiative aimed at leveraging Generative AI and Large Language Models (LLM) to embed digital library collections into a vector database and build a chatbot interface for intuitive and efficient searching. The project is licensed under the GNU General Public License v3 (GPL-3.0).

## Project Overview

The project involves embedding digital library collections into a vector database using state-of-the-art AI models. A chatbot interface is built on top of this, allowing users to interact with the collection through natural language queries. The chatbot is designed to understand and retrieve relevant information based on the user's input, making the digital collection more accessible and user-friendly.

## Features

- **Vector Database Integration**: Embedding digital library collections into a vector database using FAISS.
- **Natural Language Search**: Users can search the library collection using natural language queries.
- **Conversational Retrieval**: The chatbot can engage in a conversation, understanding the context of previous queries to refine search results.
- **Flask Web Service**: A Flask-based API service to handle user queries and return relevant search results.

## Installation

To run this project locally, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Vincent-Cui/dpanther_chatbot.git
   cd dpanther_chatbot
   ```

2. **Install the necessary dependencies**:
   Ensure you have Python 3.10+ installed. Then, install the required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

3. **Prepare the Vector Database**:
   - The project assumes you have a pre-built FAISS vector store. This vector store is created from the digital library collection, which should be stored in a pickle file (`.pkl`).
   - Modify the `query_data.py` script to load your vector store file:
     ```python
     with open("path_to_your_vector_store.pkl", "rb") as f:
         global vs
         vs = pickle.load(f)
     ```

4. **Run the Chatbot API**:
   Start the Flask server to serve the chatbot API:
   ```bash
   python chatbot.py
   ```
   The server will run on `http://localhost:6001`.

## Usage

You can interact with the chatbot via HTTP requests. Here are the two primary endpoints:

1. **/chat** (POST): 
   - This endpoint handles both standard and conversational queries.
   - **Request Body**:
     ```json
     {
       "qtype": 0,  # 0 for standard search, 1 for conversational search
       "query": "Your search query here"
     }
     ```
   - **Response**: A JSON object containing the search results or conversation response.

## Contributing

Contributions are welcome! If you find a bug or have a feature request, please open an issue. If you'd like to contribute code, please fork the repository and submit a pull request.

## License

This project is licensed under the GNU General Public License v3 (GPL-3.0). See the [LICENSE](LICENSE) file for more details.

## Acknowledgments

- [LangChain](https://github.com/hwchase17/langchain) for the document loading and text splitting utilities.
- [OpenAI](https://openai.com/) for the embeddings and LLM models.
- [FAISS](https://github.com/facebookresearch/faiss) for the vector database implementation.
- [Flask](https://flask.palletsprojects.com/) for the web framework.
