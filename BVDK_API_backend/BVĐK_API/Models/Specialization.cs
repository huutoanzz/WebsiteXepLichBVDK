using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;

namespace BVĐK_API.Models
{
    public class Specialization
    {
        [BsonId]
        public ObjectId Id { get; set; }  // MongoDB ObjectId (_id)

        [BsonElement("ID_chuyenKhoa")]
        public string SpecializationId { get; set; }  // ID của chuyên khoa

        [Required]
        [BsonElement("tenChuyenKhoa")]
        [StringLength(100)]
        public string SpecializationName { get; set; }  // Tên chuyên khoa

        [BsonElement("ghiChu")]
        [StringLength(255)]
        public string Notes { get; set; }  // Ghi chú
    }
}
