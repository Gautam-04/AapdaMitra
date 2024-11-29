import google.generativeai as genai
import os
import json
import matplotlib
import matplotlib.pyplot as plt

os.environ["KMP_DUPLICATE_LIB_OK"]="TRUE"
matplotlib.use('agg')

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


class DisasterAnalysis:
    def __init__(self, data):
        self.data = data

        genai.configure(api_key=os.environ['GEMINI_API_KEY'])
        self.model = genai.GenerativeModel('gemini-1.5-flash')
        
        self.chat = self.model.start_chat()
        print("new object for gemini created")

    def generateReportFromData(self):
        return (self.chat.send_message(f'''The data provided below is a JSON data of various social media posts related to disasters or emergency events.
                                            Analyzing the data and present a short summary for each post in the context of disaster management.Also mention the authenticity of the post in the summary.
                                            The report should provide actionable insights in context to the data.
                                            Do not add any Limitations and Conclusion section. Only return the report.
                                            Do not give summary property by property. Only include information that would help mitigate the event.
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