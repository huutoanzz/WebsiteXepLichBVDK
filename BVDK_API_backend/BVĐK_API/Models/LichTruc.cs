using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace BVĐK_API.Models
{
    public class LichTruc
    {
        [BsonId]
        public ObjectId Id { get; set; }

        [BsonElement("ngayTruc")]
        public DateTime Ngay { get; set; }

        [BsonElement("phongTruc")]
        public List<PhongTruc> Phong { get; set; } = new List<PhongTruc>();
    }

    public class PhongTruc
    {
        [BsonElement("IDCa")]
        public string IDCa { get; set; }

        [BsonElement("IDPhongKham")]
        public string IDPhongKham { get; set; }

        [BsonElement("IDBacSi")]
        public string IDBacSi { get; set; }
    }

}
