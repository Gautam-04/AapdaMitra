/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useMemo } from "react";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/header";
import "./Donation.css";
import axios from "axios";
import { toast } from "react-toastify";
import { MaterialReactTable } from "material-react-table";
import { useParams } from "react-router-dom";
import { t } from "i18next";
import LineChart from "../../components/lineChart/LineChart";
import DoughnutChart from "../../components/doughnutChart/DoughnutChart";

function Donation() {
  const [donations, setDonations] = useState([]);
  const [fundraiserInfo, setFundraiserInfo] = useState({
    fundraiser: { fullForm: "", title: "", description: "", createdAt: "" },
  });
  const [fundraiserStat, setFundraiserStat] = useState({
    data: [],
    fundraiser: { amountCollected: 0, goal: 0 },
  });
  const { fundraiserId } = useParams();

  const [pieChartSchema, setPieChartSchema] = useState({
    labels: Object.keys(fundraiserStat.fundraiser).map((data) => data),
    datasets: [
      {
        label: "Amount(₹)",
        data: Object.values(fundraiserStat.fundraiser).map((data) => data),
        backgroundColor: [
          "rgba(75,192,192,1)",
          "#ecf0f1",
          "#50AF95",
          "#f3ba2f",
          "#2a71d0",
        ],
        borderColor: "lightslategray",
        borderWidth: 1,
      },
    ],
  });

  const [lineChartSchema, setLineChartSchema] = useState({
    labels: fundraiserStat.data.map((data) => data["date"]),
    datasets: [
      {
        label: "Amount(₹)",
        data: fundraiserStat.data.map((data) => data["amount"]),
        backgroundColor: [
          "rgba(75,192,192,1)",
          "#ecf0f1",
          "#50AF95",
          "#f3ba2f",
          "#2a71d0",
        ],
        borderColor: "black",
        borderWidth: 1,
      },
    ],
  });

  // Fetch Donations
  const fetchDonations = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        params: { fundraiserId },
      };
      const response = await axios.get(
        "/api/v1/donation/get-donations",
        config
      );
      if (response.status === 200) {
        setDonations(response.data?.donations[0]?.donations);
        // console.log(response.data.donations[0].donations);
      }
    } catch (error) {
      // toast.error("Error fetching donations. Try again later.");
      console.error(error);
    }
  };

  const fetchFundraiserInfo = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        params: { fundraiserId },
      };
      const response = await axios.get(
        "/api/v1/donation/get-fundraiser-from-id",
        config
      );
      if (response.status === 200) {
        // console.log(response.data);
        setFundraiserInfo(response.data);
      }
    } catch (error) {
      // toast.error("Error fetching donation info. Try again later.");
      console.error(error);
    }
  };

  const fetchFundraiserStat = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        params: { fundraiserId },
      };
      const response = await axios.get(
        "/api/v1/donation/get-fundraiser",
        config
      );
      if (response.status === 200) {
        response.data.fundraiser.remaining =
          response.data.fundraiser.goal -
          response.data.fundraiser.amountCollected;

        response.data.goal = response.data.fundraiser.goal;
        delete response.data.fundraiser.goal;
        setFundraiserStat(response.data);
        // console.log(response.data);
      }
    } catch (error) {
      // toast.error("Error fetching donation statistics. Try again later.");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDonations();
    fetchFundraiserInfo();
    fetchFundraiserStat();
  }, []);

  useEffect(() => {
    setLineChartSchema({
      labels: fundraiserStat.data.map((data) => data["date"]),
      datasets: [
        {
          label: "Amount(₹)",
          data: fundraiserStat.data.map((data) => data["amount"]),
          backgroundColor: [
            "#2b3674",
            // "#2a71d0",
          ],
          // fill: false,
          borderColor: "#2b3674",
          borderWidth: 1,
          tension: 0.3,
        },
      ],
    });
  }, [fundraiserStat]);

  useEffect(() => {
    setPieChartSchema({
      labels: Object.keys(fundraiserStat.fundraiser).map((data) => data),
      datasets: [
        {
          label: "Amount(₹)",
          data: Object.values(fundraiserStat.fundraiser).map((data) => data),
          backgroundColor: [
            "#2b3674",
            "whitesmoke",
            // "#2a71d0",
          ],
          fill: false,
          borderColor: "#2b3674",
          borderWidth: 1,
          // tension: 0.3,
        },
      ],
    });
  }, [fundraiserStat]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "serialNumber",
        header: "Sr No",
        size: 50,
        muiTableBodyCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "paymentId",
        header: "Payment ID",
        size: 100,
        muiTableBodyCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "userId",
        header: "User ID",
        size: 100,
        muiTableBodyCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "amount",
        header: "Amount (INR)",
        Cell: ({ cell }) => `Rs. ${cell.getValue()?.toFixed(2)}`,
        size: 100,
        muiTableBodyCellProps: {
          align: "center",
        },
      },
      // {
      //     accessorKey: 'paymentTime',
      //     header: 'Transaction Time',
      //     Cell: ({ cell }) => new Date(cell.getValue()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      //     size: 100,
      //     muiTableBodyCellProps: {
      //     align: "center",
      //     },
      // },
      {
        accessorKey: "paymentDate",
        header: "Payment Date",
        Cell: ({ cell }) => new Date(cell.getValue()).toLocaleDateString(),
        size: 100,
        muiTableBodyCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "blockchain.transactionHash",
        header: "Transaction Hash",
        size: 100,
        muiTableBodyCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "blockchain.blockNumber",
        header: "Block Number",
        size: 100,
        muiTableBodyCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "blockchain.dataHash",
        header: "Data Hash",
        size: 100,
        muiTableBodyCellProps: {
          align: "center",
        },
      },
    ],
    []
  );

  return (
    <>
      <Header />
      <div className="fundraiser-wrapper">
        <div className="fundraiser-info-container">
          <div className="fundraiser-info">
            <div className="fundraiser-name">
              {fundraiserInfo.fundraiser.fullForm} (
              {fundraiserInfo.fundraiser.title})
            </div>
            <div className="fundraiser-description">
              <span>Description:</span> {fundraiserInfo.fundraiser.description}{" "}
            </div>
            <div className="fundraiser-date">
              <span>Creation Date:</span>{" "}
              {fundraiserInfo.fundraiser.createdAt.split("T")[0]}{" "}
            </div>
            <div className="fundraiser-goal">
              <span>Progress:</span> ₹
              {fundraiserInfo.fundraiser.amountCollected} / ₹
              {fundraiserInfo.fundraiser.goal}{" "}
            </div>
          </div>
          <div className="fundraiser-image">
            <img src={fundraiserInfo.fundraiser.logo} />
          </div>
        </div>

        <div className="donation-container">
          <MaterialReactTable
            columns={columns}
            data={donations}
            enablePagination={true}
            enableSorting={true}
            enableGlobalFilter={true}
            initialState={{
              sorting: [
                {
                  id: "serialNumber",
                  desc: true,
                },
              ],
            }}
          />
        </div>
        <div className="donation-charts">
          <div className="charts-donation-timeline">
            <LineChart
              chartData={lineChartSchema}
              title={"Donation Timeline"}
            />
          </div>
          <div className="charts-donation-progress">
            <DoughnutChart chartData={pieChartSchema} title={"Goal Achieved"} />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Donation;
