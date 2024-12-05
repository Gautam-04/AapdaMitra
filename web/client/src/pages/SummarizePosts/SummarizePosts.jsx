import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./SummarizePosts.css";
import Header from "../../components/header/header";
import Footer from "../../components/footer/Footer";
import ReactMarkdown from "react-markdown";
import axios from "axios";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Spinner } from "react-bootstrap";
import rehypeRaw from "rehype-raw";

const SummarizePosts = () => {
  const printRef = useRef(null);
  const incomingPosts = useLocation();
  const [posts, setPosts] = useState(incomingPosts.state.posts);
  console.log(incomingPosts);
  console.log(posts);

  const handlePrint = useReactToPrint({
    documentTitle: "Post Summary",
    contentRef: printRef,
    pageStyle: `@media print {
      @page {
        size: 500mm 500mm;
        margin: 0;
      }
    }`,
  });

  const [Report, setReport] = useState("");

  const [g, setG] = useState(null);
  useEffect(() => {
    const fetchReport = async () => {
      const reportData = posts;
      const reportGenURL = "http://127.0.0.1:5000/gemini/generate-report";
      try {
        const response = await axios({
          method: "post",
          url: reportGenURL,
          headers: { "Access-Control-Allow-Origin": "*" },
          data: { reportData },
        });
        console.log(response);
        setReport(response.data.report);
        const graphs = [];
        for (let i = 0; i < response.data.graphs.length; i++) {
          graphs.push(response.data.graphs[i].slice(1, -1));
        }
        setG(graphs);
      } catch (error) {
        console.log(error);
      }
    };
    fetchReport();
  }, []);
  return (
    <>
      <Header />
      <div className="summary-wrapper" ref={printRef}>
        <div className="summary-container">
          <div className="title">Post Summary</div>
          {/* {Role === "superAdmin" ? <>SuperAdmin</> : <> Admin</>} */}
          {Report === "" ? (
            <>
              <ReactMarkdown
                children={"Summary is Loading. Please wait..."}
                className={"md-format"}
              />
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </>
          ) : (
            <ReactMarkdown
              children={Report}
              class="md-format"
              urlTransform={(value) => value}
              rehypePlugins={[rehypeRaw]}
            />
          )}

          {/* {g && (
            <div className="graphs">
              <div className="title">Supporting Graphs</div>
              <div className="graphs-container">
                {g.map((img) => (
                  <img src={`data:image/png;base64,${img}`} alt="Graph" />
                ))}
              </div>
            </div>
          )} */}
        </div>
      </div>
      {/* <button onClick={() => handlePrint()}>Print article</button> */}
      <Footer />
    </>
  );
};

export default SummarizePosts;
