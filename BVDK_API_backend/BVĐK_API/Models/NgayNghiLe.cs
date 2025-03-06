using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace BVĐK_API.Models
{
    public class NgayNghiLe
    {
        [BsonId]
        public ObjectId Id { get; set; }

        [BsonElement("ID_ngayNghi")]
        public string IDNgayNghi { get; set; }

        [BsonElement("tenNgayNghi")]
        public string TenNgayNghi { get; set; }

        // Change List<NgayLe> to List<string> to match the MongoDB structure
        [BsonElement("ngayTrongNam")]
        public List<string> NgayLes { get; set; } = new List<string>();
    }
}
