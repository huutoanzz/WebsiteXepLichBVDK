using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.ComponentModel.DataAnnotations;

namespace BVĐK_API.Models
{
    public class Shift
    {
        [BsonId]
        public ObjectId Id { get; set; }  // MongoDB ObjectId (_id)

        [BsonElement("ID_caTruc")]
        [Required]
        public string ShiftId { get; set; }  // ID ca làm việc

        [BsonElement("tenCa")]
        [Required]
        [StringLength(100)]
        public string ShiftName { get; set; }  // Tên ca làm việc

        [BsonElement("gioBD")]
        [Required]
        public string StartTime { get; set; }  // Thời gian bắt đầu (dạng chuỗi)

        [BsonElement("gioKT")]
        [Required]
        public string EndTime { get; set; }  // Thời gian kết thúc (dạng chuỗi)

    }
}
