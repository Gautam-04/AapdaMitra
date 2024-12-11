import google.generativeai as genai
import os
import json
import matplotlib
import matplotlib.pyplot as plt

os.environ["KMP_DUPLICATE_LIB_OK"]="TRUE"
matplotlib.use('agg')
genai.configure(api_key=os.environ['GEMINI_API_KEY'])
MODEL = genai.GenerativeModel('gemini-1.5-flash')

def load_data(pathToData):
    with open(pathToData, "r") as f:
        return json.loads(f.read())
    
def executeCodeFromArray(codeArray: list[str]):
    for graph in codeArray:
        graph = graph.splitlines()
        print(graph, sep="\n")
        for line in graph:
            try:
                print(line)
                eval(line)
            except Exception as e:
                print(line)
                print(e)
        plt.clf()
    
def imageToB64(image):
    pass

def generateSummary(data):
    for post in data:
        post['post_body_full'] = ""
    response = MODEL.generate_content(f'''The data given below is multiple news articles scraped from different sources related to disasters.
                                    Read the data and generate a brief summary aggregating the data from multiple posts into a singular quick read paragraph with color coding and markdown.
                                      Don't change the font only give colors and boldness in the markdown. Only keep a maximum of three colors.
                                      Return nothing if the input is an empty array.
                                    The summary aims to summarize news articles for NDRF to get information from. {data}''')
    print(response.text)
    return response.text


def generateOneLiner(data):
    return (MODEL.generate_content(f'''Read the given data and generate a one liner summary of it.
                                    Make sure the summary is short (one-line).
                                    The summary must include the disaster type, location and time mentioned in the data. {data}''').text)
        

class DisasterAnalysis:
    def __init__(self, data):
        self.data = data

        
        self.chat = MODEL.start_chat()
        print("new object for gemini created")

    def generateReportFromData(self):
        return (self.chat.send_message(f'''The data provided below is a JSON data of various social media posts related to disasters or emergency events.
                                            Analyzing the data and present a short summary for each post in the context of disaster management.Also mention the authenticity of the post in the summary.
                                            The report should provide actionable insights in context to the data.
                                            Do not add any Limitations and Conclusion section. Only return the report.
                                            Do not give summary property by property. Only include information that would help mitigate the event.
                                            Add appropriate colors to Authenticity only in the markdown.
                                            {self.data}''').text)
    
    def generateGraphPhrases(self):
        return (self.chat.send_message(rf'''Generate four unique phrases from which graphs can be made that will help visualize the information from the data.
                                            For example, '90% of posts were from Twitter rest 10% were from News websites' or '75% of posts were authentic and 25% were fake'.
                                            Do not give graph statements but phrases for graphs.
                                            Do not give graph phrases where all the labels have the same value or there is only one label in the whole graph.
                                            Do not include any dates in the phrase.
                                            Give nothing but the graph phrases including the data needed to make those graphs.
                                            No formatting and new line for each statement.''').text)
    

    def generateGraphCodePython(self, graphPhrases, pathForSaving):
        graphCode = self.chat.send_message(f''' Below are statements to generate graphs from:
                                            {graphPhrases}
                                            Carefully ready each statement and choose which graph will best help represent that data (line, pie, chart, scatter, etc).
                                            Finally, generate a JSON array consisting of the lines of code to generate those graphs seperately using python and matplotlib that the eval function of python can directly run.
                                            Add a line for saving to '{pathForSaving}' the generated graph at the end instead of using .show().
                                            It is important that you do not declare any variables as they raise an error in eval(), directly use the corresponding data in the function parameters.
                                            No semicolons only newlines.
                                            Final output should only be a single json array and no stray text or explanations. No formatting.''').text
        
        print(graphCode)
        return json.loads(graphCode[8:len(graphCode) - 4])