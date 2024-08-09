from langchain.document_loaders import PyPDFLoader
import langchain
from langchain.document_loaders import ReadTheDocsLoader, TextLoader, DirectoryLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores.faiss import FAISS
from langchain.chains import ConversationalRetrievalChain
from langchain.chat_models import ChatOpenAI
from langchain.llms import OpenAI
import pickle
import time

with open("../vs_test/miamilife_pdf_2k.pkl", "rb") as f:
        global vs
        vs = pickle.load(f)

def ss_query(query):
        ## search a question
    start_time = time.time()
    res = vs.similarity_search_with_score(query,10)
    end_time = time.time()
    elapsed_time = end_time - start_time  
    print(f"Elapsed Time: {elapsed_time} seconds") 
    # print(res)
    return res

def chat_query(query, chat_history = []):
    ## create a retriever from vector db and make sure the relavance score is larget than 0.2
    ret = vs.as_retriever(
        search_type="similarity_score_threshold",
        search_kwargs={'score_threshold': 0.6, 'k':10}
    )
    ## create a ConversationalRetrievalChain to query from ret
    chain = ConversationalRetrievalChain.from_llm(ChatOpenAI(model="gpt-4", temperature=0.7), 
                                                    retriever=ret,
                                                    return_source_documents=True,)
            ## search a question
    res = chain({"question": query, "chat_history": chat_history})
    # print(res)
    return res
