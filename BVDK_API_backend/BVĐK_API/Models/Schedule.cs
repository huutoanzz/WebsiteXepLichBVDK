using System.ComponentModel.DataAnnotations;

namespace BVĐK_API.Models
{
    public class Schedule
    {
        [Key]
        public int ScheduleId { get; set; }  // ID lịch hẹn

        public int DoctorId { get; set; }  // ID bác sĩ

        public int ClinicId { get; set; }  // ID phòng khám

        public int ShiftId { get; set; }  // ID ca làm việc

        [Required]
        public DateTime Date { get; set; }  // Ngày lịch hẹn

        [Required]
        public TimeSpan Time { get; set; }  // Giờ lịch hẹn
    }
}
