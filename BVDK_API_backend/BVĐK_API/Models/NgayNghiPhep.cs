using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace BVĐK_API.Models
{
    public class NgayNghiPhep
    {
        [BsonId]
        public ObjectId Id { get; set; }

        [BsonElement("ID_bacSi")]
        public string IDBacSi { get; set; }

        [BsonElement("ngayNghi")]
        public DateTime NgayNghi { get; set; }

        [BsonElement("lyDo")]
        public string LyDo { get; set; }

        [BsonElement("trangThai")]
        public Boolean TrangThai { get; set; } 
    }
}
