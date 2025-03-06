using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;

namespace BVĐK_API.Models
{
    public class User
    {
        [BsonId]
        public ObjectId Id { get; set; }  // MongoDB ObjectId (_id)

        [BsonElement("ID_nguoiDung")]
        public string UserId { get; set; }  // ID của người dùng (nd_admin, nd_staff, etc.)

        [Required]
        [BsonElement("tenDangNhap")]
        [StringLength(50)]
        public string Username { get; set; }  // Tên đăng nhập

        [Required]
        [BsonElement("matKhau")]
        [StringLength(100)]
        public string Password { get; set; }  // Mật khẩu (nên mã hóa)

        [Required]
        [BsonElement("vaiTro")]
        [StringLength(20)]
        public string Role { get; set; }  // Vai trò người dùng (doctor, admin, staff)

        [BsonElement("ID_bacSi")]
        [StringLength(50)]
        public string DoctorId { get; set; }  // ID của bác sĩ, chỉ có nếu vai trò là doctor
    }
}
