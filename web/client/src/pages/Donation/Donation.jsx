/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useMemo } from "react";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/header";
import "./Donation.css";
import axios from "axios";
import { toast } from "react-toastify";
import { MaterialReactTable } from "material-react-table";
import { useParams } from "react-router-dom";

function Donation() {
  const [donations, setDonations] = useState([]);
  const { fundraiserId } = useParams();

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
        console.log(response.data.donations[0].donations);
      }
    } catch (error) {
      toast.error("Error fetching donations. Try again later.");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

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
      <Footer />
    </>
  );
}

export default Donation;
