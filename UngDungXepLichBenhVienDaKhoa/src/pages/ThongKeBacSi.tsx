import { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register the required components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface BacSiThongKe {
  idBacSi: string;
  hoTenBacSi: string;
  tongCa: number;
  gioiTinh: string;
}

const ThongKeBacSi = () => {
  const [thang, setThang] = useState(new Date().getMonth() + 1);
  const [nam, setNam] = useState(new Date().getFullYear());
  const [bacSiData, setBacSiData] = useState<BacSiThongKe[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortCriteria, setSortCriteria] = useState<"idBacSi" | "hoTenBacSi" | "tongCa">("idBacSi");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const fetchThongKe = async () => {
    try {
      const response = await axios.get(`https://localhost:7183/api/schedule/thong-ke-bac-si-theo-thang/${thang}/${nam}`);
      setBacSiData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchThongKe();
  }, [thang, nam]);

  const filteredData = bacSiData.filter(bacSi =>
    bacSi.idBacSi.includes(searchTerm) || bacSi.hoTenBacSi.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedData = [...filteredData].sort((a, b) => {
    let comparison = 0;

    switch (sortCriteria) {
      case "idBacSi":
        comparison = a.idBacSi.localeCompare(b.idBacSi);
        break;
      case "hoTenBacSi":
        comparison = a.hoTenBacSi.localeCompare(b.hoTenBacSi);
        break;
      case "tongCa":
        comparison = b.tongCa - a.tongCa;
        break;
      default:
        break;
    }

    return sortDirection === "asc" ? comparison : -comparison;
  });

  // Prepare chart data
  const chartData = {
    labels: sortedData.map(bacSi => bacSi.hoTenBacSi),
    datasets: [
      {
        label: 'Tổng Ca',
        data: sortedData.map(bacSi => bacSi.tongCa),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-3xl font-bold mb-4">Thống Kê Bác Sĩ Theo Tháng</h2>

      {/* Chart Section */}
      <div className="mb-8">
        <Bar data={chartData} options={{ responsive: true, plugins: { title: { display: true, text: `Thống Kê Bác Sĩ - ${thang}/${nam}` } } }} />
      </div>

      {/* Filters Section */}
      <div className="mb-4">
        <label className="mr-2">Chọn tháng:</label>
        <input
          type="number"
          value={thang}
          onChange={(e) => setThang(Number(e.target.value))}
          min="1"
          max="12"
        />
        <label className="mr-2 ml-4">Chọn năm:</label>
        <input
          type="number"
          value={nam}
          onChange={(e) => setNam(Number(e.target.value))}
          min="2000"
        />
        <label className="mr-2 ml-4">Tìm kiếm:</label>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="ID hoặc tên bác sĩ"
          className="border p-1"
        />
      </div>

      {/* Sorting Section */}
      <div className="mb-4">
        <span className="mr-2">Sắp xếp theo:</span>
        <button onClick={() => { setSortCriteria("idBacSi"); setSortDirection(sortDirection === "asc" ? "desc" : "asc"); }} className="mr-2 p-2 bg-blue-500 text-white">
          ID Bác Sĩ {sortCriteria === "idBacSi" ? (sortDirection === "asc" ? "↑" : "↓") : ""}
        </button>
        <button onClick={() => { setSortCriteria("hoTenBacSi"); setSortDirection(sortDirection === "asc" ? "desc" : "asc"); }} className="mr-2 p-2 bg-blue-500 text-white">
          Họ Tên Bác Sĩ {sortCriteria === "hoTenBacSi" ? (sortDirection === "asc" ? "↑" : "↓") : ""}
        </button>
        <button onClick={() => { setSortCriteria("tongCa"); setSortDirection(sortDirection === "asc" ? "desc" : "asc"); }} className="p-2 bg-blue-500 text-white">
          Tổng Ca {sortCriteria === "tongCa" ? (sortDirection === "asc" ? "↑" : "↓") : ""}
        </button>
      </div>

      {/* Table Section */}
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr>
            <th className="border px-4 py-2">ID Bác Sĩ</th>
            <th className="border px-4 py-2">Họ Tên Bác Sĩ</th>
            <th className="border px-4 py-2">Tổng Ca</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map(bacSi => (
            <tr key={bacSi.idBacSi}>
              <td className="border px-4 py-2">{bacSi.idBacSi}</td>
              <td className="border px-4 py-2">{bacSi.hoTenBacSi}</td>
              <td className="border px-4 py-2">{bacSi.tongCa}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ThongKeBacSi;
