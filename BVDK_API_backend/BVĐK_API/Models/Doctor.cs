using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace BVĐK_API.Models
{
    public class Doctor
    {
        [BsonId]
        public ObjectId Id { get; set; }  // MongoDB ObjectId (_id)

        public string ID_bacSi { get; set; }  // Mã bác sĩ (ID_bacSi)
        public string hoTen { get; set; }  // Họ tên (hoTen)
        public string ID_chuyenKhoa { get; set; }  // Mã chuyên khoa (ID_chuyenKhoa)
        public string gioiTinh { get; set; }  // Giới tính (gioiTinh)
        public string SDT { get; set; }  // Số điện thoại (SDT)
        public string email { get; set; }  // Email (email)
        public string diaChi { get; set; }  // Địa chỉ (diaChi)
        public string ghiChu { get; set; }  // Ghi chú (ghiChu)
        public int chiTieu { get; set; }  // Chỉ tiêu (chiTieu)
        public int ngayDaLam { get; set; }  // Ngày đã làm (ngayDaLam)
    }
}
