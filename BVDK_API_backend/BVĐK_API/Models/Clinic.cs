using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System.ComponentModel.DataAnnotations;

namespace BVĐK_API.Models
{
    public class Clinic
    {
        [BsonId]
        public ObjectId Id { get; set; }  // MongoDB ObjectId (_id)

        [BsonElement("ID_phongKham")]
        public string ClinicId { get; set; }  // ID của phòng khám

        [BsonElement("ID_chuyenKhoa")]
        public string IDChuyenKhoa { get; set; }
        [Required]
        [BsonElement("tenPhong")]
        [StringLength(100)]
        public string ClinicName { get; set; }  // Tên phòng khám

        [BsonElement("diaChi")]
        [StringLength(255)]
        public string Address { get; set; }  // Địa chỉ phòng khám

        [BsonElement("soDienThoai")]
        [StringLength(15)]
        public string Phone { get; set; }  // Số điện thoại
    }
}
