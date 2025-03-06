using BVĐK_API.Interfaces;
using BVĐK_API.Models;
using BVĐK_API.Repositories;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using OfficeOpenXml;
using System;
using System.Collections.Generic;
using System.Linq;

namespace BVĐK_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ScheduleController : ControllerBase
    {
        private readonly IScheduleRepository _scheduleRepository;
        private readonly IDoctorRepository _doctorRepository;
        private readonly IClinicRepository _clinicRepository;
        private readonly IShiftRepository _shiftRepository;
        private readonly ISpecializationRepository _specializationRepository;
        private readonly INgayNghiLeRepository _nghiLeRepository;
        private readonly INgayNghiPhepRepository _nghiPhepRepository;

        public ScheduleController(IScheduleRepository scheduleRepository, IDoctorRepository doctorRepository, IClinicRepository clinicRepository, IShiftRepository shiftRepository, ISpecializationRepository specializationRepository, INgayNghiLeRepository nghiLeRepository, INgayNghiPhepRepository nghiPhepRepository)
        {
            _scheduleRepository = scheduleRepository;
            _doctorRepository = doctorRepository;
            _clinicRepository = clinicRepository;
            _shiftRepository = shiftRepository;
            _specializationRepository = specializationRepository;
            _nghiLeRepository = nghiLeRepository;
            _nghiPhepRepository = nghiPhepRepository;
        }
        [HttpGet("schedules")]
        public async Task<ActionResult<List<LichTruc>>> GetAllSchedules()
        {
            var schedules = await _scheduleRepository.GetAllSchedulesAsync();
            return Ok(schedules);
        }
        [HttpGet("{idBacSi}")]
        public async Task<ActionResult<List<LichTruc>>> GetDoctorSchedules(string idBacSi)
        {
            // Lấy danh sách lịch trực cho bác sĩ theo ID
            var lichTrucList = await _scheduleRepository.GetAllSchedulesAsync();

            // Giả sử bạn có phương thức để lấy thông tin bác sĩ
            var doctor = await _doctorRepository.GetDoctorByIdAsync(idBacSi);

            if (doctor == null)
            {
                return NotFound("Không tìm thấy bác sĩ này.");
            }

            // Lấy thông tin phòng khám từ ClinicRepository
            var phongKhamList = await _clinicRepository.GetAllClinicsAsync();
            var caTrucList = await _shiftRepository.GetAllShiftsAsync();

            var doctorSchedules = lichTrucList
                .Where(l => l.Phong.Any(p => p.IDBacSi == idBacSi))
                .Select(l => new
                {
                    Id = l.Id, // Chuyển đổi Id từ ObjectId sang string
                    Ngay = l.Ngay,
                    Phong = l.Phong
                        .Where(p => p.IDBacSi == idBacSi)
                        .Select(p => new
                        {
                            p.IDPhongKham, // ID phòng khám
                            p.IDCa,
                            tenPhongKham = phongKhamList.FirstOrDefault(c => c.ClinicId == p.IDPhongKham)?.ClinicName,
                            diaChi = phongKhamList.FirstOrDefault(c => c.ClinicId == p.IDPhongKham)?.Address,
                            tenCa = caTrucList.FirstOrDefault(c => c.ShiftId == p.IDCa)?.ShiftName,
                            gioBD = DateTime.Parse($"{l.Ngay:yyyy-MM-dd} {caTrucList.FirstOrDefault(c => c.ShiftId == p.IDCa)?.StartTime:HH:mm:ss}"),
                            gioKT = DateTime.Parse($"{l.Ngay:yyyy-MM-dd} {caTrucList.FirstOrDefault(c => c.ShiftId == p.IDCa)?.EndTime:HH:mm:ss}")
                        })
                        .ToList(),
                })
                .ToList();

            if (!doctorSchedules.Any())
            {
                return NotFound("Không tìm thấy lịch trực cho bác sĩ này.");
            }

            return Ok(doctorSchedules);
        }


        [HttpGet("export-monthly")]
        public async Task<IActionResult> ExportMonthlySchedule(DateTime month)
        {
            // Xác định ngày đầu tháng và ngày cuối tháng
            DateTime startOfMonth = new DateTime(month.Year, month.Month, 1);
            DateTime endOfMonth = startOfMonth.AddMonths(1).AddDays(-1);

            // Lấy lịch trực trong tháng
            var schedules = await _scheduleRepository.GetSchedulesBetweenDatesAsync(startOfMonth, endOfMonth);

            if (!schedules.Any())
                return NotFound("Không có lịch trực trong tháng này.");

            // Thiết lập giấy phép cho EPPlus
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

            // Tạo file Excel
            using var package = new ExcelPackage();
            var worksheet = package.Workbook.Worksheets.Add("Monthly Schedule");

            // Thêm thông tin về bệnh viện và phòng kế hoạch tổng hợp
            worksheet.Cells[1, 1].Value = "BỆNH VIỆN ĐA KHOA SÀI GÒN";
            worksheet.Cells[2, 1].Value = "PHÒNG KẾ HOẠCH TỔNG HỢP";
            worksheet.Cells[3, 1].Value = "DANH SÁCH BÁC SĨ ĐIỀU DƯỠNG RA KHOA KHÁM BỆNH";
            worksheet.Cells[4, 1].Value = $"Tháng {month.Month} năm {month.Year}";

            // Căn giữa tiêu đề và thay đổi kích thước chữ
            worksheet.Cells[1, 1, 1, 6].Merge = true;
            worksheet.Cells[1, 1, 1, 6].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Left;
            worksheet.Cells[1, 1, 1, 6].Style.Font.Size = 12;
            worksheet.Cells[1, 1, 1, 6].Style.Font.Bold = true;

            worksheet.Cells[2, 1, 2, 6].Merge = true;
            worksheet.Cells[2, 1, 2, 6].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Left;
            worksheet.Cells[2, 1, 2, 6].Style.Font.Size = 12;
            worksheet.Cells[2, 1, 2, 6].Style.Font.Bold = true;

            worksheet.Cells[3, 1, 3, 6].Merge = true;
            worksheet.Cells[3, 1, 3, 6].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
            worksheet.Cells[3, 1, 3, 6].Style.Font.Size = 20;
            worksheet.Cells[3, 1, 3, 6].Style.Font.Bold = true;

            worksheet.Cells[4, 1, 4, 6].Merge = true;
            worksheet.Cells[4, 1, 4, 6].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
            worksheet.Cells[4, 1, 4, 6].Style.Font.Size = 12;
            worksheet.Cells[4, 1, 4, 6].Style.Font.Bold = true;

            // Tạo header
            worksheet.Cells[5, 1].Value = "Ngày";
            worksheet.Cells[5, 2].Value = "Khoa - Phòng";
            worksheet.Cells[5, 3].Value = "Bác Sĩ";
            worksheet.Cells[5, 4].Value = "Ca Trực";
            worksheet.Cells[5, 5].Value = "Giờ Bắt Đầu";
            worksheet.Cells[5, 6].Value = "Giờ Kết Thúc";

            // Lấy thông tin phòng khám, ca trực và bác sĩ
            var phongKhamList = await _clinicRepository.GetAllClinicsAsync();
            var caTrucList = await _shiftRepository.GetAllShiftsAsync();

            int row = 6;
            foreach (var schedule in schedules)
            {
                foreach (var phong in schedule.Phong)
                {
                    // Lấy thông tin bác sĩ
                    var doctor = await _doctorRepository.GetDoctorByIdAsync(phong.IDBacSi);
                    if (doctor == null) continue;

                    // Lấy thông tin phòng khám và ca trực
                    var phongKham = phongKhamList.FirstOrDefault(c => c.ClinicId == phong.IDPhongKham);
                    var caTruc = caTrucList.FirstOrDefault(c => c.ShiftId == phong.IDCa);

                    // Chèn dữ liệu vào các ô Excel
                    worksheet.Cells[row, 1].Value = schedule.Ngay.AddDays(1).ToString("dd/MM/yyyy");
                    worksheet.Cells[row, 2].Value = phongKham?.ClinicName; // Tên khoa - phòng
                    worksheet.Cells[row, 3].Value = doctor?.hoTen; // Tên bác sĩ
                    worksheet.Cells[row, 4].Value = caTruc?.ShiftName; // Tên ca trực
                    worksheet.Cells[row, 5].Value = caTruc.StartTime; // Giờ bắt đầu
                    worksheet.Cells[row, 6].Value = caTruc.EndTime; // Giờ kết thúc
                    row++;
                }
            }

            // Tạo style cho header
            using (var range = worksheet.Cells[5, 1, 5, 6])
            {
                range.Style.Font.Bold = true;
                range.Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                range.Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.LightGray);
                range.Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
            }

            // Tạo style cho các ô dữ liệu
            using (var range = worksheet.Cells[6, 1, row - 1, 6])
            {
                range.Style.Border.Top.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
                range.Style.Border.Left.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
                range.Style.Border.Right.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
                range.Style.Border.Bottom.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
            }

            // Auto-fit columns
            worksheet.Cells[worksheet.Dimension.Address].AutoFitColumns();

            // Trả về file Excel
            var excelData = package.GetAsByteArray();
            return File(excelData, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "MonthlySchedule.xlsx");
        }

        [HttpGet("export-weekly")]
        public async Task<IActionResult> ExportWeeklySchedule(int weekNumber, DateTime month)
        {
            // Xác định ngày đầu tháng và ngày cuối tháng
            DateTime startOfMonth = new DateTime(month.Year, month.Month, 1);
            DateTime endOfMonth = startOfMonth.AddMonths(1).AddDays(-1);

            // Xác định ngày đầu tuần đầu tiên của tháng (Thứ Hai)
            int daysToSubtract = ((int)startOfMonth.DayOfWeek + 6) % 7; // Đếm lùi về Thứ Hai
            DateTime startOfFirstWeek = startOfMonth.AddDays(-daysToSubtract);

            // Tính ngày bắt đầu và ngày kết thúc của tuần
            DateTime startDate = startOfFirstWeek.AddDays((weekNumber - 1) * 7);
            startDate = startDate.AddDays(-1);
            DateTime startDateLabel = startDate.AddDays(1);
            DateTime endDate = startDate.AddDays(7);


            // Lấy dữ liệu lịch trực từ repository
            var schedules = await _scheduleRepository.GetSchedulesBetweenDatesAsync(startDate, endDate);

            if (!schedules.Any())
                return NotFound("Không có lịch trực trong tuần này.");

            // Thiết lập giấy phép EPPlus
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

            // Tạo file Excel
            using var package = new ExcelPackage();
            var worksheet = package.Workbook.Worksheets.Add("Weekly Schedule");

            // Thêm thông tin về bệnh viện và phòng kế hoạch tổng hợp
            worksheet.Cells[1, 1].Value = "BỆNH VIỆN ĐA KHOA SÀI GÒN";
            worksheet.Cells[2, 1].Value = "PHÒNG KẾ HOẠCH TỔNG HỢP";
            worksheet.Cells[3, 1].Value = "DANH SÁCH BÁC SĨ ĐIỀU DƯỠNG RA KHOA KHÁM BỆNH";
            worksheet.Cells[4, 1].Value = $"Tuần lễ từ ngày: {startDateLabel:dd/MM/yyyy} - {endDate:dd/MM/yyyy}";

            // Căn giữa tiêu đề và thay đổi kích thước chữ
            worksheet.Cells[1, 1, 1, 8].Merge = true;
            worksheet.Cells[1, 1, 1, 8].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Left;
            worksheet.Cells[1, 1, 1, 8].Style.Font.Size = 12;
            worksheet.Cells[1, 1, 1, 8].Style.Font.Bold = true;

            worksheet.Cells[2, 1, 2, 8].Merge = true;
            worksheet.Cells[2, 1, 2, 8].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Left;
            worksheet.Cells[2, 1, 2, 8].Style.Font.Size = 12;
            worksheet.Cells[2, 1, 2, 8].Style.Font.Bold = true;

            worksheet.Cells[3, 1, 3, 8].Merge = true;
            worksheet.Cells[3, 1, 3, 8].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
            worksheet.Cells[3, 1, 3, 8].Style.Font.Size = 20;
            worksheet.Cells[3, 1, 3, 8].Style.Font.Bold = true;

            worksheet.Cells[4, 1, 4, 8].Merge = true;
            worksheet.Cells[4, 1, 4, 8].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
            worksheet.Cells[4, 1, 4, 8].Style.Font.Size = 12;
            worksheet.Cells[4, 1, 4, 8].Style.Font.Bold = true;


            // Tạo header
            worksheet.Cells[5, 1].Value = "KHOA - PHÒNG";
            worksheet.Cells[5, 2].Value = $"Thứ Hai\n{startDateLabel:dd/MM/yyyy}";
            worksheet.Cells[5, 3].Value = $"Thứ Ba\n{startDateLabel.AddDays(1):dd/MM/yyyy}";
            worksheet.Cells[5, 4].Value = $"Thứ Tư\n{startDateLabel.AddDays(2):dd/MM/yyyy}";
            worksheet.Cells[5, 5].Value = $"Thứ Năm\n{startDateLabel.AddDays(3):dd/MM/yyyy}";
            worksheet.Cells[5, 6].Value = $"Thứ Sáu\n{startDateLabel.AddDays(4):dd/MM/yyyy}";
            worksheet.Cells[5, 7].Value = $"Thứ Bảy\n{startDateLabel.AddDays(5):dd/MM/yyyy}";
            worksheet.Cells[5, 8].Value = $"Chủ Nhật\n{startDateLabel.AddDays(6):dd/MM/yyyy}";

            // Đảm bảo văn bản được bọc trong các ô (Enable text wrapping)
            for (int col = 1; col <= 8; col++)
            {
                worksheet.Cells[5, col].Style.WrapText = true;
                worksheet.Cells[5, col].Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Center;
            }


            // Lấy danh sách phòng khám, ca trực và bác sĩ từ cơ sở dữ liệu
            var phongKhamList = await _clinicRepository.GetAllClinicsAsync();
            var caTrucList = await _shiftRepository.GetAllShiftsAsync();
            var doctorList = await _doctorRepository.GetAllDoctorsAsync();

            int row = 6;
            foreach (var phongKham in phongKhamList)
            {
                // Inside your loop where you're adding the clinic names:
                worksheet.Cells[row, 1].Value = phongKham.ClinicName.ToUpper(); // Tên khoa - phòng, converted to uppercase
                worksheet.Cells[row, 1].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center; // Căn giữa ngang
                worksheet.Cells[row, 1].Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Center; // Căn giữa dọc
                worksheet.Cells[row, 1].Style.Font.Size = 12; // Set font size to 12

                for (int dayOffset = 0; dayOffset < 7; dayOffset++) // From Monday to Sunday
                {
                    var currentDate = startDate.AddDays(dayOffset); // Calculate the current date for the loop
                    var dailySchedule = schedules.Where(s => s.Ngay.Date == currentDate.Date).ToList(); // Get the schedule for the current day
                    if (dailySchedule.Any())
                    {
                        var shifts = "";
                        foreach (var schedule in dailySchedule)
                        {
                            foreach (var phong in schedule.Phong.Where(p => p.IDPhongKham == phongKham.ClinicId))
                            {
                                var doctor = doctorList.FirstOrDefault(d => d.ID_bacSi == phong.IDBacSi);
                                var caTruc = caTrucList.FirstOrDefault(c => c.ShiftId == phong.IDCa);
                                if (doctor != null && caTruc != null)
                                {
                                    shifts += doctor.hoTen + " (" + caTruc.ShiftName + ")" + "\n";
                                }
                            }
                        }
                        var cell = worksheet.Cells[row, 2 + dayOffset]; // Adjust cell column for each day
                        cell.Value = shifts.Trim();
                        cell.Style.WrapText = true;
                        cell.Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
                        cell.Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Center;
                    }
                }

                row++;
            }


            // Tạo style cho header
            using (var range = worksheet.Cells[5, 1, 5, 8])
            {
                range.Style.Font.Bold = true;
                range.Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                range.Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.LightGray);
                range.Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
            }

            // Tạo style cho các ô dữ liệu
            using (var range = worksheet.Cells[6, 1, row - 1, 8])
            {
                range.Style.Border.Top.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
                range.Style.Border.Left.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
                range.Style.Border.Right.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
                range.Style.Border.Bottom.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
                range.Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
            }

            // Auto-fit columns
            worksheet.Cells[worksheet.Dimension.Address].AutoFitColumns();

            // Adjust the width of columns from Thứ Hai to Chủ Nhật 
            for (int col = 2; col <= 8; col++)
            {
                worksheet.Column(col).Width = 30;
            }

            // Footer
            worksheet.Cells[row + 1, 1].Value = "Ghi chú:";
            worksheet.Cells[row + 1, 1].Style.Font.Size = 10;
            worksheet.Cells[row + 2, 1].Value = "- Bác sĩ có đánh dấu (*) là bác sĩ chính của phòng khám.";
            worksheet.Cells[row + 2, 1].Style.Font.Size = 10;

            var stream = new MemoryStream(package.GetAsByteArray());

            // Trả về file excel
            return File(stream, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Lich_Truc_" + DateTime.Now.ToString("yyyyMMdd") + ".xlsx");
        }



        [HttpGet("export-weekly-doctor")]
        public async Task<IActionResult> ExportWeeklyScheduleByDoctor(string idBacSi, int weekNumber, DateTime month)
        {
            // Xác định ngày đầu tháng và ngày cuối tháng
            DateTime startOfMonth = new DateTime(month.Year, month.Month, 1);
            DateTime endOfMonth = startOfMonth.AddMonths(1).AddDays(-1);

            // Xác định ngày đầu tuần đầu tiên của tháng (Thứ Hai)
            int daysToSubtract = ((int)startOfMonth.DayOfWeek + 6) % 7;
            DateTime startOfFirstWeek = startOfMonth.AddDays(-daysToSubtract);

            // Tính ngày bắt đầu và kết thúc của tuần
            DateTime startDate = startOfFirstWeek.AddDays((weekNumber - 1) * 7);
            startDate = startDate.AddDays(-1);
            DateTime startDateLabel = startDate.AddDays(1);
            DateTime endDate = startDate.AddDays(7);


            // Lấy thông tin bác sĩ
            var doctor = await _doctorRepository.GetDoctorByIdAsync(idBacSi);
            if (doctor == null)
                return NotFound("Không tìm thấy bác sĩ này.");

            // Lấy lịch trực của bác sĩ
            var schedules = await _scheduleRepository.GetAllSchedulesAsync();
            var doctorSchedules = schedules
                .Where(s => s.Ngay >= startDate && s.Ngay <= endDate)
                .SelectMany(s => s.Phong.Where(p => p.IDBacSi == idBacSi), (s, p) => new
                {
                    s.Ngay,
                    p.IDPhongKham,
                    p.IDCa
                })
                .ToList();

            if (!doctorSchedules.Any())
                return NotFound("Không có lịch trực cho bác sĩ trong tuần này.");

            // Lấy danh sách phòng khám và ca trực
            var clinics = await _clinicRepository.GetAllClinicsAsync();
            var shifts = await _shiftRepository.GetAllShiftsAsync();

            // Thiết lập giấy phép EPPlus
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

            // Tạo file Excel
            using var package = new ExcelPackage();
            var worksheet = package.Workbook.Worksheets.Add("Weekly Doctor Schedule");

            // Thêm thông tin tiêu đề
            worksheet.Cells[1, 1].Value = "BỆNH VIỆN ĐA KHOA SÀI GÒN";
            worksheet.Cells[2, 1].Value = "PHÒNG KẾ HOẠCH TỔNG HỢP";
            worksheet.Cells[3, 1].Value = $"LỊCH TRỰC TUẦN CHO BÁC SĨ: {doctor.hoTen.ToUpper()}";
            worksheet.Cells[4, 1].Value = $"Tuần lễ từ ngày: {startDateLabel:dd/MM/yyyy} - {endDate:dd/MM/yyyy}";

            worksheet.Cells[1, 1, 1, 8].Merge = true;
            worksheet.Cells[1, 1].Style.Font.Bold = true;
            worksheet.Cells[1, 1].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Left;

            worksheet.Cells[3, 1, 3, 8].Merge = true;
            worksheet.Cells[3, 1].Style.Font.Bold = true;
            worksheet.Cells[3, 1].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;

            // Tạo header
            worksheet.Cells[5, 1].Value = "NGÀY";
            worksheet.Cells[5, 2].Value = "PHÒNG KHÁM";
            worksheet.Cells[5, 3].Value = "CA TRỰC";
            worksheet.Cells[5, 4].Value = "GIỜ BẮT ĐẦU";
            worksheet.Cells[5, 5].Value = "GIỜ KẾT THÚC";

            worksheet.Cells[5, 1, 5, 5].Style.Font.Bold = true;
            worksheet.Cells[5, 1, 5, 5].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;

            int row = 6;
            foreach (var schedule in doctorSchedules)
            {
                var clinic = clinics.FirstOrDefault(c => c.ClinicId == schedule.IDPhongKham);
                var shift = shifts.FirstOrDefault(s => s.ShiftId == schedule.IDCa);

                string[] ngayTrongTuan = { "Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy" };
                int ngayTrongTuanIndex = (int)schedule.Ngay.AddDays(1).DayOfWeek; 
                string ngayHienThi = $"{ngayTrongTuan[ngayTrongTuanIndex]} - {schedule.Ngay.AddDays(1).ToString("dd/MM/yyyy")}";

                worksheet.Cells[row, 1].Value = ngayHienThi;
                worksheet.Cells[row, 2].Value = clinic?.ClinicName;
                worksheet.Cells[row, 3].Value = shift?.ShiftName;
                worksheet.Cells[row, 4].Value = shift?.StartTime.ToString();
                worksheet.Cells[row, 5].Value = shift?.EndTime.ToString();

                row++;
            }


            // Tạo style cho các ô dữ liệu
            using (var range = worksheet.Cells[6, 1, row - 1, 5])
            {
                range.Style.Border.Top.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
                range.Style.Border.Left.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
                range.Style.Border.Right.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
                range.Style.Border.Bottom.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
                range.Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
            }

            // Auto-fit columns
            worksheet.Cells[worksheet.Dimension.Address].AutoFitColumns();

            // Trả về file Excel
            var stream = new MemoryStream(package.GetAsByteArray());
            return File(stream, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", $"Lich_Truc_BacSi_{doctor.hoTen}_{DateTime.Now:yyyyMMdd}.xlsx");
        }
        [HttpGet("export-monthly-doctor")]
        public async Task<IActionResult> ExportMonthlyScheduleByDoctor(string idBacSi, DateTime month)
        {
            // Xác định ngày đầu tháng và ngày cuối tháng
            DateTime startOfMonth = new DateTime(month.Year, month.Month, 1);
            startOfMonth = startOfMonth.AddDays(-1);
            DateTime endOfMonth = startOfMonth.AddMonths(1).AddDays(-1);
            endOfMonth = endOfMonth.AddDays(1);
            // Lấy thông tin bác sĩ
            var doctor = await _doctorRepository.GetDoctorByIdAsync(idBacSi);
            if (doctor == null)
                return NotFound("Không tìm thấy bác sĩ này.");

            // Lấy lịch trực của bác sĩ trong tháng
            var schedules = await _scheduleRepository.GetAllSchedulesAsync();
            var doctorSchedules = schedules
                .Where(s => s.Ngay >= startOfMonth && s.Ngay <= endOfMonth)
                .SelectMany(s => s.Phong.Where(p => p.IDBacSi == idBacSi), (s, p) => new
                {
                    s.Ngay,
                    p.IDPhongKham,
                    p.IDCa
                })
                .ToList();

            if (!doctorSchedules.Any())
                return NotFound("Không có lịch trực cho bác sĩ trong tháng này.");

            // Lấy danh sách phòng khám và ca trực
            var clinics = await _clinicRepository.GetAllClinicsAsync();
            var shifts = await _shiftRepository.GetAllShiftsAsync();

            // Thiết lập giấy phép EPPlus
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

            // Tạo file Excel
            using var package = new ExcelPackage();
            var worksheet = package.Workbook.Worksheets.Add("Monthly Doctor Schedule");

            // Thêm thông tin tiêu đề
            worksheet.Cells[1, 1].Value = "BỆNH VIỆN ĐA KHOA SÀI GÒN";
            worksheet.Cells[2, 1].Value = "PHÒNG KẾ HOẠCH TỔNG HỢP";
            worksheet.Cells[3, 1].Value = $"LỊCH TRỰC THÁNG CHO BÁC SĨ: {doctor.hoTen.ToUpper()}";
            worksheet.Cells[4, 1].Value = $"Tháng: {month:MM/yyyy}";

            worksheet.Cells[1, 1, 1, 8].Merge = true;
            worksheet.Cells[1, 1].Style.Font.Bold = true;
            worksheet.Cells[1, 1].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Left;

            worksheet.Cells[3, 1, 3, 8].Merge = true;
            worksheet.Cells[3, 1].Style.Font.Bold = true;
            worksheet.Cells[3, 1].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;

            // Tạo header
            worksheet.Cells[5, 1].Value = "NGÀY";
            worksheet.Cells[5, 2].Value = "PHÒNG KHÁM";
            worksheet.Cells[5, 3].Value = "CA TRỰC";
            worksheet.Cells[5, 4].Value = "GIỜ BẮT ĐẦU";
            worksheet.Cells[5, 5].Value = "GIỜ KẾT THÚC";

            worksheet.Cells[5, 1, 5, 5].Style.Font.Bold = true;
            worksheet.Cells[5, 1, 5, 5].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;

            int row = 6;
            foreach (var schedule in doctorSchedules)
            {
                var clinic = clinics.FirstOrDefault(c => c.ClinicId == schedule.IDPhongKham);
                var shift = shifts.FirstOrDefault(s => s.ShiftId == schedule.IDCa);

                string[] ngayTrongThang = { "Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy" };
                int ngayTrongTuanIndex = (int)schedule.Ngay.AddDays(1).DayOfWeek; 
                string ngayHienThi = $"{ngayTrongThang[ngayTrongTuanIndex]} - {schedule.Ngay.AddDays(1).ToString("dd/MM/yyyy")}"; 

                worksheet.Cells[row, 1].Value = ngayHienThi;
                worksheet.Cells[row, 2].Value = clinic?.ClinicName;
                worksheet.Cells[row, 3].Value = shift?.ShiftName;
                worksheet.Cells[row, 4].Value = shift?.StartTime.ToString();
                worksheet.Cells[row, 5].Value = shift?.EndTime.ToString();

                row++;
            }


            // Tạo style cho các ô dữ liệu
            using (var range = worksheet.Cells[6, 1, row - 1, 5])
            {
                range.Style.Border.Top.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
                range.Style.Border.Left.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
                range.Style.Border.Right.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
                range.Style.Border.Bottom.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
                range.Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
            }

            // Auto-fit columns
            worksheet.Cells[worksheet.Dimension.Address].AutoFitColumns();

            // Trả về file Excel
            var stream = new MemoryStream(package.GetAsByteArray());
            return File(stream, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", $"Lich_Truc_BacSi_{doctor.hoTen}_{month:yyyyMM}.xlsx");
        }




        [HttpPost("xep-lich/{dtp}")]
        public async Task<ActionResult<List<LichTruc>>> XepLichTrucTuDong(DateTime dtp)
        {
            // Kiểm tra nếu ngày dtp nhỏ hơn tháng hiện tại thì trả về thông báo lỗi
            DateTime currentDate = DateTime.UtcNow; // Sử dụng giờ UTC để tránh lệch múi giờ
            DateTime currentMonth = new DateTime(currentDate.Year, currentDate.Month, 1); // Lấy ngày đầu tiên của tháng hiện tại
            DateTime targetMonth = new DateTime(dtp.Year, dtp.Month, 1); // Lấy ngày đầu tiên của tháng cần xếp lịch

            if (targetMonth < currentMonth)
            {
                return BadRequest("Không thể xếp lịch cho tháng trong quá khứ.");
            }

            // Kiểm tra xem tháng này đã có lịch trực chưa
            var isScheduleExist = await _scheduleRepository.IsScheduleExistForMonthAsync(dtp);

            if (isScheduleExist)
            {
                // Nếu đã có lịch, trả về thông báo rằng không cần xếp lịch mới
                return BadRequest("Đã có lịch trực cho tháng này, không cần xếp lại.");
            }

            // Lấy danh sách bác sĩ, phòng khám, ca trực, ngày nghỉ lễ từ repository
            var bacSiList = await _doctorRepository.GetAllDoctorsAsync();
            var phongKhamList = await _clinicRepository.GetAllClinicsAsync();
            var caTrucList = await _shiftRepository.GetAllShiftsAsync();
            var ngayNghiLeList = await _nghiLeRepository.GetAllNgayNghiLeAsync();
            var ngayNghiPhepList = await _nghiPhepRepository.GetAllNgayNghiPhepAsync();

            // Xếp lịch trực
            var lichTruc = XepLichTruc(bacSiList, phongKhamList, caTrucList, ngayNghiLeList, ngayNghiPhepList, dtp);

            // Lưu tất cả lịch trực vào MongoDB
            await _scheduleRepository.CreateSchedulesAsync(lichTruc);

            return Ok(lichTruc);
        }

        [HttpDelete("xoa-lich-thang/{dtp}")]
        public async Task<ActionResult> XoaLichThang(DateTime dtp)
        {
            try
            {
                // Normalize to the start of the day (midnight) to avoid time issues
                dtp = dtp.Date; // This sets the time part to 00:00:00 for consistency

                // Kiểm tra nếu ngày dtp nhỏ hơn tháng hiện tại thì trả về thông báo lỗi
                DateTime currentDate = DateTime.UtcNow; // Sử dụng giờ UTC để tránh lệch múi giờ
                DateTime currentMonth = new DateTime(currentDate.Year, currentDate.Month, 1); // Lấy ngày đầu tiên của tháng hiện tại
                DateTime targetMonth = new DateTime(dtp.Year, dtp.Month, 1); // Lấy ngày đầu tiên của tháng cần xóa lịch

                if (targetMonth < currentMonth)
                {
                    return BadRequest("Không thể xóa lịch của tháng trong quá khứ.");
                }

                // Kiểm tra xem tháng này có lịch trực hay không
                var isScheduleExist = await _scheduleRepository.IsScheduleExistForMonthAsync(dtp);

                if (!isScheduleExist)
                {
                    // Nếu không có lịch trực trong tháng này, trả về thông báo rằng không có lịch để xóa
                    return BadRequest("Không có lịch trực để xóa cho tháng này.");
                }

                // Xóa tất cả lịch trực trong tháng này
                await _scheduleRepository.DeleteSchedulesForMonthAsync(dtp);

                // Trả về thông báo thành công
                return Ok("Đã xóa toàn bộ lịch của tháng này.");
            }
            catch (Exception ex)
            {
                // Xử lý lỗi nếu có
                return StatusCode(500, $"Có lỗi xảy ra khi xóa lịch: {ex.Message}");
            }
        }




        private List<LichTruc> XepLichTruc(List<Doctor> bacSiList, List<Clinic> phongKhamList, List<Shift> caTrucList, List<NgayNghiLe> ngayNghiLeList, List<NgayNghiPhep> ngayNghiPhepList, DateTime dtp)
        {
            Random rand = new Random();
            var lichTruc = KhoiTaoLichTruc(dtp, bacSiList, phongKhamList, caTrucList, ngayNghiLeList, ngayNghiPhepList);
            double temperature = 10000; // Initial temperature
            double coolingRate = 0.003; // Cooling rate
            double minimumTemperature = 1; // Define a minimum temperature

            while (temperature > minimumTemperature)
            {
                var newLichTruc = ThayDoiNgauNhien(lichTruc, bacSiList, phongKhamList, caTrucList, rand);
                double currentEnergy = TinhNangLuong(lichTruc, phongKhamList);
                double newEnergy = TinhNangLuong(newLichTruc, phongKhamList);

                if (newEnergy < currentEnergy && ValidateSchedule(newLichTruc))
                {
                    lichTruc = newLichTruc;
                }
                else if (rand.NextDouble() < Math.Exp((currentEnergy - newEnergy) / temperature) && ValidateSchedule(newLichTruc))
                {
                    lichTruc = newLichTruc;
                }

                temperature *= 1 - coolingRate;
            }

            return lichTruc;
        }


        private bool ValidateSchedule(List<LichTruc> lichTruc)
        {
            var soCaTrucBacSi = new Dictionary<string, int>();
            var soCaTrucBacSiTrongNgay = new Dictionary<string, int>();

            foreach (var ngay in lichTruc)
            {
                soCaTrucBacSiTrongNgay.Clear();

                foreach (var phong in ngay.Phong)
                {
                    if (!soCaTrucBacSi.ContainsKey(phong.IDBacSi))
                    {
                        soCaTrucBacSi[phong.IDBacSi] = 0;
                    }
                    soCaTrucBacSi[phong.IDBacSi]++;

                    if (!soCaTrucBacSiTrongNgay.ContainsKey(phong.IDBacSi))
                    {
                        soCaTrucBacSiTrongNgay[phong.IDBacSi] = 0;
                    }
                    soCaTrucBacSiTrongNgay[phong.IDBacSi]++;
                }

                foreach (var kvp in soCaTrucBacSiTrongNgay)
                {
                    if (kvp.Value > 1)
                    {
                        return false;
                    }
                }
            }

            var soCaTrucBacSiTrongTuan = new Dictionary<string, int>();
            foreach (var kvp in soCaTrucBacSi)
            {
                if (!soCaTrucBacSiTrongTuan.ContainsKey(kvp.Key))
                {
                    soCaTrucBacSiTrongTuan[kvp.Key] = 0;
                }
                soCaTrucBacSiTrongTuan[kvp.Key] += kvp.Value;

                if (soCaTrucBacSiTrongTuan[kvp.Key] > 7)
                {
                    return false;
                }
            }

            foreach (var kvp in soCaTrucBacSi)
            {
                if (kvp.Value > 30)
                {
                    return false;
                }
            }

            return true;
        }

        private List<LichTruc> KhoiTaoLichTruc(DateTime dtp, List<Doctor> bacSiList, List<Clinic> phongKhamList, List<Shift> caTrucList, List<NgayNghiLe> ngayNghiLeList, List<NgayNghiPhep> ngayNghiPhepList)
        {
            var lichTruc = new List<LichTruc>();
            Random rand = new Random();
            var soCaTrucBacSi = new Dictionary<string, int>();

            int year = dtp.Year;
            int month = dtp.Month;

            DateTime firstDayOfMonth = new DateTime(year, month, 1);
            DateTime lastDayOfMonth = new DateTime(year, month, DateTime.DaysInMonth(year, month));

            for (DateTime day = firstDayOfMonth; day <= lastDayOfMonth; day = day.AddDays(1))
            {
                if (ngayNghiLeList.Any(n => n.NgayLes.Contains(day.ToString("MM-dd"))))
                {
                    continue; // Bỏ qua ngày nghỉ lễ
                }

                var lichTrucNgay = new LichTruc { Ngay = day };
                var soCaTrucBacSiTrongNgay = new Dictionary<string, int>();

                foreach (var caTruc in caTrucList)
                {
                    foreach (var phongKham in phongKhamList)
                    {
                        // Lọc phòng khám theo chuyên khoa của bác sĩ
                        var availableDoctors = bacSiList
                            .Where(b =>
                                b.ID_chuyenKhoa == phongKham.IDChuyenKhoa && // Điều kiện chuyên khoa trùng khớp với phòng khám
                                (!soCaTrucBacSiTrongNgay.ContainsKey(b.ID_bacSi) || soCaTrucBacSiTrongNgay[b.ID_bacSi] < 1) && // Bác sĩ không trực quá 3 ca/ngày
                                (!soCaTrucBacSi.ContainsKey(b.ID_bacSi) || soCaTrucBacSi[b.ID_bacSi] < 30) // Bác sĩ không trực quá 78 ca/tháng
                            ).ToList();

                        // Nếu ca trực là ca đêm, chỉ chọn bác sĩ thuộc chuyên khoa capCuu_01
                        if (caTruc.ShiftId == "caD_03")
                        {
                            availableDoctors = availableDoctors.Where(b => b.ID_chuyenKhoa == "capCuu_01").ToList();
                        }

                        // Số lượng bác sĩ cần chọn từ danh sách đã lọc
                        int numberOfDoctorsToSelect = Math.Min(rand.Next(1, 4), availableDoctors.Count);
                        var selectedDoctors = availableDoctors
                            .OrderBy(_ => rand.Next())
                            .Take(numberOfDoctorsToSelect)
                            .ToList();

                        if (selectedDoctors.Count > 0)
                        {
                            foreach (var doctor in selectedDoctors)
                            {
                                // Cập nhật số ca trực của bác sĩ trong ngày
                                if (!soCaTrucBacSiTrongNgay.ContainsKey(doctor.ID_bacSi))
                                {
                                    soCaTrucBacSiTrongNgay[doctor.ID_bacSi] = 0;
                                }
                                soCaTrucBacSiTrongNgay[doctor.ID_bacSi]++;

                                // Cập nhật tổng số ca trực của bác sĩ
                                if (!soCaTrucBacSi.ContainsKey(doctor.ID_bacSi))
                                {
                                    soCaTrucBacSi[doctor.ID_bacSi] = 0;
                                }
                                soCaTrucBacSi[doctor.ID_bacSi]++;

                                var phongTruc = new PhongTruc
                                {
                                    IDCa = caTruc.ShiftId,
                                    IDPhongKham = phongKham.ClinicId,
                                    IDBacSi = doctor.ID_bacSi
                                };

                                lichTrucNgay.Phong.Add(phongTruc);
                            }
                        }
                    }
                }

                lichTruc.Add(lichTrucNgay);
            }

            return lichTruc;
        }

        private double TinhNangLuong(List<LichTruc> lichTruc, List<Clinic> phongKhamList)
        {
            double nangLuong = 0.0;
            int soPhongKham = phongKhamList.Count;
            int soCaTrucMax = 30; // Số ca trực tối đa trong 7 ngày

            var soNgayTrucBacSi = new Dictionary<string, int>();

            foreach (var ngay in lichTruc)
            {
                foreach (var caTruc in ngay.Phong)
                {
                    if (!soNgayTrucBacSi.ContainsKey(caTruc.IDBacSi))
                    {
                        soNgayTrucBacSi[caTruc.IDBacSi] = 0;
                    }
                    soNgayTrucBacSi[caTruc.IDBacSi]++;
                }
            }

            foreach (var kvp in soNgayTrucBacSi)
            {
                if (kvp.Value > soCaTrucMax)
                {
                    nangLuong += (kvp.Value - soCaTrucMax) * 10; // Cứ mỗi ca vượt, tăng 10 năng lượng
                }
            }

            foreach (var ngay in lichTruc)
            {
                var phongKhamSet = new HashSet<string>();
                foreach (var phong in ngay.Phong)
                {
                    phongKhamSet.Add(phong.IDPhongKham);
                }
                int missingRooms = soPhongKham - phongKhamSet.Count;
                if (missingRooms > 0)
                {
                    nangLuong += missingRooms * 5; // Cứ mỗi phòng khám thiếu, tăng 5 năng lượng
                }
            }

            return nangLuong;
        }

        private List<LichTruc> ThayDoiNgauNhien(List<LichTruc> lichTruc, List<Doctor> bacSiList, List<Clinic> phongKhamList, List<Shift> caTrucList, Random rand)
        {
            int randomDayIndex = rand.Next(lichTruc.Count);
            var selectedDay = lichTruc[randomDayIndex];

            if (selectedDay.Phong.Count > 0)
            {
                int randomShiftIndex = rand.Next(selectedDay.Phong.Count);
                var selectedShift = selectedDay.Phong[randomShiftIndex];

                var availableDoctors = bacSiList
                    .Where(b => !selectedDay.Phong.Any(c => c.IDBacSi == b.ID_bacSi))
                    .ToList();

                if (availableDoctors.Count > 0)
                {
                    var newDoctor = availableDoctors[rand.Next(availableDoctors.Count)];
                    selectedShift.IDBacSi = newDoctor.ID_bacSi;
                }
            }

            return lichTruc;
        }




        [HttpDelete("xoaLichNgay/{ngayTruc}")]
        public async Task<IActionResult> XoaLichNgay(DateTime ngayTruc)
        {
            try
            {
                // Lấy danh sách lịch trực
                var lichTrucList = await _scheduleRepository.GetAllSchedulesAsync();

                // Lọc theo ngày
                var lichTruc = lichTrucList.FirstOrDefault(l => l.Ngay.Date == ngayTruc.Date);
                if (lichTruc == null)
                {
                    return NotFound("Không tìm thấy lịch trực cho ngày này.");
                }

                // Xóa lịch trực của ngày này
                await _scheduleRepository.DeleteScheduleAsync(lichTruc);

                return Ok("Đã xóa lịch của ngày này.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Có lỗi xảy ra khi xóa lịch: {ex.Message}");
            }
        }

        [HttpDelete("xoaBacSiPhongTruc/{ngayTruc}/{idBacSi}/{idCaTruc}/{idPhongKham}")]
        //public async Task<IActionResult> XoaBacSiPhongTruc(DateTime ngayTruc, string idBacSi, string idCaTruc, string idPhongKham)
        //{
        //    // Lấy danh sách lịch trực
        //    var lichTrucList = await _scheduleRepository.GetAllSchedulesAsync();

        //    // Lọc theo ngày
        //    var lichTruc = lichTrucList.FirstOrDefault(l => l.Ngay.Date == ngayTruc.Date);
        //    if (lichTruc == null)
        //    {
        //        return NotFound("Không tìm thấy lịch trực cho ngày này.");
        //    }

        //    // Tìm phongTruc cần xóa
        //    var phongTrucToRemove = lichTruc.Phong.FirstOrDefault(pt =>
        //        pt.IDBacSi == idBacSi &&
        //        pt.IDCa == idCaTruc &&
        //        pt.IDPhongKham == idPhongKham);

        //    if (phongTrucToRemove == null)
        //    {
        //        return NotFound("Không tìm thấy phongTruc với thông tin đã cho.");
        //    }

        //    // Xóa phongTruc khỏi danh sách
        //    lichTruc.Phong.Remove(phongTrucToRemove);

        //    // Cập nhật cơ sở dữ liệu nếu cần
        //    await _scheduleRepository.UpdateScheduleAsync(lichTruc);

        //    return Ok("Xóa thành công.");
        //}


        [HttpDelete("xoaBacSiNgayTruc/{ngayTruc}/{idBacSi}")]
        public async Task<IActionResult> XoaBacSiPhongTruc(DateTime ngayTruc, string idBacSi)
        {
            // Lấy danh sách lịch trực
            var lichTrucList = await _scheduleRepository.GetAllSchedulesAsync();

            // Lọc lịch trực theo ngày
            var lichTruc = lichTrucList.FirstOrDefault(l => l.Ngay.Date == ngayTruc.Date);
            if (lichTruc == null)
            {
                return NotFound("Không tìm thấy lịch trực cho ngày này.");
            }

            // Tìm tất cả phongTruc cần xóa dựa trên IDBacSi
            var phongTrucToRemove = lichTruc.Phong.Where(pt => pt.IDBacSi == idBacSi).ToList();

            if (!phongTrucToRemove.Any())
            {
                return NotFound("Không tìm thấy phongTruc với thông tin đã cho.");
            }

            // Xóa tất cả phongTruc khỏi danh sách
            foreach (var phongTruc in phongTrucToRemove)
            {
                lichTruc.Phong.Remove(phongTruc);
            }

            // Cập nhật cơ sở dữ liệu
            await _scheduleRepository.UpdateScheduleAsync(lichTruc);

            return Ok("Xóa thành công.");
        }

        [HttpPost("themPhongTruc/{ngayTruc}")]
        public async Task<IActionResult> ThemPhongTruc(DateTime ngayTruc, [FromBody] PhongTruc phongTruc)
        {
            // Lấy danh sách lịch trực từ repository
            var lichTrucList = await _scheduleRepository.GetAllSchedulesAsync();

            // Lọc lịch trực theo ngày
            var lichTruc = lichTrucList.FirstOrDefault(l => l.Ngay == ngayTruc);
            if (lichTruc == null)
            {
                return NotFound("Không tìm thấy lịch trực cho ngày này.");
            }

            // Kiểm tra xem phongTruc đã tồn tại trong lịch trực
            var existingPhongTruc = lichTruc.Phong.FirstOrDefault(pt =>
                pt.IDBacSi == phongTruc.IDBacSi &&
                pt.IDCa == phongTruc.IDCa &&
                pt.IDPhongKham == phongTruc.IDPhongKham);

            if (existingPhongTruc != null)
            {
                return Conflict("PhongTruc đã tồn tại trong lịch trực này.");
            }

            // Thêm phongTruc vào lịch trực
            lichTruc.Phong.Add(phongTruc);

            try
            {
                // Cập nhật cơ sở dữ liệu
                await _scheduleRepository.UpdateScheduleAsync(lichTruc);
            }
            catch (Exception ex)
            {
                // Xử lý lỗi trong quá trình cập nhật
                return StatusCode(500, $"Có lỗi xảy ra khi cập nhật dữ liệu: {ex.Message}");
            }

            return Ok("Thêm phong trực thành công.");
        }

        [HttpPut("suaPhongTruc/{ngayTruc}/{idBacSi}/{idCaTruc}/{idPhongKham}")]
        public async Task<IActionResult> SuaPhongTruc(DateTime ngayTruc, string idCaTruc, string idPhongKham, string idBacSi, PhongTruc updatedPhongTruc)
        {
            // Lấy danh sách lịch trực
            var lichTrucList = await _scheduleRepository.GetAllSchedulesAsync();

            // Lọc theo ngày
            var lichTruc = lichTrucList.FirstOrDefault(l => l.Ngay == ngayTruc);
            if (lichTruc == null)
            {
                return NotFound("Không tìm thấy lịch trực cho ngày này.");
            }

            // Tìm phongTruc cần sửa
            var phongTrucToUpdate = lichTruc.Phong.FirstOrDefault(pt =>
                pt.IDBacSi == idBacSi &&
                pt.IDCa == idCaTruc &&
                pt.IDPhongKham == idPhongKham);

            if (phongTrucToUpdate == null)
            {
                return NotFound("Không tìm thấy phongTruc với thông tin đã cho.");
            }

            // Cập nhật thông tin phongTruc
            phongTrucToUpdate.IDBacSi = updatedPhongTruc.IDBacSi;
            phongTrucToUpdate.IDCa = updatedPhongTruc.IDCa; // Cập nhật IDCa nếu cần
            phongTrucToUpdate.IDPhongKham = updatedPhongTruc.IDPhongKham; // Cập nhật IDPhongKham nếu cần

            // Cập nhật cơ sở dữ liệu nếu cần
            await _scheduleRepository.UpdateScheduleAsync(lichTruc);

            return Ok("Cập nhật thành công.");
        }
        [HttpGet("thong-ke-bac-si-theo-thang/{thang}/{nam}")]
        public async Task<ActionResult<List<BacSiThongKe>>> ThongKeBacSiTheoThang(int thang, int nam)
        {
            var lichTrucList = await _scheduleRepository.GetAllSchedulesAsync();
            var bacSiList = await _doctorRepository.GetAllDoctorsAsync();

            var thongKe = new Dictionary<string, BacSiThongKe>();

            foreach (var lichTruc in lichTrucList)
            {
                // Tăng ngày lên 1 ngày trước khi kiểm tra tháng và năm
                var adjustedNgay = lichTruc.Ngay.AddDays(1);

                if (adjustedNgay.Month == thang && adjustedNgay.Year == nam)
                {
                    foreach (var phong in lichTruc.Phong)
                    {
                        if (!thongKe.ContainsKey(phong.IDBacSi))
                        {
                            var bacSi = bacSiList.FirstOrDefault(b => b.ID_bacSi == phong.IDBacSi);
                            if (bacSi != null)
                            {
                                thongKe[phong.IDBacSi] = new BacSiThongKe
                                {
                                    IdBacSi = bacSi.ID_bacSi,
                                    HoTenBacSi = bacSi.hoTen,
                                    ChiTieu = bacSi.chiTieu,
                                    TongCa = 0
                                };
                            }
                        }

                        if (thongKe.ContainsKey(phong.IDBacSi))
                        {
                            thongKe[phong.IDBacSi].TongCa++;
                        }
                    }
                }
            }

            return Ok(thongKe.Values.ToList());
        }


        public class BacSiThongKe
        {
            public string IdBacSi { get; set; }
            public string HoTenBacSi { get; set; }
            public int ChiTieu { get; set; }
            public int TongCa { get; set; }
        }

    }
}